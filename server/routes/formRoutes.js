const express = require("express");

const router = express.Router();

const {
  getFormConfig,
} = require("../controllers/formController");

router.get("/config", getFormConfig);

module.exports = router;