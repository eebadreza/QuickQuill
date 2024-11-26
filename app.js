require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const connectDB = require('./server/config/db');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');

const app = express();
const port = 4321 || process.env.PORT;

const mainRouter = require('./server/routes/mainRouter');
const dashboardRouter = require('./server/routes/dashboardRouter');
const authRouter = require('./server/routes/authRouter');

app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.DB_URI,
        }),
        //cookie: { maxAge: new Date ( Date.now() + (3600000) ) }
        // Date.now() - 30 * 24 * 60 * 60 * 1000
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Conntect to Database
connectDB();

// Static Files
app.use(express.static('public'));

// Templating Engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Routes
app.use('/', authRouter);
app.use('/', mainRouter);
app.use('/', dashboardRouter);

// Handle 404
app.get('*', function (req, res) {
    //res.status(404).send('404 Page Not Found.')
    // console.log(req.hostname);
    res.status(404).render('404', {
        errHeading: 'Page Not Found',
        linkText: 'Explore QuickQuill',
        linkUrl: `${req.protocol}://${req.get('host')}/`,
    });
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
