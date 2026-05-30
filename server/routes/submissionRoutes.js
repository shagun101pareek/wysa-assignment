const express = require("express");

const {
  createSubmission,
  getSubmissions,
  getSubmissionById,
  updateSubmission,
} = require("../controllers/submissionController");

const router = express.Router();

router.post("/", createSubmission);

router.get("/", getSubmissions);

router.get("/:id", getSubmissionById);

router.patch("/:id", updateSubmission);

module.exports = router;