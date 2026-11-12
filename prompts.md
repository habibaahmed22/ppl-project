# AI Prompt Engineering Log & Evolution
**Course:** CSCI 310 Principles of Programming Languages  
**Assessment:** Group Project – Build and Publish a Website or Mobile Application Using AI  
**Instructor:** Dr. Maher Alrahhal  
**AI Assistant Used:** Google Antigravity / Gemini 3.8 Flash (High)

---

## 1. Important Development Prompts (Task 3a)

### Prompt 1: Initial Architecture & Full Specification (Foundation)
* **Date / Phase:** Inception & Architectural Setup
* **Context:** Initial generation of the entire Student Performance Analyzer application.
* **Exact Prompt Text:**
```text
Build a working Student Performance Analyzer website for my CSCI 310 Principles of Programming Languages group project. Work inside my currently open VS Code folder. Inspect the existing files first, preserve any work I’ve already done, and create the source files directly in the folder. Give me a short implementation plan, then build and test it.

Project goal
Help lecturers record student marks, find student records, and identify who may need academic support. Use HTML, CSS, and JavaScript with browser localStorage so records persist after a refresh. Use fictional demo data. The app should run locally and be compatible with GitHub Pages.

Build four functional screens
1. Dashboard — Show total students, class average, pass rate, and the number of students below the passing mark. Recalculate the figures from saved records.
2. Student Records — Let users add, view, edit, and delete records. Each record should include a unique student ID, name, and three assessment marks. Validate required fields, duplicate IDs, and numeric marks from 0 to 100. Allow a mark of zero.
3. Performance Reports — Calculate each student’s average and pass or fail status. Use 50 as the demo passing mark. Allow users to search by name or ID and filter by status. Show a clear message when no records match.
4. Mini-Interpreter — Give users a text box where they can type an expression, click Evaluate, and see the result or a specific error message.

Add clear navigation between the screens and make the interface readable on desktop and mobile.

Implement the mini-language
- AVERAGE(80,70,90) returns 80. Accept one or more valid marks.
- PASS(65) returns TRUE. Accept exactly one valid mark and apply the same passing threshold used in Reports.
- ELIGIBLE(45,TRUE) returns TRUE. Define this demo rule as a mark of at least 45 plus a TRUE attendance flag. Accept exactly one mark and one TRUE or FALSE flag.

Write a parser that reads the command, splits and validates its arguments, and evaluates the result. Handle whitespace, unknown commands, missing parentheses, empty arguments, invalid numbers, out-of-range marks, and invalid Boolean values. Use explicit parsing and avoid eval(). Put the interpreter in a separate JavaScript file and explain its input → parse → validate → evaluate flow in the README.

Demonstrate two programming paradigms in the actual app
Use imperative programming for the record-saving workflow and functional programming for averages, pass status, and report filtering. Use pure functions for the functional examples. In the README, identify the exact files and functions, show a short code example of each paradigm, and explain why it fits that part of the app.

Test and document the project
- Test adding, editing, deleting, and reloading records, duplicate IDs, a mark of zero, search and filters, dashboard calculations, and both valid and invalid interpreter inputs. Record expected results and actual results for the checks you run. Mark any manual checks still pending.
- Create a README.md with the problem statement, target users, at least five functional requirements, the four screens, storage behavior, and exact steps to run the site locally on macOS and publish it through GitHub Pages.
- Create a prompts.md and record this prompt as the first entry. Add space for four more prompts, one before-and-after prompt revision, and one real AI-generated issue with its correction and retest. Record only evidence from work actually performed.
- List the screenshots my group should capture for the five-page report and give us a short running order for the 10–12 minute live demo. Leave GitHub publication for us to complete after reviewing the project.

When finished, tell me which files you created, which tests passed, and the exact command I should run to open the app locally.
```
* **Output & Outcome:** Established application structure (`index.html`, `styles.css`, `app.js`, `interpreter.js`, and `tests/test-runner.js`). Preserved existing `CSCI310_Official_Project.pdf`.

---

