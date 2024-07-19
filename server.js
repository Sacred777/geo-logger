/*
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
*/

const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const { createObjectCsvWriter } = require("csv-writer");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 8089;

const bySite = true; // true, если нужно добавлять домен сайта к названию файла
const byDate = true; // true, если нужно добавлять текущую дату к названию файла

app.use(bodyParser.json());
app.use(cors()); // включение CORS

const reportsDir = path.join(__dirname, "reports");
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir);
}

app.post("/log", (req, res) => {
  const timestamp = new Date();
  const date = `${String(timestamp.getDate()).padStart(2, "0")}.${String(timestamp.getMonth() + 1).padStart(2, "0")}.${timestamp.getFullYear()}`;
  const time = `${String(timestamp.getHours()).padStart(2, "0")}:${String(timestamp.getMinutes()).padStart(2, "0")}:${String(timestamp.getSeconds()).padStart(2, "0")}`;
  const dateForFileName = `${timestamp.getFullYear()}${String(timestamp.getMonth() + 1).padStart(2, "0")}${String(timestamp.getDate()).padStart(2, "0")}`;
  const domain = req.body.domain;
  const userAgent = req.body.user_agent;

  const geoData = {
    date,
    time,
    // timestamp: timestamp,
    service: req.body.service,
    country: req.body.country,
    region: req.body.region,
    kladr_region: req.body.kladr_region,
    city: req.body.city,
    user_agent: userAgent,
  };

  let fileName = "";
  if (bySite) fileName += `${domain}`;
  if (byDate) fileName += `_${dateForFileName}`;
  fileName += "_geodata.csv";
  const filePath = path.join(reportsDir, fileName);

  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: [
      { id: "date", title: "Date" },
      { id: "time", title: "Time" },
      { id: "service", title: "Service" },
      { id: "country", title: "Country" },
      { id: "region", title: "Region" },
      { id: "kladr_region", title: "Kladr Region" },
      { id: "city", title: "City" },
      { id: "user_agent", title: "User-Agent" },
    ],
    append: true,
  });

  csvWriter
    .writeRecords([geoData])
    .then(() => {
      console.log("Data logged:", geoData);
      res.status(200).send("Data logged");
    })
    .catch((error) => {
      console.error("Error writing to CSV", error);
      res.status(500).send("Error logging data");
    });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
