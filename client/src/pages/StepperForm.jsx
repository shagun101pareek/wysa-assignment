import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Navbar from "../components/Navbar";

//Validation
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

function StepperForm() {
  const { id } = useParams();
  const location = useLocation();
  const isNew = id === "new";
  const initialTitle = location.state?.title || "";

  const [formConfig, setFormConfig] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const [submissionId, setSubmissionId] = useState(isNew ? null : id);

  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [submission, setSubmission] = useState(null);

  const [isDirty, setIsDirty] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [pendingPath, setPendingPath] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchFormConfig();
    if (!isNew) {
      fetchSubmission();
    }
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const fetchFormConfig = async () => {
    const response = await api.get("/forms/config");
    setFormConfig(response.data);
  };

  const fetchSubmission = async () => {
    try {
      const response = await api.get(`/submissions/${submissionId}`);

      setSubmission(response.data);

      if (response.data.answers) {
        setAnswers(response.data.answers);
      }

      if (response.data.currentStep) {
        setCurrentStep(response.data.currentStep - 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const setFieldValue = (fieldId, value) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
    setIsDirty(true);

    setErrors((prev) => {
      if (!prev[fieldId]) return prev;
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
  };

  const validateStep = (stepIndex) => {
    const step = formConfig.steps[stepIndex];
    if (!step) return true;

    const stepErrors = {};
    step.fields.forEach((field) => {
      const message = validateField(field, answers[field.id]);
      if (message) {
        stepErrors[field.id] = message;
      }
    });

    setErrors((prev) => {
      const next = { ...prev };
      step.fields.forEach((field) => delete next[field.id]);
      return { ...next, ...stepErrors };
    });

    return Object.keys(stepErrors).length === 0;
  };

  const firstInvalidStep = () => {
    const allErrors = {};
    let invalidStep = -1;

    formConfig.steps.forEach((step, index) => {
      step.fields.forEach((field) => {
        const message = validateField(field, answers[field.id]);
        if (message) {
          allErrors[field.id] = message;
          if (invalidStep === -1) invalidStep = index;
        }
      });
    });

    setErrors(allErrors);
    return invalidStep;
  };

  const saveSubmission = async ({ status, step }) => {
    try {
      let sid = submissionId;

      if (!sid) {
        const created = await api.post("/submissions", {
          title: initialTitle,
        });
        sid = created.data._id;
        setSubmissionId(sid);
        navigate(`/submit/${sid}`, {
          replace: true,
          state: { title: initialTitle },
        });
      }

      const response = await api.patch(`/submissions/${sid}`, {
        answers,
        currentStep: step,
        status,
      });

      setSubmission(response.data);
      setIsDirty(false);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const requestLeave = (path) => {
    if (isDirty) {
      setPendingPath(path);
      setLeaveOpen(true);
    } else {
      navigate(path);
    }
  };

  const saveDraftAndLeave = async () => {
    const saved = await saveSubmission({
      status: "draft",
      step: currentStep + 1,
    });
    setLeaveOpen(false);
    if (saved) navigate(pendingPath || "/");
  };

  const discardAndLeave = () => {
    setIsDirty(false);
    setLeaveOpen(false);
    navigate(pendingPath || "/");
  };

  const cancelLeave = () => {
    setLeaveOpen(false);
    setPendingPath(null);
  };

  const saveDraft = async () => {
    const saved = await saveSubmission({
      status: "draft",
      step: currentStep + 1,
    });
    if (saved) alert("Draft Saved");
  };

  const goToPrevious = () => {
    if (currentStep === 0) return;
    setCurrentStep((prev) => prev - 1);
  };

  const goToNext = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep((prev) => prev + 1);
  };

  const submitForm = async () => {
    const invalidStep = firstInvalidStep();

    if (invalidStep !== -1) {
      setCurrentStep(invalidStep);
      return;
    }

    const saved = await saveSubmission({
      status: "completed",
      step: formConfig.steps.length,
    });
    if (saved) {
      navigate("/", { state: { toast: "Form submitted successfully" } });
    }
  };

  if (!formConfig) {
    return <h2 className="loading-text">Loading...</h2>;
  }

  const step = formConfig.steps[currentStep];
  const isLastStep = currentStep === formConfig.steps.length - 1;

  return (
    <>
      <Navbar onBrandClick={() => requestLeave("/")} />
      <div className="dashboard-wrapper">
        <div className="back-bar">
          <button className="back-btn" onClick={() => requestLeave("/")}>
            <ArrowBackIcon />
            Back to Dashboard
          </button>
        </div>

        <div className="form-container">
          <div className="form-title-row">
            <h1 className="form-title">
              {submission?.title || initialTitle || formConfig.title}
            </h1>
            {isDirty && <span className="unsaved-pill">Unsaved changes</span>}
          </div>
          {(submission?.title || initialTitle) && (
            <p className="form-subtitle">{formConfig.title}</p>
          )}

          <div className="stepper">
            {formConfig.steps.map((s, index) => {
              const stateClass =
                index === currentStep
                  ? "stepper__step--active"
                  : index < currentStep
                    ? "stepper__step--completed"
                    : "";

              return (
                <div className="stepper__row" key={s.id}>
                  <div className={`stepper__step ${stateClass}`}>
                    <span className="stepper__circle">{index + 1}</span>
                    <span className="stepper__label">{s.title}</span>
                  </div>
                  {index < formConfig.steps.length - 1 && (
                    <span className="stepper__connector" />
                  )}
                </div>
              );
            })}
          </div>

          <h2 className="step-title">{step.title}</h2>

          <div className="form-fields">
            {step.fields.map((field) => {
              const error = errors[field.id];
              const fieldClass = `form-field ${error ? "form-field--error" : ""}`;
              const value = answers[field.id] || "";

              if (field.type === "text") {
                return (
                  <div className={fieldClass} key={field.id}>
                    <label className="form-label" htmlFor={field.id}>
                      {field.label}
                      {field.required && <span className="required-mark">*</span>}
                    </label>
                    <input
                      id={field.id}
                      className="form-input"
                      type="text"
                      value={value}
                      onChange={(e) => setFieldValue(field.id, e.target.value)}
                    />
                    {error && <span className="form-error">{error}</span>}
                  </div>
                );
              }

              if (field.type === "select") {
                return (
                  <div className={fieldClass} key={field.id}>
                    <label className="form-label" htmlFor={field.id}>
                      {field.label}
                      {field.required && <span className="required-mark">*</span>}
                    </label>
                    <select
                      id={field.id}
                      className="form-select"
                      value={value}
                      onChange={(e) => setFieldValue(field.id, e.target.value)}
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {error && <span className="form-error">{error}</span>}
                  </div>
                );
              }

              if (field.type === "radio") {
                return (
                  <div className={fieldClass} key={field.id}>
                    <span className="form-label">
                      {field.label}
                      {field.required && <span className="required-mark">*</span>}
                    </span>
                    <div className="radio-group">
                      {field.options.map((option) => (
                        <label className="radio-option" key={option}>
                          <input
                            type="radio"
                            name={field.id}
                            value={option}
                            checked={value === option}
                            onChange={(e) =>
                              setFieldValue(field.id, e.target.value)
                            }
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                    {error && <span className="form-error">{error}</span>}
                  </div>
                );
              }

              return null;
            })}
          </div>

          <div className="form-actions">
            <button
              className="btn btn--outline"
              disabled={currentStep === 0}
              onClick={goToPrevious}
            >
              Previous
            </button>

            <div className="form-actions__right">
              <button className="btn btn--outline" onClick={saveDraft}>
                Save Draft
              </button>

              {isLastStep ? (
                <button className="btn btn--success" onClick={submitForm}>
                  Submit Form
                </button>
              ) : (
                <button className="btn btn--primary" onClick={goToNext}>
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {leaveOpen && (
        <div className="modal-overlay" onClick={cancelLeave}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal__title">Unsaved changes</h2>
            <p className="modal__subtitle">
              You have changes on this step that haven&apos;t been saved. Would
              you like to save them as a draft before leaving?
            </p>

            <div className="modal__actions modal__actions--split">
              <button className="btn btn--outline" onClick={discardAndLeave}>
                Don't save
              </button>
              <div className="modal__actions-right">
                <button className="btn btn--outline" onClick={cancelLeave}>
                  Cancel
                </button>
                <button
                  className="btn btn--primary"
                  onClick={saveDraftAndLeave}
                >
                  Save as draft
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StepperForm;
