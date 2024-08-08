import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AllOrders from './AllOrders';
import Operations from './Operations';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AllOrders />} />
        <Route path="/operations" element={<Operations />} />
      </Routes>
    </Router>
  );
}

export default App;