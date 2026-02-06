import { useEffect, useState } from "react";
import { api } from "../services/api";

interface ProductionItem {
  productName: string;
  quantity: number;
  unitValue: number;
  subtotal: number;
}

interface ProductionResult {
  items: ProductionItem[];
  totalValue: number;
}

export function Planning() {
  const [plan, setPlan] = useState<ProductionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPlan = async () => {
    setLoading(true);
    try {
      const response = await api.get<ProductionResult>("/planning");
      setPlan(response.data);
    } catch (error) {
      console.error("Erro ao calcular produção", error);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          📈 Relatório de Produção
        </h1>
        <button
          onClick={fetchPlan}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          🔄 Recalcular
        </button>
      </div>

      {loading && (
        <div className="text-center py-10">
          <p className="text-xl text-indigo-600 animate-pulse">
            Calculando melhor produção...
          </p>
        </div>
      )}

      {!loading && plan && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {plan.items.length === 0 ? (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p className="text-yellow-700">
                  O estoque atual não é suficiente para produzir nenhum item
                  cadastrado.
                </p>
              </div>
            ) : (
              plan.items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-lg shadow border-l-8 border-green-500 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">
                      {item.productName}
                    </h3>
                    <p className="text-slate-500">
                      Produzir:{" "}
                      <strong className="text-slate-900 text-lg">
                        {item.quantity} unidades
                      </strong>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Valor unitário: ${item.unitValue.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Subtotal</p>
                    <p className="text-2xl font-bold text-green-600">
                      $ {item.subtotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div>
            <div className="bg-indigo-900 text-white p-6 rounded-lg shadow-lg sticky top-8">
              <h2 className="text-lg font-medium text-indigo-200 uppercase mb-2">
                Receita Bruta Estimada
              </h2>
              <p className="text-5xl font-bold mb-6">
                $ {plan.totalValue.toFixed(2)}
              </p>

              <div className="border-t border-indigo-700 pt-4">
                <p className="text-sm text-indigo-300">
                  * Este cálculo prioriza produtos de maior valor agregado
                  (Algoritmo Guloso) utilizando o estoque disponível no momento.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
