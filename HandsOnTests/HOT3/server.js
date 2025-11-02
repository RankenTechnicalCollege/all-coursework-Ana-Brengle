import express from "express"
import dotenv from 'dotenv'

dotenv.config();

import debug from "debug";
const debugServer = debug('app:Server');

import cors from'cors'

import { ping } from "./database.js";
import { productRouter } from "./routes/api/products.js";
import { userRouter } from "./routes/api/users.js";

import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";


ping();

const app = express()


app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors(
  {
    origin: ['http://localhost:2023', 'http://localhost:5137', 'http://localhost:3000'],
    credentials: true
  }
));
app.use(express.static("frontend/dist"));

app.all('/api/auth/*splat', toNodeHandler(auth))
app.use('/api/products', productRouter)
app.use('/api/user', userRouter)

const port = process.env.PORT || 3000

app.listen(port,() => {
  debugServer(`Server is now running on port http://localhost:${port}`);
})
