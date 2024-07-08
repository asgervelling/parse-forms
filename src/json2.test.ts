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
} from "./json2";
import {
  char,
  choice,
  optionalWhitespace,
  ResultType,
  sequenceOf,
  str,
} from "arcsecond";
import { JSONValue } from "./discUnExperiment";

function asSuccess<T, E, D>(parseResult: ResultType<T, E, D>) {
  if (!parseResult.isError) {
    return parseResult;
  } else {
    console.log("Failing:");
    console.log(parseResult);
    throw parseResult.error;
  }
}

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
    console.log(result);
    expect(asSuccess(result).result).toEqual(jsonNull);
  });
  test("fails to parse anything other than null", () => {
    const result = parseNull.run(`hello`);
    expect(result.isError).toBe(true);
  });
});

// describe("parseArray", () => {
//   test("successfully parses an empty array", () => {
//     const result = parseArray.run(`[]`);
//     expect(asSuccess(result).result).toEqual([]);
//   });
//   test("successfully parses an array with a single element", () => {
//     const result = parseArray.run(`["hello"]`);
//     expect(asSuccess(result).result).toEqual([
//       { type: "string", value: "hello" },
//     ]);
//   });
//   test("successfully parses an array with multiple elements", () => {
//     const result = parseArray.run(`["hello", "world"]`);
//     expect(asSuccess(result).result).toEqual({
//       type: "array",
//       value: [
//         { type: "string", value: "hello" },
//         { type: "string", value: "world" },
//       ],
//     } as JSONValue);
//   });
//   test("successfully parses an array with whitespace", () => {
//     const result = parseArray.run(`[ "hello" , "world" ]`);
//     expect(asSuccess(result).result).toEqual({
//       type: "array",
//       value: [
//         { type: "string", value: "hello" },
//         { type: "string", value: "world" },
//       ],
//     } as JSONValue);
//   });
// });
