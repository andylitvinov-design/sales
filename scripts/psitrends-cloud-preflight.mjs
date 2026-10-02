#!/usr/bin/env node
const required = [
  'PSITRENDS_PRODUCTION_ACCESS_MODE'
];

const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error('STATUS: BLOCKED');
  console.error('Missing required cloud production configuration: ' + missing.join(', '));
  console.error('Expected PSITRENDS_PRODUCTION_ACCESS_MODE to identify the approved production access path.');
  process.exit(2);
}

const mode = String(process.env.PSITRENDS_PRODUCTION_ACCESS_MODE || '').trim();
if (!['https-broker', 'ssh-cloud-only'].includes(mode)) {
  console.error('STATUS: BLOCKED');
  console.error('Unsupported PSITRENDS_PRODUCTION_ACCESS_MODE. Use https-broker or ssh-cloud-only.');
  process.exit(2);
}

const urls = ['https://psitrends.com/', 'https://psitrends.com/ru/'];
for (const url of urls) {
  const response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(15000) });
  if (!response.ok) {
    console.error('STATUS: BLOCKED');
    console.error('Public readback failed: ' + url + ' -> ' + response.status);
    process.exit(2);
  }
  console.log('HTTP OK', url, response.status);
}

console.log('STATUS: CLOUD_PREFLIGHT_OK');
console.log('Access mode:', mode);
console.log('Production writes still require the repo runbook backup/rollback gate and live EN/RU verification.');
