const { DynamoDBClient, ScanCommand, PutItemCommand, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const express = require('express');
const path = require('path');
const app = express();

app.use('/index', express.static(path.join(__dirname, '/WebSite/IndexPage')));

app.get('/', (req, res) => {
    res.redirect('/index')
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, '/WebSite/IndexPage/index.html'));
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});