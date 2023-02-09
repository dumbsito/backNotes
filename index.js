const express = require ("express");
const path = require ("path");
const bodyParser = require ("body-parser");
const cors = require ("cors");
const passport = require ("passport");
const mongoose = require ("mongoose");
const config = require("./config/database");
const session = require("express-session");

mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("strictQuery", true);

mongoose.connection.on('connected', ()=>{
    console.log("connected to database " + config.database);
});

mongoose.connection.on('error', (err)=>{
    console.log("Database error " + err);
});

const app = express();
app.use(session({ secret: 'melody hensley is my spirit animal' }));

const users = require("./routes/users");

const port = 3000;


app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  app.use(cors());

  let corsOptions = {
    origin: ["http://localhost:4200"],
    credentials: true
  }
  
  app.use(cors(corsOptions));
require("./config/passport")(passport);

app.use("/users", users);
app.get("/",(req,res)=>{
    res.send("hello from home")
})


app.listen(port, ()=>{
    console.log("The server started on port " + port);
});