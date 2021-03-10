const express = require('express')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const { urlencoded } = require('express')
const { connect } = require('http2')
const session = require('express-session')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const MySQLStore = require('express-mysql-session')(session)

const { AppError } = require('./Utilities')
const sectionRoute = require('./routes/section')
const taskRoute = require('./routes/task')

const app = express()
const dburl = process.env.CLEARDB_DATABASE_URL
const sessionStore = new MySQLStore({
    dburl
})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))
app.use(urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false, store: sessionStore }))
app.use(flash())
app.use(cookieParser())
app.use(helmet());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://cdn.jsdelivr.net/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dxaeka3jm/",
                "https://images.unsplash.com/",
                "https://img.lovepik.com/original_origin_pic/18/06/19/fa7aef652afdf48d95e90dd8aeee5b42.png_wh860.png"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

//res.locals for flash
app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

//section routes
app.use('/sections', sectionRoute)

//task routes
app.use('/sections/:sectionId', taskRoute)

//404 handler
app.all('*', (req, res, next) => {
    throw new AppError('Page not found', 404)
})

// //Error handler
app.use((err, req, res, next) => {
    const { message, statusCode, stack } = err
    const msg = message || "Ran into an unknown error"
    const status = statusCode || 500
    res.status(status).render('error', { msg, stack })
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})