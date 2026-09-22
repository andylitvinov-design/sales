"""Bounded public crawl. Optional first argument: evidence output directory."""
import urllib.request,urllib.parse,time,json,re,sys
from html.parser import HTMLParser
from collections import deque
from pathlib import Path
EVIDENCE=Path(sys.argv[1]) if len(sys.argv)>1 else Path(__file__).resolve().parents[1]/'.codex/reports'/time.strftime('%Y-%m-%d',time.gmtime())/'psitrends-evidence'
EVIDENCE.mkdir(parents=True,exist_ok=True)
class P(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.images=[];self.meta={};self.canonical=[];self.hreflang=[];self.h1=[];self.title='';self.text=[];self.tag='';self.scripts=[];self.forms=[];self.maintext=[];self.inmain=0;self.innav=0;self.inscript=0
 def handle_starttag(self,t,a):
  d=dict(a);self.tag=t
  if t=='main':self.inmain+=1
  if t=='nav':self.innav+=1
  if t in ['script','style']:self.inscript+=1
  if t=='a' and d.get('href'):self.links.append(d['href'])
  if t=='img':self.images.append(d)
  if t=='meta':self.meta[d.get('name',d.get('property',''))]=d.get('content','')
  if t=='link' and d.get('rel')=='canonical':self.canonical.append(d.get('href'))
  if t=='link' and d.get('hreflang'):self.hreflang.append(d)
  if t=='script' and d.get('src'):self.scripts.append(d['src'])
  if t=='form':self.forms.append({k:v for k,v in d.items() if k in ['action','method','id']})
 def handle_data(self,x):
  if self.tag=='title':self.title+=x
  if self.tag=='h1':self.h1.append(x.strip())
  if self.tag not in ['script','style']:self.text.append(x.strip())
  if self.inmain and not self.innav and not self.inscript:self.maintext.append(x.strip())
 def handle_endtag(self,t):
  self.tag=''
  if t=='main':self.inmain=max(0,self.inmain-1)
  if t=='nav':self.innav=max(0,self.innav-1)
  if t in ['script','style']:self.inscript=max(0,self.inscript-1)
seeds=['https://psitrends.com/','https://psitrends.com/ru/']
inventory=(EVIDENCE/'cms-inventory.json')
if inventory.exists():
 for row in json.loads(inventory.read_text())['inventory']['menu']:
  if row['client_id']=='0' and row['published']=='1' and row['type']=='component' and row['path']:
   seeds.append('https://psitrends.com/'+('ru/' if row['language']=='ru-RU' else '')+row['path'])
q=deque((u,0) for u in dict.fromkeys(seeds));seen=set();out=[]
while q and len(seen)<400:
 u,depth=q.popleft(); u=urllib.parse.quote(u,safe=':/?=&%')
 if u in seen:continue
 seen.add(u);start=time.time()
 try:
  with urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'PsiTrends-owner-audit/1.0'}),timeout=20) as r:
   body=r.read(2500000);status=r.status;final=r.url;headers=dict(r.headers)
  p=P();p.feed(body.decode('utf8','replace'))
  links=[]
  for l in p.links:
   v=urllib.parse.urljoin(final,l).split('#')[0];parsed=urllib.parse.urlparse(v)
   if parsed.netloc=='psitrends.com' and parsed.scheme=='https' and not parsed.query and not re.search(r'\.(jpg|png|webp|pdf|zip|mp4|svg|css|js)$',parsed.path,re.I) and not parsed.path.startswith('/administrator'):
    links.append(v)
    if v not in seen:q.append((v,depth+1))
  out.append(dict(url=u,final=final,status=status,seconds=round(time.time()-start,3),bytes=len(body),depth=depth,title=p.title,description=p.meta.get('description',''),robots=p.meta.get('robots',''),canonical=p.canonical,hreflang=p.hreflang,h1=p.h1,images=len(p.images),missingAlt=sum('alt' not in x or not x['alt'] for x in p.images),forms=p.forms,internalLinks=links,externalLinks=sorted(set(l for l in p.links if l.startswith('http') and 'psitrends.com' not in l)),scripts=p.scripts,headers={k:v for k,v in headers.items() if k.lower() in ['server','x-powered-by','content-encoding','cache-control','strict-transport-security','content-security-policy','x-frame-options','x-content-type-options','referrer-policy']},text=' '.join(x for x in (p.maintext or p.text) if x)[:100000]))
 except Exception as e:out.append(dict(url=u,error=str(e),depth=depth))
 time.sleep(.2)
(EVIDENCE/'crawl.json').write_text(json.dumps({'checkedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'limit':400,'remaining':len(q),'pages':out},ensure_ascii=False,indent=2))
print('Crawled',len(out),'URLs; remaining',len(q))
