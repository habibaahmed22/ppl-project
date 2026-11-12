/**
 * app.js
 * Student Performance Analyzer
 * Course: CSCI 310 Principles of Programming Languages
 * 
 * Safe console fallback for CLI runtimes (e.g. JavaScriptCore jsc)
 */
if (typeof console === 'undefined') {
  var console = {
    log: function () {},
    warn: function () {},
    error: function () {}
  };
}

/**
 * This application explicitly demonstrates two core programming paradigms:
 * 
 * 1. FUNCTIONAL PROGRAMMING (FP):
 *    - Located in `PerformanceFP` namespace.
 *    - Used for all calculations: student averages, class metrics, pass/fail status,
 *      and search/filter operations on performance reports.
 *    - Characteristics: Pure functions, zero side-effects, immutability, higher-order functions
 *      (map, filter, reduce), and declarative data pipelines.
 * 
 * 2. IMPERATIVE PROGRAMMING:
 *    - Located in `StorageAndRecordsImperative` and UI Controller workflows.
 *    - Used for record-saving workflows, state mutations, localStorage persistence,
 *      step-by-step procedural validation, and DOM manipulation.
 *    - Characteristics: Explicit state manipulation, step-by-step procedural execution,
 *      mutable data structures, loops, and conditional branching.
 */

// ============================================================================
// PARADIGM 1: FUNCTIONAL PROGRAMMING MODULE (PerformanceFP)
// Pure functions, no side-effects, immutable transformations
// ============================================================================

