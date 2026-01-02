import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";

import Routine from "./pages/Routine";
import Contact from "./pages/Contact";
import CreateRoutine from "./components/CreateRoutine";
import Login from "./components/Login";
import Register from "./components/Register";
import SavedTemplates from "./pages/SavedTemplates";

function App() {
  return (
    <Router>
      <div
        className="min-h-screen flex flex-col
                   bg-slate-100 dark:bg-slate-900
                   text-slate-800 dark:text-slate-100"
      >
        <Navbar />

        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/routine" element={<Routine />} />
            <Route path="/create-routine" element={<CreateRoutine />} />
            <Route path="/saved-templates" element={<SavedTemplates />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
