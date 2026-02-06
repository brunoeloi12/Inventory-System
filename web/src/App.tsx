import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RawMaterials } from "./pages/RawMaterials";
import { Products } from "./pages/Products";
import { Navbar } from "./components/Navbar";
import { Planning } from "./pages/Planning";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100 pb-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<RawMaterials />} />
          <Route path="/products" element={<Products />} />
          <Route path="/planning" element={<Planning />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
