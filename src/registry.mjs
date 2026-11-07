// Formats are loaded on demand: the registry inside the module is the only place that knows
// which files exist.
const NAMES = ["plain", "csv", "json"];

export const formats = NAMES.slice();

export async function formatAs(name, payload, options = {}) {
  if (!NAMES.includes(name)) {
    throw new TypeError(`unknown format "${name}"; supported: ${NAMES.join(", ")}`);
  }
  const mod = await import(`./formats/${name}.mjs`);
  return mod.format(payload, options);
}
