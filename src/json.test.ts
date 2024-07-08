import { describe, expect, test } from "@jest/globals";
import {
  escapedQuote,
  orEmptyString,
  parseString,
  whitespaceSurrounded,
  commaSeparated,
  parseBool,
  plusOrMinus,
  parseFloat,
  parseInt,
  parseScientificForm,
  parseNumber,
  parseNull,
  parseArray,
  keyValueSeparator,
  asJSONObject,
  asJSONArray,
  parseObject,
} from "./json";
import { ResultType, str } from "arcsecond";
import { JSONValue } from "./jsonTypes";

function asSuccess<T, E, D>(parseResult: ResultType<T, E, D>) {
  if (!parseResult.isError) {
    return parseResult;
  } else {
    console.log("Failing:");
    console.log(parseResult);
    throw parseResult.error;
  }
}

const asJSONString = (value: string): JSONValue => ({
  type: "string",
  value: value,
});

/*****************************
 * Parsers
 *****************************/

describe("parseString", () => {
  test("successfully parses a string", () => {
    const result = parseString.run(`"hello"`);
    expect(asSuccess(result).result).toEqual({
      type: "string",
      value: "hello",
    });
  });
  test("successfully parses a string with escaped double quotes", () => {
    const result = parseString.run(`"hello \\"world\\""`);
    expect(asSuccess(result).result).toEqual({
      type: "string",
      value: `hello \\"world\\"`,
    } as JSONValue);
  });
  test("successfully parses a string with escaped single quotes", () => {
    const result = parseString.run(`"hello \\'world\\'"`);
    expect(asSuccess(result).result).toEqual({
      type: "string",
      value: `hello \\'world\\'`,
    } as JSONValue);
  });
  test("fails to parse a string without closing double quotes", () => {
    const result = parseString.run(`"hello`);
    expect(result.isError).toBe(true);
  });
  test("fails to parse a string without opening double quotes", () => {
    const result = parseString.run(`hello"`);
    expect(result.isError).toBe(true);
  });
});

describe("parseBool", () => {
  const asJSONBool = (value: boolean): JSONValue => ({
    type: "boolean",
    value: value,
  });

  test("successfully parses true", () => {
    const result = parseBool.run(`true`);
    expect(asSuccess(result).result).toEqual(asJSONBool(true));
  });
  test("successfully parses false", () => {
    const result = parseBool.run(`false`);
    expect(asSuccess(result).result).toEqual(asJSONBool(false));
  });
  test("fails to parse anything other than true or false", () => {
    const result = parseBool.run(`hello`);
    expect(result.isError).toBe(true);
  });
});

const asJSONNumber = (value: string): JSONValue => ({
  type: "number",
  value: Number(value),
});

describe("parseFloat", () => {
  test("successfully parses a positive float", () => {
    const result = parseFloat.run(`123.456`);
    expect(asSuccess(result).result).toEqual(asJSONNumber("123.456"));
  });
  test("successfully parses a negative float", () => {
    const result = parseFloat.run(`-123.456`);
    expect(asSuccess(result).result).toEqual(asJSONNumber("-123.456"));
  });
  test("fails to parse a float without a decimal", () => {
    const result = parseFloat.run(`0`);
    expect(result.isError).toBe(true);
  });
});

describe("parseInt", () => {
  test("successfully parses a positive integer", () => {
    const result = parseInt.run(`123`);
    expect(asSuccess(result).result).toEqual(asJSONNumber("123"));
  });
  test("successfully parses a negative integer", () => {
    const result = parseInt.run(`-123`);
    expect(asSuccess(result).result).toEqual(asJSONNumber("-123"));
  });
  test("fails to parse a float (parses the int before the decimal point)", () => {
    const result = parseInt.run(`123.456`);
    expect(asSuccess(result).result).toEqual(asJSONNumber("123"));
  });
});

describe("parseScientificForm", () => {
  test("successfully parses a positive float in scientific notation", () => {
    const result = parseScientificForm.run(`1.23456e2`);
    expect(asSuccess(result).result).toEqual(asJSONNumber("1.23456e2"));
  });
  test("successfully parses a negative float in scientific notation", () => {
    const result = parseScientificForm.run(`-1.23456e2`);
    expect(asSuccess(result).result).toEqual(asJSONNumber("-1.23456e2"));
  });
  test("successfully parses a positive integer in scientific notation", () => {
    const result = parseScientificForm.run(`1e3`);
    expect(asSuccess(result).result).toEqual(asJSONNumber("1e3"));
  });
  test("successfully parses a negative integer in scientific notation", () => {
    const result = parseScientificForm.run(`-1e3`);
    expect(asSuccess(result).result).toEqual(asJSONNumber("-1e3"));
  });
  test("fails to parse a float without a decimal", () => {
    const result = parseScientificForm.run(`0`);
    expect(result.isError).toBe(true);
  });
});

