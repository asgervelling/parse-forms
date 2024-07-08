import * as fs from "fs";

export function main() {
  const vargs = process.argv.slice(2);
  if (vargs.length > 1) {
    console.error("Usage: formatJson <filename>");
    process.exit(1);
  }
  const args = vargs.length === 0 ? ["src/examples/weirdjson.json"] : vargs;
  const filename = args[0];

  console.log(`Formatting JSON file: ${filename}`);

  // Read the file
  const content = fs.readFileSync(filename, "utf-8");
  console.log("Original content:");
  console.log(content);

  console.log("Formatted content:");
  console.log(JSON.stringify(JSON.parse(content), null, 2));
}

main();
