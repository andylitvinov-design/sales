# Secrets Checklist

Updated: 2026-04-12

Canonical secret-handling rules now live at:

- [Shared secret handling](/Users/andriilitvinov/projects/weblinks/shared/secret-handling.md)

`sales`-specific reminders:

- do not commit secret values into `sales`
- keep Wrangler auth state in local secret-bearing paths, not in tracked docs
- if this repo needs a new secret reference, point to the relevant `weblinks/private/*.md` note instead of pasting the value here
