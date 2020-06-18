const express = require('express'),
  path = require('path'),
  mongoose = require('mongoose'),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  dbConfig = require('./database/db');



// Connecting with mongo db
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
  useNewUrlParser: true
}).then(() => {
    console.log('Database sucessfully connected')
  },
  error => {
    console.log('Database could not connected: ' + error)
  }
)

// Setting up port with express js

const userRoutes = require("./routes/user");
const shiftsRoutes = require("./routes/shifts");
const weeksRoutes = require("./routes/weeks");
const sidurRoutes = require("./routes/sidur");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
// app.use('*', express.static(path.join(__dirname, 'public/index.html')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.use("/api/user", userRoutes);
app.use("/api/shifts", shiftsRoutes);
app.use("/api/weeks", weeksRoutes);
app.use("/api/sidur", sidurRoutes);

// Create port
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
})

// Find 404 and hand over to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.message); // Log error message in our server's console
  if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
  res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
});
