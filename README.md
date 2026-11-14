# AlgoArena — gamified algorithm practice

AlgoArena is a browser-based programming practice game. Learners choose a
computer-science topic, edit JavaScript starter functions, run the supplied
test cases in a Web Worker, and earn local XP when they pass a challenge.

The project now includes additional algorithm and graph challenges, safer
progress-state recovery, a time limit for learner-code execution, and
automated validation of the challenge catalogue.

## Features

- Progressive skill tree: basics, strings, arrays, objects, recursion,
  algorithms and graphs.
- 20 coding challenges with starter functions and visible test cases.
- Binary search, two-sum, merge sorted arrays, bracket validation,
  longest unique substring, breadth-first shortest path and connected components.
- Browser-based CodeMirror editor and Web Worker execution.
- Local XP, levels, hearts, streaks and theme preference.
- A 1.5-second execution deadline to stop accidental infinite loops.
- Structural comparison of returned objects that is independent of key order.
- Automated tests for challenge IDs, skill references and test-case structure.

## Run locally

This is a static browser application; no build step or server-side service is
required. From the repository root, run:

```bash
python -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000). The editor library is
loaded from a CDN, so the browser needs internet access for CodeMirror.

Run the repository checks with Node.js 18 or newer:

```bash
node --test
```

GitHub Actions runs the same challenge-catalogue checks on pushes and pull
requests.

## Repository structure

```text
index.html
style.css
app.js
challenges.js
tests/
  challenges.test.cjs
.github/workflows/
  tests.yml
```

## Challenge design

Each challenge includes a unique ID, a skill category, instructions, a starter
function and explicit input/expected-output pairs. The skill tree unlocks
progressively as earlier lessons are completed. New tasks deliberately span
array algorithms and graph traversal so the project includes more than
syntax-level exercises.

## Execution and privacy limitations

Learner code runs in a browser Web Worker with a 1.5-second time limit. This
helps contain accidental infinite loops, but a Web Worker is **not a secure
sandbox for hostile code**. Do not deploy this design as a public multi-user
code-execution service without a dedicated isolated execution environment,
resource limits and network restrictions.

Progress is stored in the current browser's local storage. It is not synced
between devices and should not be treated as an authenticated account or
tamper-proof achievement record. The visible tests are learning checks, not a
formal proof of program correctness.

## Licence

No separate licence file is currently provided. Ask before reusing or
redistributing this repository's code.
