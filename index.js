const express = require ("express");
const path = require ("path");
const bodyParser = require ("body-parser");
const cors = require ("cors");
const passport = require ("passport");
const mongoose = require ("mongoose");
const config = require("./config/database");
const session = require("express-session");

mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });

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

app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport);

app.use("/users", users);



app.listen(port, ()=>{
    console.log("The server started on port " + port);
});