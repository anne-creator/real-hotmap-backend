const asyncHandler = require("express-async-handler");
const UberData = require("../models/uberData");
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
  
    const totalDataCount = uberData.length;
  
    const transformedData = uberData.map((data, index) => {
      const formattedTime = formatDate(data.pickup_datetime);
      
      const locationId = data.PULocationID;
  
      const density = locationCounts[locationId] / totalDataCount;
  
      return {
        type: "Feature",
        properties: {
          id: `nyk${padNumber(index + 1)}`, // Auto-incrementing ID
          time: formattedTime,
          density: density,
        },
        geometry: {
          type: "Point",
          locationId: locationId, // Matches PULocationID
        },
      };
    });
  
    const jsonResult = {
      type: "FeatureCollection",
      crs: {
        type: "name",
        properties: {
          name: "urn:ogc:def:crs:OGC:1.3:CRS84",
        },
      },
      features: transformedData,
    };
  
    res.status(200).json(jsonResult);
  };
  
  // Helper function to format date and time
  const formatDate = (date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");
    console.log("date", date)
    console.log("year", year)
    console.log("month", month)
    console.log("day", day)
    console.log("hours", hours)
    console.log("minutes", minutes)
    console.log("seconds", seconds)
  
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  };
  
  // Helper function to pad numbers with leading zeros
  const padNumber = (number) => {
    return String(number).padStart(5, "0");
  };
  
  module.exports = { getPickupData };
  