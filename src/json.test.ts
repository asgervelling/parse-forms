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
} from "./json";
import { ResultType, str } from "arcsecond";

function asSuccess<T, E, D>(parseResult: ResultType<T, E, D>) {
  if (!parseResult.isError) {
    return parseResult;
  } else {
    console.log("Failing:");
    console.log(parseResult);
    throw parseResult.error;
  }
}

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

describe("parseString", () => {
  test("successfully parses a string", () => {
    const result = parseString.run(`"hello"`);
    expect(asSuccess(result).result).toEqual("hello");
  });
  test("successfully parses a string with escaped double quotes", () => {
    const result = parseString.run(`"hello \\"world\\""`);
    expect(asSuccess(result).result).toEqual(`hello \\"world\\"`);
  });
  test("successfully parses a string with escaped single quotes", () => {
    const result = parseString.run(`"hello \\'world\\'"`);
    expect(asSuccess(result).result).toEqual(`hello \\'world\\'`);
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

describe("orEmptyString", () => {
  test("successfully parses a string", () => {
    const result = orEmptyString(parseString).run(`"hello"`);
    expect(asSuccess(result).result).toEqual("hello");
  });
  test("successfully parses an empty string", () => {
    const result = orEmptyString(parseString).run(``);
    expect(asSuccess(result).result).toEqual("");
  });
});

describe("whiteSpaceSurrounded", () => {
  test("successfully parses a string with whitespace", () => {
    const result = whitespaceSurrounded(parseString).run(`   "hello"   `);
    expect(asSuccess(result).result).toEqual("hello");
  });
  test("successfully parses an empty string with whitespace", () => {
    const result = whitespaceSurrounded(str("d")).run(`  d `);
    expect(asSuccess(result).result).toEqual("d");
  });
  test("does not fail when there is no whitespace", () => {
    const result = whitespaceSurrounded(parseString).run(`"hello"`);
    expect(asSuccess(result).result).toEqual("hello");
  });
});

describe("commaSeparated", () => {
  test("successfully parses comma separated strings", () => {
    const result = commaSeparated(parseString).run(`"hello","world"`);
    expect(asSuccess(result).result).toEqual(["hello", "world"]);
  });
  test("successfully parses comma separated strings with whitespace", () => {
    const result = commaSeparated(parseString).run(`"hello" , "world"`);
    expect(asSuccess(result).result).toEqual(["hello", "world"]);
  });
});

describe("parseBool", () => {
  test("successfully parses true", () => {
    const result = parseBool.run(`true`);
    expect(asSuccess(result).result).toEqual(true);
  });
  test("successfully parses false", () => {
    const result = parseBool.run(`false`);
    expect(asSuccess(result).result).toEqual(false);
  });
  test("fails to parse anything other than true or false", () => {
    const result = parseBool.run(`hello`);
    expect(result.isError).toBe(true);
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

describe("parseFloat", () => {
  test("successfully parses a positive float", () => {
    const result = parseFloat.run(`123.456`);
    expect(asSuccess(result).result).toEqual("123.456");
  });
  test("successfully parses a negative float", () => {
    const result = parseFloat.run(`-123.456`);
    expect(asSuccess(result).result).toEqual("-123.456");
  });
  test("fails to parse a float without a decimal", () => {
    const result = parseFloat.run(`0`);
    expect(result.isError).toBe(true);
  });
});

describe("parseInt", () => {
  test("successfully parses a positive integer", () => {
    const result = parseInt.run(`123`);
    expect(asSuccess(result).result).toEqual("123");
  });
  test("successfully parses a negative integer", () => {
    const result = parseInt.run(`-123`);
    expect(asSuccess(result).result).toEqual("-123");
  });
  test("fails to parse a float (parses the int before the decimal point)", () => {
    const result = parseInt.run(`123.456`);
    expect(asSuccess(result).result).toEqual("123");
  });
});

describe("parseScientificForm", () => {
  test("successfully parses a positive float in scientific notation", () => {
    const result = parseScientificForm.run(`123.456e789`);
    expect(asSuccess(result).result).toEqual("123.456e789");
  });
  test("successfully parses a negative float in scientific notation", () => {
    const result = parseScientificForm.run(`-123.456e789`);
    expect(asSuccess(result).result).toEqual("-123.456e789");
  });
  test("successfully parses a positive integer in scientific notation", () => {
    const result = parseScientificForm.run(`123e789`);
    expect(asSuccess(result).result).toEqual("123e789");
  });
  test("successfully parses a negative integer in scientific notation", () => {
    const result = parseScientificForm.run(`-123e789`);
    expect(asSuccess(result).result).toEqual("-123e789");
  });
  test("fails to parse a float without a decimal", () => {
    const result = parseScientificForm.run(`0`);
    expect(result.isError).toBe(true);
  });
});

describe("parseNumber", () => {
  test("successfully parses a positive float", () => {
    const result = parseNumber.run(`123.456`);
    expect(asSuccess(result).result).toEqual("123.456");
  });
  test("successfully parses a negative float", () => {
    const result = parseNumber.run(`-123.456`);
    expect(asSuccess(result).result).toEqual("-123.456");
  });
  test("successfully parses a positive integer", () => {
    const result = parseNumber.run(`123`);
    expect(asSuccess(result).result).toEqual("123");
  });
  test("successfully parses a negative integer", () => {
    const result = parseNumber.run(`-123`);
    expect(asSuccess(result).result).toEqual("-123");
  });
  test("successfully parses a positive float in scientific notation", () => {
    const result = parseNumber.run(`123.456e789`);
    expect(asSuccess(result).result).toEqual("123.456e789");
  });
  test("successfully parses a negative float in scientific notation", () => {
    const result = parseNumber.run(`-123.456e789`);
    expect(asSuccess(result).result).toEqual("-123.456e789");
  });
  test("successfully parses a positive integer in scientific notation", () => {
    const result = parseNumber.run(`123e789`);
    expect(asSuccess(result).result).toEqual("123e789");
  });
  test("successfully parses a negative integer in scientific notation", () => {
    const result = parseNumber.run(`-123e789`);
    expect(asSuccess(result).result).toEqual("-123e789");
  });
});

describe("parseNull", () => {
  test("successfully parses null", () => {
    const result = parseNull.run(`null`);
    console.log(result);
    expect(asSuccess(result).result).toEqual(null);
  });
  test("fails to parse anything other than null", () => {
    const result = parseNull.run(`hello`);
    expect(result.isError).toBe(true);
  });
});

describe("parseArray", () => {
  test("successfully parses an empty array", () => {
    const result = parseArray.run(`[]`);
    expect(asSuccess(result).result).toEqual([]);
  });
  test("successfully parses an array with a single element", () => {
    const result = parseArray.run(`["hello"]`);
    expect(asSuccess(result).result).toEqual(["hello"]);
  });
  test("successfully parses an array with multiple elements", () => {
    const result = parseArray.run(`["hello", "world"]`);
    expect(asSuccess(result).result).toEqual(["hello", "world"]);
  });
  test("successfully parses an array with whitespace", () => {
    const result = parseArray.run(`[ "hello" , "world" ]`);
    expect(asSuccess(result).result).toEqual(["hello", "world"]);
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
