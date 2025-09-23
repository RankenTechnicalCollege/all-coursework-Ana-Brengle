import express from 'express'

const app = express()
const port = 3000

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('frontend/dist'))

app.use('/api/users', (await import('./routes/api/users.js')).usersRouter);


app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})