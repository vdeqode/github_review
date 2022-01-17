const mongoose = require('mongoose');

const host = process.env.DATABASE_HOSTNAME;
const dbPort = process.env.DATABASE_PORT;
const dbName = process.env.DATABASE_NAME
const dbConnectionString = `mongodb://${host}:${dbPort}/${dbName}`

// Connecting to MongoDB database
mongoose.connect(dbConnectionString, {
    'useNewUrlParser': true,
})
.then(() => {
    console.log('Successfully connected to MongoDB.')
})
.catch((error) => console.log("ConnectionError:",error.message));

mongoose.connection.on('error', (error) => {
    console.log("MongoError: ", error.message)
})

mongoose.connection.on('disconnected', () => {
    console.log('Connection to mongoDB is disconnected.')
})

process.on('SIGINT', async () => {
    await mongoose.connection.close()
    process.exit(0)
})

