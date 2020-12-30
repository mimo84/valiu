import faker from 'faker';

export const rndNumber = () => Math.floor(Math.random() * 255);
export const randomColor = () =>
  `rgba(${rndNumber()},${rndNumber()}, ${rndNumber()} )`;

export const generateData = (length: number) =>
  Array.from({ length }).map((e) => ({
    color: randomColor(),
    content: faker.random.words(),
    id: faker.random.uuid(),
  }));
