import React, { KeyboardEvent, useState } from 'react';
import VirtualScroller from './VirtualScroller';
import { v4 as uuid } from 'uuid';
import useSocket from './useSocket';
import Loader from '../loader/Loader';

export interface ITag {
  color: string;
  content: string;
  id: string;
}

const rndNumber = () => Math.floor(Math.random() * 255);
const randomColor = () =>
  `rgba(${rndNumber()},${rndNumber()}, ${rndNumber()} )`;

const CodingChallenge: React.FC = () => {
  const { tags, addTag, editTag, deleteTag, loading, key } = useSocket();

  const actionDelete = (id: string) => {
    deleteTag(id);
  };

  const actionEdit = (index: string) => {
    const target = tags.find((t) => t.id === index);
    setEdit(target?.content || '');
    setEditTarget(target);
  };
  const onInputEnter = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      tagAction();
    }
  };

  const onEditInputChange = (e: any) => {
    setEdit(e.currentTarget.value);
  };

  const tagAction = () => {
    if (editTarget !== undefined) {
      const editedTag = tags.find((t) => {
        return t.id === editTarget?.id;
      });

      if (editedTag) {
        editTag({ ...editedTag, content: edit });
      }
      setScrollPosition(scrollPosition);
    } else {
      const brandNewTag = {
        color: randomColor(),
        content: edit,
        id: uuid(),
      };
      addTag(brandNewTag);
      setScrollPosition(0);
    }

    setEdit('');
    setEditTarget(undefined);
  };

  const [edit, setEdit] = useState('');
  const [editTarget, setEditTarget] = useState<ITag | undefined>(undefined);
  const [scrollPosition, setScrollPosition] = useState(0);

  const RowTemplate = (v: ITag, i: number) => {
    return (
      <div className="item-container" key={`${v.color}_${i}`}>
        <span
          className="item-color"
          style={{
            backgroundColor: `${v.color}`,
          }}
        >
          &nbsp;
        </span>
        <span className="item-content">{v.content}</span>
        <div className="item-actions">
          <button className="action-button" onClick={() => actionEdit(v.id)}>
            Editar
          </button>

          <button className="action-button" onClick={() => actionDelete(v.id)}>
            Borrar
          </button>
        </div>
      </div>
    );
  };
  return (
    <>
      <h2>Coding Challenge! (rendering: {tags.length})</h2>

      <div className="container">
        <div className="tag-list">Etiquetas {loading && <Loader />}</div>
        {loading === false && (
          <>
            <input
              type="text"
              className="input"
              value={edit}
              autoFocus
              onChange={onEditInputChange}
              onKeyDown={onInputEnter}
              placeholder="Añadir etiqueta"
            />

            <VirtualScroller
              scrollPosition={scrollPosition}
              setScrollPosition={setScrollPosition}
              key={key}
              data={tags}
              row={RowTemplate}
            />
          </>
        )}
      </div>
    </>
  );
};

export default CodingChallenge;
