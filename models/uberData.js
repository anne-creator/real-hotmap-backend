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
    pickup_lat:{
        type: Number,
        required: [true, "Please add a pickup_lat"]
    },
    pickup_long:{
        type: Number,
        required: [true, "Please add a pickup_long"]
    },
    dropoff_lat:{
        type: Number,
        required: [true, "Please add a dropoff_lat"]
    },
    dropoff_long:{
        type: Number,
        required: [true, "Please add a dropoff_long"]
    },
    Hvfhs_license_num :{
        type: String,
        required: [true, "Please add a Hvfhs_license_num "]
    }
});

module.exports = mongoose.model("UberData", uberDataSchema, 'UberData');