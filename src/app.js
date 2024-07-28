const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors(
    {
        origin: process.env.FRONTEND_URL, // replace with your frontend URL
        credentials: true
    }
));

app.use(express.json({
    limit:"16kb"
}));

app.use(express.urlencoded({
    extended: true,
    limit:"16kb"
}));

app.use(express.static("public"));



module.exports = app;
