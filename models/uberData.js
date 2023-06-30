const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const uberDataSchema = new Schema({
    pickup_datetime:{
        type: Date,
        required: [true, "Please add a pickup_datetime"]
    },
    dropoff_datetime:{
        type: Date,
        required: [true, "Please add a dropoff_datetime"]
    },
    PULocationID:{
        type: Number,
        required: [true, "Please add a PULocationID"]
    },
    DOLocationID:{
        type: Number,
        required: [true, "Please add a DOLocationID"]
    },
    Hvfhs_license_num :{
        type: String,
        required: [true, "Please add a Hvfhs_license_num "]
    }
});

module.exports = mongoose.model("UberData", uberDataSchema, 'UberData');