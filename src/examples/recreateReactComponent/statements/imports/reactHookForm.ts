import { factory } from "typescript";

export default function reactHookForm() {
  return factory.createImportDeclaration(
    undefined,
    factory.createImportClause(
      false,
      undefined,
      factory.createNamedImports([
        factory.createImportSpecifier(
          false,
          undefined,
          factory.createIdentifier("DefaultValues")
        ),
        factory.createImportSpecifier(
          false,
          undefined,
          factory.createIdentifier("SubmitHandler")
        )
      ])
    ),
    factory.createStringLiteral("react-hook-form"),
    undefined
  );
}