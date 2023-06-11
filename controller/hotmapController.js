const asyncHandler = require("express-async-handler");
const UberData = require("../models/uberData");

const getMappingTable = require("../mappingTable/locationIdToLatLong");
//@desc Get Sample Data
//@route GET /api/
const getPickupData = async (req, res) => {
  const uberData = await UberData.find();
  // Count the occurrences of each locationId
  const locationCounts = uberData.reduce((counts, data) => {
    const locationId = data.PULocationID;
    counts[locationId] = (counts[locationId] || 0) + 1;
    return counts;
  }, {});

  const mappingTable = await getMappingTable();

  const totalDataCount = uberData.length;
  let maxDensity = 0;
  for (const locationId in locationCounts) {
    const density = locationCounts[locationId] / totalDataCount;
    if (density > maxDensity) {
      maxDensity = density;
    }
  }

  const transformedData = uberData.map((data, index) => {
    const formattedTime = formatDate(data.pickup_datetime);
    const locationId = data.PULocationID;
    const density = locationCounts[locationId] / totalDataCount;

    const { lat, long } = mappingTable[locationId];
    // Apply scaling factor to density
    // const scalingFactor = 10; // Adjust this value to control the scaling
    const scaledDensity = density / maxDensity;

    return {
      id: `nyk${padNumber(index + 1)}`, // Auto-incrementing ID
      time: formattedTime,
      density: scaledDensity,
      lat: lat,
      long: long,
      type: "pickup",
      // locationId: locationId, // Matches PULocationID
    };
  });

  const jsonResult = transformedData

  return JSON.stringify(jsonResult)
};

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

module.exports = { getPickupData };

