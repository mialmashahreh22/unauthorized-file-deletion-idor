# Unauthorized File Deletion IDOR - Bug Explanation

## What Is the Bug?

A user can delete a file-like resource just by knowing its ID, without being authenticated or authorized.

## Vulnerability Type

IDOR / Access Control / Destructive Action

## Why It Happens

The endpoint trusts the resource identifier and does not check who is making the request or whether they own the file.

## Why It Matters

Destructive methods like DELETE must always enforce authentication and authorization.

## Safe Lab Version

This repository includes a safe local simulation of the bug. The lab does not contact any real target or live service.

Lab path:

```text
labs/ctf-game/
```

## How to Fix

- Require login for destructive actions.
- Check resource ownership or role permission before deletion.
- Use non-predictable identifiers and monitor unusual DELETE activity.

## Responsible Disclosure Note

For a real report, keep evidence redacted, avoid publishing secrets or private user data, and test only systems where you have permission.
