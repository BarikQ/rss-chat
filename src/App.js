import React from 'react';
import Layout from './components/Layout/Layout';
import logo from './logo.svg';
import './App.css';

function App() {

  return (
    <div className="container">
      <img src={logo} className="App-logo" alt="logo" />
      <Layout title="rss chat" />
    </div>
  );
}

export default App;
