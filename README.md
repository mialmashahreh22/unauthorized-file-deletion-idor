# Unauthorized File Deletion IDOR

<p align="center">
  <img src="https://img.shields.io/badge/Bug_Report-Cybersecurity-0078D4?style=for-the-badge" alt="Bug Report">
  <img src="https://img.shields.io/badge/CTF_Lab-Realistic_Simulation-22C55E?style=for-the-badge" alt="Realistic CTF Simulation">
  <img src="https://img.shields.io/badge/Severity-High-DC2626?style=for-the-badge" alt="High">
</p>

---

## Overview

Use the mock request console to delete a resource while unauthenticated, then verify it is gone.

This repository is a **sanitized educational case study**. It does not target a real company or live system. The CTF lab is a mock vulnerable app where the flag unlocks only after reproducing the simulated bug.

## Play the CTF Simulation

Run locally:

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000/labs/ctf-game/
```

GitHub Pages:

```text
https://mialmashahreh22.github.io/unauthorized-file-deletion-idor/labs/ctf-game/
```

## What You Must Do

Exploit the missing authorization check on DELETE.

## Report

Read the full report:

```text
report/BUG-REPORT.md
```

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
