const express = require('express');
const i18next = require('i18next');
const middleware = require('i18next-http-middleware');
const FsBackend = require('i18next-fs-backend');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoute.js');
const logoutRoute = require("./routes/logoutRoute.js")
const movieRoute = require('./routes/movieRoute');
const actorRoute = require('./routes/actorRoute');
const dbURL = "mongodb+srv://Cluster83833:arsen@cluster0.aslgnhw.mongodb.net/?retryWrites=true&w=majority";
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');



const app = express();
app.use(cookieParser());
i18next
  .use(FsBackend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    preload: ['en', 'ru'], // Preload all the languages
    backend: {
      loadPath: './locales/{{lng}}/translation.json', // Path to your language files
    },
  });

  app.use(
    middleware.handle(i18next, {
      removeLngFromUrl: false,
    })
  );
  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(session({
    secret: '1111',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  }));
  
  app.use((req, res, next) => {
    res.locals.isAdmin = req.session.isAdmin || false;
    res.locals.currentLng = req.language; // Current language
    res.locals.fallbackLng = i18next.options.fallbackLng;
    next();
  });
  
  app.use(methodOverride('_method'));
  
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '/views'));
  
  app.use('/', logoutRoute);
  app.use("/", userRouter);
  app.use("/movies", movieRoute);
  app.use("/actors", actorRoute);

  app.get('/change-lang/:lang', (req, res) => {
    const lang = req.params.lang;
    res.cookie('i18next', lang);
    res.redirect('back');
  });
  
  
  mongoose.connect(dbURL).then(async () => {
    app.listen(3000, () => {
      console.log("Connected to database and listening on port 3000");
    });
  }).catch((err) => console.error('Error connecting to database:', err));