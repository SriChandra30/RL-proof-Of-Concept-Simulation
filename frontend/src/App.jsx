import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Alerts from "./components/Alerts";
import Visualization from "./components/Visualization";
import Comparison from "./components/Comparison";
import AgentCommandPanel from "./components/AgentCommandPanel";
function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
          <Dashboard />
          <AgentCommandPanel/>
          </>} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/comparison" element={<Comparison />}/>
        <Route path="/visualization" element={<Visualization />}/>
        
        
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
