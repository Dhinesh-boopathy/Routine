import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Savings from "./pages/Savings";
import Navbar from "./components/Navbar";
import Routine from "./pages/Routine";
import CreateRoutine from "./components/CreateRoutine";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar/>
        <Routes>
          <Route path="/" element={<Routine />} />
          <Route path="/savings" element={<Savings />} />
          <Route path="/routine" element={<Routine />} />
          <Route path="/create-routine" element={<CreateRoutine />} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;
