// Server-side form validation. Mirrors the client's field rules so the API
// stays the source of truth and cannot be bypassed by direct requests.

// Returns an error message for a single field, or "" when the value is valid.
const countWords = (value) =>
  value
    .split(/\s+/)
    .filter((segment) => /[\p{L}]/u.test(segment)).length;

const validateField = (field, rawValue) => {
  const value = (rawValue ?? "").toString().trim();

  if (field.required && !value) {
    return `${field.label} is required`;
  }

  if (!value) {
    return "";
  }

  const rules = field.validation || {};

  if (rules.minLength && value.length < rules.minLength) {
    return `${field.label} must be at least ${rules.minLength} characters`;
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    return `${field.label} must be at most ${rules.maxLength} characters`;
  }

  if (rules.minWords && countWords(value) < rules.minWords) {
    return (
      rules.message ||
      `${field.label} must contain at least ${rules.minWords} word${
        rules.minWords === 1 ? "" : "s"
      }`
    );
  }

  if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
    return rules.message || `${field.label} is invalid`;
  }

  if (
    (field.type === "select" || field.type === "radio") &&
    Array.isArray(field.options) &&
    !field.options.includes(value)
  ) {
    return `Please select a valid ${field.label}`;
  }

  return "";
};

// Returns true when every field in a step passes validation.
const isStepValid = (step, answers) => {
  if (!step || !Array.isArray(step.fields)) return false;
  return step.fields.every((field) => !validateField(field, answers[field.id]));
};

// Returns the list of step ids that are fully valid (i.e. completed).
const getCompletedSteps = (formConfig, answers = {}) => {
  if (!formConfig || !Array.isArray(formConfig.steps)) return [];
  return formConfig.steps
    .filter((step) => isStepValid(step, answers))
    .map((step) => step.id);
};

// Validates every field across all steps. Returns a map of { fieldId: message }.
const validateAllFields = (formConfig, answers = {}) => {
  const errors = {};
  if (!formConfig || !Array.isArray(formConfig.steps)) return errors;

  formConfig.steps.forEach((step) => {
    (step.fields || []).forEach((field) => {
      const message = validateField(field, answers[field.id]);
      if (message) {
        errors[field.id] = message;
      }
    });
  });

  return errors;
};

module.exports = {
  validateField,
  isStepValid,
  getCompletedSteps,
  validateAllFields,
};
