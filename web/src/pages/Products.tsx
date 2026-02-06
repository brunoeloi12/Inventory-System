import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../store/store";
import {
  fetchProducts,
  addProduct,
  type ProductMaterialItem,
} from "../store/slices/productsSlice";
import { fetchMaterials } from "../store/slices/materialsSlice";

export function Products() {
  const dispatch = useDispatch<AppDispatch>();

  const productState = useSelector((state: RootState) => state.products) as any;
  const materialState = useSelector(
    (state: RootState) => state.materials,
  ) as any;

  const products = productState?.products || [];
  const materials = materialState?.list || [];

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [value, setValue] = useState(0);

  const [recipe, setRecipe] = useState<ProductMaterialItem[]>([]);

  const [selectedMaterialId, setSelectedMaterialId] = useState<number | "">("");
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchMaterials());
  }, [dispatch]);

  const handleAddIngredient = () => {
    if (selectedMaterialId && amount > 0) {
      setRecipe([
        ...recipe,
        { rawMaterialId: Number(selectedMaterialId), quantity: amount },
      ]);
      setSelectedMaterialId("");
      setAmount(0);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formattedMaterials = recipe.map((item) => ({
      rawMaterialId: item.rawMaterialId,
      quantity: item.quantity,
    }));

    dispatch(
      addProduct({
        name,
        code,
        value,
        materials: formattedMaterials as any,
      }),
    );

    setName("");
    setCode("");
    setValue(0);
    setRecipe([]);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">
        🍔 Produtos & Receitas
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold text-indigo-600">
            1. Dados do Produto
          </h2>
          <div>
            <label className="block text-sm text-slate-700">Nome</label>
            <input
              className="w-full border p-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-slate-700">Código</label>
              <input
                className="w-full border p-2 rounded"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-slate-700">
                Preço de Venda ($)
              </label>
              <input
                type="number"
                className="w-full border p-2 rounded"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={recipe.length === 0}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:bg-slate-300 transition-colors"
          >
            Salvar Produto Completo
          </button>
        </form>

        <div className="bg-slate-50 p-4 rounded border border-slate-200">
          <h2 className="text-xl font-semibold text-indigo-600 mb-4">
            2. Ficha Técnica (Receita)
          </h2>

          <div className="flex gap-2 mb-4 items-end">
            <div className="flex-1">
              <label className="block text-sm text-slate-600">
                Ingrediente (Matéria-Prima)
              </label>
              <select
                className="w-full border p-2 rounded"
                value={selectedMaterialId}
                onChange={(e) => setSelectedMaterialId(Number(e.target.value))}
              >
                <option value="">Selecione...</option>
                {materials.map((m: any) => (
                  <option key={m.id} value={m.id}>
                    {m.name} (Estoque: {m.stockQuantity})
                  </option>
                ))}
              </select>
            </div>
            <div className="w-24">
              <label className="block text-sm text-slate-600">Qtd</label>
              <input
                type="number"
                className="w-full border p-2 rounded"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
            <button
              type="button"
              onClick={handleAddIngredient}
              className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition-colors"
            >
              +
            </button>
          </div>

          <ul className="space-y-2">
            {recipe.map((item, idx) => {
              const matName =
                materials.find((m: any) => m.id === item.rawMaterialId)?.name ||
                "Desconhecido";
              return (
                <li
                  key={idx}
                  className="flex justify-between bg-white p-2 rounded shadow-sm text-sm"
                >
                  <span>{matName}</span>
                  <span className="font-bold">{item.quantity} un</span>
                </li>
              );
            })}
            {recipe.length === 0 && (
              <p className="text-slate-400 text-sm text-center">
                Nenhum ingrediente adicionado.
              </p>
            )}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((prod: any) => (
          <div
            key={prod.id}
            className="bg-white p-4 rounded shadow border-l-4 border-indigo-500 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-slate-800">
                  {prod.name}
                </h3>
                <p className="text-xs text-slate-500 uppercase">{prod.code}</p>
              </div>
              <p className="text-green-600 font-bold text-lg">
                $ {prod.value.toFixed(2)}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-600 mb-2 uppercase">
                Receita / Composição:
              </p>
              <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded space-y-1">
                {(!prod.materials && !prod.composition) ||
                (prod.materials || prod.composition || []).length === 0 ? (
                  <span className="italic text-slate-400">
                    Sem receita cadastrada
                  </span>
                ) : (
                  (prod.materials || prod.composition).map(
                    (m: any, i: number) => (
                      <div key={i} className="flex justify-between">
                        <span>
                          • {m.rawMaterial?.name || "Item #" + m.rawMaterialId}
                        </span>
                        <span className="font-semibold">
                          {m.quantityRequired || m.quantity} un
                        </span>
                      </div>
                    ),
                  )
                )}
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="col-span-3 text-center py-10 text-slate-500">
            Nenhum produto cadastrado ainda.
          </div>
        )}
      </div>
    </div>
  );
}
