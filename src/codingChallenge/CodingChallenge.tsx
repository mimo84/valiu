import React, { KeyboardEvent, useState } from 'react';
import VirtualScroller from './VirtualScroller';
import { v4 as uuid } from 'uuid';
import faker from 'faker';
import { useEffect } from 'react';

faker.locale = 'pt_BR';

export interface ITag {
  color: string;
  content: string;
  id: string;
}

const rndNumber = () => Math.floor(Math.random() * 255);
const randomColor = () =>
  `rgba(${rndNumber()},${rndNumber()}, ${rndNumber()} )`;
const initialTags: ITag[] = Array.from({ length: 10e4 }).map((_, i) => ({
  color: randomColor(),
  content: faker.random.words(),
  id: uuid(),
}));

const CodingChallenge: React.FC = () => {
  const actionDelete = (index: string) => {
    const nuTags = tags.filter((t) => t.id !== index);
    setTags(nuTags);
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
    let nuTags;
    if (editTarget !== undefined) {
      nuTags = tags.map((t) => {
        return t.id === editTarget?.id ? { ...t, content: edit } : t;
      });
      setScrollPosition(scrollPosition);
    } else {
      const brandNewTag = {
        color: randomColor(),
        content: edit,
        id: uuid(),
      };
      nuTags = [brandNewTag].concat(tags);
      setScrollPosition(0);
    }

    setEdit('');
    setEditTarget(undefined);
    setTags(nuTags);
  };

  const [tags, setTags] = useState<ITag[]>(initialTags);
  const [edit, setEdit] = useState('');
  const [editTarget, setEditTarget] = useState<ITag | undefined>(undefined);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    setTags(tags);
  }, [tags]);

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
        <div className="tag-list">Etiquetas</div>

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
          key={tags.length}
          data={tags}
          row={RowTemplate}
        />
      </div>
    </>
  );
};

export default CodingChallenge;
