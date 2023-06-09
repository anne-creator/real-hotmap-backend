const asyncHandler = require("express-async-handler");
const UberData = require("../models/uberData");

//@desc Get Sample Data
//@route GET /api/
const getData = async (req,res) => {
    const uberData = await UberData.find().limit(50);
    console.log(uberData)
    res.status(200).json(uberData);
     
};


module.exports = {getData};