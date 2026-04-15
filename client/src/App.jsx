import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./Dashboard";

function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <Link to="/dashboard">Go to Dashboard</Link>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/aisuggestions" element={<Aisuggestions />} />
    </Routes>
  );
}

export default App;