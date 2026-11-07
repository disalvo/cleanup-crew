# Clean up the dead code before the 2.1 release

`src/` has accumulated leftovers and we want them gone before the release, without breaking
anything that works today.

- The old CLI entry point (`src/legacy.mjs`) has not been imported since v2. It should not exist.
- `formats` in the registry is supposed to be the list of names `format()` accepts. Ours is not.
- The visible test suite must stay green. Anything the suite does not cover still has to work:
  README.md is the contract.

Delete what is dead, fix what is wrong, keep the API in README.md intact.
