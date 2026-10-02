<?php
/** Synthetic filesystem/transaction recovery tests. Run only in an isolated PHP container, network none. */
declare(strict_types=1);
if(getenv('PSITRENDS_SYNTHETIC_TEST')!=='1'||!is_file('/update/SYNTHETIC_FIXTURE'))throw new RuntimeException('synthetic_fixture_required');
// Namespace instrumentation substitutes only PDO; production runner bytes stay untouched.
$source=file_get_contents(__DIR__.'/update-six-approved-videos.php');
$instrumented=str_replace('declare(strict_types=1);','declare(strict_types=1);namespace Synthetic;use \\RuntimeException;use \\Throwable;use \\JConfig;',$source,$replacements);
if($replacements!==1)throw new RuntimeException('instrumentation_guard');
file_put_contents('/update/instrumented-runner.php',$instrumented);
function check(bool $value,string $message):void{if(!$value)throw new RuntimeException($message);}
function encoded(array $v):string{return json_encode($v,JSON_THROW_ON_ERROR|JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE);}
function digest(array $v):string{return hash('sha256',encoded($v));}
function writeFile(string $path,string $bytes):void{if(!is_dir(dirname($path)))mkdir(dirname($path),0755,true);file_put_contents($path,$bytes);chmod($path,0644);}
function runAction(string $action,string $failure='',string $race=''):array{
 $command=[PHP_BINARY,'-n','-d','log_errors=1','-d','error_log=/dev/stderr',__DIR__.'/update-six-approved-videos.mock.php',$action];$pipes=[];$env=array_merge(getenv(),['PSITRENDS_UPDATE_SCOPE'=>'stage','PSITRENDS_TEST_FAIL'=>$failure,'PSITRENDS_SYNTHETIC_RACE'=>$race]);
 $p=proc_open($command,[0=>['pipe','r'],1=>['pipe','w'],2=>['pipe','w']],$pipes,null,$env);fclose($pipes[0]);$out=stream_get_contents($pipes[1]);$err=stream_get_contents($pipes[2]);fclose($pipes[1]);fclose($pipes[2]);$code=proc_close($p);
 return ['code'=>$code,'result'=>json_decode(trim($code===0?$out:$err),true),'raw'=>$out.$err];
}
$prefix='media/templates/site/psitrends_client/assets/approved-video-posters/';
$names=['home-en-v2.webp','home-ru-v1.webp','services-en-v2.webp','services-ru-v1.webp','homeopathy-en-v2.webp','homeopathy-ru-v1.webp'];
$shared=['templates/psitrends_client/index.php'=>'shared/index.php','media/templates/site/psitrends_client/assets/psitrends-client.css'=>'shared/psitrends-client.css','media/templates/site/psitrends_client/assets/psitrends-client.js'=>'shared/psitrends-client.js'];
function fixture(bool $withShared):array{
 global $prefix,$names,$shared;
 foreach(['before.json','journal.json','lock','mock-db.json'] as $name)if(is_file('/update/'.$name))unlink('/update/'.$name);
 writeFile('/var/www/html/configuration.php','<?php class JConfig {public $dbprefix="wfct4_";public $host="psitrends-client-releasecheck-db";public $db="psitrends_releasecheck";public $mailonline=0;public $user="synthetic";public $password="synthetic";}');
 $rows=[];$id=50;foreach(['en','ru'] as $locale)foreach(['home','consultations','hypnotherapy','constellations','about','academy','contact','events','projects'] as $kind){$rows[$locale.':'.$kind]=['id'=>++$id,'alias'=>'psitrends-client-'.$locale.'-'.$kind,'language'=>$locale==='en'?'en-GB':'ru-RU','state'=>1,'access'=>1,'catid'=>7,'checked_out'=>null,'title'=>'Title '.$locale.$kind,'introtext'=>'<section>Existing '.$locale.$kind.' Русский</section>','fulltext'=>'Preserve fulltext '.$kind,'metadesc'=>'Keep metadata'];}
 writeFile('/update/mock-db.json',encoded($rows));$m=['mode'=>'six-approved-video-delta','pages'=>[],'files'=>[],'invariants'=>[],'untouchedRows'=>[],'sharedAssetUpdate'=>$withShared];
 foreach($rows as $key=>$r){[$locale,$kind]=explode(':',$key);if(!in_array($kind,['home','consultations','about'],true)){$m['untouchedRows'][$key]=digest($r);continue;}$body=$r['introtext'].'<section>Approved video '.$key.'</section>';$file='articles/'.$locale.'-'.$kind.'.html';writeFile('/update/package/'.$file,$body);$m['pages'][]=['key'=>$key,'id'=>$r['id'],'alias'=>$r['alias'],'language'=>$r['language'],'access'=>1,'catid'=>7,'beforeRow'=>digest($r),'beforeBody'=>hash('sha256',$r['introtext']),'afterBody'=>hash('sha256',$body),'bodyFile'=>$file];}
 foreach($names as $name){$path='/var/www/html/'.$prefix.$name;foreach([$path,$path.'.next'] as $f)if(is_file($f))unlink($f);$bytes='synthetic-poster-'.$name;writeFile('/update/package/posters/'.$name,$bytes);$m['files'][$prefix.$name]=['source'=>'posters/'.$name,'sha256'=>hash('sha256',$bytes)];}
 foreach($shared as $to=>$from){$old='original-v8-'.$to;writeFile('/var/www/html/'.$to,$old);if($withShared){$new='new-v9-'.$to;writeFile('/update/package/'.$from,$new);$m['files'][$to]=['source'=>$from,'sha256'=>hash('sha256',$new),'beforeSha256'=>hash('sha256',$old)];}else $m['invariants'][$to]=hash('sha256',$old);}
 foreach(['hypnotherapy-en-v1.webp','constellations-en-v1.webp'] as $name){$bytes='approved-existing-'.$name;writeFile('/var/www/html/'.$prefix.$name,$bytes);$m['invariants'][$prefix.$name]=hash('sha256',$bytes);}
 chmod('/update',0700);writeFile('/update/package/migration-plan.json',encoded($m));return [$rows,$m];
}
function assertRestored(array $rows,array $m):void{
 global $prefix,$names,$shared;
 check(json_decode(file_get_contents('/update/mock-db.json'),true)===$rows,'rows_not_restored');foreach($names as $name)check(!file_exists('/var/www/html/'.$prefix.$name),'owned_poster_not_removed');
 foreach($shared as $to=>$from)check(file_get_contents('/var/www/html/'.$to)==='original-v8-'.$to,'shared_not_restored');foreach($m['invariants'] as $to=>$sha)check(hash_file('sha256','/var/www/html/'.$to)===$sha,'invariant_changed');
}
$passed=[];
foreach([false,true] as $sharedUpdate){foreach(['','after_file_1','before_commit','after_commit'] as $failure){[$rows,$m]=fixture($sharedUpdate);$pre=runAction('preflight');check($pre['code']===0,'preflight '.$pre['raw']);check(!file_exists('/update/before.json'),'preflight_mutates_snapshot');$cap=runAction('capture');check($cap['code']===0,'capture '.$cap['raw']);$apply=runAction('apply',$failure);check($apply['code']===($failure===''?0:1),'apply_exit '.$apply['raw']);if($failure!=='')check(strpos($apply['result']['reason']??'','injected_')===0,'not_injected_failure');
 $journal=json_decode(file_get_contents('/update/journal.json'),true);check($journal['phase']===($failure===''?'complete':($failure==='after_commit'?'db_committed':'files')),'journal_phase');
 $dbAfter=json_decode(file_get_contents('/update/mock-db.json'),true);check(($dbAfter===$rows)===in_array($failure,['after_file_1','before_commit'],true),'transaction_boundary');
 check(count($journal['completedFiles'])===($failure==='after_file_1'?1:count($m['files'])),'journal_file_count');
 $rollback=runAction('rollback');check($rollback['code']===0,'rollback '.$rollback['raw']);assertRestored($rows,$m);$passed[]=($sharedUpdate?'v9':'posters').':'.($failure?:'success').':rollback';}}
