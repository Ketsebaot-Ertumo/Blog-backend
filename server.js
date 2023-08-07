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
//const cloudinary = require('cloudinary');

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
app.use(bodyParser.json({limit: "25mb"}));
app.use(bodyParser.urlencoded({
    limit: "25mb", 
    extended: true
}));
app.use(cookieParser());
app.use(cors());

//routes middleware
app.use('/api', authRoute);
app.use('/api', postRoute);

app.use(express.json());

//error middleware
app.use(errorHandler);

//create port
const port= process.env.PORT || 6000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});



//cloudinary

// app.post('/api/uploads', async (req, res) => {
//     try {
//       const result = await cloudinary.uploader.upload(req.body.image, {
//         folder: "uploads",
//         width: 1200,
//         crop: "scale"
//       });
//       res.json({
//         success: true,
//         public_id: result.public_id,
//         url: result.secure_url
//       });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ success: false, message: 'Server error' });
//     }
//   });

//   // API endpoint for uploading images
// app.post('/api/upload', async (req, res) => {
//     try {
//       const result = await cloudinary.uploader.upload(req.body.image, {
//         folder: 'uploads'
//       });
//       res.json({
//         success: true,
//         public_id: result.public_id,
//         url: result.secure_url
//       });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ success: false, message: 'Server error' });
//     }
//   });
