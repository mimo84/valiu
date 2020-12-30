import * as express from 'express';
import * as http from 'http';
import * as socketIo from 'socket.io';
import {
  EMIT_NEW_TAG_EVENT,
  RECEIVE_NEW_TAG_EVENT,
  EMIT_EDIT_TAG_EVENT,
  RECEIVE_EDIT_TAG_EVENT,
  EMIT_DELETE_TAG_EVENT,
  RECEIVE_DELETE_TAG_EVENT,
  INITIAL_LIST_EVENT,
} from './common/contants';

import index from './routes/routes';
import { generateData } from './common/utils';

export interface ITag {
  color: string;
  content: string;
  id: string;
}

const port = process.env.PORT || 4001;
const anySocketIo: any = socketIo;
const app = express();

app.use(index);

const server = http.createServer(app);
const io = anySocketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

let tagList: ITag[] = generateData(10e4);

io.on('connection', (socket: socketIo.Socket) => {
  socket.emit(INITIAL_LIST_EVENT, tagList);

  socket.on('disconnect', () => {});

  socket.on(EMIT_NEW_TAG_EVENT, (r) => {
    tagList = [r].concat(tagList);
    io.emit(RECEIVE_NEW_TAG_EVENT, r);
  });

  socket.on(EMIT_EDIT_TAG_EVENT, (tag) => {
    tagList = tagList.map((t) => {
      return t.id === tag.id ? tag : t;
    });
    io.emit(RECEIVE_EDIT_TAG_EVENT, tag);
  });
  socket.on(EMIT_DELETE_TAG_EVENT, (r) => {
    tagList = tagList.filter((t) => t.id !== r);
    io.emit(RECEIVE_DELETE_TAG_EVENT, r);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
