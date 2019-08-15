import React from 'react';
import Layout from './components/Layout/Layout';
import logo from './logo.svg';
import './App.css';

function App() {

  return (
    <>
      <img src={logo} className="App-logo" alt="logo" />
      <div className="connection" id="connection">Error</div>
      <Layout title="rss chat" />
    </>
  );
}

export default App;