describe("parseNumber", () => {
  test("successfully parses a positive float", () => {
    const result = parseNumber.run(`123.456`);
    expect(asSuccess(result).result).toEqual(asJSONNumber("123.456"));
  });
  test("successfully parses a negative float", () => {
    const result = parseNumber.run(`-123.456`);
    expect(asSuccess(result).result).toEqual(asJSONNumber("-123.456"));
  });
  test("successfully parses a positive integer", () => {
    const result = parseNumber.run(`123`);
    expect(asSuccess(result).result).toEqual(asJSONNumber("123"));
  });
  test("successfully parses a negative integer", () => {
    const result = parseNumber.run(`-123`);
    expect(asSuccess(result).result).toEqual(asJSONNumber("-123"));
  });
  test("successfully parses a positive float in scientific notation", () => {
    const result = parseNumber.run(`123.456e789`);
    expect(asSuccess(result).result).toEqual(asJSONNumber("123.456e789"));
  });
  test("successfully parses a negative float in scientific notation", () => {
    const result = parseNumber.run(`-123.456e789`);
    expect(asSuccess(result).result).toEqual(asJSONNumber("-123.456e789"));
  });
  test("successfully parses a positive integer in scientific notation", () => {
    const result = parseNumber.run(`123e789`);
    expect(asSuccess(result).result).toEqual(asJSONNumber("123e789"));
  });
  test("successfully parses a negative integer in scientific notation", () => {
    const result = parseNumber.run(`-123e789`);
    expect(asSuccess(result).result).toEqual(asJSONNumber("-123e789"));
  });
});

describe("parseNull", () => {
  const jsonNull: JSONValue = {
    type: "null",
    value: null,
  };

  test("successfully parses null", () => {
    const result = parseNull.run(`null`);
    expect(asSuccess(result).result).toEqual(jsonNull);
  });
  test("fails to parse anything other than null", () => {
    const result = parseNull.run(`hello`);
    expect(result.isError).toBe(true);
  });
});

describe("parseArray", () => {
  test("successfully parses an empty array", () => {
    const result = parseArray.run(`[]`);
    expect(asSuccess(result).result).toEqual(asJSONArray([]));
  });
  test("successfully parses an array with a single element", () => {
    const result = parseArray.run(`["hello"]`);
    expect(asSuccess(result).result).toEqual(
      asJSONArray([{ type: "string", value: "hello" }])
    );
  });
  test("successfully parses an array with multiple elements", () => {
    const result = parseArray.run(`["hello", "world"]`);
    expect(asSuccess(result).result).toEqual({
      type: "array",
      value: [
        { type: "string", value: "hello" },
        { type: "string", value: "world" },
      ],
    });
  });
  test("successfully parses an array with whitespace", () => {
    const result = parseArray.run(`[ "hello" , "world" ]`);
    expect(asSuccess(result).result).toEqual({
      type: "array",
      value: [
        { type: "string", value: "hello" },
        { type: "string", value: "world" },
      ],
    });
  });
});

describe("parseObject", () => {
  test("", () => {
    const json = `{
      "name": "John Doe",
      "age": 30,
      "cars": {
        "car1": "Ford",
        "car2": "BMW",
        "car3": "Fiat"
      }
    }`;

    expect(asSuccess(parseObject.run(json)).result).toEqual({
      type: "object",
      value: {
        name: {
          type: "string",
          value: "John Doe",
        },
        age: {
          type: "number",
          value: 30,
        },
        cars: {
          type: "object",
          value: {
            car1: {
              type: "string",
              value: "Ford",
            },
            car2: {
              type: "string",
              value: "BMW",
            },
            car3: {
              type: "string",
              value: "Fiat",
            },
          },
        },
      },
    });
  });

  test("successfully parses an empty object", () => {
    const result = parseObject.run(`{}`);
    expect(asSuccess(result).result).toEqual(asJSONObject([]));
  });

  test("successfully parses an object with a single key-value pair", () => {
    const result = parseObject.run(`{"key": "value"}`);
    expect(asSuccess(result).result).toEqual(
      asJSONObject([{ key: { type: "string", value: "value" } }])
    );
  });

  test("successfully parses very nested objects and arrays of different types", () => {
    const result = parseObject.run(`{
      "name": "John Doe",
      "age": 30,
      "cars": {
        "car1": "Ford",
        "car2": "BMW",
        "car3": "Fiat"
      },
      "numbers": [1, 2, 3, 4, 5, 6],
      "emptyArray": [],
      "emptyObject": {}
    }`);
    expect(asSuccess(result).result).toEqual({
      type: "object",
      value: {
        name: {
          type: "string",
          value: "John Doe",
        },
        age: {
          type: "number",
          value: 30,
        },
        cars: {
          type: "object",
          value: {
            car1: {
              type: "string",
              value: "Ford",
            },
            car2: {
              type: "string",
              value: "BMW",
            },
            car3: {
              type: "string",
              value: "Fiat",
            },
          },
        },
        numbers: {
          type: "array",
          value: [
            { type: "number", value: 1 },
            { type: "number", value: 2 },
            { type: "number", value: 3 },
            { type: "number", value: 4 },
            { type: "number", value: 5 },
            { type: "number", value: 6 },
          ],
        },
        emptyArray: {
          type: "array",
          value: [],
        },
        emptyObject: {
          type: "object",
          value: {},
        },
      },
    });
  });

  test("successfully handles arrays with different types of elements", () => {
    const result = parseObject.run(`{
      "mixedArray": [1, "hello", true, null, [1, "hi"]]
    }`);
    expect(asSuccess(result).result).toEqual({
      type: "object",
      value: {
        mixedArray: {
          type: "array",
          value: [
            { type: "number", value: 1 },
            { type: "string", value: "hello" },
            { type: "boolean", value: true },
            { type: "null", value: null },
            {
              type: "array",
              value: [
                { type: "number", value: 1 },
                { type: "string", value: "hi" },
              ],
            },
          ],
        },
      },
    });
  });
});

