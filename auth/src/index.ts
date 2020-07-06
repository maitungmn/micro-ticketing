import express from 'express'
import 'express-async-errors'
import {json} from 'body-parser'
import mongoose from "mongoose"
import * as dotenv from "dotenv";

import {currentUserRouter} from "./routes/current-user"
import {signinRouter} from "./routes/signin";
import {signupRouter} from "./routes/signup";
import {signoutRouter} from "./routes/signout";

import {errorHandler} from "./middlewares/error-handler";
import {NotFoundError} from "./errors/not-found-error";

dotenv.config()

const app = express()
app.use(json())

const port = 3000

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signupRouter)
app.use(signoutRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

const start = async () => {
  try {
    await mongoose.connect(`mongodb://${process.env.HOST_MONGO}:27017/auth`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    console.log('Connected to MongoDb')
  } catch (e) {
    console.error(e)
  }
  app.listen(port, () => {
    console.log('Listening on port', port)
  })
}

start()

