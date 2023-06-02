const asyncHandler = require("express-async-handler")

//@desc Get Sample Data
//@route GET /api/
const getData = asyncHandler(async (req,res) => {
    console.log(res)
    res.status(200).json({message: "this is for test purpose"});
});


module.exports = {getData};