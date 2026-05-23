# Remediation Notes

## Main Fixes

- Require authentication for destructive operations.
- Verify ownership or role authorization for every resource.
- Use non-predictable identifiers and avoid exposing internal file names.

## Engineering Checklist

- Add server-side authorization checks.
- Add regression tests for the reported scenario.
- Log suspicious repeated attempts.
- Return minimal response data.
- Document intended business rules.
- Review related endpoints for the same pattern.

## Verification

After remediation, confirm:

- The old step no longer reproduces: Find a public resource URL with a hash-like ID.
- The old step no longer reproduces: Send a DELETE request to the same path in a controlled lab.
- The old step no longer reproduces: Request the resource again.
- The old step no longer reproduces: Observe that it is gone.
