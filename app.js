const express = require('express'); 
const mongoose = require('mongoose'); 
const path = require('path'); 
const config = require('config'); 

const app = express();
app.use(express.json());

const db = config.get('mongoURI'); 

//connection to the database
mongoose 
    .connect(db, { 
        useNewUrlParser: true, 
        useCreateIndex: true, 
        useFindAndModify: false, 
        useUnifiedTopology: true }) 
    .then(() => console.log('Successfully Connected to Database...')) 
    .catch(err => console.log(err)
);

//const searchRoutes = require('./routes/search')
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');

mongoose.Promise = global.Promise;

const morgan = require('morgan');

app.use(morgan('dev'));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 
    'Origin, X-Requested=With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 
        'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

const bodyParser = require('body-parser');

//Parsing the body to fix errors; post information
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); 

//Request Handling Routes
//app.use('/search', searchRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);

//No route was able to handle the request
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;