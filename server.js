
const express= require('express');
const app= express();
const mongoose= require('mongoose');
const morgan= require('morgan');
const bodyParser= require('body-parser');
require('dotenv').config();
var cors= require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');

//import routes
const authRoute = require('./routes/authRoute');
const postRoute = require('./routes/postRoute')



//Database connecton
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
})
    .then(() => console.log("DB Conected"))
    .catch((err) => console.log(err));


//middleware
app.use(morgan('dev'));
app.use(bodyParser.json({limit: "5mb"}));
app.use(bodyParser.urlencoded({limit: "5mb", extended: true}));
app.use(cookieParser());
app.use(cors());

//route middleware
app.use('/api', authRoute);
app.use('/api', postRoute);

//error middleware
app.use(errorHandler);

//create port
const port= process.env.PORT || 6000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});



//models

//utils

//controllers