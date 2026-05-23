# Unauthorized File Deletion IDOR

<p align="center">
  <img src="https://img.shields.io/badge/Bug_Report-Cybersecurity-0078D4?style=for-the-badge" alt="Bug Report">
  <img src="https://img.shields.io/badge/CTF_Lab-Playable-22C55E?style=for-the-badge" alt="CTF Lab">
  <img src="https://img.shields.io/badge/Category-IDOR_%2F_Access_Control_%2F_Destructive_Action-F97316?style=for-the-badge" alt="IDOR / Access Control / Destructive Action">
  <img src="https://img.shields.io/badge/Severity-High-DC2626?style=for-the-badge" alt="High">
</p>

---

## Overview

A predictable resource identifier can be used with an unauthenticated DELETE request to remove a file-like resource.

This repository is a **sanitized educational case study**. It does not target a real company or live system. The included lab uses mock data so students can safely understand the bug class.

## Quick Facts

| Field | Value |
|---|---|
| Category | IDOR / Access Control / Destructive Action |
| Severity | High |
| Related CWE | CWE-639: Authorization Bypass Through User-Controlled Key |
| Lab | Browser-based CTF |
| Flag Style | `FLAG{...}` |

## Play the CTF Lab

Run locally:

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000/labs/ctf-game/
```

Goal: solve the three missions and reveal the flag.

## Report

Read the full report:

```text
report/BUG-REPORT.md
```

## Impact Summary

- Unauthorized deletion of resources.
- Potential denial of service.
- Integrity loss if identifiers can be guessed or enumerated.

## Repository Structure

```text
unauthorized-file-deletion-idor/
|-- README.md
|-- report/
|   `-- BUG-REPORT.md
|-- docs/
|   `-- remediation.md
|-- labs/
|   `-- ctf-game/
|       |-- index.html
|       |-- styles.css
|       |-- app.js
|       |-- manifest.webmanifest
|       |-- service-worker.js
|       `-- assets/
|           `-- ctf-icon.svg
`-- resources/
    `-- references.md
```

## Safety

Use this project only for learning, local labs, and responsible disclosure practice. Do not test destructive actions, IDORs, token exposure, or business-logic abuse against systems you do not own or have permission to test.
