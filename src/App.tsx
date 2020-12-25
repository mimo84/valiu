import React from 'react';
import './App.css';
import CodingChallenge from './codingChallenge/CodingChallenge';
// https://www.notion.so/Challenge-for-d377a1a1de674c068a3b5c01726c15ae
function App() {
  return (
    <div className="App">
      <header className="header">
        <a href="//#endregion" className="brand">
          <img
            src="https://uploads-ssl.webflow.com/5ea3bbe508815409b2adc81a/5ea3bc7a27484bf404a45aa5_logo_valiu.svg"
            alt="Valiu Logo"
          />
        </a>
      </header>
      <section className="main-section">
        <CodingChallenge />
      </section>
    </div>
  );
}

export default App;
