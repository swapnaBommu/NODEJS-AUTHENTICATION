// 1. Import Exprerss
import express from 'express';
import dotenv from "dotenv";
import path from 'path';
import ejsLayouts from 'express-ejs-layouts';
import passport from 'passport';
import userRouter from './src/features/user/user.routes.js';
import { ApplicationError } from './src/error-handler/applicationError.js';
import { connectUsingMongoose } from './src/config/mongooseConfig.js';

// 2. Create Server
const server = express();

// load all the environment variables in application
dotenv.config();


//setup ejs layouts
server.use(ejsLayouts);

server.use(express.json());

//parse form data
server.use(express.urlencoded({extended : true}));

//initialize passposrt
server.use(passport.initialize());

//setup view engine settings
server.set("view engine","ejs");
server.set("views",path.join(path.resolve(),"src","views"));

server.use('/', userRouter);

// 3. Default request handler
// server.get('/', (req, res) => {
//   res.render('register');
// });

// Error handler middleware
server.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof ApplicationError) {
    return res.status(err.code).send(err.message);
  }

  // server errors.
  res
    .status(500)
    .send(
      'Something went wrong, please try later'
    );
});

// 4. Middleware to handle 404 requests.
server.use((req, res) => {
  res
    .status(404)
    .send(
      'API not found. Please check our documentation for more information at localhost:3200/api-docs'
    );
});

// 5. Specify port.
server.listen(3200, ()=>{
  console.log('Server is running at 3200');

  connectUsingMongoose();
});

