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
  letters,
} from "arcsecond";
import {
  ArrayValue,
  JSONValue,
  KeyValuePair,
  StringType,
  StringValue,
} from "./jsonTypes";

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

const asJSONBool = (value: boolean): JSONValue => ({
  type: "boolean",
  value: value,
});

export const parseBool = choice([str("true"), str("false")]).map((x) =>
  x === "true" ? asJSONBool(true) : asJSONBool(false)
);

export const plusOrMinus = anyOfString("+-");

const asJSONNumber = (value: number): JSONValue => ({
  type: "number",
  value: value,
});

export const parseFloat = sequenceOf([
  orEmptyString(plusOrMinus),
  digits,
  char("."),
  digits,
]).map((x) => asJSONNumber(Number(x.join(""))));

export const parseInt = sequenceOf([orEmptyString(plusOrMinus), digits]).map(
  (x) => asJSONNumber(Number(x.join("")))
);

export const parseScientificForm = sequenceOf([
  choice([parseFloat, parseInt]).map((x) => x.value),
  anyOfString("eE"),
  choice([parseFloat, parseInt]).map((x) => x.value),
]).map((x) => asJSONNumber(Number(x.join(""))));

export const parseNumber = choice([parseScientificForm, parseFloat, parseInt]);

const jsonNull: JSONValue = {
  type: "null",
  value: null,
};

export const parseNull = str("null").map(() => jsonNull);

export const asJSONArray = (values: JSONValue[]): JSONValue => ({
  type: "array",
  value: values.length > 0 ? values : [],
});

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

export const asJSONObject = (keyValuePairs: KeyValuePair[]): JSONValue => {
  const objValue: Record<string, JSONValue> = {};
  keyValuePairs.forEach((kv) => {
    const key = Object.keys(kv)[0];
    objValue[key] = kv[key];
  });
  return {
    type: "object",
    value: objValue,
  } as JSONValue;
};

export const parseObject = between(whitespaceSurrounded(char("{")))(
  whitespaceSurrounded(char("}"))
)(
  commaSeparated(parseKeyValue).map((keyValuePairs) => {
    return asJSONObject(keyValuePairs as KeyValuePair[]);
  })
);
