const express = require("express");
const app = express();

const data = [
  {
    _id: 1,
    body: "body 111",
  },
  {
    _id: 2,
    body: "body 222",
  },
];

app.get("/data", (req, res) => {
  res.send(JSON.stringify(data));
});

app.listen(8089, () => {
  console.log("Server started");
});

/*
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const csvWriter = createObjectCsvWriter({
    path: 'geodata.csv',
    header: [
        { id: 'timestamp', title: 'Timestamp' },
        { id: 'service', title: 'Service' },
        { id: 'country', title: 'Country' },
        { id: 'region', title: 'Region' },
        { id: 'kladr_region', title: 'Kladr Region' },
        { id: 'city', title: 'City' }
    ],
    append: true
});

app.post('/log', (req, res) => {
    const geoData = {
        timestamp: new Date().toISOString(),
        service: req.body.service,
        country: req.body.country,
        region: req.body.region,
        kladr_region: req.body.kladr_region,
        city: req.body.city
    };

    csvWriter.writeRecords([geoData])
        .then(() => {
            console.log('Data logged:', geoData);
            res.status(200).send('Data logged');
        })
        .catch(error => {
            console.error('Error writing to CSV', error);
            res.status(500).send('Error logging data');
        });
});

app.listen(port, () => {
    console.log(Server running at http://localhost:${port}/);
});
*/
