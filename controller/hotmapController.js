const asyncHandler = require("express-async-handler");
const UberData = require("../models/uberData");
const getMappingTable = require("../mappingTable/locationIdToLatLong");
const {BigQuery} = require('@google-cloud/bigquery');
const bigquery = new BigQuery();
//@desc Get Sample Data
//@route GET /api/
const getPickupData = async (req, res) => {
  try {
    const uberData = await UberData.find();
    const transformedData = uberData.map((data) => {
      return {
        pickup_datetime: data.pickup_datetime,
        dropoff_datetime: data.dropoff_datetime,
        pickup_lat: data.pickup_lat,
        pickup_long: data.pickup_long,
        dropoff_lat: data.dropoff_lat,
        dropoff_long: data.dropoff_long,
        density: data.density,
        Hvfhs_license_num: data.Hvfhs_license_num,
      };
    });

    res.json(transformedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const getPastData = asyncHandler(async (req,res) => {

  const start = new Date(req.query.timeStamp);
  const end = new Date(req.query.timeStamp);
  end.setMinutes(end.getMinutes() + 10)
  console.log( start);
  console.log( end);
  const query = `SELECT *
  FROM \`perceptive-day-388607.mangoDb_change_stream.mongoDb_change_stream\` 
  WHERE pickup_datetime >= '${start.toISOString()}'
  AND pickup_datetime <= '${end.toISOString()}'
  `;
  console.log(query)
  const options = {
      query: query,
      location: 'northamerica-northeast2',
    };
    const [job] = await bigquery.createQueryJob(options);
    console.log(`Job ${job.id} started.`);
    const [rows] = await job.getQueryResults();
    console.log('Rows:');
    rows.forEach(row => console.log(row));
    res.status(200).json(rows);
});



// Helper function to format date and time
const formatDate = (date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

// Helper function to pad numbers with leading zeros
const padNumber = (number) => {
  return String(number).padStart(5, "0");
};


const getData = asyncHandler(async (req,res) => {

  const query = `SELECT *
  FROM \`perceptive-day-388607.mangoDb_change_stream.mongoDb_change_stream\``;
  const options = {
      query: query,
      location: 'northamerica-northeast2',
    };
    const [job] = await bigquery.createQueryJob(options);
    console.log(`Job ${job.id} started.`);
    const [rows] = await job.getQueryResults();
    console.log('Rows:');
    rows.forEach(row => console.log(row));
    res.status(200).json(rows);
});



module.exports = {getData, getPickupData, getPastData};