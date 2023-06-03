const asyncHandler = require("express-async-handler");
const UberData = require("../models/uberData");
//@desc Get Sample Data
//@route GET /api/
const getData = asyncHandler(async (req,res) => {
    const uberData = await UberData.find();
    console.log(uberData)
    res.status(200).json(uberData);
});


module.exports = {getData};