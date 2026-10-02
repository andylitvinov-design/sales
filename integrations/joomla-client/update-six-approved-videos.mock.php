<?php
/** PDO transaction double for the synthetic recovery test, loaded with php -n only. */
declare(strict_types=1);
namespace Synthetic;
use RuntimeException;
if(getenv('PSITRENDS_SYNTHETIC_TEST')!=='1')throw new RuntimeException('synthetic_only');
final class PDO{
 const ATTR_ERRMODE=3;const ERRMODE_EXCEPTION=2;const FETCH_ASSOC=2;
 public array $rows;private bool $transaction=false;private array $before=[];
 function __construct(...$ignored){$this->rows=json_decode(file_get_contents('/update/mock-db.json'),true);}
 function prepare(string $sql):Statement{return new Statement($this,$sql);}
 function beginTransaction():void{
  $race=getenv('PSITRENDS_SYNTHETIC_RACE')?:'';
  if($race!==''){$key=$race==='non_target'?'en:academy':'en:home';$this->rows[$key]['title']=strtolower($this->rows[$key]['title']);file_put_contents('/update/mock-db.json',json_encode($this->rows));}
  $this->before=$this->rows;$this->transaction=true;
 }
 function inTransaction():bool{return $this->transaction;}
 function rollBack():void{$this->rows=$this->before;$this->transaction=false;}
 function commit():void{file_put_contents('/update/mock-db.json',json_encode($this->rows));$this->transaction=false;}
}
final class Statement{
 private PDO $db;private string $sql;private array $result=[];private int $count=0;
 function __construct(PDO $db,string $sql){$this->db=$db;$this->sql=$sql;}
 function execute(array $args):void{
  if(strpos($this->sql,'SELECT id,alias,language,state,access,catid,checked_out,title,introtext,`fulltext`,metadesc FROM wfct4_content WHERE alias=?')===0){$this->result=array_values(array_filter($this->db->rows,fn($r)=>$r['alias']===$args[0]));return;}
  if(strpos($this->sql,'UPDATE wfct4_content SET introtext=? WHERE id=? AND introtext=?')!==0)throw new RuntimeException('unexpected_sql');
  [$body,$id,$before,$title,$full,$meta,$alias,$language,$catid]=$args;$this->count=0;
  foreach($this->db->rows as &$r)if($r['id']===$id&&$r['introtext']===$before&&$r['title']===$title&&$r['fulltext']===$full&&$r['metadesc']===$meta&&$r['alias']===$alias&&$r['language']===$language&&$r['catid']===$catid&&$r['state']===1&&$r['access']===1&&(int)$r['checked_out']===0){$this->count=$r['introtext']===$body?0:1;$r['introtext']=$body;}
 }
 function fetchAll(int $mode):array{return $this->result;}
 function rowCount():int{return $this->count;}
}
require '/update/instrumented-runner.php';
