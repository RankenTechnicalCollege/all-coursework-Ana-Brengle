import express from 'express'
import debug from 'debug'
const debugServer = debug('app:Server')
import cors from 'cors'

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(port,() =>{
    debugServer(`Server is now running on port http://localhost:${port}`);
});