const mongoose = require('mongoose');
const UberData = require("./models/uberData");
const parseCSV = require('./mappingTable/locationIdToLatLong');
const axios = require('axios');


const CONNECTION_STRING = 'mongodb+srv://hackthon:hackthon@cluster0.gzafe90.mongodb.net/Uber_NYC?retryWrites=true&w=majority';


// simulator settings

const manhattanIntervals = {
  minLat: 40.710796,
  maxLat: 40.755940,
  minLong: -74.004694,
  maxLong: -73.975159
};

const newJerseyIntervals = {
  minLat: 40.713678,
  maxLat: 40.730874,
  minLong: -74.053115,
  maxLong: -74.036636
};

const brooklynIntervals = {
  minLat: 40.676963,
  maxLat: 40.698823,
  minLong: -73.996323,
  maxLong: -73.974395
};

const queenIntervals = {
  minLat: 40.661103,
  maxLat: 40.749786,
  minLong: -73.866314,
  maxLong: -73.717254
};

const newarkIntervals = {
  minLat: 40.691223,
  maxLat: 40.779951,
  minLong: -74.234734,
  maxLong: -74.140345
};




// const calculateDrivingTime = async (originLat, originLng, destinationLat, destinationLng) => {
//   const apiKey = googleMapAPIKey;
//   const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLng}&destination=${destinationLat},${destinationLng}&key=${apiKey}`;

//   try {
//     const response = await axios.get(url);
//     console.log(response.data);
//     const duration = response.data.routes[0].legs[0].duration.value;
//     const durationInMinutes = Math.ceil(duration / 60);

//     return durationInMinutes;
//   } catch (error) {
//     console.error('Error calculating driving time:', error);
//     throw error;
//   }
// };

const calculateDrivingDuration = (pickupLat, pickupLng, dropoffLat, dropoffLng) => {
  const R = 6371; // Radius of the Earth in kilometers
  const lat1 = toRadians(pickupLat);
  const lat2 = toRadians(dropoffLat);
  const latDiff = toRadians(dropoffLat - pickupLat);
  const lngDiff = toRadians(dropoffLng - pickupLng);

  // Haversine formula
  const a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(lngDiff / 2) * Math.sin(lngDiff / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance between pickup and dropoff in kilometers

  // Calculate estimated trip duration
  const speed = 10; // Fixed speed in km/h
  const duration = distance / speed; // Trip duration in hours
  // Convert duration to minutes
  const durationInMinutes = duration * 60;

  return Math.ceil(durationInMinutes);
};

const toRadians = (angle) => {
  return angle * (Math.PI / 180);
};

const generateRandomData = async (start, end) => {
  const getRandomCoordinate = (minLat, maxLat, minLong, maxLong) => {
    const lat = Math.random() * (maxLat - minLat) + minLat;
    const long = Math.random() * (maxLong - minLong) + minLong;
    return { lat, long };
  };

  const getRandomDensity = () => {
    return Math.random();
  };

  const locations = [manhattanIntervals, newJerseyIntervals, brooklynIntervals, queenIntervals, newarkIntervals];
  const randomLocation = locations[Math.floor(Math.random() * locations.length)];
  const { minLat, maxLat, minLong, maxLong } = randomLocation;

  const { lat: pickupLat, long: pickupLong } = getRandomCoordinate(minLat, maxLat, minLong, maxLong);
  const { lat: dropoffLat, long: dropoffLong } = getRandomCoordinate(minLat, maxLat, minLong, maxLong);


  const getRandomPlate = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  try {
    const durationInMinutes = calculateDrivingDuration(pickupLat, pickupLong, dropoffLat, dropoffLong);
    const pickupTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    const dropoffTime = pickupTime + durationInMinutes * 60 * 1000;

    const randomUberData = {
      pickup_datetime: new Date(pickupTime),
      dropoff_datetime: new Date(dropoffTime),
      pickup_lat: pickupLat,
      pickup_long: pickupLong,
      dropoff_lat: dropoffLat,
      dropoff_long: dropoffLong,
      density: getRandomDensity(),
      Hvfhs_license_num: getRandomPlate(6)
    };

    return randomUberData;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const clearAllRows = async () => {
  try {
    await mongoose.connect(CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    await UberData.deleteMany({});

    console.log('All rows cleared from the collection.');
  } catch (error) {
    console.error('Error clearing rows:', error);
  } 
};

const removeExcessRows = async () => {
  try {
    const currentTime = new Date();
    const fifteenMinutesAgo = new Date(currentTime.getTime() - 15 * 60 * 1000);

    await mongoose.connect(CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await UberData.deleteMany({ pickup_datetime: { $lt: fifteenMinutesAgo } });

    console.log('Removed excess rows older than 15 minutes.');
  } catch (error) {
    console.error('Error removing excess rows:', error);
  }
};


const runDataGeneration = (interval, rows) => {
  console.log("start generating data");
  let start = new Date(Date.now());
  console.log(start);


  let isGenerating = false;
  const generateAndRemoveRows = async () => {
    if (isGenerating) return;

    isGenerating = true;

    try {
      await mongoose.connect(CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });

      for (let i = 0; i < rows; i++) {
        const fakeUberData = new UberData(await generateRandomData(start, start));
        // console.log(fakeUberData);
        await fakeUberData.save();
      }

      console.log(`Generated ${rows} rows of fake data.`);

      await removeExcessRows();
    } catch (error) {
      console.error('Error generating and removing rows:', error);
    } finally {
      // mongoose.disconnect();
      isGenerating = false;

    }

    // Move start and end dates by 1 day
    // start.setDate(start.getDate() + 2);
    // end.setDate(end.getDate() + 2);
  };

  // Start the interval
  const simulatorInterval = setInterval(generateAndRemoveRows, interval);

  return simulatorInterval;
};




// runDataGeneration(1000, 5);
// clearAllRows();

module.exports = { runDataGeneration, clearAllRows,  };