/*****************************
 * Helper functions
 *****************************/
describe("escapedQuote", () => {
  test("successfully parses escaped double quotes", () => {
    const result = escapedQuote.run(`\\"`);
    expect(asSuccess(result).result).toEqual('\\"');
  });
  test("fails to parse unescaped double quotes", () => {
    const result = escapedQuote.run(`"`);
    expect(result.isError).toBe(true);
  });
  test("successfully parses escaped single quotes", () => {
    const result = escapedQuote.run(`\\'`);
    expect(asSuccess(result).result).toEqual("\\'");
  });
  test("fails to parse unescaped single quotes", () => {
    const result = escapedQuote.run(`'`);
    expect(result.isError).toBe(true);
  });
});

describe("orEmptyString", () => {
  test("successfully parses a string", () => {
    const result = orEmptyString(str(`"hello"`)).run(`"hello"`);
    expect(asSuccess(result).result).toEqual(`"hello"`);
  });
});

describe("whiteSpaceSurrounded", () => {
  test("successfully parses a string with whitespace", () => {
    const result = whitespaceSurrounded(parseString).run(`   "hello"   `);
    expect(asSuccess(result).result).toEqual({
      type: "string",
      value: "hello",
    });
  });
  test("successfully parses an empty string with whitespace", () => {
    const result = whitespaceSurrounded(str("d")).run(`  d `);
    expect(asSuccess(result).result).toEqual("d");
  });
  test("does not fail when there is no whitespace", () => {
    const result = whitespaceSurrounded(parseString).run(`"hello"`);
    expect(asSuccess(result).result).toEqual(asJSONString("hello"));
  });
});

describe("commaSeparated", () => {
  test("handles empty arrays", () => {
    const result = commaSeparated(parseString).run(` `);
    expect(asSuccess(result).result).toEqual([]);
  });
  test("successfully parses comma separated strings", () => {
    const result = commaSeparated(parseString).run(`"hello","world"`);
    expect(asSuccess(result).result).toEqual(
      ["hello", "world"].map(asJSONString)
    );
  });
  test("successfully parses comma separated strings with whitespace", () => {
    const result = commaSeparated(parseString).run(`"hello" , "world"`);
    expect(asSuccess(result).result).toEqual(
      ["hello", "world"].map(asJSONString)
    );
  });
});

describe("plusOrMinus", () => {
  test("successfully parses +", () => {
    const result = plusOrMinus.run(`+`);
    expect(asSuccess(result).result).toEqual("+");
  });
  test("successfully parses -", () => {
    const result = plusOrMinus.run(`-`);
    expect(asSuccess(result).result).toEqual("-");
  });
  test("fails to parse anything other than + or -", () => {
    const result = plusOrMinus.run(`hello`);
    expect(result.isError).toBe(true);
  });
});

describe("keyValueSeparator", () => {
  test("successfully parses a colon", () => {
    const result = keyValueSeparator.run(`:`);
    expect(asSuccess(result).result).toEqual(":");
  });
  test("successfully parses a colon with whitespace", () => {
    const result = keyValueSeparator.run(` : `);
    expect(asSuccess(result).result).toEqual(":");
  });
  test("fails to parse anything other than a colon", () => {
    const result = keyValueSeparator.run(`hello`);
    expect(result.isError).toBe(true);
  });
});
