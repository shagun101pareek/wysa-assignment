import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

import {
  Box,
  Paper,
  TextField,
  Button,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import Navbar from "../components/Navbar";
import Text from "../components/Text";

function StepperForm() {
  const { id } = useParams();
  const [formConfig, setFormConfig] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const [answers, setAnswers] = useState({});
  const [submission, setSubmission] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
  fetchFormConfig();
  fetchSubmission();
}, []);

  const fetchFormConfig = async () => {
    const response = await api.get("/forms/config");
    setFormConfig(response.data);
  };

  const fetchSubmission = async () => {
  try {
    const response = await api.get(`/submissions/${id}`);

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
  const saveDraft = async () => {
  try {
    await api.patch(`/submissions/${id}`, {
      answers,
      currentStep: currentStep + 1,
      status: "draft",
    });

    alert("Draft Saved");
  } catch (error) {
    console.error(error);
  }
};
const submitForm = async () => {
  try {
    await api.patch(`/submissions/${id}`, {
      answers,
      currentStep: formConfig.steps.length,
      status: "completed",
    });

    navigate("/");
  } catch (error) {
    console.error(error);
  }
};

  if (!formConfig) {
    return <Text component="h2" className="loading-text">Loading...</Text>;
  }

  const step = formConfig.steps[currentStep];

  return (
    <>
    <Navbar />
    <Box className="dashboard-wrapper">
      <Paper className="form-container">
        <Text className="form-title">
          {formConfig.title}
        </Text>

        <Stepper
          activeStep={currentStep}
          sx={{ mb: 5 }}
        >
          {formConfig.steps.map((step) => (
            <Step key={step.id}>
              <StepLabel>{step.title}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Text className="step-title">
          {step.title}
        </Text>

        <Stack spacing={3}>
          {step.fields.map((field) => {
            if (field.type === "text") {
              return (
                <TextField
  key={field.id}
  label={field.label}
  fullWidth
  value={answers[field.id] || ""}
  onChange={(e) =>
    setAnswers({
      ...answers,
      [field.id]: e.target.value,
    })
  }
/>
              );
            }

            if (field.type === "select") {
              return (
                <TextField
  key={field.id}
  select
  label={field.label}
  fullWidth
  value={answers[field.id] || ""}
  onChange={(e) =>
    setAnswers({
      ...answers,
      [field.id]: e.target.value,
    })
  }
>
                  {field.options.map((option) => (
                    <MenuItem
                      key={option}
                      value={option}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              );
            }
            if (field.type === "radio") {
  return (
    <Box key={field.id}>
      <FormLabel>
        {field.label}
      </FormLabel>

      <RadioGroup
        value={answers[field.id] || ""}
        onChange={(e) =>
          setAnswers({
            ...answers,
            [field.id]: e.target.value,
          })
        }
      >
        {field.options.map((option) => (
          <FormControlLabel
            key={option}
            value={option}
            control={<Radio />}
            label={option}
          />
        ))}
      </RadioGroup>
    </Box>
  );
}

            return null;
          })}
        </Stack>

        <Stack
  className="form-actions"
  direction="row"
  justifyContent="space-between"
>
            <Button
  variant="outlined"
  onClick={saveDraft}
>
  Save Draft
</Button>
          <Button
            disabled={currentStep === 0}
            onClick={() => {
  if (!validateStep()) return;

  setCurrentStep((prev) => prev + 1);
}}
          >
            Previous
          </Button>

          {currentStep === formConfig.steps.length - 1 ? (
  <Button
    variant="contained"
    color="success"
    onClick={submitForm}
  >
    Submit Form
  </Button>
) : (
  <Button
    variant="contained"
    onClick={async () => {
      const nextStep = currentStep + 1;

      setCurrentStep(nextStep);

      await api.patch(`/submissions/${id}`, {
        answers,
        currentStep: nextStep + 1,
        status: "draft",
      });
    }}
  >
    Next
  </Button>
)}
        </Stack>
      </Paper>
    </Box>
    </>
  );
}


export default StepperForm;