const PerformanceFP = (function () {
  'use strict';

  const PASSING_THRESHOLD = 50;

  /**
   * Pure Function: Calculates the arithmetic average of an array of marks.
   * Uses reduce without mutating inputs.
   * @param {number[]} marks - Array of assessment marks
   * @returns {number} Average mark rounded to 1 decimal place, or 0 if empty
   */
  const calculateAverage = (marks) => {
    if (!Array.isArray(marks) || marks.length === 0) return 0;
    const sum = marks.reduce((total, mark) => total + mark, 0);
    return Math.round((sum / marks.length) * 10) / 10;
  };

  /**
   * Pure Function: Determines whether an average meets or exceeds the passing threshold.
   * @param {number} average - Average mark
   * @param {number} [threshold=PASSING_THRESHOLD] - Passing cutoff
   * @returns {boolean} True if pass, false otherwise
   */
  const determinePassStatus = (average, threshold = PASSING_THRESHOLD) => {
    return average >= threshold;
  };

  /**
   * Pure Function: Predicate to identify students requiring academic intervention.
   * @param {number} average - Average mark
   * @param {number} [threshold=PASSING_THRESHOLD] - Passing cutoff
   * @returns {boolean} True if at-risk (< threshold)
   */
  const isAtRisk = (average, threshold = PASSING_THRESHOLD) => {
    return average < threshold;
  };

  /**
   * Pure Function: Computes class-wide overall average across all assessments of all students.
   * Declarative pipeline using flatMap and reduce.
   * @param {Array<Object>} records - Array of student records
   * @returns {number} Class average rounded to 1 decimal place
   */
  const calculateClassAverage = (records) => {
    if (!Array.isArray(records) || records.length === 0) return 0;
    const allMarks = records.flatMap((student) => [
      Number(student.mark1),
      Number(student.mark2),
      Number(student.mark3)
    ]);
    if (allMarks.length === 0) return 0;
    const sum = allMarks.reduce((total, mark) => total + mark, 0);
    return Math.round((sum / allMarks.length) * 10) / 10;
  };

  /**
   * Pure Function: Computes individual assessment averages (Assessment 1, 2, 3).
   * @param {Array<Object>} records - Array of student records
   * @returns {Object} { a1, a2, a3 }
   */
  const calculateAssessmentAverages = (records) => {
    if (!Array.isArray(records) || records.length === 0) {
      return { a1: 0, a2: 0, a3: 0 };
    }
    const n = records.length;
    const sumA1 = records.reduce((acc, r) => acc + Number(r.mark1), 0);
    const sumA2 = records.reduce((acc, r) => acc + Number(r.mark2), 0);
    const sumA3 = records.reduce((acc, r) => acc + Number(r.mark3), 0);
    return {
      a1: Math.round((sumA1 / n) * 10) / 10,
      a2: Math.round((sumA2 / n) * 10) / 10,
      a3: Math.round((sumA3 / n) * 10) / 10
    };
  };

  /**
   * Pure Function: Computes overall percentage of students passing.
   * Uses filter to find passing students and computes percentage.
   * @param {Array<Object>} records - Array of student records
   * @param {number} [threshold=PASSING_THRESHOLD]
   * @returns {number} Pass percentage rounded to 1 decimal place
   */
  const calculatePassRate = (records, threshold = PASSING_THRESHOLD) => {
    if (!Array.isArray(records) || records.length === 0) return 0;
    const passingStudents = records.filter((student) => {
      const avg = calculateAverage([
        Number(student.mark1),
        Number(student.mark2),
        Number(student.mark3)
      ]);
      return determinePassStatus(avg, threshold);
    });
    const rate = (passingStudents.length / records.length) * 100;
    return Math.round(rate * 10) / 10;
  };

  /**
   * Pure Function: Counts how many students are currently below the passing mark.
   * @param {Array<Object>} records - Array of student records
   * @param {number} [threshold=PASSING_THRESHOLD]
   * @returns {number} Count of students below threshold
   */
  const countStudentsBelowPassing = (records, threshold = PASSING_THRESHOLD) => {
    if (!Array.isArray(records)) return 0;
    return records.filter((student) => {
      const avg = calculateAverage([
        Number(student.mark1),
        Number(student.mark2),
        Number(student.mark3)
      ]);
      return isAtRisk(avg, threshold);
    }).length;
  };

  /**
   * Pure Function: Transforms a raw student record into a rich report projection.
   * Immutable projection creating a new object.
   * @param {Object} student - Raw student record
   * @param {number} [threshold=PASSING_THRESHOLD]
   * @returns {Object} Rich student report
   */
  const formatStudentReport = (student, threshold = PASSING_THRESHOLD) => {
    const marks = [Number(student.mark1), Number(student.mark2), Number(student.mark3)];
    const average = calculateAverage(marks);
    const passes = determinePassStatus(average, threshold);
    const atRisk = isAtRisk(average, threshold);

    let recommendation = 'On Track - Good Progress';
    if (average >= 85) {
      recommendation = 'Excellence - Eligible for Honours/Peer Mentoring';
    } else if (average < 50) {
      recommendation = 'Academic Support Required (Tutoring & Remedial Sessions)';
    } else if (average < 60) {
      recommendation = 'Borderline Pass - Monitor Assessment Submissions';
    }

    return {
      id: student.id,
      name: student.name,
      mark1: Number(student.mark1),
      mark2: Number(student.mark2),
      mark3: Number(student.mark3),
      average: average,
      passed: passes,
      status: passes ? 'Pass' : 'Fail',
      atRisk: atRisk,
      recommendation: recommendation
    };
  };

  /**
   * Pure Function: Filters and searches performance reports declaratively.
   * Composes string matching and status predicates without modifying the input array.
   * @param {Array<Object>} records - Array of student records
   * @param {string} searchQuery - Search text for name or student ID
   * @param {string} statusFilter - 'all', 'pass', or 'fail'
   * @param {number} [threshold=PASSING_THRESHOLD]
   * @returns {Array<Object>} Filtered array of formatted student reports
   */
  const filterAndSearchReports = (records, searchQuery = '', statusFilter = 'all', threshold = PASSING_THRESHOLD) => {
    if (!Array.isArray(records)) return [];
    const query = searchQuery.trim().toLowerCase();

    return records
      .map((student) => formatStudentReport(student, threshold))
      .filter((report) => {
        // Search matching: match ID or Name
        const matchesQuery = query === '' ||
          report.id.toLowerCase().includes(query) ||
          report.name.toLowerCase().includes(query);

        // Status matching
        let matchesStatus = true;
        if (statusFilter === 'pass') {
          matchesStatus = report.passed === true;
        } else if (statusFilter === 'fail') {
          matchesStatus = report.passed === false;
        }

        return matchesQuery && matchesStatus;
      });
  };

  /**
   * Pure Function: Aggregates complete dashboard KPI figures from student records.
   * @param {Array<Object>} records - Array of student records
   * @returns {Object} Complete dashboard metrics
   */
  const computeDashboardMetrics = (records) => {
    const totalStudents = Array.isArray(records) ? records.length : 0;
    const classAverage = calculateClassAverage(records);
    const passRate = calculatePassRate(records);
    const belowPassingCount = countStudentsBelowPassing(records);
    const assessmentAverages = calculateAssessmentAverages(records);

    const atRiskStudents = (records || [])
      .map((s) => formatStudentReport(s))
      .filter((r) => r.atRisk)
      .map((r) => ({ id: r.id, name: r.name, average: r.average }));

    return {
      totalStudents,
      classAverage,
      passRate,
      belowPassingCount,
      assessmentAverages,
      atRiskStudents
    };
  };

  return {
    PASSING_THRESHOLD,
    calculateAverage,
    determinePassStatus,
    isAtRisk,
    calculateClassAverage,
    calculateAssessmentAverages,
    calculatePassRate,
    countStudentsBelowPassing,
    formatStudentReport,
    filterAndSearchReports,
    computeDashboardMetrics
  };
})();


// ============================================================================
// PARADIGM 2: IMPERATIVE PROGRAMMING MODULE (StorageAndRecordsImperative)
// Procedural workflows, state mutation, loop-based validation, localStorage CRUD
// ============================================================================

