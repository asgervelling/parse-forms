export type NumberType = { type: "number" };
export type BooleanType = { type: "boolean" };
export type NullType = { type: "null" };
export type StringType = { type: "string" };

export type NumberValue = NumberType & { value: number };
export type BooleanValue = BooleanType & { value: boolean };
export type NullValue = NullType & { value: null };
export type StringValue = StringType & { value: string };

type PrimitiveValue = NumberValue | BooleanValue | NullValue | StringValue;

export type ArrayValue = {
  type: "array";
  value: JSONValue[];
};

type ObjectValue = {
  type: "object";
  value: Record<string, JSONValue>;
};

export type JSONValue = PrimitiveValue | ArrayValue | ObjectValue;

// Example usage of valid JSON values
const numberValue: JSONValue = { type: "number", value: 2 };
const booleanValue: JSONValue = { type: "boolean", value: true };
const numberArrayValue: JSONValue = {
  type: "array",
  value: [
    { type: "number", value: 1 },
    { type: "number", value: 2 },
    { type: "number", value: 3 },
  ],
};
const nullArrayValue: ArrayValue = {
  type: "array",
  value: [{ type: "null", value: null }],
};
const recursiveJsonValue: JSONValue = {
  type: "object",
  value: {
    numbers: {
      type: "array",
      value: [
        // According to the JSON specification (RFC 8259),
        // JSON arrays can contain elements of any type,
        // and these elements can be of mixed types.
        { type: "number", value: 1 },
        {
          type: "object",
          value: {
            name: { type: "string", value: "Bob" },
          },
        },
      ],
    },
  },
};
