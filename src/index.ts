import http from "http";
import express from "express";
import cors from "cors";
import { Server } from "colyseus";
import { monitor } from "@colyseus/monitor";
// import socialRoutes from "@colyseus/social/express"

import { GameRoom } from "./GameRoom";
import { LobbyRoom } from "colyseus";

const port = Number(process.env.PORT || 3000);
const app = express()

// app.use(cors());
app.use(express.json())
app.use(express.static('client'))

const server = http.createServer(app);
const gameServer = new Server({
  server,
});

// register your room handlers
gameServer.define("lobby", LobbyRoom);
gameServer.define('game_room', GameRoom).enableRealtimeListing();

/**
 * Register @colyseus/social routes
 *
 * - uncomment if you want to use default authentication (https://docs.colyseus.io/server/authentication/)
 * - also uncomment the import statement
 */
// app.use("/", socialRoutes);

// register colyseus monitor AFTER registering your room handlers
app.use("/colyseus", monitor());

gameServer.listen(port);
console.log(`Listening on ws://localhost:${ port }`)
