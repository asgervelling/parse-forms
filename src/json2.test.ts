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
import { ResultType, str } from "arcsecond";
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
