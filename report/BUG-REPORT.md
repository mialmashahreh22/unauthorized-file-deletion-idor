# Bug Report: Unauthorized File Deletion IDOR

## Summary

A predictable resource identifier can be used with an unauthenticated DELETE request to remove a file-like resource.

## Vulnerability Type

IDOR / Access Control / Destructive Action

## Severity

High

## Related CWE

CWE-639: Authorization Bypass Through User-Controlled Key

## Steps to Reproduce

1. Find a public resource URL with a hash-like ID.
2. Send a DELETE request to the same path in a controlled lab.
3. Request the resource again.
4. Observe that it is gone.

## Expected Behavior

DELETE requests should require authentication, ownership checks, and non-predictable identifiers.

## Actual Behavior

The server accepts destructive requests based only on knowledge of a resource identifier.

## Impact

- Unauthorized deletion of resources.
- Potential denial of service.
- Integrity loss if identifiers can be guessed or enumerated.

## Remediation

- Require authentication for destructive operations.
- Verify ownership or role authorization for every resource.
- Use non-predictable identifiers and avoid exposing internal file names.

## Evidence Guidance

For a real responsible disclosure report, include only authorized evidence:

- Redacted screenshots
- Redacted request and response examples
- Timeline of testing
- Clear reproduction steps
- No real secrets, tokens, private personal data, or destructive live actions

## CTF Lab

The lab in `labs/ctf-game` teaches this bug class using safe mock data. Complete all missions to reveal the flag.
