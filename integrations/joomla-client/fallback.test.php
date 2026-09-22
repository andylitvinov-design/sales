<?php
declare(strict_types=1);
define('_JEXEC',1);
$file=__DIR__.'/template/legacy-route.php';
if(!is_file($file)){echo "FAIL legacy fallback missing\n";exit(1);}require $file;
foreach(range(38,44) as $id){$url=psitrendsLegacyRoute(['id'=>(string)$id,'option'=>'com_content','view'=>'article','utm_source'=>'retained']);parse_str(parse_url($url,PHP_URL_QUERY),$q);if($q['Itemid']!=='101'||$q['id']!==(string)$id||$q['utm_source']!=='retained')throw new RuntimeException('lost legacy query');}
$url=psitrendsLegacyRoute(['option'=>'com_content','id'=>'38','template'=>'psitrends_client','templateStyle'=>'99']);if(str_contains($url,'template'))throw new RuntimeException('override loop');
if(!str_starts_with(psitrendsLegacyRoute(['return'=>'https://example.invalid/']),'/index.php?'))throw new RuntimeException('external redirect');
echo "PASS seven legacy queries preserve content and attribution, clear template override, stay local\n";
