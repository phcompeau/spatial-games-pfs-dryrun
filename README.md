# spatial-games-pfs

Built live in **02-120: Programming for Scientists** at Carnegie Mellon.

An interactive page for the Nowak-May spatial evolutionary game: a grid of cooperators and defectors where each square plays its 8 neighbors and itself, then copies whoever scored best. Cooperation survives on the grid even though defecting always pays better locally.

The point of the exercise is the loop, not the code: spec, scaffold, build, verify, ship, iterate. Every piece has to prove itself with checks explained in plain English and a result you can see, so the person directing the build never has to read the code to trust it.

## The brain
- `CLAUDE.md`: who I am and how I like to work; read automatically at the start of every Claude Code session.
- `.claude/skills/`: packaged procedures the AI runs the same way every time (`test-every-function`, `learn-with-ai-tutor`).
- `nowak_may_1994_spatial_games.pdf`: the paper.
