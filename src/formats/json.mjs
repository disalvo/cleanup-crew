// JSON text; indent 0 means one line.
export function format(payload, { indent = 0 } = {}) {
  return JSON.stringify(payload, null, indent);
}
