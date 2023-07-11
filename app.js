const express = require('express');
const http = require('http');
require('dotenv').config();
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
require('./jobs/agenda');
require('./jobs/emailJobs');

const port = process.env.PORT;

http.createServer(app).listen(port, function() {
  console.log('app is listening on port ' + port);
});

app.use('/', require(`./routes`));
