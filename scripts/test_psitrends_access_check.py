"""Synthetic-only tests: never invoke security or use real credentials."""
import contextlib
import io
import json
from pathlib import Path
import runpy
import subprocess
import unittest
from unittest.mock import patch

SCRIPT = Path(__file__).with_name('psitrends-access-check.py')
SENTINEL = 'SYNTHETIC_SECRET_MUST_NOT_LEAK'


class RecoveryCheckTests(unittest.TestCase):
    def check_case(self, outcome, status):
        self.assertTrue(SCRIPT.is_file(), 'Recovery checker must exist')
        stdout, stderr = io.StringIO(), io.StringIO()
        kwargs = {'side_effect': outcome} if isinstance(outcome, BaseException) else {'return_value': outcome}
        with patch('subprocess.run', **kwargs) as run, contextlib.redirect_stdout(stdout), contextlib.redirect_stderr(stderr):
            runpy.run_path(str(SCRIPT), run_name='__main__')
        result = json.loads(stdout.getvalue())
        self.assertEqual(result['status'], status)
        self.assertIs(result['joomla_login_verified'], False)
        self.assertEqual(set(result), {'status', 'joomla_login_verified'})
        self.assertNotIn(SENTINEL, stdout.getvalue() + stderr.getvalue())
        self.assertEqual(stderr.getvalue(), '')
        run.assert_called_once_with(
            ['/usr/bin/security', 'find-generic-password', '-s',
             'psitrends.production.joomla', '-a', 'cms-administrator', '-w'],
            capture_output=True, timeout=15, check=False,
        )

    def test_retrieved_credentials_never_claim_login_or_leak(self):
        value = json.dumps({'username': SENTINEL, 'password': SENTINEL}).encode()
        self.check_case(subprocess.CompletedProcess([], 0, value, SENTINEL.encode()), 'CREDENTIAL_RETRIEVED_LOGIN_NOT_VERIFIED')

    def test_missing_item(self):
        self.check_case(subprocess.CompletedProcess([], 44, SENTINEL.encode(), SENTINEL.encode()), 'KEYCHAIN_ITEM_NOT_FOUND')

    def test_locked_or_interaction_required(self):
        for code in (36, 51, 128):
            with self.subTest(code=code):
                self.check_case(subprocess.CompletedProcess([], code, SENTINEL.encode(), SENTINEL.encode()), 'KEYCHAIN_LOCKED_OR_INTERACTION_REQUIRED')

    def test_timeout_never_leaks_partial_output(self):
        self.check_case(subprocess.TimeoutExpired(SENTINEL, 15, output=SENTINEL.encode(), stderr=SENTINEL.encode()), 'KEYCHAIN_TIMEOUT')

    def test_invalid_credentials(self):
        values = [SENTINEL.encode(), b'\xff', b'[]', b'null', b'{}']
        for username, password in [('', SENTINEL), (SENTINEL, ''), (' ', SENTINEL), (SENTINEL, None), (123, SENTINEL)]:
            values.append(json.dumps({'username': username, 'password': password}).encode())
        for value in values:
            with self.subTest(value_type=type(value).__name__):
                self.check_case(subprocess.CompletedProcess([], 0, value, SENTINEL.encode()), 'MALFORMED_CREDENTIAL')

    def test_unknown_failure_does_not_expose_diagnostics(self):
        self.check_case(subprocess.CompletedProcess([], 1, SENTINEL.encode(), SENTINEL.encode()), 'KEYCHAIN_READ_FAILED')

    def test_missing_security_binary(self):
        self.check_case(FileNotFoundError(SENTINEL), 'KEYCHAIN_TOOL_UNAVAILABLE')

    def test_exception_never_exposes_message(self):
        self.check_case(OSError(SENTINEL), 'KEYCHAIN_READ_FAILED')


if __name__ == '__main__':
    unittest.main()
