const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// midleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('genious car server is running');
})

app.listen(port, () => {
    console.log(`Genious car server is running port: ${port}`);
})