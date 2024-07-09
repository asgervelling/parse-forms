import { parseJsonValue } from "../../json";
import { JSONValue } from "../../jsonTypes";

function notFancyPrint(node: JSONValue, depth: number = 0) {
  console.log([indent(depth), node.type].join(""));
  switch (node.type) {
    case "string":
    case "boolean":
    case "null":
    case "number":
      return;
    case "array":
      node.value.forEach((node) => notFancyPrint(node, depth + 1));
      return;
    case "object":
      Object.entries(node.value).forEach(([k, v]) => {
        console.log(k + ":")
        notFancyPrint(v, depth + 1)
      });
      return;
  }
}

const indent = (depth: number) => "  ".repeat(depth);

const json = `{
  "name": "John Doe",
  "age": 30,
  "cars": {
    "car1": "Ford",
    "car2": "BMW",
    "car3": "Fiat"
  }
}`;

parseJsonValue.fork(
  json,
  (errorMsg) => console.error(errorMsg),
  (result) => {
    const node = result as JSONValue;
    notFancyPrint(node);
  }
);
