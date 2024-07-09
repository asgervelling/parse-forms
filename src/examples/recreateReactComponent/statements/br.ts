import { factory } from "typescript";

/** Blank line represented by a semicolon */
export default function br() {
  return factory.createEmptyStatement();
}