const StorageAndRecordsImperative = (function () {
  'use strict';

  const STORAGE_KEY = 'csci310_student_performance_records';

  // Fictional Initial Demo Data
  // Includes varied marks, a student with a mark of 0, passing & failing students
  const INITIAL_DEMO_RECORDS = [
    { id: 'STU101', name: 'Sarah Jenkins', mark1: 92, mark2: 88, mark3: 95 },
    { id: 'STU102', name: 'Tariq Mansoor', mark1: 65, mark2: 70, mark3: 60 },
    { id: 'STU103', name: 'Aisha Al-Nuaimi', mark1: 52, mark2: 48, mark3: 56 },
    { id: 'STU104', name: 'Liam O’Connor', mark1: 42, mark2: 38, mark3: 45 },
    { id: 'STU105', name: 'Priya Patel', mark1: 45, mark2: 40, mark3: 50 },
    { id: 'STU106', name: 'Omar Farooq', mark1: 0, mark2: 75, mark3: 80 }, // Demonstrates valid mark of 0
    { id: 'STU107', name: 'Chen Wei', mark1: 85, mark2: 90, mark3: 88 },
    { id: 'STU108', name: 'Carlos Gomez', mark1: 30, mark2: 25, mark3: 40 }
  ];

  // In-memory mutable state
  let currentRecords = [];

  /**
   * Imperative Procedure: Loads student records from browser localStorage.
   * If storage is empty or corrupt, seeds initial fictional demo data.
   */
  function loadRecordsFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw !== null && raw !== '') {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          currentRecords = parsed;
          return currentRecords;
        }
      }
    } catch (e) {
      console.warn('Storage read failed or corrupted; reseeding demo data.', e);
    }

    // Fallback: seed demo records imperatively
    currentRecords = JSON.parse(JSON.stringify(INITIAL_DEMO_RECORDS));
    saveRecordsToStorage(currentRecords);
    return currentRecords;
  }

  /**
   * Imperative Procedure: Writes records array to browser localStorage.
   * @param {Array<Object>} records - Array to persist
   */
  function saveRecordsToStorage(records) {
    currentRecords = records;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to write to localStorage:', e);
      throw new Error('Local storage write failed. Your browser storage might be full.');
    }
  }

  /**
   * Imperative Procedure: Force reset storage to initial demo dataset.
   */
  function resetToDemoData() {
    currentRecords = JSON.parse(JSON.stringify(INITIAL_DEMO_RECORDS));
    saveRecordsToStorage(currentRecords);
    return currentRecords;
  }

  /**
   * Imperative Validation Workflow:
   * Sequentially validates input fields. Collects and returns specific field errors.
   * Ensures:
   *  - Required fields are present
   *  - Duplicate IDs are rejected (when adding or changing ID)
   *  - Marks are numeric between 0 and 100 inclusive
   *  - A mark of 0 is explicitly ALLOWED and validated as valid!
   */
  function validateStudentRecord(formData, existingRecords, originalId = null) {
    const errors = {};

    // 1. Validate Student ID
    if (!formData.id || typeof formData.id !== 'string' || formData.id.trim() === '') {
      errors.id = 'Student ID is required.';
    } else {
      const trimmedId = formData.id.trim().toUpperCase();
      // Check for duplicate ID
      for (let i = 0; i < existingRecords.length; i++) {
        const item = existingRecords[i];
        if (item.id.toUpperCase() === trimmedId) {
          // If we are editing and this is the same record, it's allowed
          if (originalId && item.id.toUpperCase() === originalId.toUpperCase()) {
            continue;
          }
          errors.id = `Student ID '${trimmedId}' already exists. IDs must be unique.`;
          break;
        }
      }
    }

    // 2. Validate Student Name
    if (!formData.name || typeof formData.name !== 'string' || formData.name.trim() === '') {
      errors.name = 'Student Name is required.';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Student Name must be at least 2 characters long.';
    }

    // 3. Validate Assessment Marks (mark1, mark2, mark3)
    const assessmentKeys = ['mark1', 'mark2', 'mark3'];
    const assessmentLabels = ['Assessment 1', 'Assessment 2', 'Assessment 3'];

    for (let j = 0; j < assessmentKeys.length; j++) {
      const key = assessmentKeys[j];
      const label = assessmentLabels[j];
      const val = formData[key];

      // Check empty / missing
      if (val === undefined || val === null || String(val).trim() === '') {
        errors[key] = `${label} is required (0–100).`;
        continue;
      }

      const num = Number(val);
      if (isNaN(num)) {
        errors[key] = `${label} must be a valid number.`;
      } else if (num < 0 || num > 100) {
        errors[key] = `${label} must be between 0 and 100.`;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors: errors
    };
  }

  /**
   * Imperative Workflow: Save Student Record (Add or Edit)
   * Mutates the current records state and updates persistent storage.
   */
  function saveStudentRecord(formData, originalId = null) {
    // Step 1: Validate input fields
    const validation = validateStudentRecord(formData, currentRecords, originalId);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors
      };
    }

    // Step 2: Prepare clean record object
    const cleanRecord = {
      id: formData.id.trim().toUpperCase(),
      name: formData.name.trim(),
      mark1: Number(formData.mark1),
      mark2: Number(formData.mark2),
      mark3: Number(formData.mark3)
    };

    // Step 3: Branch: Edit existing record or Append new record
    if (originalId) {
      // Find index imperatively
      let foundIndex = -1;
      for (let i = 0; i < currentRecords.length; i++) {
        if (currentRecords[i].id.toUpperCase() === originalId.toUpperCase()) {
          foundIndex = i;
          break;
        }
      }

      if (foundIndex === -1) {
        return {
          success: false,
          errors: { general: `Record with ID '${originalId}' not found for updating.` }
        };
      }

      // Mutate in-place
      currentRecords[foundIndex] = cleanRecord;
    } else {
      // Append new record
      currentRecords.push(cleanRecord);
    }

    // Step 4: Write updated records to localStorage
    saveRecordsToStorage(currentRecords);

    return {
      success: true,
      record: cleanRecord
    };
  }

  /**
   * Imperative Workflow: Delete Student Record
   * Searches for record by ID, splices the array, and updates storage.
   */
  function deleteStudentRecord(id) {
    if (!id) return false;
    const targetId = id.trim().toUpperCase();

    let targetIndex = -1;
    for (let i = 0; i < currentRecords.length; i++) {
      if (currentRecords[i].id.toUpperCase() === targetId) {
        targetIndex = i;
        break;
      }
    }

    if (targetIndex !== -1) {
      currentRecords.splice(targetIndex, 1);
      saveRecordsToStorage(currentRecords);
      return true;
    }

    return false;
  }

  /**
   * Returns current in-memory records
   */
  function getRecords() {
    return currentRecords;
  }

  return {
    loadRecordsFromStorage,
    saveRecordsToStorage,
    resetToDemoData,
    validateStudentRecord,
    saveStudentRecord,
    deleteStudentRecord,
    getRecords,
    INITIAL_DEMO_RECORDS
  };
})();


