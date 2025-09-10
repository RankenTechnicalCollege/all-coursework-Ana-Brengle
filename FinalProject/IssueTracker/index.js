import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import debug from 'debug';
const debugServer = debug('app:Server');
import { bugRouter } from './routes/api/bugs.js';
import { userRouter } from './routes/api/users.js';


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = process.env.PORT || 3000;
app.use(express.static('frontend/dist'));
app.use('/api/bugs', bugRouter);
app.use('/api/users', userRouter);



app.listen(port,() =>{
    debugServer(`SServer is now running on port http://localhost:${port}`);
});
// import express from 'express';
// const app = express()
// const port = 3000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })



