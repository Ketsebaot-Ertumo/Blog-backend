require('dotenv').config();
const express= require('express');
const app= express();
const mongoose= require('mongoose');
const morgan= require('morgan');
const bodyParser= require('body-parser');
var cors= require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const cloudinary= require('./utils/cloudinary');


//import routes
const authRoute = require('./routes/authRoute');
const postRoute=  require('./routes/postRoute');


//Database connecton
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
})
    .then(() => console.log("DB Conected"))
    .catch((err) => console.log(err));


//middleware
app.use(morgan('dev'));
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({
    limit: "50mb", 
    extended: true
}));
app.use(cookieParser());
// app.use(cors());
app.use(cors({origin: true, credentials: true}));

//routes middleware
app.use('/api', authRoute);
app.use('/api', postRoute);

app.use(express.json());

//error middleware
app.use(errorHandler);

//create port
const port= process.env.PORT || 9000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
