const express = require('express')
require('dotenv').config()
const cors = require('cors')
const app = express()
const routings = require('./routing')

// Connection to MongoDB Databse
const Database = require('./database');
const serverPort = process.env.SERVER_PORT; 

// Middlewares 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Base route
app.get('/', (req, res) => {
  res.send('Connected to server!')
})

// API routings
app.use('/api/', routings);

// Starting the server
app.listen(serverPort, () => {
  console.log(`Server running at http://localhost:${serverPort}`)
})