# Notes Management

##### A basic REST API Service for managing notes

The application is build in NodeJS, Express, MySQL, Sequelize


## Setup - Before Starting

Create database "**notes**". 

Port "**3000**" must be free.

You can also change port, database details, token-secrets, etc in the "**.env**" file.

Use the below script to install all required packages via Node Package Manager.

```bash
npm install
```


## Installed NPM Modules

These are the dependencies used in this application. (No need to install each dependencies individually, as they will get installed automatically by just running :   **npm install**).

```bash
npm i express --save
npm i dotenv --save
npm i jsonwebtoken --save
npm i bcrypt --save 
npm i app-root-path --save
npm i helmet --save 
npm i winston --save
npm i morgan --save  
npm install swagger-jsdoc --save
npm install swagger-ui-express --save
```


## Start Application

Run the below command in terminal to start the application.

```bash
node server
```


## Application Logs

Application logs can be viewed in the "**./logs/app.log**".


## API Documentation

Below is the link to see the POSTMAN-based API documentation .
[API Documentation](https://documenter.getpostman.com/view/6680660/TzCV3jr5)

Once application starts running Swagger API Documentation can be viewed here -  
http://localhost:3000/api-docs 


### Author
[Amarnath R R](http://amar-rockz.com/)
