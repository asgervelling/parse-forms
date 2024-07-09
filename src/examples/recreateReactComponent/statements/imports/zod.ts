import { factory } from "typescript";

export default function zod() {
  return factory.createImportDeclaration(
    undefined,
    factory.createImportClause(
      false,
      undefined,
      factory.createNamedImports([factory.createImportSpecifier(
        false,
        undefined,
        factory.createIdentifier("z")
      )])
    ),
    factory.createStringLiteral("zod"),
    undefined
  )
}