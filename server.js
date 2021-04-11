require("dotenv").config()

const express = require("express")
const path = require("path");
const helmet = require('helmet')
const morgan = require('morgan');

const SwaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const openApiDocumentation = require('./openApiDoc');

const winston = require('./logger/winston');
const users = require('./src/routes/users');
const notes = require('./src/routes/notes');
const auth = require('./src/routes/auth');

const app = express()


const rootPath = path.resolve("./dist")



// MIDDLEWARES
// Helmet Security
app.use(helmet());
// Parse requests
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
// Setup root path
app.use(express.static(rootPath))
// Handling logs
app.use(morgan('combined', { stream: winston.stream }));


require("./src/db/connection")
require("./src/bootstrap")()

// Swagger setup
app.use("/api-docs", SwaggerUI.serve, SwaggerUI.setup(openApiDocumentation))

// Auth
app.post("/token/", auth.token)
app.post("/login/", auth.login)
app.post("/register/", auth.register)
app.delete("/logout/", auth.logout)

// User 
app.get("/user/", users.getAllUsers)
app.get("/user/:userId", users.getUser)
app.patch("/user/:userId", users.updateUser)
app.delete("/user/:userId", users.deleteUser)

// Notes 
app.get("/note/", auth.authorize, notes.getAllNotes)
app.get("/note/:noteId", auth.authorize, notes.getNote)
app.post("/note/", auth.authorize, notes.createNote)
app.patch("/note/:noteId", auth.authorize, notes.updateNote)
app.delete("/note/:noteId", auth.authorize, notes.deleteNote)
app.get("/usernote/:userId", auth.authorize, notes.getNoteByUser)





app.listen(process.env.SERVER_PORT, () => {
    console.log(`Listening port ${process.env.SERVER_PORT}`)
})