const mongoose = require("mongoose");
require("dotenv").config();

const FormConfig = require("../models/FormConfig");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    await FormConfig.deleteMany({});

    await FormConfig.create({
      title: `${submission.formTitle} #${count + 1}`,

      description:
        "Help us understand your wellness preferences",

      steps: [
        {
          id: "personal-info",
          title: "Personal Information",

          fields: [
            {
              id: "fullName",
              label: "Full Name",
              type: "text",
              required: true,
            },
            {
              id: "age",
              label: "Age",
              type: "text",
              required: true,
            },
            {
              id: "gender",
              label: "Gender",
              type: "select",
              required: true,
              options: ["Male", "Female", "Don't want to disclose"],
            },
          ],
        },

        {
          id: "wellness-preferences",
          title: "Wellness Preferences",

          fields: [
            {
              id: "primaryGoal",
              label: "Primary Goal",
              type: "select",
              required: true,
              options: [
                "Reduce Stress",
                "Improve Sleep",
                "Build Habits",
                "Improve Focus",
              ],
            },

            {
              id: "supportType",
              label: "Preferred Support Type",
              type: "radio",
              required: true,
              options: [
                "Guided Exercises",
                "Chat Support",
                "Self Reflection",
              ],
            },

            {
              id: "notes",
              label: "Additional Notes",
              type: "text",
              required: false,
            },
          ],
        },

        {
          id: "availability",
          title: "Availability",

          fields: [
            {
              id: "preferredTime",
              label: "Preferred Time",
              type: "select",
              required: true,
              options: ["Morning", "Afternoon", "Evening"],
            },

            {
              id: "contactMethod",
              label: "Preferred Contact Method",
              type: "radio",
              required: true,
              options: ["Email", "Phone", "Chat"],
            },

            {
              id: "details",
              label: "Additional Details",
              type: "text",
              required: false,
            },
          ],
        },
      ],
    });

    console.log("Form Config Seeded");

    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });