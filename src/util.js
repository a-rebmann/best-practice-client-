import {isNil } from 'lodash'

export const nat_lang_templates = {
  "Absence": "{1} does not occur more than {n} times",
  "Existence": "{1} occurs at least {n} times",
  "Exactly": "{1} occurs exactly {n} times",
  "Init": "{1} is the first to occur",
  "End": "{1} is the last to occur",

  "Choice": "{1} or {2} or both eventually occur in the same process instance",
  "Exclusive Choice": "{1} or {2} occurs, but never both in the same process instance",
  "Responded Existence": "if {1} occurs in the process instance, then {2} occurs as well",
  "Response": "if {1} occurs, then {2} occurs at some point after {1}",
  "Alternate Response": "each time {1} occurs, then {2} occurs afterwards, and no other {1} recurs in between",
  "Chain Response": "each time {1} occurs, then {2} occurs immediately afterwards",
  "Precedence": "{2} occurs only if it is preceded by {1}",
  "Alternate Precedence": "each time {2} occurs, it is preceded by {1} and no other {2} can recur in between",
  "Chain Precedence": "each time {2} occurs, then {1} occurs immediately beforehand",
  "Succession": "{1} occurs if and only if it is followed by {2}",
  "Alternate Succession": "{1} and {2} occur if and only if the latter follows the former, and they alternate in a process instance",
  "Chain Succession": "{1} and {2} occur if and only if the latter immediately follows the former",
  "Co-Existence": "if {1} occurs, then {2} occurs as well, and vice versa",

  "Not Responded Existence": "only one of {1} and {2} can occur in a process instance, but not both",
  "Not Chain Precedence": "when {2} occurs, {1} did not occur immediately beforehand",
  "Not Precedence":  "when {2} occurs, {1} did not occur beforehand",
  "Not Response": "when {1} occurs, {2} cannot not occur afterwards",
  "Not Chain Response": "when {1} occurs, {2} cannot not occur immediately afterwards",
  "Not Succession": "{2} cannot occur after {1}",
  "Not Co-Existence": "if {1} occurs, then {2} cannot occur, and vice versa",
}


export const colors = [
  { color: 'green', text: 'event is part of conformant variant' },
  { color: 'yellow', text: 'event is part of non-conformant variant' },
  { color: 'orange', text: 'event is likely non-conformant' },
  { color: 'red', text: 'event is non-conformant' },
];

export const findLabel = (row, leftOrRight) =>
  !isNil(row) &&
  !isNil(row[`log_label_${leftOrRight}`]) &&
  !isNil(JSON.parse(row[`log_label_${leftOrRight}`]?.replace(/'/g, '"'))[0])
    ? JSON.parse(row[`log_label_${leftOrRight}`]?.replace(/'/g, '"'))[0]
    : row[`${leftOrRight}_op`];

export const CONSTRAINT_LEVELS = [
  { text: 'Activity', value: 'Activity' },
  { text: 'Object', value: 'Object' },
  { text: 'Multi-object', value: 'Multi-object' },
  { text: 'Resource', value: 'Resource' },
];

export const LEVEL_DESCRIPTIONS = {
  'Activity': 'Activity-level constraints capture best practices about the behavioral relations that should hold between pairs of activities in a trace',
  'Multi-object': 'Multi-object constraints capture relations that should hold between pairs of business objects occurring in a process, e.g., that a trace can only contain (activities related to) an invoice if there is also at least one activity related to a delivery',
  'Object': 'Object-level constraints capture relations regarding the actions (state changes) that are applied to a business object, e.g., that an order must be checked before it is approved',
  'Resource': 'Resource-level constraints restrict the execution of activities to specific roles (who can perform a given process step)',
};

export const RELEVANCE_LEVELS = [
  { text: '>0.5', value: '0.5' },
  { text: '>0.6', value: '0.6' },
  { text: '>0.7', value: '0.7' },
  { text: '>0.8', value: '0.8' },
  { text: '>0.9', value: '0.9' },
];


export const filterFn = (rows, accessor, filterValue) => {
  if (filterValue.length > 0) {
    return rows.filter((row) => {
      const rowVal = row.values[accessor];
      if (filterValue.some((item) => rowVal?.includes(item))) {
        return true;
      }
      return false;
    });
  }
  return rows;
};


export const objectMap = (obj, fn) =>
  Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]));


export const addNatLangTemplateViolation = (violation) => {
  return {
    ...violation,
    nat_lang_template: nat_lang_templates[violation.constraint.constraint.constraint_type]
    .replaceAll("{1}", "''" + violation.constraint.constraint.left_operand + "''")
    .replaceAll("{2}", "''" + violation.constraint.constraint.right_operand + "''")
    .replaceAll('{n}', violation.constraint.constraint.constraint_str?.split('[')[0]?.slice(-1)),
  }
}


export const addNatLangTemplateFittedConstraint = (constraint) => {
  return {
    ...constraint,
    nat_lang_template: nat_lang_templates[constraint.constraint.constraint_type]
    .replaceAll("{1}", "''" + constraint.left_operand + "''")
    .replaceAll("{2}", "''" + constraint.right_operand + "''")
    .replaceAll('{n}', constraint.constraint.constraint_str?.split('[')[0]?.slice(-1)),
  }
}


export const addNatLangTemplateConstraint = (constraint) => {
  return {
    ...constraint,
    nat_lang_template: nat_lang_templates[constraint.constraint_type]
    .replaceAll("{1}", "''" + constraint.left_operand + "''")
    .replaceAll("{2}", "''" + constraint.right_operand + "''")
    .replaceAll('{n}', constraint.constraint_str?.split('[')[0]?.slice(-1)),
  }
}