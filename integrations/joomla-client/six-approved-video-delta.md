# Six-video delta runner

`update-six-approved-videos.php` narrows the established guarded updater contract to six insertion-only article bodies and six fixed posters. It preflights the exact eighteen-key article set; the other twelve rows, including both previously published English method videos, are immutable. Metadata, menus, ACL, template pages metadata and sitemap are never written.

The private manifest uses `mode=six-approved-video-delta`. `sharedAssetUpdate=true` additionally allows exactly the native index, built CSS and built JavaScript as one coherent version update. Each shared file requires its reconciled `beforeSha256`. Capture preserves its bytes, mode, owner and group. Existing method poster hashes remain invariants.

Mount the unique private checkpoint at `/update`, the verified Joomla root at `/var/www/html`, and the same protected host lock directory for every stage/production invocation at `/release-lock`. The lock directory must be mode 0700; its `client-update.lock` coordinates this runner across checkpoint directories. Existing older runners do not acquire this new lock, so rule out competing legacy deployments separately. Set `PSITRENDS_UPDATE_SCOPE=stage|production`; use `preflight`, `capture`, `apply`, or `rollback`.

The package is immutable after capture. `preflight` writes no snapshot or live content. Stage failure injection uses `PSITRENDS_TEST_FAIL=after_file_1|before_commit|after_commit`; production rejects it. The durable journal distinguishes filesystem progress, DB commit and completion. Recovery uses the same frozen package and guarded `rollback`; it restores captured rows/shared files and removes only matching new posters. Purge scoped caches after apply and rollback through the existing cache runner.

Synthetic recovery tests run on the production PHP image with isolated tmpfs fixtures and no network:

```sh
docker run --rm --network none --tmpfs /update:mode=0700 --tmpfs /release-lock:mode=0700 --tmpfs /var/www/html:mode=0755 -e PSITRENDS_SYNTHETIC_TEST=1 -v "$PWD/integrations/joomla-client:/tests:ro" psitrends-php php -r 'touch("/update/SYNTHETIC_FIXTURE"); require "/tests/update-six-approved-videos.test.php";'
```

These tests substitute only PDO with a transaction double. They prove file/journal recovery and guards under PHP 8.1; they do not replace native stage capture → apply → rollback → reapply, real MySQL failure recovery, browser QA, backup verification, or public playback acceptance.
