import ts, { factory } from "typescript";
import * as stmts from "./statements";
import { br } from "./statements";

// Create an array of statements, including the add function
const statements: readonly ts.Statement[] = [
  stmts.useClient(),
  stmts.imports.reactHookForm(),
  stmts.imports.zod(),
  br(),
  stmts.formSchema(),
  br(),
  stmts.types.formValues(),
  br(),
  stmts.onSubmit(),
];

// Create a source file containing the statements
const sourceFile = factory.createSourceFile(
  statements,
  factory.createToken(ts.SyntaxKind.EndOfFileToken),
  ts.NodeFlags.None
);

// Create a printer to print the source file
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

// Print the source file
const result = printer.printFile(sourceFile);
console.log(result);