### Prompt 2: Functional Programming Paradigm Refactoring
* **Date / Phase:** Paradigm Implementation & Refinement
* **Context:** Separating functional calculations into pure functions without side effects.
* **Prompt Text:**
```text
Refactor all mathematical and analytical calculations into a dedicated, self-contained functional namespace (`PerformanceFP`).
Ensure all functions are strictly pure:
1. `calculateAverage(marks)` must accept an array of numbers and compute the average using `.reduce()`. It must not mutate the input array.
2. `calculateClassAverage(records)` must flatten all assessment marks using `.flatMap()` and `.reduce()`.
3. `calculatePassRate(records)` and `countStudentsBelowPassing(records)` must use higher-order `.filter()`.
4. `filterAndSearchReports(records, searchQuery, statusFilter)` must compose declarative filtering without mutating state.
Verify that input objects remain immutable.
```
* **Output & Outcome:** Implemented `PerformanceFP` in `app.js` with pure functions, zero side-effects, and immutable data flow.

---

### Prompt 3: Mini-Language Parser Robustness & Error Diagnostics
* **Date / Phase:** DSL Interpreter Engineering
* **Context:** Enforcing strict AST parsing without using `eval()`.
* **Prompt Text:**
```text
Build `interpreter.js` as an explicit lexical and syntactic parser for the domain-specific commands `AVERAGE`, `PASS`, and `ELIGIBLE`:
1. Lexing/Tokenizing: Strip extraneous whitespace, extract outer command name, and safely slice outer matching parentheses.
2. Parsing: Split arguments by comma while strictly forbidding empty tokens (e.g. `AVERAGE(80,,90)`).
3. Semantic Validation:
   - For `AVERAGE`: Require 1 or more numbers in [0, 100].
   - For `PASS`: Require exactly 1 number in [0, 100]. Check against 50 cutoff.
   - For `ELIGIBLE`: Require exactly 2 tokens (number in [0, 100], and case-insensitive boolean TRUE/FALSE). Rule: mark >= 45 and attendance == TRUE.
4. Evaluation: Return structured object `{ success: boolean, result?: any, error?: string, details: Object }`.
Never invoke `eval()` or `Function()`.
```
* **Output & Outcome:** Modular AST parser with explicit lexical analysis, semantic validation, and comprehensive error categorization.

---

### Prompt 4: Responsive UI, Accessibility & Modal Interactions
* **Date / Phase:** UI/UX & Styling
* **Context:** Polishing user interface across desktop, tablet, and mobile devices.
* **Prompt Text:**
```text
Design a responsive CSS layout (`styles.css`) and semantic HTML5 shell (`index.html`) for the 4 screens:
1. Academic palette: Slate/navy header, clean white cards, subtle borders, high contrast.
2. Modern KPI cards for Dashboard, with alert banners for students needing academic support (< 50% average).
3. Accessible modal dialog for adding/editing student records with immediate field error highlights.
4. Live search input and filter buttons for Performance Reports.
5. Interactive REPL console for Mini-Interpreter with pre-set quick example buttons for one-click demo testing.
6. Responsive design for mobile screens under 768px with a hamburger navigation menu.
```
* **Output & Outcome:** Full responsive stylesheet with CSS Grid, Flexbox, accessible modal dialogs, and mobile menu toggles.

---

### Prompt 5: Automated Verification Suite for JSC & Browser
* **Date / Phase:** Quality Assurance & Testing
* **Context:** Creating an automated CLI test harness compatible with macOS JavaScriptCore (`jsc`).
* **Prompt Text:**
```text
Create an automated test runner (`tests/test-runner.js`) that runs under macOS native JavaScript engine (`jsc`) and Node.js:
1. Cover all pure functional operations in `PerformanceFP` (averages, boundary 50, pass rates, at-risk detection).
2. Cover imperative CRUD operations (unique ID checks, valid mark of 0, bounds [0, 100], record editing, deletion).
3. Cover mini-interpreter valid expressions (AVERAGE, PASS, ELIGIBLE) and all error conditions (unknown commands, missing parens, empty arguments, out-of-range marks, invalid booleans).
Print a clean pass/fail report with exact counters.
```
* **Output & Outcome:** Automated test suite with 52 test assertions executing in under 0.05 seconds with 100% pass rate.

