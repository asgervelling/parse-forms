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
  StringType,
  StringValue,
} from "./discUnExperiment";

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

export const parseArray = between(whitespaceSurrounded(char("[")))(
  whitespaceSurrounded(char("]"))
)(
  commaSeparated(
    parseJsonValue.map((x) => {
      const values = x as JSONValue[];
      return values;
    })
  ).map(
    (x) =>
      ({
        type: "array",
        value: x,
      } as JSONValue)
  )
);

// Example usage of parseArray
// console.log(parseArray.run(`[1, 2, 3]`));
const result = parseArray.run('[1, "hello", [1, 2, 3]]');
if (!result.isError) {
  console.log(JSON.stringify(result.result, null, 2));
}

export const keyValueSeparator = whitespaceSurrounded(char(":"));

type KeyValuePair = { [key: string]: JSONValue };

// Not tested. Needs a map function and I'm unsure which
export const parseKeyValue = whitespaceSurrounded(
  sequenceOf([parseString, keyValueSeparator, parseJsonValue]).map((x) => {
    const [key, _, value] = x as [StringValue, string, JSONValue];
    return { [key.value]: value } as KeyValuePair;
  })
);

// Example usage of parseKeyValue
// console.log(parseKeyValue.run(`"key": "value"`));

/* 
.map((x) => {
  const [key, _, value] = x as string[];
  return { [key]: value };
});
*/

export const parseObject = between(whitespaceSurrounded(char("{")))(
  whitespaceSurrounded(char("}"))
)(commaSeparated(parseKeyValue)).map((x) => {
  const keyValuePairs = x as KeyValuePair[];
  const object: JSONValue = {
    type: "object",
    value: Object.assign({}, ...keyValuePairs),
  };
  return object;
});

// Example usage of parseObject
// const result = parseObject.run(`{"myKey": "My value"}`);
// if (!result.isError) {
//   console.log(JSON.stringify(result.result, null, 2));
// }

// Example usage of parseJsonValue
// console.log(parseJsonValue.run(`"hello"`));
