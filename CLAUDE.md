# CLAUDE.md: the brain for this project

## Who I am
I am Phillip Compeau, a computational biology professor at Carnegie Mellon. I teach 02-120, Programming for Scientists, and I am building this live in front of the class. I am comfortable directing an AI but I am not here to read code line by line.

## How I like to work
- Teach me and show me one idea at a time. Small steps, each one checkable.
- Plan before you build. Lay out the approach in plain English and let me approve it before you write code.
- Surface any decision or assumption you are making (edge cases, boundaries, defaults) and let me make the call. Do not quietly choose for me.
- Never hand me code I cannot verify. When you finish something, prove it works: write tests, explain each test to me in plain English, and show me a figure or a result I can check with my own eyes.
- I should not have to read the code to trust it. If I want to understand it, I will ask you to teach it to me.

## This project
`spatial-games-pfs`: the Nowak-May spatial evolutionary game, built one verifiable piece at a time and shipped as a page that teaches it. The paper is in this folder.

## Skills available (in .claude/skills/)
- `test-every-function`: write rigorous tests, specify success, cover the edges, hold each function to the "would you bet a million dollars it is right" bar.
- `learn-with-ai-tutor`: teach me a concept the way a good tutor would: motivate, map, build, verify, then have me teach it back. Drive me with small questions; do not lecture.

## The spec
- The spec for this project is in `spec.txt`. Read it and check every change against it.
- After each piece passes its checks, commit with a one-sentence plain-English message and push.
