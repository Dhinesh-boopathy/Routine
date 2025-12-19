import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">Partitioner</h1>

      <div className="flex gap-6 text-lg">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <Link to="/savings" className="hover:text-blue-600">Savings</Link>
        <Link to="/routine" className="hover:text-blue-600">Routine</Link>

      </div>
    </nav>
  );
}
