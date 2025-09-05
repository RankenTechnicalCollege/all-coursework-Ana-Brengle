import express, { json } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import debug from 'debug';
const debugServer = debug('app:Server');
import { userRouter } from './routes/api/users.js';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(json());

app.use(express.static('frontend/dist'));
app.use('/api/users', userRouter);
const port = process.env.PORT || 3000;

app.listen(port,() =>{
    debugServer(`Server is now running on port http://localhost:${port}`);
    
});


