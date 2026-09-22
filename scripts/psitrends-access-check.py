#!/usr/bin/env python3
"""Check a private Keychain credential shape; never authenticate to Joomla.

Run only when owner interaction is appropriate: security may prompt. No retries,
network calls, saved credential values, or Keychain permission changes. Output is
an allowlisted status only; subprocess diagnostics and exceptions stay private.
"""
import json
import subprocess


def check_access():
    """Return only a status, keeping captured secret bytes local to this call."""
    try:
        result = subprocess.run(
            ['/usr/bin/security', 'find-generic-password', '-s',
             'psitrends.production.joomla', '-a', 'cms-administrator', '-w'],
            capture_output=True, timeout=15, check=False,
        )
    except subprocess.TimeoutExpired:
        return 'KEYCHAIN_TIMEOUT'
    except FileNotFoundError:
        return 'KEYCHAIN_TOOL_UNAVAILABLE'
    except Exception:
        # Exception messages can include command output or credentials.
        return 'KEYCHAIN_READ_FAILED'

    # security exposes OSStatus via the process exit status (low byte).
    # These are operational hints, never proof that a credential is absent
    # from every keychain or that a specific lock/authorization cause applies.
    if result.returncode == 44:  # errSecItemNotFound (-25300)
        return 'KEYCHAIN_ITEM_NOT_FOUND'
    if result.returncode in (36, 51, 128):  # interaction denied/auth failed/cancel
        return 'KEYCHAIN_LOCKED_OR_INTERACTION_REQUIRED'
    if result.returncode != 0:
        return 'KEYCHAIN_READ_FAILED'

    try:
        credential = json.loads(result.stdout)
        valid = isinstance(credential, dict) and all(
            isinstance(credential.get(field), str) and credential[field].strip()
            for field in ('username', 'password')
        )
    except Exception:
        # Decoder exceptions can quote the original secret-bearing input.
        return 'MALFORMED_CREDENTIAL'
    return ('CREDENTIAL_RETRIEVED_LOGIN_NOT_VERIFIED'
            if valid else 'MALFORMED_CREDENTIAL')


if __name__ == '__main__':
    print(json.dumps({'status': check_access(), 'joomla_login_verified': False}))
