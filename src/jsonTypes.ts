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

export type KeyValuePair = { [key: string]: JSONValue };

export type ObjectValue = {
  type: "object";
  value: Record<string, JSONValue>;
};

export type JSONValue = PrimitiveValue | ArrayValue | ObjectValue;
