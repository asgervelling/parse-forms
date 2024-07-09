import { factory } from "typescript";

export default function formValues() {
  return factory.createTypeAliasDeclaration(
    undefined,
    factory.createIdentifier("FormValues"),
    undefined,
    factory.createTypeReferenceNode(
      factory.createQualifiedName(
        factory.createIdentifier("z"),
        factory.createIdentifier("infer")
      ),
      [factory.createTypeQueryNode(
        factory.createIdentifier("FormSchema"),
        undefined
      )]
    )
  )
}