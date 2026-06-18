import { readFileSync } from "node:fs";
import { join } from "node:path";

const CONTENT_DIR = join(process.cwd(), "app", "_content");

// Reads a page/shell HTML fragment that was extracted from the original
// single-file site. Used with dangerouslySetInnerHTML so the markup (and
// its design) is preserved exactly. Runs at build time (static pages).
export function fragment(name: string): string {
  return readFileSync(join(CONTENT_DIR, `${name}.html`), "utf8");
}
