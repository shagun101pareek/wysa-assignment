const mongoose = require("mongoose");

const Submission = require("../models/Submission");
const FormConfig = require("../models/FormConfig");
const {
  getCompletedSteps,
  validateAllFields,
} = require("../utils/validation");

const VALID_STATUSES = ["draft", "completed"];

const createSubmission = async (req, res) => {
  try {
    const formConfig = await FormConfig.findOne();

    if (!formConfig || !Array.isArray(formConfig.steps) || formConfig.steps.length === 0) {
      return res.status(500).json({
        message: "Form configuration is missing or broken",
      });
    }

    const providedTitle = (req.body.title || "").trim();

    let title = providedTitle;
    if (!title) {
      const count = await Submission.countDocuments({
        formConfigId: formConfig._id,
      });
      title = `${formConfig.title} #${count + 1}`;
    }

    const submission = await Submission.create({
      formConfigId: formConfig._id,
      formTitle: formConfig.title,
      title,
      totalSteps: formConfig.steps.length,
      status: "draft",
      currentStep: 1,
      answers: {},
      completedSteps: [],
    });

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ updatedAt: -1 });

    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getSubmissionById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid submission id" });
    }

    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        message: "Submission not found",
      });
    }

    res.status(200).json(submission);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateSubmission = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid submission id" });
    }

    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        message: "Submission not found",
      });
    }

    const formConfig = await FormConfig.findById(submission.formConfigId);

    if (!formConfig || !Array.isArray(formConfig.steps) || formConfig.steps.length === 0) {
      return res.status(500).json({
        message: "Form configuration is missing or broken",
      });
    }

    const totalSteps = formConfig.steps.length;

    let answers;
    if (req.body.answers !== undefined) {
      if (
        typeof req.body.answers !== "object" ||
        req.body.answers === null ||
        Array.isArray(req.body.answers)
      ) {
        return res.status(400).json({ message: "Invalid answers payload" });
      }
      answers = req.body.answers;
    } else {
      answers = Object.fromEntries(submission.answers || []);
    }

    if (req.body.currentStep !== undefined) {
      const step = Number(req.body.currentStep);
      if (!Number.isInteger(step) || step < 1 || step > totalSteps) {
        return res.status(400).json({ message: "Invalid step" });
      }
      submission.currentStep = step;
    }

    let nextStatus = submission.status;
    if (req.body.status !== undefined) {
      if (!VALID_STATUSES.includes(req.body.status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      nextStatus = req.body.status;
    }

    if (nextStatus === "completed") {
      const errors = validateAllFields(formConfig, answers);
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          message: "Cannot complete: some fields are invalid",
          errors,
        });
      }
    }

    if (req.body.title !== undefined) {
      const title = String(req.body.title).trim();
      if (title) submission.title = title;
    }

    submission.answers = answers;
    submission.completedSteps = getCompletedSteps(formConfig, answers);
    submission.status = nextStatus;

    if (!submission.totalSteps) submission.totalSteps = totalSteps;
    if (!submission.formTitle) submission.formTitle = formConfig.title;
    if (!submission.title) submission.title = formConfig.title;

    await submission.save();

    res.status(200).json(submission);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createSubmission,
  getSubmissions,
  getSubmissionById,
  updateSubmission,
};
