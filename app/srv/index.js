import express from 'express';
import history from "connect-history-api-fallback";
import cors from 'cors';
// import socketIO from "socket.io";

import router_user from "./routes/api/user";
import router_group from "./routes/api/group";

import mongooseInit from "./mongoose/init.js";

import path from 'path';

export default (app, http) => {
  mongooseInit();

  app.use(express.static('dist'));
  app.use(history({
    index: '/dist/index.html',
    rewrites: [{
      from: /^\/api\/.*$/,
      to: context => context.parsedUrl.pathname
    }]
  }));
  app.use(express.json());
  // app.use(cors({
  //   origin: 'http://localhost:8089'
  // }));

  app.use('/api/user', router_user);
  app.use('/api/group', router_group);
  // app.use(express.json());
  //
  // app.get('/foo', (req, res) => {
  //   res.json({msg: 'foo'});
  // });
  //
  // app.post('/bar', (req, res) => {
  //   res.json(req.body);
  // });
  // 
  // optional support for socket.io
  // 
  // let io = socketIO(http);
  // io.on("connection", client => {
  //   client.on("message", function(data) {
  //     // do something
  //   });
  //   client.emit("message", "Welcome");
  // });
};
