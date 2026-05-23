# Unauthorized File Deletion IDOR - CTF Lab Guide

This lab is a realistic mock simulation for one bug class.

## Goal

Find the bug in the mock app and unlock the flag.

## How to Run

From this repo root:

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000/labs/ctf-game/
```

## What to Do

1. Open the mock request console.
2. Send a DELETE request as an anonymous user.
3. Send a GET request to the same resource.
4. When the file is gone, the flag appears.

## What You Should Learn

Destructive methods like DELETE must always enforce authentication and authorization.

## Safety

This is a local mock app. Do not repeat these actions against real websites unless you have explicit authorization.
