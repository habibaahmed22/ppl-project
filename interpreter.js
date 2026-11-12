/**
 * interpreter.js
 * Mini-Interpreter for CSCI 310 Principles of Programming Languages
 * 
 * Implements a small domain-specific language (DSL) parser and evaluator
 * without using JavaScript's eval().
 * 
 * Pipeline:
 *   [Input String] 
 *         │
 *         ▼
 *   [1. Tokenize]  --> Extracts command name and argument strings
 *         │
 *         ▼
 *   [2. Parse]     --> Constructs structured AST { command, rawArgs }
 *         │
 *         ▼
 *   [3. Validate]  --> Semantic checks (arg count, types, ranges [0, 100], booleans)
 *         │
 *         ▼
 *   [4. Evaluate]  --> Computes final result (Number | 'TRUE' | 'FALSE')
 * 
 * Supported commands:
 *   1. AVERAGE(m1, m2, ...) -> Arithmetic mean (1 or more valid marks 0-100)
 *   2. PASS(mark)           -> 'TRUE' if mark >= 50 else 'FALSE' (exactly 1 mark 0-100)
 *   3. ELIGIBLE(mark, flag) -> 'TRUE' if mark >= 45 and flag is TRUE else 'FALSE'
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MiniInterpreter = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const PASSING_THRESHOLD = 50;
  const ELIGIBILITY_MIN_MARK = 45;

  /**
   * Represents structured evaluation results
   */
  class InterpreterResult {
    constructor(success, result, error = null, details = {}) {
      this.success = success;
      this.result = result;
      this.error = error;
      this.details = details;
    }
  }

  /**
   * Step 1 & 2: Parse textual input into an Abstract Syntax Tree (AST)
   * Enforces syntax structure: COMMAND(arg1, arg2, ...)
   */
  function parse(input) {
    if (typeof input !== 'string') {
      throw new Error('Input must be a string expression.');
    }

    const trimmed = input.trim();
    if (trimmed.length === 0) {
      throw new Error('Expression cannot be empty.');
    }

    // Match command format: COMMAND_NAME ( ... )
    // Ensure open paren exists
    const openParenIndex = trimmed.indexOf('(');
    if (openParenIndex === -1) {
      throw new Error("Syntax Error: Missing opening parenthesis '(' in expression.");
    }

    // Ensure closing paren exists at the end
    if (!trimmed.endsWith(')')) {
      throw new Error("Syntax Error: Missing closing parenthesis ')' or unexpected trailing characters.");
    }

    const commandName = trimmed.substring(0, openParenIndex).trim();
    if (!commandName) {
      throw new Error('Syntax Error: Missing command name before parenthesis.');
    }

    // Check valid identifier name (alphanumeric uppercase/lowercase)
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(commandName)) {
      throw new Error(`Syntax Error: Invalid command name identifier '${commandName}'.`);
    }

    // Extract inside of outer parentheses
    const insideArgs = trimmed.substring(openParenIndex + 1, trimmed.length - 1).trim();

    // Split arguments respecting commas
    // Note: If insideArgs is empty string, args array is empty []
    let rawArgs = [];
    if (insideArgs.length > 0) {
      // Split by comma
      const parts = insideArgs.split(',');
      for (let i = 0; i < parts.length; i++) {
        const rawToken = parts[i].trim();
        if (rawToken === '') {
          throw new Error(`Syntax Error: Empty argument at position ${i + 1}. Trailing or consecutive commas are not permitted.`);
        }
        rawArgs.push(rawToken);
      }
    }

    return {
      command: commandName.toUpperCase(),
      originalCommand: commandName,
      rawArgs: rawArgs,
      insideText: insideArgs
    };
  }

  /**
   * Step 3: Semantic Validation
   * Validates command support, argument count, and argument types/ranges.
   */
  function validate(ast) {
    const { command, rawArgs } = ast;
    const supportedCommands = ['AVERAGE', 'PASS', 'ELIGIBLE'];

    if (!supportedCommands.includes(command)) {
      throw new Error(`Unknown Command: '${ast.originalCommand}'. Supported commands are: AVERAGE, PASS, ELIGIBLE.`);
    }

    switch (command) {
      case 'AVERAGE': {
        if (rawArgs.length === 0) {
          throw new Error('Validation Error: AVERAGE requires at least one numeric mark. Example: AVERAGE(80, 70, 90)');
        }
        const numericMarks = rawArgs.map((arg, idx) => parseAndValidateMark(arg, `AVERAGE argument ${idx + 1}`));
        return {
          command,
          marks: numericMarks
        };
      }

      case 'PASS': {
        if (rawArgs.length !== 1) {
          throw new Error(`Validation Error: PASS requires exactly 1 mark argument, but received ${rawArgs.length}. Example: PASS(65)`);
        }
        const mark = parseAndValidateMark(rawArgs[0], 'PASS argument');
        return {
          command,
          mark
        };
      }

      case 'ELIGIBLE': {
        if (rawArgs.length !== 2) {
          throw new Error(`Validation Error: ELIGIBLE requires exactly 2 arguments (mark, attendanceFlag), but received ${rawArgs.length}. Example: ELIGIBLE(45, TRUE)`);
        }
        const mark = parseAndValidateMark(rawArgs[0], 'ELIGIBLE argument 1 (mark)');
        const flag = parseAndValidateBoolean(rawArgs[1], 'ELIGIBLE argument 2 (attendance flag)');
        return {
          command,
          mark,
          flag
        };
      }

      default:
        throw new Error(`Unsupported command handler: ${command}`);
    }
  }

  /**
   * Helper to parse a mark and validate range [0, 100]
   * Allows 0!
   */
  function parseAndValidateMark(token, label) {
    // Check if numeric
    // Disallow empty or non-numeric tokens
    const num = Number(token);
    if (isNaN(num) || token.trim() === '') {
      throw new Error(`Validation Error: ${label} '${token}' is not a valid number.`);
    }

    if (num < 0 || num > 100) {
      throw new Error(`Range Error: ${label} must be between 0 and 100 inclusive. Received: ${num}`);
    }

    return num;
  }

  /**
   * Helper to parse and validate a boolean token ('TRUE' or 'FALSE', case-insensitive)
   */
  function parseAndValidateBoolean(token, label) {
    const upper = token.trim().toUpperCase();
    if (upper === 'TRUE') {
      return true;
    }
    if (upper === 'FALSE') {
      return false;
    }
    throw new Error(`Type Error: ${label} must be either TRUE or FALSE. Received: '${token}'`);
  }

  /**
   * Step 4: Evaluate the validated AST
   */
  function evaluate(validatedAst) {
    switch (validatedAst.command) {
      case 'AVERAGE': {
        const sum = validatedAst.marks.reduce((acc, curr) => acc + curr, 0);
        const avg = sum / validatedAst.marks.length;
        // Format to maximum 2 decimal places, or integer if whole
        const rounded = Math.round(avg * 100) / 100;
        return rounded;
      }

      case 'PASS': {
        const passes = validatedAst.mark >= PASSING_THRESHOLD;
        return passes ? 'TRUE' : 'FALSE';
      }

      case 'ELIGIBLE': {
        // Defined rule: mark >= 45 and attendance flag is TRUE
        const eligible = validatedAst.mark >= ELIGIBILITY_MIN_MARK && validatedAst.flag === true;
        return eligible ? 'TRUE' : 'FALSE';
      }

      default:
        throw new Error(`Cannot evaluate unrecognized command: ${validatedAst.command}`);
    }
  }

  /**
   * Complete Pipeline Execution:
   * Input -> Parse -> Validate -> Evaluate -> Formatted Result
   */
  function execute(input) {
    try {
      const ast = parse(input);
      const validated = validate(ast);
      const result = evaluate(validated);

      return new InterpreterResult(true, result, null, {
        command: ast.command,
        rawArgs: ast.rawArgs,
        validatedArgs: validated
      });
    } catch (err) {
      return new InterpreterResult(false, null, err.message, {
        rawInput: input
      });
    }
  }

  return {
    PASSING_THRESHOLD,
    ELIGIBILITY_MIN_MARK,
    parse,
    validate,
    evaluate,
    execute,
    InterpreterResult
  };
});
