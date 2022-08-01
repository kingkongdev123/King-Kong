import express from 'express';
import http from 'http';
import cors from 'cors';
import fs from 'fs';
import { Server } from 'socket.io';
import { airdrop2CollectionHolders, gamePlayListener, getGamePlayHistory, getGameStats, getUserStats } from './process';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.get('/', async (req, res) => {
  res.status(200).send("server is running...");
})

app.get('/api/user_stats', async (req, res) => {
  let result = await getUserStats();
  res.status(200).send(result);
})

app.get('/api/game_stats', async (req, res) => {
  let result = await getGameStats();
  res.status(200).send(result)
})

app.get('/api/game_play', async (req, res) => {
  let result = await getGamePlayHistory();
  res.status(200).send(result)

});

io.on('connection', async (socket) => {
  console.log("New Connection Established");

  socket.on('disconnect', () => {
    console.log("One socket is disonnected");
  });
})

server.listen(port, () => {
  console.log(`server is listening on ${port}`);
  gamePlayListener(io);
  return;
});