import ts, { factory } from "typescript";

export default function onSubmit() {
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [factory.createVariableDeclaration(
        factory.createIdentifier("onSubmit"),
        undefined,
        factory.createTypeReferenceNode(
          factory.createIdentifier("SubmitHandler"),
          [factory.createTypeReferenceNode(
            factory.createIdentifier("FormValues"),
            undefined
          )]
        ),
        factory.createArrowFunction(
          undefined,
          undefined,
          [factory.createParameterDeclaration(
            undefined,
            undefined,
            factory.createIdentifier("values"),
            undefined,
            undefined,
            undefined
          )],
          undefined,
          factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
          factory.createBlock(
            [factory.createExpressionStatement(factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier("console"),
                factory.createIdentifier("log")
              ),
              undefined,
              [factory.createTemplateExpression(
                factory.createTemplateHead(
                  "{\n\
    name:                 ",
                  "{\n\
    name:                 "
                ),
                [
                  factory.createTemplateSpan(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier("values"),
                      factory.createIdentifier("name")
                    ),
                    factory.createTemplateMiddle(
                      "\n\
    age:                  ",
                      "\n\
    age:                  "
                    )
                  ),
                  factory.createTemplateSpan(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier("values"),
                      factory.createIdentifier("age")
                    ),
                    factory.createTemplateMiddle(
                      "  \n\
    signUpForNewsletter:  ",
                      "  \n\
    signUpForNewsletter:  "
                    )
                  ),
                  factory.createTemplateSpan(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier("values"),
                      factory.createIdentifier("signUpForNewsletter")
                    ),
                    factory.createTemplateMiddle(
                      "\n\
    email:                ",
                      "\n\
    email:                "
                    )
                  ),
                  factory.createTemplateSpan(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier("values"),
                      factory.createIdentifier("email")
                    ),
                    factory.createTemplateTail(
                      "\n\
  }",
                      "\n\
  }"
                    )
                  )
                ]
              )]
            ))],
            true
          )
        )
      )],
      ts.NodeFlags.Const | ts.NodeFlags.Constant | ts.NodeFlags.Constant
    )
  )
}