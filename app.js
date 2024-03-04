const path = require("path");
const fs = require("fs");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session); //require returns a function that i need to pass session to
const errorController = require("./controllers/error");
const User = require("./models/user");
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");
const MulterAzureStorage = require("multer-azure-storage");

const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const https = require("https");
require("dotenv").config();

MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.gdjmk4f.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

const app = express();
const store = new MongoDBStore({
    //mongodbstore yields a constructor that i need to instantiate
    uri: MONGODB_URI,
    collection: "sessions",
});
const csrfProtection = csrf();

const privateKey = fs.readFileSync("server.key");
const certificate = fs.readFileSync("server.cert");

const fileStorage = new MulterAzureStorage({
    azureStorageConnectionString: `${process.env.AZURE_STORAGE_CONNECTION_STRING}`,
    containerName: "images",
    containerSecurity: "blob",
});
const invoiceStorage = new MulterAzureStorage({
    azureStorageConnectionString: `${process.env.AZURE_STORAGE_CONNECTION_STRING}`,
    containerName: "invoices",
    containerSecurity: "blob",
});
// const fileStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "images");
//     },
//     filename: (req, file, cb) => {
//         cb(null, new Date().toISOString() + "-" + file.originalname);
//     },
// });

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, "access.log"),
    { flags: "a" } // append
);

const cspDirectives = {
    defaultSrc: ["'self'"],
    imgSrc: [
        "'self'",
        "data:",
        "https://myshopwebappstorage.blob.core.windows.net",
    ],
    scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
    scriptSrcAttr: ["'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    frameSrc: ["https://js.stripe.com"],
};

app.use(helmet({ contentSecurityPolicy: { directives: cspDirectives } }));
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
    multer({
        storage: fileStorage,
        fileFilter: fileFilter,
    }).single("image")
);
app.use(
    "/upload-invoice",
    multer({
        storage: invoiceStorage,
    }).single("invoice")
);
// app.use(
//     multer({
//         dest: "images",
//         storage: fileStorage,
//         fileFilter: fileFilter,
//     }).single("image")
// );
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
    session({
        secret: "my secret",
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);
app.use(csrfProtection); //after session
app.use(flash());

app.use((req, res, next) => {
    res.locals = {
        isAuthenticated: req.session ? req.session.isLoggedIn : false,
        csrfToken: req.csrfToken(), //csrf token is added to every request
    };
    next();
});

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then((user) => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch((err) => {
            next(new Error(err));
        });
});

app.use("/admin", adminRoutes); // order matters when using use() method, but not when using get()
app.use(shopRoutes);
app.use(authRoutes); //everything that doesnt go to admin or shop will go to auth

app.get("/500", errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
    console.log(error);
    // res.status(error.httpStatusCode).render(...);
    // res.redirect('/500');
    res.status(500).render("500", {
        pageTitle: "Error!",
        path: "/500",
        isAuthenticated: req.session ? req.session.isLoggedIn : false,
    });
});

mongoose
    .connect(MONGODB_URI)
    .then((result) => {
        https
            .createServer({ key: privateKey, cert: certificate }, app)
            .listen(process.env.PORT || 3000);
        // app.listen(process.env.PORT || 3000);
    })
    .catch((err) => {
        console.log(err);
    });
