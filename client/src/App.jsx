import './css/App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import NavBar from './components/navbar'
import Home from './components/home'
import Dashboard from "./components/Dashboard";
import Aisuggestions from "./components/Aisuggestions";

function App() {
  return (
    <>
    <Router>
      <NavBar />
      <Routes>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/aisuggestions" element={<Aisuggestions />} />
      </Routes>
    </Router>
    </>
  );
}


export default App;