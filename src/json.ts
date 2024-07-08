import {
  char,
  sequenceOf,
  str,
  choice,
  possibly,
  sepBy,
  many,
  anythingExcept,
  digits,
  optionalWhitespace,
  between,
  anyOfString,
  recursiveParser,
  anyCharExcept,
  Parser,
} from "arcsecond";

export const escapedQuote = sequenceOf([str("\\"), anyOfString(`"'`)]).map(
  (x) => x.join("")
);

export const parseString = sequenceOf([
  char('"'),
  many(choice([escapedQuote, anyCharExcept(char('"'))])).map((x) => x.join("")),
  char('"'),
]).map(([_, result]) => result);

export const orEmptyString = (parser: Parser<string, string, any>) =>
  possibly(parser).map((x) => (x ? x : ""));

export const whitespaceSurrounded =
  between(optionalWhitespace)(optionalWhitespace);

export const commaSeparated = sepBy(whitespaceSurrounded(char(",")));

export const parseBool = choice([str("true"), str("false")]).map((x) =>
  x === "true" ? true : false
);

export const plusOrMinus = anyOfString("+-");

export const parseFloat = sequenceOf([
  orEmptyString(plusOrMinus),
  digits,
  char("."),
  digits,
]).map((x) => x.join(""));

export const parseInt = sequenceOf([orEmptyString(plusOrMinus), digits]).map(
  (x) => x.join("")
);

export const parseScientificForm = sequenceOf([
  choice([parseFloat, parseInt]),
  anyOfString("eE"),
  choice([parseFloat, parseInt]),
]).map((x) => x.join(""));

export const parseNumber = choice([parseScientificForm, parseFloat, parseInt]);
