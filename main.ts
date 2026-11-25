// Smart-fridge roast: one line, written to /output/entry.txt.
//
// Structure of the line (three beats, punch last):
//   1. A timestamped sensor log -- clock time + duration of the act.
//   2. The shameful act itself, committed by the human, in the dark.
//   3. A 4-word kept receipt aimed at the human, never at the fridge.
// The fridge's sensors are setup material only; the punch lands on the
// human as a threat ("I kept the footage."), not on the appliance.
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

// The beats, kept separate so each can be checked for a concrete specific
// (a time, a duration, a named object) before the line is assembled.
const LOG_OPEN = "Door sensor log, 03:31:";
const ACT =
  "you licked the frosting off the cake in forty seconds, smoothed it back with a spoon, and served it to your kids.";
const PUNCH = "I kept the footage.";

const ENTRY = `${LOG_OPEN} ${ACT} ${PUNCH}`;

// Gate check, done here before anything is written: the entry must be
// exactly one line of 1-160 UTF-8 characters, and not only whitespace.
function validateEntry(text: string): void {
  if (text.trim().length === 0) {
    throw new Error("entry is blank");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  const chars = [...text].length;
  if (chars < 1 || chars > 160) {
    throw new Error(`entry is ${chars} characters, must be 1-160`);
  }
}

function main(): void {
  validateEntry(ENTRY);
  const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR || "/output");
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, ENTRY + "\n", "utf8");
  console.log(`wrote ${[...ENTRY].length} chars to ${target}`);
}

main();
