<?php
/** Purge this site's presentation caches, including Joomla 4 mobile prefixes. */
if(PHP_SAPI!=='cli')exit(1);
function clientCachePatterns(string $secret): array {
 if($secret==='')throw new RuntimeException('Missing site secret');
 $patterns=[];
 foreach(['','M-'] as $platform){
  foreach(['com_content','page','com_menus','com_templates'] as $group){
   $patterns[]=$platform.md5($secret).'-cache-'.$group.'-*';
  }
 }
 return $patterns;
}
if(($argv[1]??'')==='self-test'){
 $patterns=clientCachePatterns('synthetic-test-site');
 if(count($patterns)!==8 || !in_array('M-'.md5('synthetic-test-site').'-cache-com_templates-*',$patterns,true))exit(1);
 foreach($patterns as $pattern){
  foreach(['session-example','other-site-cache-com_menus-example',md5('synthetic-test-site').'-cache-unrelated-example'] as $excluded){
   if(fnmatch($pattern,$excluded))exit(1);
  }
 }
 echo 'Desktop/mobile scope regression passed'.PHP_EOL;exit(0);
}
define('_JEXEC',1);
define('JPATH_BASE','/var/www/html');
require JPATH_BASE.'/includes/defines.php';
require JPATH_BASE.'/includes/framework.php';
$container=\Joomla\CMS\Factory::getContainer();
$container->alias('session','session.cli')->alias(\Joomla\Session\SessionInterface::class,'session.cli');
\Joomla\CMS\Factory::$application=$container->get(\Joomla\Console\Application::class);
try {
 $app=\Joomla\CMS\Factory::$application;
 if($app->get('cache_handler')==='file'){
  foreach(['com_content','page','com_menus','com_templates'] as $group){
   if(!\Joomla\CMS\Factory::getCache($group)->clean($group,'group'))throw new RuntimeException('File cache purge failed');
  }
  echo 'Site presentation file cache purged'.PHP_EOL;exit(0);
 }
 if($app->get('cache_handler')!=='redis')throw new RuntimeException('Unsupported cache handler');
 $redis=new Redis();
 $host=$app->get('redis_server_host','localhost');
 if(!$redis->connect($host,$host[0]==='/'?0:(int)$app->get('redis_server_port',6379),5))throw new RuntimeException('Connection failed');
 $auth=$app->get('redis_server_auth');
 if($auth && !$redis->auth($auth))throw new RuntimeException('Authentication failed');
 if(!$redis->select((int)$app->get('redis_server_db',0)))throw new RuntimeException('Selection failed');
 $removed=0;
 foreach(clientCachePatterns((string)$app->get('secret','')) as $pattern){
  $cursor=null;
  do {
   $keys=$redis->scan($cursor,$pattern,100);
   if($keys!==false){foreach($keys as $key){$removed+=$redis->del($key);}}
  } while($cursor!==0);
 }
 $redis->close();
 echo 'Site presentation cache purged: '.$removed.' desktop/mobile entries'.PHP_EOL;
}catch(Throwable $error){
 // Never expose server configuration, credentials or cache key hashes.
 fwrite(STDERR,'Scoped cache purge failed; release verification must stop'.PHP_EOL);exit(1);
}
