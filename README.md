# cleanup-crew

Small formatter registry, v2.

## API

```js
import { format, formats } from "./src/format.mjs";

await format("plain", "hello world", { width: 20 }); // plain text, hard-wrapped
await format("csv", ["a,b", "c"], {});               // CSV row, RFC 4180 quoting
await format("json", { a: 1 }, { indent: 2 });       // JSON text
formats;                                             // names you can pass as the first argument
```

- `format(name, payload, options)` resolves **asynchronously** - formats are loaded on demand.
- `formats` is the list of supported names. It must match what actually loads.
- An unknown name throws a `TypeError` whose message lists the supported names.
- `plain` wraps at `options.width` (default 72), breaking on spaces only.
- `csv` quotes a field when it contains a comma, a double quote or a newline, doubling inner quotes.
- `json` uses `options.indent` (default 0 = single line).

## History

v1 shipped a second entry point for the old CLI (`src/legacy.mjs`). The CLI was replaced in v2 by
`src/format.mjs`; the public README only documents the API above.
