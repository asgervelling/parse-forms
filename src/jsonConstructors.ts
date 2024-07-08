import { JSONValue, KeyValuePair } from "./jsonTypes";

export const asJSONString = (value: string): JSONValue => ({
  type: "string",
  value: value,
});

export const asJSONBool = (value: boolean): JSONValue => ({
  type: "boolean",
  value: value,
});

export const asJSONNumber = (value: string): JSONValue => ({
  type: "number",
  value: Number(value),
});

export const jsonNull: JSONValue = {
  type: "null",
  value: null,
};

export const asJSONArray = (values: JSONValue[]): JSONValue => ({
  type: "array",
  value: values.length > 0 ? values : [],
});

export const asJSONObject = (keyValuePairs: KeyValuePair[]): JSONValue => {
  const objValue: Record<string, JSONValue> = {};
  keyValuePairs.forEach((kv) => {
    const key = Object.keys(kv)[0];
    objValue[key] = kv[key];
  });
  return {
    type: "object",
    value: objValue,
  } as JSONValue;
};
