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
  // test("successfully parses a string", () => {
  //   const result = parseString.run(`"hello"`);
  //   expect(asSuccess(result).result).toEqual("hello");
  // });
  // test("successfully parses a string with escaped double quotes", () => {
  //   const result = parseString.run(`"hello \\"world\\""`);
  //   expect(asSuccess(result).result).toEqual(`hello \\"world\\"`);
  // });
  // test("successfully parses a string with escaped single quotes", () => {
  //   const result = parseString.run(`"hello \\'world\\'"`);
  //   expect(asSuccess(result).result).toEqual(`hello \\'world\\'`);
  // });
  // test("fails to parse a string without closing double quotes", () => {
  //   const result = parseString.run(`"hello`);
  //   expect(result.isError).toBe(true);
  // });
  // test("fails to parse a string without opening double quotes", () => {
  //   const result = parseString.run(`hello"`);
  //   expect(result.isError).toBe(true);
  // });
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

describe("parseBool", () => {});

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
  test("successfully parses a positive float", () => {});
  test("successfully parses a negative float", () => {});
  test("fails to parse a float without a decimal", () => {});
});

describe("parseInt", () => {
  test("successfully parses a positive integer", () => {});
  test("successfully parses a negative integer", () => {});
  test("fails to parse a float (parses the int before the decimal point)", () => {});
});

describe("parseScientificForm", () => {
  test("successfully parses a positive float in scientific notation", () => {});
  test("successfully parses a negative float in scientific notation", () => {});
  test("successfully parses a positive integer in scientific notation", () => {});
  test("successfully parses a negative integer in scientific notation", () => {});
  test("fails to parse a float without a decimal", () => {});
});

describe("parseNumber", () => {
  test("successfully parses a positive float", () => {});
  test("successfully parses a negative float", () => {});
  test("successfully parses a positive integer", () => {});
  test("successfully parses a negative integer", () => {});
  test("successfully parses a positive float in scientific notation", () => {});
  test("successfully parses a negative float in scientific notation", () => {});
  test("successfully parses a positive integer in scientific notation", () => {});
  test("successfully parses a negative integer in scientific notation", () => {});
});

describe("parseNull", () => {
  test("successfully parses null", () => {});
  test("fails to parse anything other than null", () => {});
});

describe("parseArray", () => {
  test("successfully parses an empty array", () => {});
  test("successfully parses an array with a single element", () => {});
  test("successfully parses an array with multiple elements", () => {});
  test("successfully parses an array with whitespace", () => {});
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
