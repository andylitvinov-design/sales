"""Host-side exact label correction. Dry-run unless --apply; no URL changes."""
import argparse
import hashlib
import json
from pathlib import Path
import os

parser = argparse.ArgumentParser()
parser.add_argument('--scope', choices=['stage', 'production'], required=True)
parser.add_argument('--apply', action='store_true')
parser.add_argument('--rollback', action='store_true')
args = parser.parse_args()
roots = {
    'stage': Path('/var/lib/psitrends-staging/recovery-20260922'),
    'production': Path('/opt/docker/sites/psitrends'),
}
root = roots[args.scope]
path = root / 'public_html/templates/tx_valley/headers/style-2/header.php'
private = (root / 'legacy-header-repair' if args.scope == 'stage'
           else Path('/var/backups/psitrends/legacy-header-repair'))
before_hash = '49e155054a6e1717f31a498e1f3ad0415c82febd2a5e76fed6bb7148de85c715'
old = b'<li><a href="/express">Free Trial</a></li>'
new = b'<li><a href="/express">Ask about a session</a></li>'
assert path.resolve() == path and path.is_file(), 'Unexpected template path'
data = path.read_bytes()
if args.rollback:
    snapshot = private / 'header.before.php'
    original = snapshot.read_bytes()
    assert hashlib.sha256(original).hexdigest() == before_hash
    assert data == original.replace(old, new), 'Changed template; refuse rollback'
    replacement = original
else:
    assert hashlib.sha256(data).hexdigest() == before_hash, 'Changed template; refuse edit'
    assert data.count(old) == 1
    replacement = data.replace(old, new)
if args.apply:
    private.mkdir(mode=0o700, parents=True, exist_ok=True)
    assert private.resolve() == private and os.stat(private).st_mode & 0o077 == 0
    snapshot = private / 'header.before.php'
    if not args.rollback and not snapshot.exists():
        descriptor = os.open(snapshot, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
        with os.fdopen(descriptor, 'wb') as output:
            output.write(data)
            output.flush()
            os.fsync(output.fileno())
    assert hashlib.sha256(snapshot.read_bytes()).hexdigest() == before_hash
    # Preserve the file's owner/mode and any bind-mounted inode.
    with path.open('r+b') as output:
        assert output.read() == data, 'Concurrent change'
        output.seek(0)
        output.write(replacement)
        output.truncate()
        output.flush()
        os.fsync(output.fileno())
    assert path.read_bytes() == replacement
print(json.dumps({'scope': args.scope, 'applied': args.apply, 'rollback': args.rollback,
                  'before_sha256': hashlib.sha256(data).hexdigest(),
                  'after_sha256': hashlib.sha256(replacement).hexdigest(), 'urls_changed': 0}))
