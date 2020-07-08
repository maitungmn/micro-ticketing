import mongoose from "mongoose"
import * as dotenv from "dotenv"
import {app} from "./app"

dotenv.config()
const port = 3000

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }
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

