const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    formConfigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FormConfig",
    },

    formTitle: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    totalSteps: {
      type: Number,
      required: true,
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

submissionSchema.index({ updatedAt: -1 });
submissionSchema.index({ formConfigId: 1 });
submissionSchema.index({ status: 1, updatedAt: -1 });

module.exports = mongoose.model("Submission", submissionSchema);