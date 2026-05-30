const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    formConfigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FormConfig",
    },

    status: {
      type: String,
      enum: ["draft", "completed"],
      default: "draft",
    },

    currentStep: {
      type: Number,
      default: 1,
    },

    answers: {
      type: Map,
      of: String,
      default: {},
    },

    completedSteps: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Submission", submissionSchema);