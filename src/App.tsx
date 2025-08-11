import React from 'react';
import HomePage from './pages/home';
export default function App() {
  return (
    <div className="app-container">
      <div className="header">
        <h1>Home Inspectors</h1>
        <div>కొనేముందు పరీక్షించండి</div>
      </div>
      <main>
        <HomePage />
      </main>
    </div>
  );
}
