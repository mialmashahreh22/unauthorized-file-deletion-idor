# Unauthorized File Deletion IDOR

<p align="center">
  <img src="https://img.shields.io/badge/Bug_Report-Cybersecurity-0078D4?style=for-the-badge" alt="Bug Report">
  <img src="https://img.shields.io/badge/CTF_Lab-Realistic_Simulation-22C55E?style=for-the-badge" alt="Realistic CTF Simulation">
  <img src="https://img.shields.io/badge/Standalone-Repo-F97316?style=for-the-badge" alt="Standalone Repo">
</p>

---

## What Is Inside This Repo?

This repo is a complete standalone project for **one bug**:

- Bug explanation: `explanation/BUG-EXPLANATION.md`
- Full bug report: `report/BUG-REPORT.md`
- Playable CTF lab: `labs/ctf-game/`
- Lab guide: `labs/ctf-game/LAB-GUIDE.md`
- Remediation notes: `docs/remediation.md`
- References: `resources/references.md`

## Bug Summary

A user can delete a file-like resource just by knowing its ID, without being authenticated or authorized.

## Play the CTF Lab

GitHub Pages:

[Play the lab](https://mialmashahreh22.github.io/unauthorized-file-deletion-idor/labs/ctf-game/)

Run locally:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/labs/ctf-game/
```

## Repository Structure

```text
unauthorized-file-deletion-idor/
|-- README.md
|-- explanation/
|   `-- BUG-EXPLANATION.md
|-- report/
|   `-- BUG-REPORT.md
|-- docs/
|   `-- remediation.md
|-- labs/
|   `-- ctf-game/
|       |-- LAB-GUIDE.md
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

This is a sanitized educational simulation. It uses mock data only and does not target a real company or live system.
