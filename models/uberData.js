const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const uberDataSchema = new Schema({
    hvfhs_license_num:{
        type: String,
        required: [true, "Please add a hvfhs_license_num"]
    },
    dispatching_base_num:{
        type: String
    },
    originating_base_num:{
        type: String
    },
    request_datetime:{
        type: Date
    },
    on_scene_datetime:{
        type: Date
    },
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
    trip_miles:{
        type: Number,
        required: [true, "Please add a trip_miles"]
    },
    trip_time:{
        type: Number
    },
    base_passenger_fare:{
        type: Number
    },
    tolls:{
        type: Number
    },
    bcf:{
        type: Number
    },
    sales_tax:{
        type: Number
    },
    congestion_surcharge:{
        type: Number
    },
    airport_fee:{
        type: Number
    },
    tips:{
        type: Number
    },
    driver_pay:{
        type: Number
    },
    shared_request_flag:{
        type: String
    },
    shared_match_flag:{
        type: String
    },
    access_a_ride_flag:{
        type: String
    },
    wav_request_flag:{
        type: String
    },
    wav_match_flag:{
        type: String
    }
});

module.exports = mongoose.model("UberData", uberDataSchema, 'UberData');