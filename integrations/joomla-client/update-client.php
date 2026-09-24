<?php
/** CLI-only, bounded content/asset update. No routing, ACL or extension changes. */
declare(strict_types=1);
umask(0077);
ini_set('display_errors','0');
class UpdateGuard extends RuntimeException {}
function demand(bool $value,string $message):void { if(!$value) throw new UpdateGuard($message); }
function saveJson(string $path,array $value):void {
    $tmp=$path.'.tmp';
    demand(file_put_contents($tmp,json_encode($value,JSON_THROW_ON_ERROR|JSON_PRETTY_PRINT))!==false,'snapshot_write');
    demand(rename($tmp,$path),'snapshot_rename');
}
try {
 demand(PHP_SAPI==='cli','cli_only');
 $action=$argv[1]??''; $scope=getenv('PSITRENDS_UPDATE_SCOPE');
 demand(in_array($action,['capture','apply','rollback'],true),'action');
 demand(in_array($scope,['stage','production'],true),'scope');
 $root='/var/www/html'; $private='/update'; $package=$private.'/package';
 demand(is_dir($private)&&(fileperms($private)&0077)===0,'private_directory');
 $lock=fopen($private.'/lock','c'); demand(flock($lock,LOCK_EX|LOCK_NB),'locked');
 require $root.'/configuration.php'; $c=new JConfig;
 demand($c->dbprefix==='wfct4_','prefix');
 demand($scope==='stage'?($c->host==='psitrends-client-releasecheck-db'&&$c->db==='psitrends_releasecheck'&&(int)$c->mailonline===0):($c->host==='mysql'&&$c->db==='psitrends'),'database_target');
 $db=new PDO('mysql:host='.$c->host.';dbname='.$c->db.';charset=utf8mb4',$c->user,$c->password,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]); unset($c);
 $manifest=json_decode(file_get_contents($package.'/migration-plan.json'),true,512,JSON_THROW_ON_ERROR);
 demand(count($manifest['pages'])===12,'page_count');
 $files=['templates/psitrends_client/index.php'=>'template/index.php','templates/psitrends_client/pages.json'=>'template/pages.json'];
 foreach(['psitrends-client.css','psitrends-client.js','archway.webp'] as $name)$files['media/templates/site/psitrends_client/assets/'.$name]='template/media/assets/'.$name;
 $thumbnails=glob($package.'/template/media/assets/review-thumbnails/*.webp'); demand(count($thumbnails)===38,'thumbnail_count');
 foreach($thumbnails as $thumbnail){$name=basename($thumbnail);$files['media/templates/site/psitrends_client/assets/review-thumbnails/'.$name]='template/media/assets/review-thumbnails/'.$name;}
 $thumbnailDirectory=$root.'/media/templates/site/psitrends_client/assets/review-thumbnails';
 $desired=[]; $rows=[];
 $select=$db->prepare('SELECT id,alias,language,state,checked_out,title,introtext,`fulltext`,metadesc FROM wfct4_content WHERE alias=?');
 foreach($manifest['pages'] as $p){
  demand(preg_match('/^(en|ru):(home|hypnotherapy|constellations|about|academy|contact)$/D',$p['key'])===1,'page_key');
  $select->execute([$p['article']['alias']]); $matches=$select->fetchAll(PDO::FETCH_ASSOC); demand(count($matches)===1,'unique_existing_article'); $r=$matches[0];
  demand($r['language']===$p['language']&&(int)$r['state']===1&&(int)$r['checked_out']===0,'article_not_public_or_checked_out');
  $body=file_get_contents($package.'/'.$p['article']['bodyFile']); demand(hash('sha256',$body)===$p['article']['sha256'],'article_digest');
  $rows[$p['key']]=$r; $desired[$p['key']]=array_replace($r,['title'=>$p['article']['title'],'introtext'=>$body,'fulltext'=>'','metadesc'=>$p['article']['metadesc']]);
 }
 $fileHashes=[];foreach($files as $to=>$from){demand(is_file($package.'/'.$from),'package_file');$fileHashes[$to]=hash_file('sha256',$package.'/'.$from);}
 $packageHash=hash('sha256',serialize([$desired,$fileHashes]));
 $snapshotPath=$private.'/before.json';
 if($action==='capture'){
  demand(!file_exists($snapshotPath),'already_captured');$beforeFiles=[];
  foreach($files as $to=>$from)$beforeFiles[$to]=is_file($root.'/'.$to)?base64_encode(file_get_contents($root.'/'.$to)):null;
  saveJson($snapshotPath,['scope'=>$scope,'package'=>$packageHash,'rows'=>$rows,'files'=>$beforeFiles,'thumbnailDirectoryExisted'=>is_dir($thumbnailDirectory)]);
  echo json_encode(['status'=>'CAPTURED','articles'=>count($rows),'files'=>count($files),'snapshot_sha256'=>hash_file('sha256',$snapshotPath)]).PHP_EOL;exit;
 }
 $snap=json_decode(file_get_contents($snapshotPath),true,512,JSON_THROW_ON_ERROR);
 demand($snap['scope']===$scope,'snapshot_scope');
 demand(is_bool($snap['thumbnailDirectoryExisted']??null),'snapshot_thumbnail_directory');
 // Digest excludes before-field values except unchanged identity, so it remains stable after apply.
 demand($snap['package']===$packageHash,'package_changed');
 $target=$action==='apply'?$desired:$snap['rows'];
 foreach($rows as $key=>$r)demand($r===$snap['rows'][$key]||$r===$desired[$key],'concurrent_content_edit');
 foreach($files as $to=>$from){
  $now=is_file($root.'/'.$to)?file_get_contents($root.'/'.$to):null;
  $before=$snap['files'][$to]===null?null:base64_decode($snap['files'][$to]);
  demand($now===$before||($now!==null&&hash('sha256',$now)===$fileHashes[$to]),'concurrent_file_edit');
 }
 saveJson($private.'/journal.json',['phase'=>'started','action'=>$action,'package'=>$packageHash]);
 $db->beginTransaction();
 try {
  $update=$db->prepare('UPDATE wfct4_content SET title=?,introtext=?,`fulltext`=?,metadesc=? WHERE id=? AND title=? AND introtext=? AND `fulltext`=? AND metadesc=? AND (checked_out=0 OR checked_out IS NULL)');
  foreach($target as $key=>$r){$old=$rows[$key];$update->execute([$r['title'],$r['introtext'],$r['fulltext'],$r['metadesc'],$r['id'],$old['title'],$old['introtext'],$old['fulltext'],$old['metadesc']]);demand($update->rowCount()===1||$r===$old,'optimistic_guard');}
  if($action==='apply'||$snap['thumbnailDirectoryExisted']){
   if(!is_dir($thumbnailDirectory))demand(mkdir($thumbnailDirectory,0755,true),'thumbnail_directory');
   demand(chmod($thumbnailDirectory,0755),'thumbnail_directory');
  }
  foreach($files as $to=>$from){
   $bytes=$action==='apply'?file_get_contents($package.'/'.$from):($snap['files'][$to]===null?null:base64_decode($snap['files'][$to]));
   if($bytes===null){if(is_file($root.'/'.$to))demand(unlink($root.'/'.$to),'remove_new_asset');continue;}
   demand(file_put_contents($root.'/'.$to.'.next',$bytes)!==false,'file_write');chmod($root.'/'.$to.'.next',0644);demand(rename($root.'/'.$to.'.next',$root.'/'.$to),'file_rename');
  }
  if($action==='rollback'&&!$snap['thumbnailDirectoryExisted']&&is_dir($thumbnailDirectory))demand(rmdir($thumbnailDirectory),'thumbnail_directory');
  $db->commit();
 } catch(Throwable $e){if($db->inTransaction())$db->rollBack();throw $e;}
 saveJson($private.'/journal.json',['phase'=>'complete','action'=>$action,'package'=>$packageHash]);
 echo json_encode(['status'=>strtoupper($action).'_COMPLETE','articles'=>12,'files'=>count($files),'routing_changed'=>false,'legacy_changed'=>false]).PHP_EOL;
} catch(Throwable $e){fwrite(STDERR,json_encode(['status'=>'FAILED','reason'=>$e instanceof UpdateGuard?$e->getMessage():'runtime_error','recovery'=>'Inspect private journal; rollback uses optimistic before/after guards.']).PHP_EOL);exit(1);}
