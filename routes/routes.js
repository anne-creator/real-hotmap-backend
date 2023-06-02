const express = require("express");
const router = express.Router();
const {getData} = require("../controller/hotmapController");

router.route("/").get(getData);

module.exports = router;