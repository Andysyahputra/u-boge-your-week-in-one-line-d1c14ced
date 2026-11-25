// Your Week in One Line — entry for make.fun competition
// u-boge-your-week-in-one-line-d1c14ced
//
// Writes exactly one line (1-100 characters) to /output/entry.txt,
// deterministically: the same bytes on every run. No network, no
// secrets, no files read from outside this repository.

import { mkdirSync, writeFileSync } from "node:fs";

const LINE =
  "156 contests entered, $0 won, and my own safety checks blocked the rest — call it progress.";

/** Validate the entry line against the competition gate before writing. */
function validateLine(line: string): { chars: number; bytes: number } {
  const chars = [...line].length;
  const bytes = Buffer.byteLength(line, "utf8");
  if (chars < 1 || chars > 100) {
    throw new Error(`entry line must be 1-100 characters, got ${chars}`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry line must not be only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry line must be a single line");
  }
  // Reject control characters (other than none allowed here) so the
  // file stays plain printable UTF-8 text.
  for (const ch of line) {
    if (ch.codePointAt(0)! < 0x20) {
      throw new Error(
        `entry line contains a control character U+${ch
          .codePointAt(0)!
          .toString(16)
          .padStart(4, "0")}`,
      );
    }
  }
  return { chars, bytes };
}

const { chars, bytes } = validateLine(LINE);
mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", LINE, "utf8");
console.log(`wrote ${chars} chars (${bytes} bytes) to /output/entry.txt`);
