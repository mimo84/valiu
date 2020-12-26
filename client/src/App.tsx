import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';

import './App.css';
import CodingChallenge from './codingChallenge/CodingChallenge';
// https://www.notion.so/Challenge-for-d377a1a1de674c068a3b5c01726c15ae

const ENDPOINT = 'http://localhost:4001';
const socketIOAny: any = socketIOClient;

function App() {
  const [response, setResponse] = useState('');

  useEffect(() => {
    const socket = socketIOAny(ENDPOINT);
    socket.on('FromAPI', (data: any) => {
      setResponse(data);
    });

    return () => socket.disconnect();
  }, []);
  return (
    <div className="App">
      <header className="header">
        <a href="/valiu" className="brand">
          <img
            src="https://uploads-ssl.webflow.com/5ea3bbe508815409b2adc81a/5ea3bc7a27484bf404a45aa5_logo_valiu.svg"
            alt="Valiu Logo"
          />
        </a>
      </header>
      <p>
        It's <time dateTime={response}>{response}</time>
      </p>
      <section className="main-section">
        <CodingChallenge />
      </section>
    </div>
  );
}

export default App;
