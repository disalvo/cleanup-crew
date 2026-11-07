export { formats } from "./registry.mjs";
import { formatAs } from "./registry.mjs";

export async function format(name, payload, options = {}) {
  return formatAs(name, payload, options);
}