[$rows,$m]=fixture(true);check(runAction('capture')['code']===0,'capture_conflict');$changed=$rows;$changed['en:academy']['introtext'].='External edit';writeFile('/update/mock-db.json',encoded($changed));$result=runAction('apply');check(($result['result']['reason']??'')==='non_target_row_drift','non_target_guard');check(!file_exists('/update/journal.json'),'writes_before_guard');$passed[]='non_target_drift_guard';
[$rows,$m]=fixture(true);check(runAction('capture')['code']===0,'capture_target_conflict');$changed=$rows;$changed['en:home']['title']='External title';writeFile('/update/mock-db.json',encoded($changed));$result=runAction('apply');check(($result['result']['reason']??'')==='concurrent_content_edit','target_guard');$passed[]='target_metadata_drift_guard';
[$rows,$m]=fixture(true);check(runAction('capture')['code']===0,'capture_file_conflict');writeFile('/var/www/html/'.$prefix.$names[0],'Someone elses poster');$result=runAction('apply');check(($result['result']['reason']??'')==='concurrent_file_edit','file_guard');$passed[]='poster_conflict_guard';
[$rows,$m]=fixture(true);unset($m['untouchedRows']['en:academy']);$m['untouchedRows']['en:home']=digest($rows['en:home']);writeFile('/update/package/migration-plan.json',encoded($m));$result=runAction('preflight');check(($result['result']['reason']??'')==='eighteen_row_preflight','exact_complement_guard');$passed[]='exact_eighteen_unique_keys';
[$rows,$m]=fixture(true);$dir='/var/www/html/'.rtrim($prefix,'/');rename($dir,$dir.'-real');symlink($dir.'-real',$dir);$result=runAction('preflight');check(($result['result']['reason']??'')==='destination_parent_containment','parent_symlink_guard');unlink($dir);rename($dir.'-real',$dir);$passed[]='parent_symlink_guard';
[$rows,$m]=fixture(true);$held=fopen('/release-lock/client-update.lock','c');check(flock($held,LOCK_EX|LOCK_NB),'test_lock');$result=runAction('preflight');check(($result['result']['reason']??'')==='global_release_locked','global_lock_guard');flock($held,LOCK_UN);fclose($held);$passed[]='cross_release_lock_guard';
[$rows,$m]=fixture(true);$dir='/update/package/articles';rename($dir,$dir.'-real');symlink($dir.'-real',$dir);$result=runAction('preflight');check(($result['result']['reason']??'')==='body_parent_containment','article_parent_symlink_guard');unlink($dir);rename($dir.'-real',$dir);$passed[]='article_parent_symlink_guard';
foreach(['target','non_target','idempotent'] as $race){[$rows,$m]=fixture(true);check(runAction('capture')['code']===0,'capture_race');if($race==='idempotent')check(runAction('apply')['code']===0,'first_idempotent_apply');$result=runAction('apply','',$race);check(($result['result']['reason']??'')==='concurrent_row_before_write','locked_byte_comparison_'.$race);$after=json_decode(file_get_contents('/update/mock-db.json'),true);$key=$race==='non_target'?'en:academy':'en:home';check($after[$key]['title']===strtolower($rows[$key]['title']),'external_edit_preserved');$passed[]='transaction_lock_case_race_'.$race;}
foreach(['chmod','chown'] as $change){[$rows,$m]=fixture(true);check(runAction('capture')['code']===0,'capture_mode');check(runAction('apply')['code']===0,'apply_mode');$path='/var/www/html/'.$prefix.$names[0];if($change==='chmod')chmod($path,0600);else chown($path,12345);$result=runAction('rollback');check(($result['result']['reason']??'')==='concurrent_file_edit','after_permission_guard_'.$change);check(is_file($path),'external_permission_not_deleted');$passed[]='after_'.$change.'_conflict_guard';}
echo encoded(['status'=>'PASS','runtime'=>PHP_VERSION,'tests'=>count($passed),'cases'=>$passed,'limitation'=>'Synthetic PDO transaction double; native stage rehearsal remains required.']),PHP_EOL;
