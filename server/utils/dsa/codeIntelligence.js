import { parse } from "acorn";
import { Graph } from "./graph.js";

const pairs = new Map([["(", ")"], ["[", "]"], ["{", "}"]]);
const closing = new Set(pairs.values());

export const validateDelimiters = (code) => {
  const stack = [];
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  const source = String(code || "");
  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    const next = source[index + 1];
    if (lineComment) {
      if (character === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (character === "*" && next === "/") {
        blockComment = false;
        index += 1;
      }
      continue;
    }
    if (quote) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = null;
      continue;
    }
    if (character === "/" && next === "/") {
      lineComment = true;
      index += 1;
    } else if (character === "/" && next === "*") {
      blockComment = true;
      index += 1;
    } else if (["'", '"', "`"].includes(character)) quote = character;
    else if (pairs.has(character)) stack.push({ character, index });
    else if (closing.has(character)) {
      const open = stack.pop();
      if (!open || pairs.get(open.character) !== character) {
        return { valid: false, message: `Unexpected ${character} at character ${index}.` };
      }
    }
  }
  if (stack.length) {
    const open = stack.at(-1);
    return { valid: false, message: `Unclosed ${open.character} at character ${open.index}.` };
  }
  return { valid: true, message: "Brackets and code blocks are balanced." };
};

const walkAst = (node, visit) => {
  if (!node || typeof node !== "object") return;
  if (typeof node.type === "string") visit(node);
  for (const [key, value] of Object.entries(node)) {
    if (["start", "end", "loc"].includes(key)) continue;
    if (Array.isArray(value)) value.forEach((child) => walkAst(child, visit));
    else if (value && typeof value === "object") walkAst(value, visit);
  }
};

export const analyzeCode = (code) => {
  const source = String(code || "");
  const delimiterCheck = validateDelimiters(source);
  const imports = [];
  const functions = [];
  const variables = new Map();
  const routes = [];
  let complexity = 1;
  let parseError = null;

  try {
    const ast = parse(source, {
      ecmaVersion: "latest",
      sourceType: "module",
      locations: true,
      allowAwaitOutsideFunction: true,
    });
    walkAst(ast, (node) => {
      if (node.type === "ImportDeclaration") imports.push(node.source.value);
      if (node.type === "FunctionDeclaration" && node.id?.name) functions.push(node.id.name);
      if (node.type === "VariableDeclarator" && node.id?.name) {
        variables.set(node.id.name, (variables.get(node.id.name) || 0) + 1);
      }
      if (["IfStatement", "ForStatement", "ForInStatement", "ForOfStatement", "WhileStatement", "DoWhileStatement", "CatchClause", "ConditionalExpression", "SwitchCase"].includes(node.type)) {
        complexity += 1;
      }
      if (node.type === "LogicalExpression" && ["&&", "||", "??"].includes(node.operator)) complexity += 1;
    });
  } catch (error) {
    parseError = error.message;
  }

  const functionCounts = new Map();
  for (const name of functions) functionCounts.set(name, (functionCounts.get(name) || 0) + 1);
  const duplicateFunctions = [...functionCounts.entries()]
    .filter(([, count]) => count > 1)
    .map(([name]) => name);
  for (const match of source.matchAll(/\b(?:app|router)\.(get|post|put|patch|delete)\s*\(\s*["']([^"']+)/g)) {
    routes.push({ method: match[1].toUpperCase(), path: match[2] });
  }

  const dependencies = new Graph();
  dependencies.addVertex("current-module");
  for (const dependency of imports) dependencies.addEdge(dependency, "current-module");

  return {
    language: parseError ? "Unknown or non-JavaScript" : "JavaScript",
    delimiterCheck,
    parseError,
    imports,
    functions,
    variables: [...variables.keys()],
    duplicateFunctions,
    routes,
    cyclomaticComplexity: complexity,
    dependencyOrder: dependencies.topologicalSort(),
  };
};

export const formatCodeAnalysis = (analysis) => [
  "## Deterministic code analysis",
  `- Syntax structure: ${analysis.parseError ? `Parser warning: ${analysis.parseError}` : "AST parsed successfully"}`,
  `- Delimiters: ${analysis.delimiterCheck.message}`,
  `- Imports: ${analysis.imports.join(", ") || "None detected"}`,
  `- Functions: ${analysis.functions.join(", ") || "None detected"}`,
  `- Duplicate functions: ${analysis.duplicateFunctions.join(", ") || "None"}`,
  `- API routes: ${analysis.routes.map((route) => `${route.method} ${route.path}`).join(", ") || "None detected"}`,
  `- Estimated cyclomatic complexity: ${analysis.cyclomaticComplexity}`,
  `- Dependency order: ${analysis.dependencyOrder.join(" → ")}`,
].join("\n");
