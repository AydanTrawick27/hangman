// api/server.js
// Pure CommonJS + AWS SDK v2 DocumentClient, testable Express app

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dynamo = require('./dynamoClient'); // v2 DocumentClient from dynamoClient.js

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

const TABLE_NAME = 'Players';

// GET /api/player?playerName=foo
app.get('/api/player', async (req, res) => {
  const { playerName } = req.query;

  if (!playerName) {
    return res.status(400).json({ error: 'playerName is required' });
  }

  try {
    const params = {
      TableName: TABLE_NAME,
      Key: { playerName },
    };

    const result = await dynamo.get(params).promise();

    if (!result.Item) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.json(result.Item);
  } catch (err) {
    console.error('GET /api/player error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/players   body: { playerName }
app.post('/api/players', async (req, res) => {
  const { playerName } = req.body;

  if (!playerName) {
    return res.status(400).json({ error: 'playerName required' });
  }

  const item = { playerName, wins: 0, losses: 0 };

  try {
    const params = {
      TableName: TABLE_NAME,
      Item: item,
      ConditionExpression: 'attribute_not_exists(playerName)',
    };

    await dynamo.put(params).promise();

    res.status(201).json(item);
  } catch (err) {
    if (err.code === 'ConditionalCheckFailedException') {
      return res.status(409).json({ error: 'Player already exists' });
    }

    console.error('POST /api/players error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/player   body: { playerName, wins, losses }
app.put('/api/player', async (req, res) => {
  const { playerName, wins, losses } = req.body;

  if (!playerName) {
    return res.status(400).json({ error: 'playerName required' });
  }

  try {
    const params = {
      TableName: TABLE_NAME,
      Key: { playerName },
      UpdateExpression: 'SET wins = :w, losses = :l',
      ExpressionAttributeValues: {
        ':w': wins,
        ':l': losses,
      },
      ReturnValues: 'ALL_NEW',
    };

    const result = await dynamo.update(params).promise();
    res.json(result.Attributes);
  } catch (err) {
    console.error('PUT /api/player error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 3001;

// Only start the server if this file is run directly (node server.js)
// When we `require('./server')` in tests, it will NOT listen on a port.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
  });
}

// Export the app for testing
module.exports = app;
