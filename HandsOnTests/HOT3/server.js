import express from "express"
import dotenv from 'dotenv'
import debug from "debug";
import { ping } from "./database.js";
import { productRouter } from "./routes/api/products.js";


dotenv.config();
ping();

const app = express()
const debugServer = debug('app:Server');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("frontend/dist"));

app.use('/api/products', productRouter)

const port = process.env.PORT || 3000

app.listen(port,() => {
  debugServer(`Server is now running on port http://localhost:${port}`);
})
