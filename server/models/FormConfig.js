const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema({
  id: String,
  label: String,
  type: {
    type: String,
    enum: ["text", "select", "radio"],
  },
  required: Boolean,
  options: [String],
});

const stepSchema = new mongoose.Schema({
  id: String,
  title: String,
  fields: [fieldSchema],
});

const formConfigSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    steps: [stepSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FormConfig", formConfigSchema);