import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./Dashboard";
import Aisuggestions from "./aisuggestions";
import NavBar from "./navbar/navbar";

function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <Link to="/dashboard">Go to Dashboard</Link>
      <Link to="/aisuggestions">Go to AI Suggestions</Link>
    </div>
  );
}

function App() {
  return (
    <>
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/aisuggestions" element={<Aisuggestions />} />
      </Routes>
    </>
  );
}


export default App;