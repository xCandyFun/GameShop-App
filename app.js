const { DynamoDBClient, ScanCommand, PutItemCommand, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const express = require('express');
const path = require('path');
const app = express();

const dynamodb = new DynamoDBClient( { region: 'eu-north-1' });
const tableName = 'Games';

app.use('/index', express.static(path.join(__dirname, '/WebSite/IndexPage')));

app.use('/index/availableGamesPage', express.static(path.join(__dirname, '/WebSite/availableGamesPage')));

app.use('/index/addGamesPage', express.static(path.join(__dirname, '/WebSite/AddGamesPage')));

app.get('/', (req, res) => {
    res.redirect('/index')
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, '/WebSite/IndexPage/index.html')); 
});

app.get('/index/availableGamesPage', (req, res) => {
    res.sendFile(path.join(__dirname, '/WebSite/AvailableGamesPage/showGames.html'));
});

app.get('/index/addGamesPage', (req, res) => {
    res.sendFile(path.join(__dirname, '/WebSite/AddGamesPage/AddGames.html'));
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});