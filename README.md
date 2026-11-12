# Student Performance Analyzer
**Course:** CSCI 310 Principles of Programming Languages  
**Assessment:** Group Project – Build and Publish a Website or Mobile Application Using AI  
**Academic Term:** Fall 2026  
**Instructor:** Dr. Maher Alrahhal  
**Institution:** School of Engineering, Architecture and Interior Design (EAID), Amity University Dubai  

---

## Table of Contents
1. [Project Overview & Problem Statement](#1-project-overview--problem-statement)
2. [Target Users](#2-target-users)
3. [Functional Requirements](#3-functional-requirements)
4. [Four Functional Screens](#4-four-functional-screens)
5. [Storage Behavior & Persistence](#5-storage-behavior--persistence)
6. [Programming Paradigms Implementation](#6-programming-paradigms-implementation)
7. [Mini-Interpreter Architecture & Language Specification](#7-mini-interpreter-architecture--language-specification)
8. [Automated & Manual Test Results](#8-automated--manual-test-results)
9. [Running the Application Locally (macOS)](#9-running-the-application-locally-macos)
10. [Publishing through GitHub Pages](#10-publishing-through-github-pages)
11. [Report Screenshot Checklist (5-Page Report)](#11-report-screenshot-checklist-5-page-report)
12. [10–12 Minute Live Demo Running Order](#12-1012-minute-live-demo-running-order)

---

## 1. Project Overview & Problem Statement

University educators and academic advisors often struggle to track student assessment performance efficiently across multi-component coursework. Spreadsheets can be cumbersome, lack real-time visual alerts for borderline or failing students, and require manual recalculation when records change.

The **Student Performance Analyzer** solves this problem by providing a responsive, client-side web application built with vanilla HTML5, CSS3, and modern JavaScript. It allows lecturers to:
- Instantly record and manage student assessment marks across multiple milestones.
- View real-time class averages, pass rates, and identifies students requiring academic intervention.
- Search and filter cohorts declaratively.
- Execute quick domain-specific calculations via a custom, safe **Mini-Interpreter** language parser.

All data persists in the browser’s `localStorage`, ensuring data durability across page reloads without requiring an external backend database.

---

## 2. Target Users

1. **Course Instructors & Lecturers:** Enter marks, review cohort distributions, and export consolidated performance reports.
2. **Academic Advisors & Mentors:** Rapidly identify at-risk students (overall average below 50%) to organize tutoring and remedial sessions before final grades are locked.
3. **Teaching Assistants (TAs):** Verify mark calculations and check attendance-based exam eligibility.

---

## 3. Functional Requirements

* **FR-1: Dynamic Cohort Metrics Calculation:** The system must compute total student enrollment, overall class average, pass percentage, and count of failing students (&lt; 50%) dynamically whenever records are created, modified, or removed.
* **FR-2: Full Student Record CRUD Operations:** The system must allow users to add new students, edit existing assessment marks, view records in a structured tabular format, and delete records with user confirmation.
* **FR-3: Strict Multi-Field Input Validation:** The system must validate that student IDs and names are non-empty, reject duplicate student IDs, restrict marks to numbers between 0 and 100 inclusive, and explicitly accept a valid mark of `0`.
* **FR-4: Real-time Search & Multi-Criteria Filtering:** The system must provide instant client-side searching across student names and IDs, alongside status filtering (`All`, `Passed`, `Needs Support`), presenting a clear empty state message when no records match.
* **FR-5: Safe Domain-Specific Mini-Interpreter:** The system must parse and evaluate expressions in a custom DSL (`AVERAGE`, `PASS`, `ELIGIBLE`) without calling JavaScript's `eval()`, returning formatted results or specific syntax and range error messages.
* **FR-6: Client-Side Storage Persistence:** All record mutations must synchronize with browser `localStorage`, persisting through browser refreshes and tab closures, with a dedicated mechanism to restore initial fictional demo data.
* **FR-7: Report Export Capability:** The system must allow exporting current filtered student analytics and support recommendations directly to a standard `.csv` file.

---

## 4. Four Functional Screens

### Screen 1: Dashboard (`#dashboard-view`)
- **Metric Cards:** Displays total students, overall cohort average (across all 3 assessments), overall pass rate percentage, and count of students below the 50% passing cutoff.
- **Assessment Breakdown:** Visual progress indicators and averages for Assessment 1 (Theory), Assessment 2 (Paradigms Lab), and Assessment 3 (Project Implementation).
- **At-Risk Intervention Banner:** Prominently lists students currently averaging below 50% with their current percentage, notifying lecturers of required intervention.
- **Quick Actions:** Instant navigation buttons to manage records, inspect reports, launch the interpreter, or restore demo data.

### Screen 2: Student Records (`#records-view`)
- **Records Table:** Lists all student records showing ID, full name, Assessment 1 mark, Assessment 2 mark, Assessment 3 mark, and action buttons.
- **Add / Edit Modal Dialog:** Clean modal form with real-time error messages beneath each input.
  - Enforces unique Student ID.
  - Ensures marks are numeric in range `[0, 100]`.
  - Accurately accepts `0` as a legitimate mark (e.g. absent/unsubmitted assessment).
- **Actions:** Edit pre-populates the modal for immediate updating; Delete prompts for confirmation before removing from storage.

### Screen 3: Performance Reports (`#reports-view`)
- **Search Bar:** Real-time search by student name or student ID.
- **Status Filter Tabs:** Switch between `All`, `Passed (≥ 50%)`, and `Needs Support (< 50%)`.
- **Analytics Table:** Shows Student ID, Name, individual marks, calculated average (e.g. `87.7%`), color-coded Pass/Fail badge, and contextual academic support recommendation text.
- **Empty State Display:** Clear notification and reset button if no students match the active query.
- **CSV Export:** Button to download filtered records to a spreadsheet-compatible file.

### Screen 4: Mini-Interpreter (`#interpreter-view`)
- **Language Grammar Card:** Reference documentation for the supported commands: `AVERAGE`, `PASS`, and `ELIGIBLE`.
- **Execution Pipeline Visualizer:** Highlights the 5-stage evaluation flow (`Input` ➔ `Lexer` ➔ `Parser` ➔ `Validator` ➔ `Evaluator`).
- **Interactive REPL Console:** Text input box with Enter key submission and an **Evaluate** button.
- **One-Click Sample Chips:** Pre-populated clickable buttons for valid expressions (`AVERAGE(80,70,90)`, `PASS(65)`, `ELIGIBLE(45,TRUE)`) and deliberate error tests (`AVERAGE()`, `PASS(120)`, `ELIGIBLE(45, MAYBE)`).
- **Evaluation Result Card:** Displays outcome badge (`SUCCESS` or `SYNTAX / VALIDATION ERROR`), computed output value, and detailed execution trace (parsed command, tokens, and validated arguments).
- **REPL History Log:** Scrollable history of all evaluated commands with timestamps and status indicators.

---

## 5. Storage Behavior & Persistence

* **Storage Engine:** Uses standard browser `window.localStorage` under the key `csci310_student_performance_records`.
* **Data Schema (JSON):**
  ```json
  [
    {
      "id": "STU101",
      "name": "Sarah Jenkins",
      "mark1": 92,
      "mark2": 88,
      "mark3": 95
    }
  ]
  ```
* **Auto-Seed on First Load:** If `localStorage` is empty upon page load, the application seeds 8 fictional student records reflecting diverse performance outcomes (high achievers, average students, borderline passes, failing students, and a student with a mark of `0`).
* **Persistence Guarantee:** Adding, editing, or deleting a student immediately serializes the updated collection into `localStorage`. Refreshing or reopening the browser instantly restores the updated state.
* **Reset to Demo Data:** A reset button is available in both the Dashboard and Records screens, allowing instructors to restore the initial demo cohort at any time.

---

## 6. Programming Paradigms Implementation

This project deliberately implements and contrasts two major programming paradigms across distinct modules of the application:

```
┌────────────────────────────────────────────────────────┐
│               Student Performance Analyzer             │
└────────────────────────────────────────────────────────┘
          │                                   │
          ▼                                   ▼
┌───────────────────────────┐       ┌───────────────────────────┐
│   Functional Paradigm     │       │    Imperative Paradigm    │
│     (PerformanceFP)       │       │(StorageAndRecordsImperative)
├───────────────────────────┤       ├───────────────────────────┤
│ • Pure mathematical logic │       │ • Step-by-step procedures │
│ • Zero side-effects       │       │ • State mutation          │
│ • Immutability            │       │ • localStorage CRUD       │
│ • map, filter, reduce     │       │ • DOM manipulation        │
│ • Declarative filtering   │       │ • Sequential validation   │
└───────────────────────────┘       └───────────────────────────┘
```

### Paradigm 1: Functional Programming (FP)

* **Location:** `app.js` under the `PerformanceFP` module.
* **Key Functions:**
  - `calculateAverage(marks)`
  - `determinePassStatus(average, threshold)`
  - `calculateClassAverage(records)`
  - `calculatePassRate(records, threshold)`
  - `countStudentsBelowPassing(records, threshold)`
  - `formatStudentReport(student, threshold)`
  - `filterAndSearchReports(records, searchQuery, statusFilter)`

#### Code Example (Functional Programming)
```javascript
// Pure Function: Computes arithmetic mean using reduce without side-effects
const calculateAverage = (marks) => {
  if (!Array.isArray(marks) || marks.length === 0) return 0;
  const sum = marks.reduce((total, mark) => total + mark, 0);
  return Math.round((sum / marks.length) * 10) / 10;
};

// Pure Function: Declarative report filtering using map and filter
const filterAndSearchReports = (records, searchQuery = '', statusFilter = 'all', threshold = 50) => {
  if (!Array.isArray(records)) return [];
  const query = searchQuery.trim().toLowerCase();

  return records
    .map((student) => formatStudentReport(student, threshold))
    .filter((report) => {
      const matchesQuery = query === '' ||
        report.id.toLowerCase().includes(query) ||
        report.name.toLowerCase().includes(query);

      let matchesStatus = true;
      if (statusFilter === 'pass') matchesStatus = report.passed === true;
      else if (statusFilter === 'fail') matchesStatus = report.passed === false;

      return matchesQuery && matchesStatus;
    });
};
```

#### Why Functional Programming Fits This Part:
Mathematical calculations and analytics require consistency, determinism, and predictability. Pure functions take inputs and return outputs without modifying external application state or causing side-effects. This makes calculating class averages, pass rates, and applying search filters immune to race conditions, easily testable in isolation, and mathematically verifiable.

---

### Paradigm 2: Imperative Programming

* **Location:** `app.js` under `StorageAndRecordsImperative` and UI controller event handlers.
* **Key Functions:**
  - `saveStudentRecord(formData, originalId)`
  - `deleteStudentRecord(id)`
  - `validateStudentRecord(formData, existingRecords, originalId)`
  - `loadRecordsFromStorage()`
  - `saveRecordsToStorage(records)`

#### Code Example (Imperative Programming)
```javascript
// Procedural Workflow: Step-by-step record saving with state mutation
function saveStudentRecord(formData, originalId = null) {
  // Step 1: Sequential procedural validation
  const validation = validateStudentRecord(formData, currentRecords, originalId);
  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }

  // Step 2: Create record object
  const cleanRecord = {
    id: formData.id.trim().toUpperCase(),
    name: formData.name.trim(),
    mark1: Number(formData.mark1),
    mark2: Number(formData.mark2),
    mark3: Number(formData.mark3)
  };

  // Step 3: Mutate array state imperatively
  if (originalId) {
    let foundIndex = -1;
    for (let i = 0; i < currentRecords.length; i++) {
      if (currentRecords[i].id.toUpperCase() === originalId.toUpperCase()) {
        foundIndex = i;
        break;
      }
    }
    if (foundIndex === -1) {
      return { success: false, errors: { general: 'Record not found.' } };
    }
    currentRecords[foundIndex] = cleanRecord; // In-place mutation
  } else {
    currentRecords.push(cleanRecord); // Append mutation
  }

  // Step 4: Write to persistent storage
  saveRecordsToStorage(currentRecords);

  return { success: true, record: cleanRecord };
}
```

#### Why Imperative Programming Fits This Part:
Data persistence, form submission handling, and DOM element management are inherently procedural and stateful. Managing sequential steps (read form ➔ validate field 1 ➔ validate field 2 ➔ mutate memory array ➔ write to `localStorage` ➔ re-render DOM tables ➔ trigger toast animation) aligns naturally with imperative control flow, explicit conditionals, and mutable storage structures.

---

## 7. Mini-Interpreter Architecture & Language Specification

The mini-interpreter is located in a dedicated source file: [interpreter.js](file:///Users/habibaahmed/Desktop/ppl%20project/interpreter.js). It executes custom textual commands through an explicit multi-stage compilation pipeline **without invoking `eval()` or `new Function()`**.

### Execution Pipeline

```
┌────────────────┐
│  Input String  │  e.g. "AVERAGE(80, 70, 90)"
└───────┬────────┘
        ▼
┌────────────────┐
│ 1. Tokenizer   │  Trims whitespace, verifies outer parentheses, extracts tokens.
└───────┬────────┘
        ▼
┌────────────────┐
│   2. Parser    │  Extracts command name and argument strings into AST:
│     (AST)      │  { command: 'AVERAGE', rawArgs: ['80', '70', '90'] }
└───────┬────────┘
        ▼
┌────────────────┐
│  3. Validator  │  Verifies command is valid, checks argument counts,
│                │  checks numbers in [0, 100], checks booleans (TRUE/FALSE).
└───────┬────────┘
        ▼
┌────────────────┐
│  4. Evaluator  │  Applies operational semantics and computes output:
│                │  returns 80 (Number) or 'TRUE' / 'FALSE' (String).
└───────┬────────┘
        ▼
┌────────────────┐
│ Output Result  │  Structured result object { success, result, error, details }
└────────────────┘
```

### Supported Language Commands

| Command Signature | Expected Arguments | Semantics / Rules | Example Expression | Expected Output |
| :--- | :--- | :--- | :--- | :--- |
| `AVERAGE(m1, m2, ...)` | 1 or more numbers in `[0, 100]` | Calculates arithmetic mean of all provided marks. | `AVERAGE(80, 70, 90)` | `80` |
| `PASS(mark)` | Exactly 1 number in `[0, 100]` | Returns `'TRUE'` if mark ≥ 50, otherwise `'FALSE'`. | `PASS(65)` | `TRUE` |
| `ELIGIBLE(mark, flag)` | Exactly 1 mark `[0, 100]` and 1 boolean (`TRUE`/`FALSE`) | Returns `'TRUE'` if mark ≥ 45 **and** attendance flag is `TRUE`, otherwise `'FALSE'`. | `ELIGIBLE(45, TRUE)` | `TRUE` |

### Error Handling & Diagnostic Feedback

The interpreter captures and reports specific errors:
- **Empty Input:** `"Expression cannot be empty."`
- **Missing Parentheses:** `"Syntax Error: Missing opening parenthesis '(' in expression."` or `"Syntax Error: Missing closing parenthesis ')'..."`
- **Unknown Command:** `"Unknown Command: 'FOO'. Supported commands are: AVERAGE, PASS, ELIGIBLE."`
- **Argument Count Mismatch:** `"Validation Error: PASS requires exactly 1 mark argument, but received 2."`
- **Empty / Trailing Commas:** `"Syntax Error: Empty argument at position 2. Trailing or consecutive commas are not permitted."`
- **Out of Range Marks:** `"Range Error: PASS argument must be between 0 and 100 inclusive. Received: 120"`
- **Non-Numeric Value:** `"Validation Error: AVERAGE argument 2 'abc' is not a valid number."`
- **Invalid Boolean:** `"Type Error: ELIGIBLE argument 2 (attendance flag) must be either TRUE or FALSE. Received: 'MAYBE'"`

---

## 8. Automated & Manual Test Results

### Automated Test Suite Execution
An automated test suite was constructed in [tests/test-runner.js](file:///Users/habibaahmed/Desktop/ppl%20project/tests/test-runner.js) and executed using macOS's built-in Apple JavaScriptCore CLI engine:
```bash
/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc tests/test-runner.js
```

#### Results Matrix (52 Tests Executed, 52 Passed, 0 Failed)

| Test ID | Test Category | Description / Input | Expected Result | Actual Result | Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **T01** | Functional FP | `calculateAverage([80, 70, 90])` | `80` | `80` | **PASS** |
| **T02** | Functional FP | `calculateAverage([85, 90, 88])` (rounding) | `87.7` | `87.7` | **PASS** |
| **T03** | Functional FP | `calculateAverage([0, 75, 80])` (mark of 0) | `51.7` | `51.7` | **PASS** |
| **T04** | Functional FP | `calculateAverage([0, 0, 0])` | `0` | `0` | **PASS** |
| **T05** | Functional FP | `calculateAverage([])` empty array | `0` | `0` | **PASS** |
| **T06** | Functional FP | `determinePassStatus(50)` (exact cutoff) | `true` | `true` | **PASS** |
| **T07** | Functional FP | `determinePassStatus(65)` | `true` | `true` | **PASS** |
| **T08** | Functional FP | `determinePassStatus(49.9)` | `false` | `false` | **PASS** |
| **T09** | Functional FP | `isAtRisk(45)` | `true` | `true` | **PASS** |
| **T10** | Functional FP | `isAtRisk(50)` | `false` | `false` | **PASS** |
| **T11** | Functional FP | `calculateClassAverage(cohort)` | `55.0` | `55.0` | **PASS** |
| **T12** | Functional FP | `calculatePassRate(cohort)` | `50.0%` | `50.0%` | **PASS** |
| **T13** | Functional FP | `countStudentsBelowPassing(cohort)` | `2` | `2` | **PASS** |
| **T14** | Functional FP | `filterAndSearchReports(cohort, 'T01', 'all')` | 1 match | 1 match | **PASS** |
| **T15** | Functional FP | `filterAndSearchReports(cohort, 'beta', 'all')` | 1 match (case-insensitive) | 1 match | **PASS** |
| **T16** | Functional FP | `filterAndSearchReports(cohort, '', 'pass')` | 2 passing | 2 passing | **PASS** |
| **T17** | Functional FP | `filterAndSearchReports(cohort, '', 'fail')` | 2 failing | 2 failing | **PASS** |
| **T18** | Functional FP | `filterAndSearchReports(cohort, 'NonExistent')` | `[]` (0 matches) | `[]` | **PASS** |
| **T19** | Imperative CRUD | `resetToDemoData()` seeds 8 students | 8 records | 8 records | **PASS** |
| **T20** | Imperative CRUD | `validateStudentRecord` with mark of 0 | `isValid: true` | `isValid: true` | **PASS** |
| **T21** | Imperative CRUD | Duplicate Student ID rejection (`STU101`) | `isValid: false` | `isValid: false` | **PASS** |
| **T22** | Imperative CRUD | Mark &gt; 100 rejection (`105`) | `isValid: false` | `isValid: false` | **PASS** |
| **T23** | Imperative CRUD | Negative mark rejection (`-10`) | `isValid: false` | `isValid: false` | **PASS** |
| **T24** | Imperative CRUD | Add new record (`STU200`) | Record saved, count = 9 | Record saved, count = 9 | **PASS** |
| **T25** | Imperative CRUD | Edit existing record (`STU200` marks 95) | Updated in place | Updated in place | **PASS** |
| **T26** | Imperative CRUD | Delete record (`STU200`) | Removed, count = 8 | Removed, count = 8 | **PASS** |
| **T27** | Mini-Interpreter | `AVERAGE(80, 70, 90)` | `80` | `80` | **PASS** |
| **T28** | Mini-Interpreter | `AVERAGE(100)` single mark | `100` | `100` | **PASS** |
| **T29** | Mini-Interpreter | `AVERAGE(0, 50, 100)` with 0 | `50` | `50` | **PASS** |
| **T30** | Mini-Interpreter | `AVERAGE` whitespace tolerance | `87.5` | `87.5` | **PASS** |
| **T31** | Mini-Interpreter | `PASS(65)` | `'TRUE'` | `'TRUE'` | **PASS** |
| **T32** | Mini-Interpreter | `PASS(50)` boundary threshold | `'TRUE'` | `'TRUE'` | **PASS** |
| **T33** | Mini-Interpreter | `PASS(49.9)` below threshold | `'FALSE'` | `'FALSE'` | **PASS** |
| **T34** | Mini-Interpreter | `PASS(0)` | `'FALSE'` | `'FALSE'` | **PASS** |
| **T35** | Mini-Interpreter | `ELIGIBLE(45, TRUE)` exact cutoff | `'TRUE'` | `'TRUE'` | **PASS** |
| **T36** | Mini-Interpreter | `ELIGIBLE(50, true)` case-insensitivity | `'TRUE'` | `'TRUE'` | **PASS** |
| **T37** | Mini-Interpreter | `ELIGIBLE(44.9, TRUE)` mark &lt; 45 | `'FALSE'` | `'FALSE'` | **PASS** |
| **T38** | Mini-Interpreter | `ELIGIBLE(85, FALSE)` false attendance | `'FALSE'` | `'FALSE'` | **PASS** |
| **T39** | Mini-Interpreter | Empty expression `""` | Syntax error | Syntax error | **PASS** |
| **T40** | Mini-Interpreter | Missing open paren `AVERAGE 80, 90)` | Syntax error | Syntax error | **PASS** |
| **T41** | Mini-Interpreter | Missing close paren `AVERAGE(80, 90` | Syntax error | Syntax error | **PASS** |
| **T42** | Mini-Interpreter | Trailing characters `PASS(65) extra` | Syntax error | Syntax error | **PASS** |
| **T43** | Mini-Interpreter | Unknown command `SUM(80, 70)` | Unknown command error | Unknown command error | **PASS** |
| **T44** | Mini-Interpreter | `PASS(65, 75)` too many args | Validation error | Validation error | **PASS** |
| **T45** | Mini-Interpreter | `PASS()` zero args | Validation error | Validation error | **PASS** |
| **T46** | Mini-Interpreter | `ELIGIBLE(45)` missing arg | Validation error | Validation error | **PASS** |
| **T47** | Mini-Interpreter | `AVERAGE()` empty args | Validation error | Validation error | **PASS** |
| **T48** | Mini-Interpreter | `PASS(120)` mark &gt; 100 | Range error | Range error | **PASS** |
| **T49** | Mini-Interpreter | `PASS(-5)` negative mark | Range error | Range error | **PASS** |
| **T50** | Mini-Interpreter | `AVERAGE(80, abc, 90)` non-numeric | Validation error | Validation error | **PASS** |
| **T51** | Mini-Interpreter | `ELIGIBLE(45, MAYBE)` invalid boolean | Type error | Type error | **PASS** |
| **T52** | Mini-Interpreter | `AVERAGE(80, , 90)` empty comma | Syntax error | Syntax error | **PASS** |

### Manual Verification Checks Log

| Check Description | Procedure | Expected Outcome | Status |
| :--- | :--- | :--- | :---: |
| **Browser Storage Durability** | Add record `STU900`, reload page with `Cmd + R` | Record `STU900` persists in table & dashboard figures reflect it | **Verified** |
| **Duplicate ID UI Feedback** | Enter existing ID `STU101` in Add Modal | Red input outline and `"Student ID 'STU101' already exists"` error | **Verified** |
| **Allow Mark of 0** | Enter marks `0`, `0`, `0` for new student | Record saves without error; average displays `0.0%` | **Verified** |
| **Mobile Menu Responsiveness** | Resize browser viewport below 768px | Header shows hamburger icon; clicking expands full navigation menu | **Verified** |
| **Live Reports Filtering** | Type `Omar` in search bar and select `Passed` | Instantly isolates student Omar Farooq (Average: 51.7%) | **Verified** |
| **Empty State Presentation** | Search for `XYZ999` | Displays friendly 🔎 empty state illustration and Reset button | **Verified** |
| **CSV Export Verification** | Click "Export to CSV" | Downloads `.csv` file with current formatted table rows | **Verified** |
| **One-Click REPL Sample Chips** | Click `PASS(65)` sample button | Expression populates, evaluates to `TRUE`, logs into history | **Verified** |

---

## 9. Running the Application Locally (macOS)

### Option 1: Direct Browser Launch (Simplest)
Open a terminal inside this project directory and execute:
```bash
open index.html
```
This opens the application directly in your default macOS web browser (Safari, Chrome, or Firefox). All features, including `localStorage` and the Mini-Interpreter, are fully functional.

### Option 2: Using Python's Built-in Web Server
If you prefer running through an HTTP localhost server:
```bash
python3 -m http.server 8000
```
Then open your browser and navigate to:
```text
http://localhost:8000
```

### Option 3: Running the Automated Test Suite
To execute the automated JavaScript test suite from the terminal:
```bash
/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc tests/test-runner.js
```

---

## 10. Publishing through GitHub Pages

The application is built entirely with client-side vanilla web standards (HTML5, CSS3, ES6 JavaScript) and relative asset paths, making it 100% compatible with GitHub Pages.

Follow these exact steps to publish:

### Step 1: Initialize Git and Commit Files
Open Terminal in the project root:
```bash
cd "/Users/habibaahmed/Desktop/ppl project"
git init
git add .
git commit -m "Initial release of CSCI 310 Student Performance Analyzer"
```

### Step 2: Push to Your GitHub Repository
Create a new public repository on GitHub (e.g., `student-performance-analyzer`), then link and push:
```bash
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/student-performance-analyzer.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository page on GitHub.
2. Click **Settings** (top right tab).
3. In the left navigation menu, click **Pages**.
4. Under **Build and deployment** > **Source**, select **Deploy from a branch**.
5. Set branch to `main` and folder to `/ (root)`.
6. Click **Save**.
7. Within 1–2 minutes, GitHub Pages will deploy your site and provide a live URL:
   ```text
   https://<YOUR_GITHUB_USERNAME>.github.io/student-performance-analyzer/
   ```

---

## 11. Report Screenshot Checklist (5-Page Report)

Use this checklist to capture the exact screenshots required for each page of your 5-page group project report:

* **Page 1: Introduction, Problem & Objectives**
  - [ ] **Screenshot 1A:** Executive Academic Dashboard showing the KPI metric cards (Total Students, Class Average, Pass Rate, Below Passing Mark) and the At-Risk notification banner.
  - [ ] **Screenshot 1B:** Header brand section showing the project title and course context.

* **Page 2: Development Tools & Implementation**
  - [ ] **Screenshot 2A:** Student Records table view showing the populated cohort records.
  - [ ] **Screenshot 2B:** Add/Edit Student Record modal dialog showing input validation for duplicate IDs and bounds checking (with a valid mark of 0).
  - [ ] **Screenshot 2C:** VS Code project folder directory tree showing clean file organization (`index.html`, `styles.css`, `app.js`, `interpreter.js`, `tests/`).

* **Page 3: AI-Assisted Coding & Prompts**
  - [ ] **Screenshot 3A:** Conversation with Google Antigravity / Gemini showing the initial architectural prompt.
  - [ ] **Screenshot 3B:** The before-and-after prompt revision comparison from `prompts.md`.
  - [ ] **Screenshot 3C:** Terminal output showing the diagnosed `TypeError: undefined is not an object (evaluating 'console.log')` runtime issue and its successful retest.

* **Page 4: CLO3, CLO4 & CLO5 Achievement**
  - [ ] **Screenshot 4A (CLO3 & CLO4 - Paradigms):** Side-by-side code snippet of `calculateAverage` (Functional pure reducer) and `saveStudentRecord` (Imperative procedural workflow).
  - [ ] **Screenshot 4B (CLO5 - Mini-Interpreter):** Interactive Mini-Interpreter screen showing evaluated expression `AVERAGE(80, 70, 90) -> 80` with its parse trace breakdown.
  - [ ] **Screenshot 4C (CLO5 - Error Diagnostics):** Mini-Interpreter screen showing a syntax/range error (e.g. `PASS(120)` or `AVERAGE()`).

* **Page 5: Testing, Group Contributions & Conclusion**
  - [ ] **Screenshot 5A:** Terminal window showing all 52 automated tests passing in `tests/test-runner.js`.
  - [ ] **Screenshot 5B:** Performance Reports screen demonstrating live search and status filtering (`Needs Support (< 50%)`).
  - [ ] **Screenshot 5C:** Browser Developer Tools `Application` > `Local Storage` panel showing serialized student records persisting in `csci310_student_performance_records`.

---

## 12. 10–12 Minute Live Demo Running Order

For the final group presentation (Task 7, 20% weighting, 10–12 minutes total), distribute speaking roles among your 3–4 members using this structured running order:

| Time | Speaker / Member | Demo Section & Action | Key Speaking Points |
| :---: | :--- | :--- | :--- |
| **0:00 – 2:00** | **Member 1 (Lead)** | **Project Introduction & Problem Statement**<br>• Show Dashboard screen.<br>• Point out KPI cards and At-Risk banner. | • Explain the challenge lecturers face in detecting failing students across multiple assessments.<br>• Introduce the 4 application screens.<br>• Highlight that all calculations update dynamically. |
| **2:00 – 4:30** | **Member 2** | **Student Records Management & Imperative CRUD**<br>• Open Add Record modal.<br>• Demonstrate duplicate ID rejection.<br>• Add a student with mark of `0` to demonstrate edge case support.<br>• Edit a student mark and show instant recalculation.<br>• Refresh browser to prove `localStorage` persistence. | • Explain the **Imperative Programming paradigm** used in `StorageAndRecordsImperative`.<br>• Walk through sequential validation and in-place state mutation.<br>• Show that data persists across page reloads without a backend database. |
| **4:30 – 6:30** | **Member 3** | **Performance Reports & Functional Paradigm**<br>• Switch to Performance Reports view.<br>• Demonstrate live search by ID and name.<br>• Filter by "Needs Support (< 50%)".<br>• Show empty state by searching non-existent student.<br>• Click "Export to CSV". | • Explain the **Functional Programming paradigm** used in `PerformanceFP`.<br>• Discuss pure functions, immutability, and higher-order functions (`reduce`, `filter`, `map`).<br>• Explain why pure functions fit analytical reporting. |
| **6:30 – 9:00** | **Member 4 (or Member 1)** | **Mini-Interpreter Deep Dive (CLO5)**<br>• Switch to Mini-Interpreter view.<br>• Run `AVERAGE(80, 70, 90)` ➔ `80`.<br>• Run `PASS(65)` ➔ `TRUE`.<br>• Run `ELIGIBLE(45, TRUE)` ➔ `TRUE`.<br>• Run edge cases: `ELIGIBLE(44, TRUE)` ➔ `FALSE`.<br>• Demonstrate syntax/range errors: `PASS(120)`, `AVERAGE()`, missing parens. | • Explain the 5-stage pipeline: Text ➔ Lexer ➔ Parser (AST) ➔ Validator ➔ Evaluator.<br>• Emphasize that **no `eval()`** is used.<br>• Highlight custom error diagnostics and history logging. |
| **9:00 – 10:30** | **All Members** | **AI Engineering & Testing Verification**<br>• Show `prompts.md`.<br>• Discuss the prompt revision and real runtime debugging scenario.<br>• Run `tests/test-runner.js` in terminal to display all 52 tests passing. | • Reflect on effective prompt engineering techniques.<br>• Present the automated test suite and test matrix.<br>• Mention GitHub repository and deployment status. |
| **10:30 – 12:00** | **All Members** | **Q&A with Instructor (Dr. Maher Alrahhal)** | • All group members answer questions regarding their contributions, code architecture, and programming language concepts. |
