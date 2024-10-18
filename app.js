const { DynamoDBClient, ScanCommand, PutItemCommand, GetItemCommand, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dynamoDB = new DynamoDBClient( { region: 'eu-north-1' });
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

app.get('/api/games', async (req, res) => {
    try {
        const data = await dynamoDB.send(new ScanCommand({ TableName: tableName }));

        const games = data.Items.map(game => ({
            gameId: game.gameId.S,
            gameName: game.gameName.S,
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
        res.redirect('/index');
    }catch (error) {
        console.log('Error adding game:', error);
        res.status(500).send('Error adding game');
    }
});

app.delete('/api/games/:gameId', async (req, res) => {
    const { gameId } = req.params;

    const params = {
        TableName: tableName,
        Key: {
            gameId: { S: gameId }
        }
    };

    try {
        await dynamoDB.send(new DeleteItemCommand(params));
        res.status(200).json({ message: 'Game delete successfully' });
    }catch (error) {
        console.log('Error deleting game:', error);
        res.status(500).json({ error: 'Failed to delete game' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});