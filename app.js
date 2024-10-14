const { DynamoDBClient, ScanCommand, PutItemCommand, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

const dynamoDB = new DynamoDBClient( { region: 'eu-north-1' });
const tableName = 'Games';

app.use(express.urlencoded({ extended: true }));

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

app.get('/api/games', async (req, res) => {
    try {
        const data = await dynamoDB.send(new ScanCommand({ TableName: tableName }));

        const games = data.Items.map(game => ({
            gameId: game.gameId.S, // Check if gameId is defined
            gameName: game.gameName.S, // Check if gameName is defined
            studio: game.studio.S,
            genre: game.genre.S,
            year: game.year.N
        }));

        res.json(games);
    } catch (error) {
        console.log('Error fetching games:', error);
        res.status(500).send('Error fetching games');
    }

});

app.get('/index/addGamesPage', (req, res) => {
    res.sendFile(path.join(__dirname, '/WebSite/AddGamesPage/AddGames.html'));
});

app.post('/index/addGamesPage', async (req, res) => {
    //console.log('Request Body:', req.body);

    try {
        const params = {
            TableName: tableName,
            Item:{
                gameId: { S: req.body.GameId },
                gameName: { S: req.body.GameName },
                studio: { S: req.body.studio },
                genre: { S: req.body.genre },
                year: { N: req.body.year.toString() }
            }
        };
        await dynamoDB.send(new PutItemCommand(params));
        //res.redirect('/index/availableGamesPage');
        res.redirect('/index');
    }catch (error) {
        console.log('Error adding game:', error);
        res.status(500).send('Error adding game');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});