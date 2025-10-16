import express from 'express';
//import {ping} from './database.js';
import dotenv from 'dotenv';
dotenv.config();
import debug from 'debug';
const debugServer = debug('app:Server');
import { bugRouter } from './routes/api/bugs.js';
import { userRouter } from './routes/api/users.js';
import cors from 'cors'
//import { registerSchema } from './validation/userSchema.js';
//import { validate } from './middleware/joiValidator.js';



const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;
app.use(express.static('frontend/dist'));

app.use('/api/users;', (await import('./routes/api/users.js')).userRouter);
app.use('/api/bugs', (await import('./routes/api/bugs.js')).bugRouter);
app.use('/api/users', userRouter);
app.use('/api/bugs', bugRouter);

//ping();

app.listen(port,() =>{
    debugServer(`Server is now running on port http://localhost:${port}`);
});

// app.post('/api/users', validate(registerSchema), (req, res) => {
//     res.status(201).json({
//         message: 'User registered successfully!',
//         data: req.body
//     })
// });



