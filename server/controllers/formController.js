const FormConfig = require("../models/FormConfig");

const getFormConfig = async (req, res) => {
  try {
    const formConfig = await FormConfig.findOne();

    if (!formConfig) {
      return res.status(404).json({
        message: "Form configuration not found",
      });
    }

    res.status(200).json(formConfig);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getFormConfig,
};