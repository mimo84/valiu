import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client/build/index';
import {
  EMIT_NEW_TAG_EVENT,
  RECEIVE_NEW_TAG_EVENT,
  EMIT_EDIT_TAG_EVENT,
  RECEIVE_EDIT_TAG_EVENT,
  EMIT_DELETE_TAG_EVENT,
  RECEIVE_DELETE_TAG_EVENT,
  INITIAL_LIST_EVENT,
} from '../common/contants';
import { ITag } from './CodingChallenge';

const SOCKET_SERVER_URL = 'https://mimo-valiu-server.herokuapp.com/';

const useSocket = () => {
  const [tags, setTags] = useState<ITag[]>([]);
  const socketRef = useRef<Socket>();

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
    });

    socketRef.current.on(INITIAL_LIST_EVENT, (tags: ITag[]) => {
      setTags(tags);
    });

    socketRef.current.on(RECEIVE_NEW_TAG_EVENT, (tag: ITag) => {
      console.log('receive new tag', tag.content);

      setTags((tags) => [tag].concat(tags));
    });

    socketRef.current.on(RECEIVE_EDIT_TAG_EVENT, (tag: ITag) => {
      setTags((tags) => {
        const nuTags = tags.map((t) => {
          return t.id === tag.id ? tag : t;
        });

        return nuTags;
      });
    });

    socketRef.current.on(RECEIVE_DELETE_TAG_EVENT, (id: string) => {
      setTags((tags) => {
        const nuTags = tags.filter((t) => t.id !== id);
        return nuTags;
      });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const addTag = (tag: ITag) => {
    socketRef.current?.emit(EMIT_NEW_TAG_EVENT, tag);
  };

  const editTag = (tag: ITag) => {
    socketRef.current?.emit(EMIT_EDIT_TAG_EVENT, tag);
  };

  const deleteTag = (id: string) => {
    socketRef.current?.emit(EMIT_DELETE_TAG_EVENT, id);
  };

  return { tags, addTag, editTag, deleteTag };
};

export default useSocket;
