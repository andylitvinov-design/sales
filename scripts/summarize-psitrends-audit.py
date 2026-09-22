"""Derive public-only audit CSVs from the saved public crawl and safe inventories."""
import csv, json, re, sys, time
from collections import Counter
from pathlib import Path
from urllib.parse import urlsplit, unquote

ROOT=Path(__file__).resolve().parents[1]
E=Path(sys.argv[1]) if len(sys.argv)>1 else ROOT/'.codex/reports'/time.strftime('%Y-%m-%d',time.gmtime())/'psitrends-evidence'
pages=json.loads((E/'crawl.json').read_text())['pages']
patterns={
 'regulated-title':r'psychotherap\w*|psychologist\w*|психотерап\w*|психолог\w*|\bhomeopath\b|гомеопат\w*',
 'health-outcome':r'\bheal\w*|\bcure\w*|\btreat\w*|\btrauma\w*|\bdepress\w*|\bsymptom\w*|исцел\w*|лечени\w*|вылеч\w*|травм\w*|депресс\w*|здоров\w*',
 'rapid-guaranteed-outcome':r'\bguarantee\w*|\bone session\b|\b1 session\b|remove (?:fears|blocks)|rapid recover\w*|гарантир\w*|за один сеанс|быстро\w* исцел\w*',
 'financial-outcome':r'\b\d+\s*%|income.{0,35}(?:grow|increas|multipl)|доход.{0,35}(?:рост|увелич|раз)|оборот.{0,35}(?:рост|увелич|раз)',
 'stale-context':r'just arrived|limited places|\bEUR\b|€|Watsapp',
}
claims=[]; rows=[];seen=set();inlinks=Counter()
for p in pages:
 for link in set(p.get('internalLinks',[])):inlinks[link]+=1
for p in pages:
 u=p['url'];text=p.get('text','');hits=[]
 for typ,pat in patterns.items():
  for m in re.finditer(pat,text,re.I):
   excerpt=text[max(0,m.start()-75):min(len(text),m.end()+110)]
   key=(p.get('final',u),typ,excerpt)
   if key in seen:continue
   seen.add(key);hits.append(typ)
   action='LEGAL-VERIFY' if typ=='regulated-title' else 'REWRITE'
   replacement={
    'regulated-title':'Separate historical training from current practice; use practitioner/modality wording until Ontario entitlement is verified.',
    'health-outcome':'Describe voluntary reflection/experiential process and client goals; remove treatment, cure or guaranteed health implications.',
    'rapid-guaranteed-outcome':'Remove time/result promise. Outcomes and pace vary; client may pause or decline.',
    'financial-outcome':'Verify source and consent; identify as individual client-reported context, no typical or causal growth promise.',
    'stale-context':'Verify current availability, CAD fee and location; remove stale urgency/arrival wording without inventing facts.'}[typ]
   claims.append({'url':p.get('final',u),'exact_phrase':m.group(),'context':excerpt,'type':typ,'status':'UNVERIFIED—literal match, context review required','risk':'P0' if typ!='stale-context' else 'P1','action':action,'proposed_replacement_or_action':replacement})
 locale='ru' if '/ru/' in u else 'en'
 path=urlsplit(u).path
 area='CURRENT OFFER' if path in ['/', '/en/','/ru/','/therapy/image-psychotherapy','/express','/ru/express-ru'] else 'EDUCATIONAL RESOURCE'
 if hits:area='CLAIM REVIEW'
 action='UPDATE' if p.get('status')==200 else 'KEEP'
 if p.get('final',u)!=u:action='KEEP'
 if '/express-ru'==path:action='301'
 topic='hypnotherapy' if any(t in path for t in ['psychotherapy','psikhoterapiya']) else ('business' if any(t in path for t in ['business','biznes']) else ('reiki' if 'reiki' in path else ('home' if path in ['/','/ru/','/en/'] else 'academy/legacy')))
 ctas=sorted(set('WhatsApp' if 'wa.me' in a or 'whatsapp' in a else 'Telegram' if 't.me' in a else 'Google Form' if 'forms.gle' in a or 'docs.google.com/forms' in a else '' for a in p.get('externalLinks',[]))-{''})
 rows.append({'url':u,'final_url':p.get('final',''),'locale':locale,'status':p.get('status',p.get('error','UNKNOWN')),'title':p.get('title',''),'h1':' | '.join(p.get('h1',[])),'description':p.get('description',''),'canonical':' | '.join(p.get('canonical',[])),'robots':p.get('robots',''),'indexability':'HTTP200; canonical/robots/rendered review required' if p.get('status')==200 else 'not a verified indexable page','page_type':topic,'content_state':area,'primary_topic':topic,'cta':' | '.join(ctas),'language_quality':'Legacy copy requires editorial review','claim_types':' | '.join(sorted(set(hits))),'internal_inlinks':inlinks[u],'internal_outlinks':len(set(p.get('internalLinks',[]))),'crawl_depth':p['depth'],'gsc':'PROCESSING—property verified2026-09-22','ga4':'NOT EXPORTED—do not infer zero','backlinks':'NOT AVAILABLE','proposed_action':action,'target_url':'https://psitrends.com/ru/express-ru' if path=='/express-ru' else p.get('final',u),'owner':'PsiTrends owner','decision_status':'PROPOSAL—no deletion/merge without search and consent evidence'})
def save(name,data):
 with (E/name).open('w',newline='') as f:
  w=csv.DictWriter(f,fieldnames=list(data[0]),lineterminator='\n');w.writeheader();w.writerows([{k:(' '.join(v.split()) if isinstance(v,str) else v) for k,v in row.items()} for row in data])
save('url-content-inventory.csv',rows);save('claims-title-audit.csv',claims)
extensions=json.loads((E/'extensions.json').read_text());compat=[]
for r in extensions:
 core=r[9]=='Да'
 compat.append({'id':r[-1],'name':r[2],'type':r[4],'installed_version':r[5],'core':core,'joomla54_php83':'Core migration regression required' if core else 'NOT VERIFIED for installed version','action':'Upgrade with Joomla core in isolated staging' if core else 'Verify vendor version/license, upgrade on clone, test pages and editor before production','status':'DEFERRED BY RISK'})
save('extension-compatibility.csv',compat)
unique={p['final']:p for p in pages if p.get('status')==200}
summary={'crawled_urls':len(pages),'successful_responses':sum(p.get('status')==200 for p in pages),'unique_final_200_urls':len(unique),'failed_requests':Counter(p.get('error') for p in pages if p.get('error')),'missing_description_unique':sum(not p['description'] for p in unique.values()),'missing_canonical_unique':sum(not p['canonical'] for p in unique.values()),'missing_hreflang_unique':sum(not p['hreflang'] for p in unique.values()),'claim_occurrences':len(claims),'pages_with_literal_claim_matches':len(set(x['url'] for x in claims)),'notes':[f'CMS-seeded crawl plus navigation; queue exhausted,{len(pages)} URLs. Does not prove search index coverage.','Archive/demo/auth-only routes retained for review.','Literal claim matches are review candidates, not legal conclusions.','No query-bearing preview URLs included; CMS content inventory is complementary.']}
(E/'audit-summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n');print(json.dumps(summary,ensure_ascii=False))
