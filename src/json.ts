import {
  char,
  sequenceOf,
  str,
  choice,
  possibly,
  sepBy,
  many,
  digits,
  optionalWhitespace,
  between,
  anyOfString,
  recursiveParser,
  anyCharExcept,
  Parser,
} from "arcsecond";

import { JSONValue, KeyValuePair, StringValue } from "./jsonTypes";
import {
  asJSONArray,
  asJSONBool,
  asJSONNumber,
  asJSONObject,
  jsonNull,
} from "./jsonConstructors";

export const parseJsonValue = recursiveParser(() =>
  choice([
    parseNumber,
    parseBool,
    parseNull,
    parseString,
    parseArray,
    parseObject,
  ])
);

export const escapedQuote = sequenceOf([str("\\"), anyOfString(`"'`)]).map(
  (x) => x.join("")
);

export const parseString = sequenceOf([
  char('"'),
  many(choice([escapedQuote, anyCharExcept(char('"'))])).map((x) => x.join("")),
  char('"'),
]).map(([_, x]) => {
  const result: JSONValue = {
    type: "string",
    value: x,
  };
  return result;
});

export const orEmptyString = (parser: Parser<string, string, any>) =>
  possibly(parser).map((x) => (x ? x : ""));

export const whitespaceSurrounded =
  between(optionalWhitespace)(optionalWhitespace);

export const commaSeparated = sepBy(whitespaceSurrounded(char(",")));

export const parseBool = choice([str("true"), str("false")]).map((x) =>
  x === "true" ? asJSONBool(true) : asJSONBool(false)
);

export const plusOrMinus = anyOfString("+-");

export const parseFloat = sequenceOf([
  orEmptyString(plusOrMinus),
  digits,
  char("."),
  digits,
]).map((x) => asJSONNumber(x.join("")));

export const parseInt = sequenceOf([orEmptyString(plusOrMinus), digits]).map(
  (x) => asJSONNumber(x.join(""))
);

export const parseScientificForm = sequenceOf([
  choice([parseFloat, parseInt]).map((x) => x.value),
  anyOfString("eE"),
  choice([parseFloat, parseInt]).map((x) => x.value),
]).map((x) => asJSONNumber(x.join("")));

export const parseNumber = choice([parseScientificForm, parseFloat, parseInt]);

export const parseNull = str("null").map(() => jsonNull);

export const parseArray = between(whitespaceSurrounded(char("[")))(
  whitespaceSurrounded(char("]"))
)(
  possibly(commaSeparated(parseJsonValue)).map((x) =>
    asJSONArray(x ? (x as JSONValue[]) : ([] as JSONValue[]))
  )
);

export const keyValueSeparator = whitespaceSurrounded(char(":"));

export const parseKeyValue = whitespaceSurrounded(
  sequenceOf([parseString, keyValueSeparator, parseJsonValue]).map((x) => {
    const [key, _, value] = x as [StringValue, string, JSONValue];
    return { [key.value]: value } as KeyValuePair;
  })
);

export const parseObject = between(whitespaceSurrounded(char("{")))(
  whitespaceSurrounded(char("}"))
)(
  commaSeparated(parseKeyValue).map((keyValuePairs) => {
    return asJSONObject(keyValuePairs as KeyValuePair[]);
  })
);