// ============================================================================
// UI CONTROLLER & APPLICATION WIRING
// Manages screen routing, DOM event listeners, modal dialogs, and Interpreter UI
// ============================================================================

(function () {
  'use strict';

  // State
  let editingOriginalId = null;
  let currentSearchQuery = '';
  let currentStatusFilter = 'all';

  // DOM Elements cache
  const elements = {};

  function initDomElements() {
    // Navigation links & views
    elements.navLinks = document.querySelectorAll('.nav-link');
    elements.views = document.querySelectorAll('.app-view');
    elements.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    elements.navMenu = document.getElementById('primary-nav');

    // Dashboard elements
    elements.metricTotalStudents = document.getElementById('metric-total-students');
    elements.metricClassAverage = document.getElementById('metric-class-average');
    elements.metricPassRate = document.getElementById('metric-pass-rate');
    elements.metricBelowPassing = document.getElementById('metric-below-passing');
    elements.avgAssessment1 = document.getElementById('avg-assessment-1');
    elements.avgAssessment2 = document.getElementById('avg-assessment-2');
    elements.avgAssessment3 = document.getElementById('avg-assessment-3');
    elements.atRiskBanner = document.getElementById('at-risk-banner');
    elements.atRiskList = document.getElementById('at-risk-list');

    // Records view elements
    elements.recordsTableBody = document.getElementById('records-table-body');
    elements.recordsCountBadge = document.getElementById('records-count-badge');
    elements.btnOpenAddModal = document.getElementById('btn-open-add-modal');
    elements.btnResetDataRecords = document.getElementById('btn-reset-data-records');
    elements.btnResetDataDashboard = document.getElementById('btn-reset-data-dashboard');

    // Modal elements
    elements.recordModal = document.getElementById('record-modal');
    elements.modalTitle = document.getElementById('modal-title');
    elements.recordForm = document.getElementById('record-form');
    elements.btnCloseModal = document.getElementById('btn-close-modal');
    elements.btnCancelModal = document.getElementById('btn-cancel-modal');
    elements.inputStudentId = document.getElementById('student-id');
    elements.inputStudentName = document.getElementById('student-name');
    elements.inputMark1 = document.getElementById('student-mark1');
    elements.inputMark2 = document.getElementById('student-mark2');
    elements.inputMark3 = document.getElementById('student-mark3');

    // Error message spans
    elements.errorStudentId = document.getElementById('error-student-id');
    elements.errorStudentName = document.getElementById('error-student-name');
    elements.errorMark1 = document.getElementById('error-mark1');
    elements.errorMark2 = document.getElementById('error-mark2');
    elements.errorMark3 = document.getElementById('error-mark3');
    elements.formGeneralError = document.getElementById('form-general-error');

    // Reports view elements
    elements.reportSearchInput = document.getElementById('report-search-input');
    elements.statusFilterButtons = document.querySelectorAll('.filter-btn');
    elements.reportsTableBody = document.getElementById('reports-table-body');
    elements.reportsEmptyState = document.getElementById('reports-empty-state');
    elements.reportsResultCount = document.getElementById('reports-result-count');
    elements.btnResetReportFilter = document.getElementById('btn-reset-report-filter');
    elements.btnExportCsv = document.getElementById('btn-export-csv');

    // Mini-Interpreter elements
    elements.interpreterInput = document.getElementById('interpreter-input');
    elements.btnEvaluate = document.getElementById('btn-evaluate');
    elements.btnClearInterpreter = document.getElementById('btn-clear-interpreter');
    elements.interpreterResultCard = document.getElementById('interpreter-result-card');
    elements.interpreterStatusBadge = document.getElementById('interpreter-status-badge');
    elements.interpreterOutputText = document.getElementById('interpreter-output-text');
    elements.interpreterDetailsBox = document.getElementById('interpreter-details-box');
    elements.interpreterHistoryList = document.getElementById('interpreter-history-list');
    elements.sampleExpressionButtons = document.querySelectorAll('.sample-expr-btn');

    // Toast element
    elements.toast = document.getElementById('notification-toast');
  }

  /**
   * Displays temporary toast notification
   */
  function showToast(message, type = 'success') {
    if (!elements.toast) return;
    elements.toast.textContent = message;
    elements.toast.className = `toast toast-${type} show`;
    clearTimeout(elements.toastTimeout);
    elements.toastTimeout = setTimeout(() => {
      elements.toast.className = 'toast';
    }, 3200);
  }

  /**
   * Tab Navigation Switcher (Single Page Application Router)
   */
  function navigateTo(targetViewId) {
    elements.views.forEach((view) => {
      if (view.id === targetViewId) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    elements.navLinks.forEach((link) => {
      if (link.getAttribute('data-target') === targetViewId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Close mobile menu if open
    if (elements.navMenu && elements.navMenu.classList.contains('mobile-open')) {
      elements.navMenu.classList.remove('mobile-open');
    }

    // Refresh views on navigation
    if (targetViewId === 'dashboard-view') {
      renderDashboard();
    } else if (targetViewId === 'records-view') {
      renderRecordsTable();
    } else if (targetViewId === 'reports-view') {
      renderReports();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Renders Dashboard metrics using pure functional PerformanceFP functions
   */
  function renderDashboard() {
    const records = StorageAndRecordsImperative.getRecords();
    const metrics = PerformanceFP.computeDashboardMetrics(records);

    // Update KPI card values
    if (elements.metricTotalStudents) {
      elements.metricTotalStudents.textContent = metrics.totalStudents;
    }
    if (elements.metricClassAverage) {
      elements.metricClassAverage.textContent = `${metrics.classAverage}%`;
    }
    if (elements.metricPassRate) {
      elements.metricPassRate.textContent = `${metrics.passRate}%`;
    }
    if (elements.metricBelowPassing) {
      elements.metricBelowPassing.textContent = metrics.belowPassingCount;
    }

    // Assessment averages
    if (elements.avgAssessment1) {
      elements.avgAssessment1.textContent = `${metrics.assessmentAverages.a1}%`;
    }
    if (elements.avgAssessment2) {
      elements.avgAssessment2.textContent = `${metrics.assessmentAverages.a2}%`;
    }
    if (elements.avgAssessment3) {
      elements.avgAssessment3.textContent = `${metrics.assessmentAverages.a3}%`;
    }

    // At-Risk Banner
    if (elements.atRiskBanner && elements.atRiskList) {
      if (metrics.atRiskStudents.length > 0) {
        elements.atRiskBanner.classList.remove('hidden');
        elements.atRiskList.innerHTML = metrics.atRiskStudents
          .map((s) => `<span class="at-risk-chip"><strong>${escapeHtml(s.id)}</strong> (${escapeHtml(s.name)}: ${s.average}%)</span>`)
          .join('');
      } else {
        elements.atRiskBanner.classList.add('hidden');
        elements.atRiskList.innerHTML = '';
      }
    }
  }

  /**
   * Renders the Student Records Table
   */
  function renderRecordsTable() {
    const records = StorageAndRecordsImperative.getRecords();

    if (elements.recordsCountBadge) {
      elements.recordsCountBadge.textContent = `${records.length} Student${records.length === 1 ? '' : 's'}`;
    }

    if (!elements.recordsTableBody) return;

    if (records.length === 0) {
      elements.recordsTableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-4 text-muted">
            No student records recorded yet. Click <strong>Add Student Record</strong> to get started.
          </td>
        </tr>
      `;
      return;
    }

    let rowsHtml = '';
    for (let i = 0; i < records.length; i++) {
      const student = records[i];
      rowsHtml += `
        <tr>
          <td><span class="badge-id">${escapeHtml(student.id)}</span></td>
          <td class="font-medium">${escapeHtml(student.name)}</td>
          <td><span class="mark-pill">${student.mark1}</span></td>
          <td><span class="mark-pill">${student.mark2}</span></td>
          <td><span class="mark-pill">${student.mark3}</span></td>
          <td class="table-actions">
            <button class="btn btn-sm btn-outline edit-btn" data-id="${escapeHtml(student.id)}" title="Edit Record">
              ✏️ Edit
            </button>
            <button class="btn btn-sm btn-danger delete-btn" data-id="${escapeHtml(student.id)}" data-name="${escapeHtml(student.name)}" title="Delete Record">
              🗑️ Delete
            </button>
          </td>
        </tr>
      `;
    }
    elements.recordsTableBody.innerHTML = rowsHtml;

    // Attach row action listeners
    const editButtons = elements.recordsTableBody.querySelectorAll('.edit-btn');
    editButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openEditModal(id);
      });
    });

    const deleteButtons = elements.recordsTableBody.querySelectorAll('.delete-btn');
    deleteButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        handleDeleteRecord(id, name);
      });
    });
  }

  /**
   * Renders Performance Reports with Pure Functional Filtering
   */
  function renderReports() {
    const records = StorageAndRecordsImperative.getRecords();

    // Call pure functional pipeline
    const filteredReports = PerformanceFP.filterAndSearchReports(
      records,
      currentSearchQuery,
      currentStatusFilter,
      PerformanceFP.PASSING_THRESHOLD
    );

    if (elements.reportsResultCount) {
      elements.reportsResultCount.textContent = `Showing ${filteredReports.length} of ${records.length} records`;
    }

    if (!elements.reportsTableBody) return;

    if (filteredReports.length === 0) {
      elements.reportsTableBody.innerHTML = '';
      if (elements.reportsEmptyState) {
        elements.reportsEmptyState.classList.remove('hidden');
      }
      return;
    }

    if (elements.reportsEmptyState) {
      elements.reportsEmptyState.classList.add('hidden');
    }

    let rowsHtml = '';
    filteredReports.forEach((rep) => {
      const statusBadge = rep.passed
        ? `<span class="badge badge-success">✓ PASS</span>`
        : `<span class="badge badge-danger">✗ FAIL</span>`;

      const recommendationBadge = rep.atRisk
        ? `<span class="recommendation-badge at-risk">⚠️ ${escapeHtml(rep.recommendation)}</span>`
        : `<span class="recommendation-badge on-track">✅ ${escapeHtml(rep.recommendation)}</span>`;

      rowsHtml += `
        <tr class="${rep.atRisk ? 'row-at-risk' : ''}">
          <td><span class="badge-id">${escapeHtml(rep.id)}</span></td>
          <td class="font-medium">${escapeHtml(rep.name)}</td>
          <td>${rep.mark1}</td>
          <td>${rep.mark2}</td>
          <td>${rep.mark3}</td>
          <td><strong>${rep.average}%</strong></td>
          <td>${statusBadge}</td>
          <td>${recommendationBadge}</td>
        </tr>
      `;
    });

    elements.reportsTableBody.innerHTML = rowsHtml;
  }

  /**
   * Opens the Modal in "Add" mode
   */
  function openAddModal() {
    editingOriginalId = null;
    elements.modalTitle.textContent = 'Add New Student Record';
    resetFormErrors();
    elements.recordForm.reset();
    elements.inputStudentId.disabled = false;
    elements.recordModal.classList.add('show');
    elements.inputStudentId.focus();
  }

  /**
   * Opens the Modal in "Edit" mode pre-populated with existing record data
   */
  function openEditModal(studentId) {
    const records = StorageAndRecordsImperative.getRecords();
    const student = records.find((s) => s.id.toUpperCase() === studentId.toUpperCase());
    if (!student) {
      showToast(`Student record ${studentId} not found.`, 'danger');
      return;
    }

    editingOriginalId = student.id;
    elements.modalTitle.textContent = `Edit Record — ${student.name} (${student.id})`;
    resetFormErrors();

    elements.inputStudentId.value = student.id;
    elements.inputStudentName.value = student.name;
    elements.inputMark1.value = student.mark1;
    elements.inputMark2.value = student.mark2;
    elements.inputMark3.value = student.mark3;

    elements.recordModal.classList.add('show');
    elements.inputStudentName.focus();
  }

  /**
   * Closes the record modal
   */
  function closeModal() {
    elements.recordModal.classList.remove('show');
    resetFormErrors();
    elements.recordForm.reset();
    editingOriginalId = null;
  }

  /**
   * Clears inline error messages
   */
  function resetFormErrors() {
    elements.errorStudentId.textContent = '';
    elements.errorStudentName.textContent = '';
    elements.errorMark1.textContent = '';
    elements.errorMark2.textContent = '';
    elements.errorMark3.textContent = '';
    elements.formGeneralError.textContent = '';
    elements.formGeneralError.classList.add('hidden');

    elements.inputStudentId.classList.remove('input-error');
    elements.inputStudentName.classList.remove('input-error');
    elements.inputMark1.classList.remove('input-error');
    elements.inputMark2.classList.remove('input-error');
    elements.inputMark3.classList.remove('input-error');
  }

  /**
   * Handles Form Submission (Add / Edit)
   */
  function handleFormSubmit(e) {
    e.preventDefault();
    resetFormErrors();

    const formData = {
      id: elements.inputStudentId.value,
      name: elements.inputStudentName.value,
      mark1: elements.inputMark1.value,
      mark2: elements.inputMark2.value,
      mark3: elements.inputMark3.value
    };

    const result = StorageAndRecordsImperative.saveStudentRecord(formData, editingOriginalId);

    if (!result.success) {
      const errors = result.errors;
      if (errors.id) {
        elements.errorStudentId.textContent = errors.id;
        elements.inputStudentId.classList.add('input-error');
      }
      if (errors.name) {
        elements.errorStudentName.textContent = errors.name;
        elements.inputStudentName.classList.add('input-error');
      }
      if (errors.mark1) {
        elements.errorMark1.textContent = errors.mark1;
        elements.inputMark1.classList.add('input-error');
      }
      if (errors.mark2) {
        elements.errorMark2.textContent = errors.mark2;
        elements.inputMark2.classList.add('input-error');
      }
      if (errors.mark3) {
        elements.errorMark3.textContent = errors.mark3;
        elements.inputMark3.classList.add('input-error');
      }
      if (errors.general) {
        elements.formGeneralError.textContent = errors.general;
        elements.formGeneralError.classList.remove('hidden');
      }
      return;
    }

    // Success: close modal, refresh UI, show toast
    const actionDesc = editingOriginalId ? 'updated' : 'added';
    closeModal();
    renderRecordsTable();
    renderDashboard();
    renderReports();
    showToast(`Successfully ${actionDesc} student record for ${result.record.name}!`, 'success');
  }

  /**
   * Handles Record Deletion
   */
  function handleDeleteRecord(id, name) {
    const confirmed = window.confirm(`Are you sure you want to delete the record for ${name} (${id})? This action cannot be undone.`);
    if (!confirmed) return;

    const success = StorageAndRecordsImperative.deleteStudentRecord(id);
    if (success) {
      renderRecordsTable();
      renderDashboard();
      renderReports();
      showToast(`Deleted student record for ${name} (${id}).`, 'info');
    } else {
      showToast(`Could not delete record ${id}.`, 'danger');
    }
  }

  /**
   * Resets Data to Default Fictional Demo Set
   */
  function handleResetData() {
    const confirmed = window.confirm('Reset all student records to the original fictional demo data? Any custom records will be replaced.');
    if (!confirmed) return;

    StorageAndRecordsImperative.resetToDemoData();
    renderRecordsTable();
    renderDashboard();
    renderReports();
    showToast('Student records have been reset to demo data.', 'info');
  }

  /**
   * Exports Current Reports to CSV
   */
  function exportReportsToCsv() {
    const records = StorageAndRecordsImperative.getRecords();
    const reports = PerformanceFP.filterAndSearchReports(
      records,
      currentSearchQuery,
      currentStatusFilter,
      PerformanceFP.PASSING_THRESHOLD
    );

    if (reports.length === 0) {
      showToast('No records available to export.', 'warning');
      return;
    }

    const headers = ['Student ID', 'Student Name', 'Assessment 1', 'Assessment 2', 'Assessment 3', 'Average (%)', 'Status', 'Recommendation'];
    const rows = reports.map((r) => [
      `"${r.id}"`,
      `"${r.name}"`,
      r.mark1,
      r.mark2,
      r.mark3,
      r.average,
      `"${r.status}"`,
      `"${r.recommendation}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `student_performance_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported report to CSV.', 'success');
  }

  /**
   * Mini-Interpreter Evaluation Execution
   */
  function handleEvaluateExpression() {
    const rawInput = elements.interpreterInput.value;
    if (!rawInput || rawInput.trim() === '') {
      elements.interpreterResultCard.classList.remove('hidden');
      elements.interpreterStatusBadge.className = 'status-badge status-error';
      elements.interpreterStatusBadge.textContent = 'ERROR';
      elements.interpreterOutputText.textContent = 'Please enter an expression to evaluate.';
      elements.interpreterDetailsBox.innerHTML = '<em>No input provided.</em>';
      return;
    }

    // Call MiniInterpreter parser and evaluator
    const evalResult = window.MiniInterpreter.execute(rawInput);

    elements.interpreterResultCard.classList.remove('hidden');

    if (evalResult.success) {
      elements.interpreterStatusBadge.className = 'status-badge status-success';
      elements.interpreterStatusBadge.textContent = 'SUCCESS';
      elements.interpreterOutputText.innerHTML = `Result: <strong class="result-val">${evalResult.result}</strong>`;

      let detailsHtml = `
        <div class="trace-row"><span>Parsed Command:</span> <code>${evalResult.details.command}</code></div>
        <div class="trace-row"><span>Raw Arguments:</span> <code>[${evalResult.details.rawArgs.join(', ')}]</code></div>
      `;
      if (evalResult.details.command === 'AVERAGE') {
        detailsHtml += `<div class="trace-row"><span>Evaluated Marks:</span> <code>${evalResult.details.validatedArgs.marks.join(', ')}</code> (Count: ${evalResult.details.validatedArgs.marks.length})</div>`;
      } else if (evalResult.details.command === 'PASS') {
        detailsHtml += `<div class="trace-row"><span>Evaluated Mark:</span> <code>${evalResult.details.validatedArgs.mark}</code> (Threshold: ≥ ${window.MiniInterpreter.PASSING_THRESHOLD})</div>`;
      } else if (evalResult.details.command === 'ELIGIBLE') {
        detailsHtml += `<div class="trace-row"><span>Rule Evaluated:</span> <code>Mark (${evalResult.details.validatedArgs.mark}) ≥ ${window.MiniInterpreter.ELIGIBILITY_MIN_MARK} AND Attendance (${evalResult.details.validatedArgs.flag ? 'TRUE' : 'FALSE'})</code></div>`;
      }
      elements.interpreterDetailsBox.innerHTML = detailsHtml;

      // Log to REPL history
      addInterpreterHistory(rawInput, String(evalResult.result), true);
    } else {
      elements.interpreterStatusBadge.className = 'status-badge status-error';
      elements.interpreterStatusBadge.textContent = 'SYNTAX / VALIDATION ERROR';
      elements.interpreterOutputText.innerHTML = `<span class="text-danger">${escapeHtml(evalResult.error)}</span>`;
      elements.interpreterDetailsBox.innerHTML = `
        <div class="trace-row"><span>Original Expression:</span> <code>${escapeHtml(rawInput)}</code></div>
        <div class="trace-row text-muted"><span>Troubleshooting Tip:</span> Check command spelling, argument counts, numeric mark ranges (0-100), and TRUE/FALSE values.</div>
      `;

      // Log to REPL history
      addInterpreterHistory(rawInput, evalResult.error, false);
    }
  }

  /**
   * Appends an entry to the Mini-Interpreter REPL history list
   */
  function addInterpreterHistory(expr, result, isSuccess) {
    if (!elements.interpreterHistoryList) return;

    // Remove empty placeholder if present
    const emptyPlaceholder = elements.interpreterHistoryList.querySelector('.empty-history');
    if (emptyPlaceholder) {
      emptyPlaceholder.remove();
    }

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const li = document.createElement('li');
    li.className = `history-item ${isSuccess ? 'history-success' : 'history-error'}`;
    li.innerHTML = `
      <div class="history-header">
        <span class="history-expr"><code>${escapeHtml(expr)}</code></span>
        <span class="history-time">${time}</span>
      </div>
      <div class="history-result">
        ${isSuccess ? '→ <strong class="text-success">' + escapeHtml(result) + '</strong>' : '❌ <span class="text-danger">' + escapeHtml(result) + '</span>'}
      </div>
    `;

    // Insert at the top of the history list
    elements.interpreterHistoryList.insertBefore(li, elements.interpreterHistoryList.firstChild);

    // Limit history to 20 entries
    while (elements.interpreterHistoryList.children.length > 20) {
      elements.interpreterHistoryList.removeChild(elements.interpreterHistoryList.lastChild);
    }
  }

  /**
   * Helper: Escape HTML to avoid XSS
   */
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Wire Event Listeners
   */
  function setupEventListeners() {
    // Navigation tabs
    elements.navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetViewId = link.getAttribute('data-target');
        navigateTo(targetViewId);
      });
    });

    // Mobile nav toggle
    if (elements.mobileMenuToggle && elements.navMenu) {
      elements.mobileMenuToggle.addEventListener('click', () => {
        elements.navMenu.classList.toggle('mobile-open');
      });
    }

    // Modal triggers
    if (elements.btnOpenAddModal) {
      elements.btnOpenAddModal.addEventListener('click', openAddModal);
    }
    if (elements.btnCloseModal) {
      elements.btnCloseModal.addEventListener('click', closeModal);
    }
    if (elements.btnCancelModal) {
      elements.btnCancelModal.addEventListener('click', closeModal);
    }
    if (elements.recordModal) {
      elements.recordModal.addEventListener('click', (e) => {
        if (e.target === elements.recordModal) {
          closeModal();
        }
      });
    }

    // Form submit
    if (elements.recordForm) {
      elements.recordForm.addEventListener('submit', handleFormSubmit);
    }

    // Reset data triggers
    if (elements.btnResetDataRecords) {
      elements.btnResetDataRecords.addEventListener('click', handleResetData);
    }
    if (elements.btnResetDataDashboard) {
      elements.btnResetDataDashboard.addEventListener('click', handleResetData);
    }

    // Reports search & filter triggers
    if (elements.reportSearchInput) {
      elements.reportSearchInput.addEventListener('input', (e) => {
        currentSearchQuery = e.target.value;
        renderReports();
      });
    }

    elements.statusFilterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        elements.statusFilterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentStatusFilter = btn.getAttribute('data-status');
        renderReports();
      });
    });

    if (elements.btnResetReportFilter) {
      elements.btnResetReportFilter.addEventListener('click', () => {
        currentSearchQuery = '';
        currentStatusFilter = 'all';
        if (elements.reportSearchInput) elements.reportSearchInput.value = '';
        elements.statusFilterButtons.forEach((b) => {
          if (b.getAttribute('data-status') === 'all') b.classList.add('active');
          else b.classList.remove('active');
        });
        renderReports();
      });
    }

    if (elements.btnExportCsv) {
      elements.btnExportCsv.addEventListener('click', exportReportsToCsv);
    }

    // Interpreter controls
    if (elements.btnEvaluate) {
      elements.btnEvaluate.addEventListener('click', handleEvaluateExpression);
    }
    if (elements.interpreterInput) {
      elements.interpreterInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleEvaluateExpression();
        }
      });
    }
    if (elements.btnClearInterpreter) {
      elements.btnClearInterpreter.addEventListener('click', () => {
        elements.interpreterInput.value = '';
        elements.interpreterResultCard.classList.add('hidden');
        if (elements.interpreterHistoryList) {
          elements.interpreterHistoryList.innerHTML = '<li class="empty-history text-muted">Evaluation history is empty. Run an expression to see logs.</li>';
        }
      });
    }

    // Quick sample expression buttons
    elements.sampleExpressionButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const expr = btn.getAttribute('data-expr');
        if (elements.interpreterInput) {
          elements.interpreterInput.value = expr;
          handleEvaluateExpression();
        }
      });
    });

    // Quick action buttons in Dashboard
    const quickRecordsBtn = document.getElementById('quick-go-records');
    if (quickRecordsBtn) {
      quickRecordsBtn.addEventListener('click', () => navigateTo('records-view'));
    }
    const quickReportsBtn = document.getElementById('quick-go-reports');
    if (quickReportsBtn) {
      quickReportsBtn.addEventListener('click', () => navigateTo('reports-view'));
    }
    const quickInterpreterBtn = document.getElementById('quick-go-interpreter');
    if (quickInterpreterBtn) {
      quickInterpreterBtn.addEventListener('click', () => navigateTo('interpreter-view'));
    }
  }

  /**
   * Application Lifecycle Initialization
   */
  function initApp() {
    initDomElements();
    setupEventListeners();

    // Load initial records from localStorage (or fallback to demo data)
    StorageAndRecordsImperative.loadRecordsFromStorage();

    // Render initial views
    renderDashboard();
    renderRecordsTable();
    renderReports();

    console.log('CSCI 310 Student Performance Analyzer initialized successfully.');
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
