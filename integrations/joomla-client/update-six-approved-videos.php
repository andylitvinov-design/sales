<?php
/** Narrow extension of established update-two-approved-videos.php capture/apply/rollback contract. */
declare(strict_types=1);
umask(0077);
ini_set('display_errors','0');
final class Guard extends RuntimeException{
}
function ok(bool $v,string $m):void{
    if(!$v)throw new Guard($m);
}
function encoded(array $v):string{
    return json_encode($v,JSON_THROW_ON_ERROR|JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE);
}
function digest(array $v):string{
    return hash('sha256',encoded($v));
}
function save(string $p,array $v):void{
    $t=$p.'.tmp';
    ok(file_put_contents($t,encoded($v))!==false,'snapshot_write');
    ok(rename($t,$p),'snapshot_rename');
}
function regular(string $p):bool{
    return is_file($p)&&!is_link($p);
}
try{
    ok(PHP_SAPI==='cli','cli_only');
    $action=$argv[1]??'';
    $scope=getenv('PSITRENDS_UPDATE_SCOPE');
    ok(in_array($action,['preflight','capture','apply','rollback'],true),'action');
    ok(in_array($scope,['stage','production'],true),'scope');
    $root='/var/www/html';
    $private='/update';
    $package=$private.'/package';
    ok(is_dir($private)&&(fileperms($private)&0077)===0,'private_directory');
    // Every stage/production invocation mounts the SAME protected host lock directory here.
    ok(is_dir('/release-lock')&&!is_link('/release-lock')&&(fileperms('/release-lock')&0077)===0,'shared_lock_directory');
    ok(!is_link('/release-lock/client-update.lock'),'shared_lock_symlink');
    $globalLock=fopen('/release-lock/client-update.lock','c');
    ok(flock($globalLock,LOCK_EX|LOCK_NB),'global_release_locked');
    $lock=fopen($private.'/lock','c');
    ok(flock($lock,LOCK_EX|LOCK_NB),'locked');
    $inject=getenv('PSITRENDS_TEST_FAIL')?:'';
    ok($inject===''||($scope==='stage'&&in_array($inject,['after_file_1','before_commit','after_commit'],true)),'failure_injection_scope');
    require $root.'/configuration.php';
    $c=new JConfig;
    ok($c->dbprefix==='wfct4_','prefix');
    ok($scope==='stage'?($c->host==='psitrends-client-releasecheck-db'&&in_array($c->db,['psitrends_releasecheck','psitrends_events20'],true)&&(int)$c->mailonline===0):($c->host==='mysql'&&$c->db==='psitrends'),'database_target');
    $db=new PDO('mysql:host='.$c->host.';dbname='.$c->db.';charset=utf8mb4',$c->user,$c->password,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
    unset($c);
    $m=json_decode(file_get_contents($package.'/migration-plan.json'),true,512,JSON_THROW_ON_ERROR);
    ok(($m['mode']??'')==='six-approved-video-delta','manifest_mode');
    $keys=['en:home','ru:home','en:consultations','ru:consultations','en:about','ru:about'];
    $pages=[];
    foreach($m['pages'] as $p){
        ok(!isset($pages[$p['key']]),'duplicate_key');
        $pages[$p['key']]=$p;
    }
    ok(count($pages)===6&&!array_diff($keys,array_keys($pages)),'six_page_scope');
    $allKeys=[];
    foreach(['en','ru'] as $locale)foreach(['home','consultations','hypnotherapy','constellations','about','academy','contact','events','projects'] as $kind)$allKeys[]=$locale.':'.$kind;
    $complement=array_values(array_diff($allKeys,$keys));
    $untouchedKeys=array_keys($m['untouchedRows']);
    ok(count($untouchedKeys)===12&&!array_diff($complement,$untouchedKeys)&&!array_diff($untouchedKeys,$complement),'eighteen_row_preflight');
    $names=['home-en-v2.webp','home-ru-v1.webp','services-en-v2.webp','services-ru-v1.webp','homeopathy-en-v2.webp','homeopathy-ru-v1.webp'];
    $prefix='media/templates/site/psitrends_client/assets/approved-video-posters/';
    $shared=['templates/psitrends_client/index.php'=>'shared/index.php','media/templates/site/psitrends_client/assets/psitrends-client.css'=>'shared/psitrends-client.css','media/templates/site/psitrends_client/assets/psitrends-client.js'=>'shared/psitrends-client.js'];
    $withShared=($m['sharedAssetUpdate']??false)===true;
    ok(count($m['files'])===($withShared?9:6),'bounded_file_scope');
    foreach($names as $name)ok(isset($m['files'][$prefix.$name]),'six_exact_posters');
    if($withShared)foreach($shared as $to=>$from)ok(isset($m['files'][$to]),'three_coherent_shared_assets');
    foreach($m['files'] as $to=>$f){
        $isPoster=strpos($to,$prefix)===0&&in_array(substr($to,strlen($prefix)),$names,true);
        ok(($isPoster&&$f['source']==='posters/'.basename($to))||($withShared&&isset($shared[$to])&&$f['source']===$shared[$to]&&preg_match('/^[a-f0-9]{64}$/D',$f['beforeSha256']??'')===1),'fixed_file_path');
        ok(realpath(dirname($package.'/'.$f['source']))===dirname($package.'/'.$f['source']),'package_parent_containment');
        ok(regular($package.'/'.$f['source'])&&hash_file('sha256',$package.'/'.$f['source'])===$f['sha256'],'package_file_digest');
        ok(realpath(dirname($root.'/'.$to))===dirname($root.'/'.$to),'destination_parent_containment');
        ok(!is_link($root.'/'.$to)&&(!file_exists($root.'/'.$to)||regular($root.'/'.$to)),'destination_type');
    }
    foreach($m['invariants'] as $file=>$sha){
        ok(in_array($file,['templates/psitrends_client/index.php','media/templates/site/psitrends_client/assets/psitrends-client.css','media/templates/site/psitrends_client/assets/psitrends-client.js',$prefix.'hypnotherapy-en-v1.webp',$prefix.'constellations-en-v1.webp'],true)&&!isset($m['files'][$file]),'invariant_path');
        ok(regular($root.'/'.$file)&&hash_file('sha256',$root.'/'.$file)===$sha,'preserved_shared_file');
    }
    ok(count($m['invariants'])===($withShared?2:5),'invariant_count');
    $q=$db->prepare('SELECT id,alias,language,state,access,catid,checked_out,title,introtext,`fulltext`,metadesc FROM wfct4_content WHERE alias=?');
    $rows=[];
    $desired=[];
    foreach(array_merge($keys,array_keys($m['untouchedRows'])) as $key){
        ok(preg_match('/^(en|ru):(home|consultations|hypnotherapy|constellations|about|academy|contact|events|projects)$/D',$key)===1,'page_key');
        [$locale,$kind]=explode(':',$key);
        $q->execute(['psitrends-client-'.$locale.'-'.$kind]);
        $hits=$q->fetchAll(PDO::FETCH_ASSOC);
        ok(count($hits)===1,'unique_existing_article');
        $r=$hits[0];
        ok($r['language']===($locale==='en'?'en-GB':'ru-RU')&&(int)$r['state']===1&&(int)$r['access']===1&&(int)$r['checked_out']===0,'public_unlocked');
        if(!isset($pages[$key])){
            ok(digest($r)===$m['untouchedRows'][$key],'non_target_row_drift');
            continue;
        }
        $p=$pages[$key];
        ok((int)$r['id']===$p['id']&&$r['alias']===$p['alias']&&(int)$r['catid']===$p['catid'],'row_identity');
        ok($p['bodyFile']==='articles/'.$locale.'-'.$kind.'.html','body_path');
        ok(regular($package.'/'.$p['bodyFile']),'body_type');
        $body=file_get_contents($package.'/'.$p['bodyFile']);
        ok(hash('sha256',$body)===$p['afterBody'],'body_digest');
        ok(!preg_match('/<(?:script|iframe|object|embed)\b|\bon\w+\s*=/i',$body),'passive_body');
        $rows[$key]=$r;
        $desired[$key]=array_replace($r,['introtext'=>$body]);
    }
    $packageHash=hash_file('sha256',$package.'/migration-plan.json');
    $before=$private.'/before.json';
    $posterDir=$root.'/'.$prefix;
    ok(is_dir($posterDir)&&!is_link(rtrim($posterDir,'/')),'existing_poster_directory');
    if($action==='preflight'||$action==='capture'){
        ok(!file_exists($before),'already_captured');
        foreach($rows as $k=>$r)ok(digest($r)===$pages[$k]['beforeRow']&&hash('sha256',$r['introtext'])===$pages[$k]['beforeBody'],'reconciled_before_row');
        $files=[];
        foreach($m['files'] as $to=>$f){
            $p=$root.'/'.$to;
            if(isset($shared[$to])){
                ok(regular($p)&&hash_file('sha256',$p)===$f['beforeSha256'],'shared_before_digest');
                $files[$to]=['bytes'=>base64_encode(file_get_contents($p)),'mode'=>fileperms($p)&0777,'uid'=>fileowner($p),'gid'=>filegroup($p)];
            }
            else{
                ok(!file_exists($p),'expected_new_poster');
                $files[$to]=null;
            }
        }
        if($action==='preflight'){
            echo encoded(['status'=>'PREFLIGHT_PASS','articles'=>6,'untouched_rows'=>12,'new_posters'=>6,'shared_updates'=>$withShared?3:0,'package'=>$packageHash]),PHP_EOL;
            exit;
        }
        save($before,['scope'=>$scope,'package'=>$packageHash,'rows'=>$rows,'files'=>$files,'posterDirectoryMode'=>fileperms($posterDir)&0777]);
        echo encoded(['status'=>'CAPTURED','articles'=>6,'files'=>count($files),'snapshot_sha256'=>hash_file('sha256',$before)]),PHP_EOL;
        exit;
    }
    ok(regular($before),'snapshot_missing');
    $snap=json_decode(file_get_contents($before),true,512,JSON_THROW_ON_ERROR);
    ok($snap['scope']===$scope&&$snap['package']===$packageHash,'snapshot_scope_package');
    foreach($rows as $k=>$r){
        $expected=array_replace($snap['rows'][$k],['introtext'=>$desired[$k]['introtext']]);
        ok($r===$snap['rows'][$k]||$r===$expected,'concurrent_content_edit');
        $desired[$k]=$expected;
    }
    foreach($m['files'] as $to=>$f){
        $now=$root.'/'.$to;
        $old=$snap['files'][$to];
        $matchesBefore=$old===null?!file_exists($now):(regular($now)&&file_get_contents($now)===base64_decode($old['bytes'],true)&&(fileperms($now)&0777)===$old['mode']&&fileowner($now)===$old['uid']&&filegroup($now)===$old['gid']);
        ok($matchesBefore||(regular($now)&&hash_file('sha256',$now)===$f['sha256']),'concurrent_file_edit');
    }
    $journal=['phase'=>'started','action'=>$action,'package'=>$packageHash,'completedFiles'=>[]];
    save($private.'/journal.json',$journal);
    $target=$action==='apply'?$desired:$snap['rows'];
    $db->beginTransaction();
    try{
        $u=$db->prepare('UPDATE wfct4_content SET introtext=? WHERE id=? AND introtext=? AND title=? AND `fulltext`=? AND metadesc=? AND alias=? AND language=? AND catid=? AND state=1 AND access=1 AND (checked_out=0 OR checked_out IS NULL)');
        foreach($target as $k=>$r){
            $old=$rows[$k];
            $u->execute([$r['introtext'],$r['id'],$old['introtext'],$old['title'],$old['fulltext'],$old['metadesc'],$old['alias'],$old['language'],$old['catid']]);
            ok($u->rowCount()===1||$r===$old,'optimistic_guard');
        }
        foreach($m['files'] as $to=>$f){
            $path=$root.'/'.$to;
            $old=$snap['files'][$to];
            $bytes=$action==='apply'?file_get_contents($package.'/'.$f['source']):($old===null?null:base64_decode($old['bytes'],true));
            if($bytes===null){
                if(file_exists($path))ok(unlink($path),'remove_owned_poster');
            }
            else{
                ok(!is_link($path.'.next'),'temporary_symlink');
                ok(file_put_contents($path.'.next',$bytes)!==false,'file_write');
                ok(chmod($path.'.next',$old===null?0644:$old['mode']),'file_mode');
                if($old!==null){
                    ok(chown($path.'.next',$old['uid']),'file_owner');
                    ok(chgrp($path.'.next',$old['gid']),'file_group');
                }
                ok(rename($path.'.next',$path),'file_rename');
            }
            $journal['completedFiles'][]=$to;
            $journal['phase']='files';
            save($private.'/journal.json',$journal);
            if($inject==='after_file_1'&&count($journal['completedFiles'])===1)throw new Guard('injected_after_file_1');
        }
        if($inject==='before_commit')throw new Guard('injected_before_commit');
        $db->commit();
        $journal['phase']='db_committed';
        save($private.'/journal.json',$journal);
        if($inject==='after_commit')throw new Guard('injected_after_commit');
    }
    catch(Throwable $e){
        if($db->inTransaction())$db->rollBack();
        throw $e;
    }
    $journal['phase']='complete';
    save($private.'/journal.json',$journal);
    echo encoded(['status'=>strtoupper($action).'_COMPLETE','articles'=>6,'files'=>count($m['files']),'shared_assets_changed'=>$withShared,'metadata_changed'=>false,'routing_changed'=>false]),PHP_EOL;
}
catch(Throwable $e){
    fwrite(STDERR,json_encode(['status'=>'FAILED','reason'=>$e instanceof Guard?$e->getMessage():'runtime_error','recovery'=>'Guarded rollback restores captured six rows/files; all other rows remain guarded.']).PHP_EOL);
    exit(1);
}
