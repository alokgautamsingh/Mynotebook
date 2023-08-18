const connectToMongo = require('./db');
const express = require('express')

 var cors = require('cors');
const bcrypt = require('bcrypt');

connectToMongo();

const app = express()
 app.use(cors())
const port = 5000

app.use(express.json())
///available routes
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`mynote backend is listening on port ${port}`)
})