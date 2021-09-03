require('dotenv').config();
const fs = require('fs');
const express = require('express');
const config = JSON.parse(fs.readFileSync('config/properties.json'));
const routes = require('./routes/index');
const bodyparser = require('body-parser');
const port = process.env.PORT || config.port;
const app = express();

app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

app.use('/', routes);

app.listen(port, (err) => {
    if(err)
    {
        console.log('Error in starting ther server');
    }
    else
    {
        console.log(`Server is running on port ${port}`);
    }
})

module.exports = app;