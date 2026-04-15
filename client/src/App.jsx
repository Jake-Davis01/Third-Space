import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { NavBar } from './navbar/navbar'
import { Home } from './home/home'

function App() {
  return (
    <>
    <Router>
      <NavBar />
      <Routes>
        <Route path="/home" element={<Home />}></Route>
      </Routes>
    </Router>
    </>
  )
}

export default App
