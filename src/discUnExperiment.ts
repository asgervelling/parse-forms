type NumberType = { type: "number" };
type BooleanType = { type: "boolean" };
type NullType = { type: "null" };
type StringType = { type: "string" };

type PrimitiveType = NumberType | BooleanType | NullType | StringType;

type PrimitiveValue =
  | (NumberType & { value: number })
  | (BooleanType & { value: boolean })
  | (NullType & { value: null })
  | (StringType & { value: string });

type ArrayValue<T extends PrimitiveType> = {
  type: "array";
  arrayType: T["type"];
  value: (T extends NumberType
    ? number
    : T extends BooleanType
    ? boolean
    : T extends NullType
    ? null
    : T extends StringType
    ? string
    : never)[];
};

// Example usage:
type NumberArrayValue = ArrayValue<NumberType>; // { type: "array"; arrayType: "number"; value: number[] }
type BooleanArrayValue = ArrayValue<BooleanType>; // { type: "array"; arrayType: "boolean"; value: boolean[] }
type NullArrayValue = ArrayValue<NullType>; // { type: "array"; arrayType: "null"; value: null[] }
type StringArrayValue = ArrayValue<StringType>; // { type: "array"; arrayType: "string"; value: string[] }

type JSONValue =
  | { type: "number"; value: number }
  | { type: "boolean"; value: boolean }
  | { type: "null"; value: null }
  | { type: "string"; value: string }
  | { type: "array"; arrayType: "number"; value: number[] }
  | { type: "array"; arrayType: "boolean"; value: boolean[] }
  | { type: "array"; arrayType: "null"; value: null[] }
  | { type: "array"; arrayType: "string"; value: string[] }
  | { type: "" };

// Example usage of valid JSON values
const numberValue: JSONValue = { type: "number", value: 2 };
const booleanValue: JSONValue = { type: "boolean", value: true };
const numberArrayValue: JSONValue = {
  type: "array",
  arrayType: "number",
  value: [1, 2, 3],
};
const nullArrayValue: JSONValue = {
  type: "array",
  arrayType: "null",
  value: [null],
};
