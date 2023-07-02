const mongoose = require('mongoose');
const UberData = require("./models/uberData");
const parseCSV = require('./mappingTable/locationIdToLatLong');
const axios = require('axios');


const CONNECTION_STRING = 'mongodb+srv://hackthon:hackthon@cluster0.gzafe90.mongodb.net/Uber_NYC?retryWrites=true&w=majority';
const googleMapAPIKey = 'AIzaSyAqxTIlZGOqKT95j1Xs3KAMjhnbgk9er_c';



// simulator settings
const MAX_ROWS = 10000;


const calculateDrivingTime = async (originLat, originLng, destinationLat, destinationLng) => {
  const apiKey = googleMapAPIKey; 
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLng}&destination=${destinationLat},${destinationLng}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const duration = response.data.routes[0].legs[0].duration.value; 
    const durationInMinutes = Math.ceil(duration / 60);

    return durationInMinutes;
  } catch (error) {
    console.error('Error calculating driving time:', error);
    throw error;
  }
};

const generateRandomData = async () => {
  const mappingTable = await parseCSV();
  const getRandomId = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const pickUpId = getRandomId(1, 263);
  const dropoffId = getRandomId(1, 263);

  const { pickUpLat, pickUpLong, dropoffLat, dropoffLong } = {
    pickUpLat: mappingTable[pickUpId].lat,
    pickUpLong: mappingTable[pickUpId].long,
    dropoffLat: mappingTable[dropoffId].lat,
    dropoffLong: mappingTable[dropoffId].long
  };

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
    const durationInMinutes = await calculateDrivingTime(pickUpLat, pickUpLong, dropoffLat, dropoffLong);

    const start = new Date(2021, 0, 1);
    const end = new Date(2021, 1, 1);
    const pickupTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    const dropoffTime = pickupTime + durationInMinutes * 60 * 1000;

    const randomUberData = {
      pickup_datetime: new Date(pickupTime),
      dropoff_datetime: new Date(dropoffTime),
      PULocationID: pickUpId,
      DOLocationID: dropoffId,
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
  } finally {
    mongoose.disconnect();
  }
};



const removeExcessRows = async () => {
  try {
    const rowCount = await UberData.countDocuments();

    if (rowCount > MAX_ROWS) {
      const oldestRows = await UberData.find({}, null, {
        sort: { pickup_datetime: 1 },
        limit: rowCount - MAX_ROWS
      });

      const oldestRowIds = oldestRows.map((row) => row._id);

      await UberData.deleteMany({ _id: { $in: oldestRowIds } });

      console.log(`Removed ${oldestRowIds.length} oldest rows.`);
    } else {
      console.log('Total row count does not exceed the maximum. No rows removed.');
    }
  } catch (error) {
    console.error('Error removing excess rows:', error);
  }
};


const runDataGeneration = (interval, rows) => {
  let start = new Date(2021, 0, 1);
  let end = new Date(2021, 1, 1);

  const generateAndRemoveRows = async () => {
    try {
      await mongoose.connect(CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });

      for (let i = 0; i < rows; i++) {
        const fakeUberData = new UberData(await generateRandomData(start, end));
        await fakeUberData.save();
      }

      console.log(`Generated ${rows} rows of fake data.`);

      await removeExcessRows();
    } catch (error) {
      console.error('Error generating and removing rows:', error);
    } finally {
      mongoose.disconnect();
    }

    // Move start and end dates by 1 day
    start.setDate(start.getDate() + 1);
    end.setDate(end.getDate() + 1);
  };

  generateAndRemoveRows();

  setInterval(() => {
    generateAndRemoveRows();
  }, interval);
};

runDataGeneration(2000, 1000);
// clearAllRows();
