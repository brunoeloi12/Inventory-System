import { Link, useLocation } from "react-router-dom";

export function Navbar() {
  const location = useLocation();

  const getLinkClass = (path: string) => {
    const baseClass = "px-4 py-2 rounded-md font-medium transition-colors";
    const activeClass = "bg-indigo-600 text-white";
    const inactiveClass = "text-slate-600 hover:bg-slate-200";

    return location.pathname === path
      ? `${baseClass} ${activeClass}`
      : `${baseClass} ${inactiveClass}`;
  };

  return (
    <nav className="bg-white shadow-sm mb-8">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-indigo-700">
          🏭 AutoFlex Inventory
        </div>

        <div className="flex gap-4">
          <Link to="/" className={getLinkClass("/")}>
            Matérias-Primas
          </Link>
          <Link to="/products" className={getLinkClass("/products")}>
            Produtos & Receitas
          </Link>
          <Link to="/planning" className={getLinkClass("/planning")}>
            Relatório de Produção
          </Link>
        </div>
      </div>
    </nav>
  );
}
