import { useState } from 'react'
import Explore from './components/Explore'
import Details from './components/Details'
import Navbar from './components/Navbar'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  const [count, setCount] = useState(0)

  return (
    <Router basename="/tourAIst/">
      <Navbar /> {/* Navbar stays consistent across all pages */}
      <Routes>
        <Route path="/" element={<Explore />} /> {/* Default route */}
        <Route path="/details/:id" element={<Details />} /> {/* Dynamic route for details */}
      </Routes>
    </Router>
  );
}

export default App
