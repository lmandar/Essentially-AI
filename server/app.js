// DO NOT MODIFY ANYTHING HERE, THE PLACE WHERE YOU NEED TO WRITE CODE IS MARKED CLEARLY BELOW
const express = require('express');
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(function (req, res, next) {
    const allowedOrigins = ['http://localhost:3000'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
    next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.enable('trust proxy');

app.post('/api/fetchStockData', async (req, res) => {
    try {
        let { symbol, fromDate } = req.body;

        if (symbol == undefined || symbol == "") {
            let message = { status: "failed", message: "Please provide Symbol." }
            return res.status(400).json(message)
        }
        if (fromDate == undefined || fromDate == "") {
            let message = { status: "failed", message: "Please Provide valide date" }
            return res.status(400).json(message)
        }

        // Make an HTTP request to the Polygon API to fetch stock data for the specified symbol and date
        let url = `https://api.polygon.io/v1/open-close/${symbol}/${fromDate}?adjusted=true&apiKey=gkMAj8JoI7yCxYIrvKCOSrNRgI8cXmD8`
        let marketData = await axios.get(url)
        if (marketData.data.status != "OK") throw { status: "failed", message: "Somethin went wrong. Please try again later." }

        // Return only the required fields in the response
        let returnData = {
            open: marketData.data.open,
            high: marketData.data.high,
            low: marketData.data.low,
            close: marketData.data.close,
            volume: marketData.data.volume
        }
        res.status(200).json({ status: "Success", data: returnData });
    } catch (err) {
        console.log(err)
        res.status(500).json({status: "failed", message:"Record not found"})
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));