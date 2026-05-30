const Submission = require("../models/Submission");
const FormConfig = require("../models/FormConfig");

const createSubmission = async (req, res) => {
  try {
    const formConfig = await FormConfig.findOne();

    if (!formConfig) {
      return res.status(404).json({
        message: "Form config not found",
      });
    }

    const submission = await Submission.create({
      formConfigId: formConfig._id,
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
    const submissions = await Submission.find()
      .sort({ updatedAt: -1 });

    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(
      req.params.id
    );

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
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

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

module.exports = {
  createSubmission,
  getSubmissions,
  getSubmissionById,
  updateSubmission
};