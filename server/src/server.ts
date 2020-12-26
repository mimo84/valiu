import * as express from 'express';
import * as http from 'http';
import * as socketIo from 'socket.io';
import * as cors from 'cors';

import { clearInterval } from 'timers';
import index from './routes/routes';

const port = process.env.PORT || 4001;
const anySocketIo: any = socketIo;
const app = express();

app.use(index);

console.log('cors', cors());

const server = http.createServer(app);
const io = anySocketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const getApiAndEmit = (socket: socketIo.Socket) => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit('FromAPI', response);
};

let interval: NodeJS.Timeout;
io.on('connection', (socket: socketIo.Socket) => {
  console.log('new client connected');
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on('disconnect', () => {
    console.log('client disconnected');
    clearInterval(interval);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
