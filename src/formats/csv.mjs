// One CSV record, RFC 4180 quoting.
export function format(payload) {
  const cells = Array.isArray(payload) ? payload : [payload];
  return cells
    .map((cell) => {
      const text = String(cell);
      return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
    })
    .join(",");
}
