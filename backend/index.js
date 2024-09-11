require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const userrouter = require('./routes/user.js')
const accountrouter = require('./routes/account.js')
const connectDB = require('./db.js');


app.use(cors());
app.use(express.json());

connectDB();

app.use('/user', userrouter)

app.use('/account', accountrouter)

app.listen(3000,() => {
    console.log('server is running');
    
});