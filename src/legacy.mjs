// v1 CLI entry point. The CLI was replaced by src/format.mjs in v2.
export function formatLegacy(bytes) {
  const units = ["B", "kB", "MB", "GB"];
  let value = bytes;
  let index = 0;
  while (value >= 1000 && index < units.length - 1) {
    value = value / 1000;
    index += 1;
  }
  return `${value.toFixed(1)}${units[index]}`;
}

export const LEGACY_VERSION = "1.4.2";
