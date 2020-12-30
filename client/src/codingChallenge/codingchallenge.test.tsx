import faker from 'faker';
import React from 'react';
import { screen, render, waitFor, act } from '@testing-library/react';
import { INITIAL_LIST_EVENT } from '../common/contants';
import CodingChallenge from './CodingChallenge';
import MockedSocket from 'socket.io-mock';
import { generateData } from '../common/utils';

const initialTags = generateData(10);

describe('Fast and isolated socket tests', function () {
  let socket: any;
  beforeAll(() => {
    socket = new MockedSocket();
  });
  beforeEach(() => {
    render(<CodingChallenge />);
  });

  test('The component is displayed', () => {
    const coding = screen.getByText('Coding Challenge!');
    expect(coding).toBeInTheDocument();
  });

  test('Socket test in real life', () => {
    socket.socketClient.on(INITIAL_LIST_EVENT, (l: any) => {
      screen.getByText('Coding Challenge!');
      expect(l.length).toEqual(10);
    });
    socket.emit(INITIAL_LIST_EVENT, initialTags);
  });
});
