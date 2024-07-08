import { describe, expect, test } from "@jest/globals";
import {
  escapedQuote,
  orEmptyString,
  parseString,
  whitespaceSurrounded,
  commaSeparated,
  parseBool,
} from "./json";
import { anyChar, ResultType, str } from "arcsecond";

function asSuccess<T, E, D>(parseResult: ResultType<T, E, D>) {
  if (!parseResult.isError) {
    return parseResult;
  } else {
    console.log("Failing:");
    console.log(parseResult);
    const error = parseResult.error as string;
    throw new Error(error);
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
