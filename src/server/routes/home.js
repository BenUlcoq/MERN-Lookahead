const express = require("express")
const router = express.Router()

// Landing Page Route
router.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = router