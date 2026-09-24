"""Build the preservation-first release map from public crawl evidence."""
import csv
import json
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = ROOT / '.codex/reports/2026-09-22/psitrends-evidence'
fields = ['old_url', 'new_url', 'action', 'locale', 'status', 'final_url',
          'cms_ids', 'content_state', 'current_cta', 'internal_inlinks',
          'gsc', 'ga4', 'backlinks', 'decision_status', 'owner', 'release_batch',
          'release_gate', 'reason', 'evidence', 'before_after_checks', 'rollback']
rows = {}

def row(url):
    return dict.fromkeys(fields, '') | {
        'old_url': url, 'new_url': url, 'action': 'KEEP',
        'gsc': 'UNAVAILABLE: processing', 'ga4': 'UNAVAILABLE: not exported',
        'backlinks': 'UNAVAILABLE', 'owner': 'PsiTrends site steward',
        'decision_status': 'PRESERVE; individual editorial review pending',
        'release_batch': 'legacy-preservation',
        'release_gate': 'No relocation or deletion authorized by missing metrics',
        'before_after_checks': 'HTTP status, visible content, locale and links',
        'rollback': 'No mutation; retain paired private pre-release backup',
    }

with (EVIDENCE / 'url-content-inventory.csv').open() as source:
    for item in csv.DictReader(source):
        url = item['url']
        r = row(url)
        r.update({k: item.get(k, '') for k in ['locale', 'status', 'final_url',
                  'content_state', 'internal_inlinks', 'gsc', 'ga4', 'backlinks']})
        r.update(current_cta=item['cta'], evidence='public crawl2026-09-22',
                 reason='Preserve existing URL and useful content; review claims in context')
        if url in ['https://psitrends.com/', 'https://psitrends.com/ru/']:
            r.update(action='UPDATE', content_state='CURRENT OFFER',
                     release_batch='native-client-layer',
                     release_gate='Native preview, supported save, ACL and paired rollback pass',
                     reason='Replace client homepage in place; retain original Quix records',
                     rollback='Private client release journal and paired backup')
        elif item['final_url'] != url:
            r.update(new_url=item['final_url'], reason='Preserve observed existing redirect; no new redirect')
        rows[url] = r

queries = json.loads((ROOT / 'reports/psitrends-query-inventory.json').read_text())
for item in queries['results']:
    url = item['url']
    if not urlsplit(url).query:
        continue
    r = row(url)
    r.update(locale=item.get('locale', ''), status=item.get('status', ''),
             final_url=item.get('final_url', url),
             cms_ids=json.dumps(item.get('source_ids', []), ensure_ascii=False),
             content_state='CLAIM REVIEW',
             evidence='CMS-seeded query crawl2026-09-22',
             reason='Meaningful Joomla query view; retain until exact equivalent and content reviewed',
             internal_inlinks='UNAVAILABLE: query inventory does not measure inlinks',
             current_cta='UNAVAILABLE: query inventory does not classify CTA')
    if item.get('status') == 500:
        r.update(action='UPDATE', release_batch='legacy-renderer-data-repair',
                 reason='Repair verified malformed background field; preserve content and URL',
                 release_gate='Seven-leaf guarded repair, rollback and legacy routing regression pass',
                 rollback='Private exact-row snapshots plus paired backup')
    rows[url] = r

for slug in ['hypnotherapy-toronto', 'systemic-constellations-toronto']:
    for suffix in ['', '.html', '/']:
        url = f'https://sales-bwa-photo.pages.dev/{slug}{suffix}'
        r = row(url)
        r.update(new_url=f'https://psitrends.com/{slug}', action='301', locale='en',
                 content_state='CURRENT OFFER', release_batch='first-party-service-migration',
                 decision_status='READY; target production verification required',
                 release_gate='First-party200, canonical/indexability, consent and CTA verified',
                 reason='Consolidate exact interim service equivalents without duplicate indexed pages',
                 evidence='Existing service source; native preview; exact redirect tests',
                 before_after_checks='Six301 variants; query preservation; final200; no loops; CF root unchanged',
                 rollback='Previous Cloudflare deployment; revert migration flag only with canonical review')
        rows[url] = r

target = ROOT / 'docs/psitrends-url-map.csv'
with target.open('w', newline='') as dest:
    writer = csv.DictWriter(dest, fieldnames=fields, lineterminator='\n')
    writer.writeheader()
    writer.writerows(rows.values())
assert len(rows) == len(set(rows))
assert all(r['action'] in {'KEEP', 'UPDATE', '301'} for r in rows.values())
print(json.dumps({'mapped_urls': len(rows), 'query_urls': sum(bool(urlsplit(u).query) for u in rows),
                  'deletions': 0, 'source': str(target)}))
