const fs = require('fs');
const csv = require('csv-parser');

const locationId = [];
const lat = [];
const long = [];
const mappingTable = {};

const parseCSV = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream('processed_data-v1.csv')
      .pipe(csv())
      .on('data', (data) => {
        const id = data['LocationID'];
        const latitude = data['Latitude'];
        const longitude = data['Longitude'];

        locationId.push(id);
        lat.push(latitude);
        long.push(longitude);

        mappingTable[id] = { lat: latitude, long: longitude };
      })
      .on('end', () => {
        resolve(mappingTable);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

module.exports = parseCSV;