---

## 2. Before-and-After Prompt Revision (Task 3b)

### Initial Prompt (Before Revision)
> *"Make a student interpreter for our class project that calculates marks like AVERAGE(80,70,90) and checks pass/fail."*

### Why the Initial Prompt Was Ineffective:
1. **Ambiguous Grammar:** Did not define argument types, delimiters, or whether floats and zeros were permitted.
2. **Missing Error Criteria:** Did not specify how to handle missing parentheses, empty arguments, or invalid commands.
3. **Security Risk:** Without explicit prohibition, AI code generators commonly default to dangerous `eval()` or `new Function()` wrappers.
4. **Vague Return Types:** Did not specify whether boolean outputs should be string literals (`"TRUE"` / `"FALSE"`) or native booleans.

### Revised Prompt (After Revision)
> *"Develop a JavaScript mini-interpreter module (`interpreter.js`) that parses and evaluates domain-specific expressions without using `eval()` or `new Function()`. Implement a four-stage pipeline: (1) Lexical Tokenizer, (2) Syntax Parser, (3) Semantic Validator, and (4) Evaluator. Support three commands: `AVERAGE(m1, m2, ...)` accepting 1+ marks in range [0, 100] (allowing 0); `PASS(mark)` accepting exactly 1 mark and returning string 'TRUE' if mark >= 50 else 'FALSE'; and `ELIGIBLE(mark, attendance)` accepting exactly 1 mark [0, 100] and 1 case-insensitive boolean (TRUE/FALSE), returning 'TRUE' if mark >= 45 and attendance is TRUE. Return structured result objects `{ success, result, error, details }`. Reject unknown commands, missing parentheses, trailing characters, and marks outside 0–100 with distinct, user-friendly error messages."*

### Impact of Revision:
- Avoided all unsafe evaluation mechanisms.
- Produced clear error messaging (e.g., `Range Error: mark must be between 0 and 100`).
- Handled edge cases such as numeric `0`, whitespace tolerance, and case-insensitivity.

---

## 3. Real AI-Generated Issue, Correction & Retest (Task 3c)

### A. The Real Issue Encountered
During execution of the automated test suite on macOS using Apple's native JavaScriptCore CLI runtime (`/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc tests/test-runner.js`), the execution crashed with an unhandled exception:
```text
Exception: TypeError: undefined is not an object (evaluating 'console.log')
initApp@/Users/habibaahmed/Desktop/ppl project/app.js:1244:12
@/Users/habibaahmed/Desktop/ppl project/app.js:1251:12
global code@/Users/habibaahmed/Desktop/ppl project/app.js:1253:3
load@[native code]
global code@tests/test-runner.js:28:7
```

### B. Root Cause Analysis
The AI generated `app.js` assuming standard web browser or Node.js host environments where the global `console` object is pre-defined. However, minimal standalone ECMAScript CLI runtimes like Apple's `jsc` (which provides `print()` instead of `console.log()`) lack a global `console` object by default. Directly referencing `console.log()` without an environment existence check caused an immediate fatal runtime exception when loaded into the test harness.

### C. The Correction Applied
1. In `app.js`, added a defensive global environment guard at the top of the file:
```javascript
// Safe console fallback for CLI runtimes (e.g. JavaScriptCore jsc)
if (typeof console === 'undefined') {
  var console = {
    log: function () {},
    warn: function () {},
    error: function () {}
  };
}
```
2. In `tests/test-runner.js`, expanded the headless testing environment harness:
```javascript
var console = {
  log: function () {},
  warn: function () {},
  error: function () {}
};
var window = { localStorage: localStorage, console: console };
```

### D. Retest Evidence
The test script was re-executed under `jsc`:
```bash
/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc tests/test-runner.js
```
**Outcome:** The exception was completely eliminated. All 52 automated tests executed and passed with code 0:
```text
======================================================
  TEST SUITE EXECUTION SUMMARY
======================================================
Total Tests Executed: 52
Tests Passed:         52 (100%)
Tests Failed:         0

>>> ALL 52 AUTOMATED TESTS PASSED SUCCESSFULLY! <<<
```
