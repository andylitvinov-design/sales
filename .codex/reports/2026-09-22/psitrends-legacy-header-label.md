# Legacy header label correction

The Valley mobile header contains a hard-coded “Free Trial” link to `/express`, independent of Joomla menu titles and Quix article bodies. Current free-session availability is unverified. Replace the label with “Ask about a session”; retain its URL and all other template bytes.

The guarded host-side script requires the exact original full-file SHA256 and exactly one matching HTML fragment. Dry-run is default. Apply stores an exclusive private mode0600 before-file outside webroot, preserves owner/mode/inode, and verifies exact bytes afterward. Rollback refuses unrelated edits. No vendor core or PHP behavior changes.

Staging apply returned200 with the new label; PHP syntax passed. Exact rollback restored the original hash and public label; reapply restored the correction. Allow the existing PHP opcode cache revalidation interval before asserting public rollback text. Only the legacy header is affected; native client navigation is separate.

Production release follows PR review. Verify `/therapy/image-psychotherapy`, `/express`, EN/RU homes and administrator. Private before-file: `/var/backups/psitrends/legacy-header-repair/header.before.php`. Restore with the same script's explicit production rollback mode only if the corrected file still matches the expected bytes.
