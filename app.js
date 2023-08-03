// Initialiser package.json
// Installer les librairies : express, pg, dotenv, express-async-errors, http-status-codes, jsonwebtoken
// Faire les scripts
// .gitignore
// Setup le serveur

// Créer le dossier db
// Créer .env
// Créer database.sql

// Middlewares: notFound, errorHandler

// Errors: BadRequestError, UnauthenticatedError, NotFoundError

// Controllers :
// authController : register, login
// jobsController : createJob, getAllJobs, getJob, updateJob, deleteJob

// Routes : authRoutes, jobsRoutes
// /api/v1/auth
// /api/v1/jobs

// Créer une collection "Jobs API" dans Thunder Client
// Auth
// Jobs

require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
//LIBRAIRIE POUR LA SECURITE
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

// middlewares
const notFound = require("./middlewares/notFoundMiddleware.js");
const errorHandler = require("./middlewares/errorHandlerMiddleware.js");

// router
const authRouter = require("./routes/authRoutes.js");
const jobsRouter = require("./routes/jobsRoutes.js");

app.use(express.json());
app.use(helmet()); //ATTAQUE DANS L'ENTETE DES REPONSES
app.use(xss());
app.use(
  //LIMIT LES REQUETES
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
);
app.use(cors());

app.use(express.json());

app.use(express.static("public"));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", jobsRouter);

app.use(notFound);
app.use(errorHandler);

const port = 5000;
app.listen(port, () => console.log(`Server is listening on port ${port}...`));
