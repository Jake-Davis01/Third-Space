import './css/App.css'
import './css/index.css';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'

import NavBar from './components/navbar'
import Home from './components/home'
import Dashboard from "./components/Dashboard";
import Aisuggestions from "./components/Aisuggestions";
import SignUp from './components/signup';
import LandingPage from './components/landingPage';

// Layout component that includes the NavBar
const WithNav = () => (
  <>
    <NavBar />
    <Outlet />
  </>
)

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page — no NavBar */}
        <Route path="/" element={<LandingPage />} />

        {/* All other pages — wrapped with NavBar */}
        <Route element={<WithNav />}>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/aisuggestions" element={<Aisuggestions />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
      </Routes>
    </Router>
  )
}


export default App;