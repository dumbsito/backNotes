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
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //allow CORS
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept, Authorization'); //tell which extra headers the app might have
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    console.log('Middleware');
    next();
});


  let corsOptions = {
    origin: ["https://notesapp-78b.netlify.app/"],
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