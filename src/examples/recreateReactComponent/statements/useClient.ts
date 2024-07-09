import { factory } from "typescript";

export default function useClient() {
  return factory.createExpressionStatement(
    factory.createStringLiteral("use client")
  );
}
