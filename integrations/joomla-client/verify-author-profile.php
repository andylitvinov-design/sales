<?php
/** Read-only readback of the exact bounded author release or its rollback. */
declare(strict_types=1);
ini_set('display_errors','0');
try {
 if(PHP_SAPI!=='cli')throw new RuntimeException();
 $rollback=($argv[1]??'')==='rollback';
 $snapshot=json_decode(file_get_contents('/update/before.json'),true,512,JSON_THROW_ON_ERROR);
 require '/var/www/html/configuration.php';$c=new JConfig;
 $db=new PDO('mysql:host='.$c->host.';dbname='.$c->db.';charset=utf8mb4',$c->user,$c->password,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);unset($c);
 $plan=json_decode(file_get_contents('/update/package/migration-plan.json'),true,512,JSON_THROW_ON_ERROR);
 $query=$db->prepare('SELECT id,alias,language,state,checked_out,title,introtext,`fulltext`,metadesc FROM wfct4_content WHERE id=?');
 $count=0;
 foreach($plan['pages'] as $p){
  if(!isset($snapshot['rows'][$p['key']]))continue;
  $expected=$snapshot['rows'][$p['key']];
  if(!$rollback)$expected=array_replace($expected,['title'=>$p['article']['title'],'introtext'=>file_get_contents('/update/package/'.$p['article']['bodyFile']),'fulltext'=>'','metadesc'=>$p['article']['metadesc']]);
  $query->execute([$expected['id']]);if($query->fetch(PDO::FETCH_ASSOC)!==$expected)throw new RuntimeException();$count++;
 }
 if($count!==4)throw new RuntimeException();
 foreach($snapshot['files'] as $file=>$before){
  $actual=is_file('/var/www/html/'.$file)?file_get_contents('/var/www/html/'.$file):null;
  $expected=$rollback?($before===null?null:base64_decode($before)):file_get_contents('/update/package/'.($file==='templates/psitrends_client/index.php'?'template/index.php':'template/media/assets/'.basename($file)));
  if($actual!==$expected)throw new RuntimeException();
 }
 echo json_encode(['ok'=>true,'mode'=>$rollback?'rollback':'apply','articles'=>4,'files'=>count($snapshot['files'])]).PHP_EOL;
}catch(Throwable $e){fwrite(STDERR,'Author release readback failed'.PHP_EOL);exit(1);}
