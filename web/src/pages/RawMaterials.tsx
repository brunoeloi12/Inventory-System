import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../store/store";
import { fetchMaterials, addMaterial } from "../store/slices/materialsSlice";

export function RawMaterials() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, status } = useSelector((state: RootState) => state.materials);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    stockQuantity: 0,
  });

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMaterials());
    }
  }, [status, dispatch]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(addMaterial(formData));
    setFormData({ name: "", code: "", stockQuantity: 0 });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">
        📦 Raw Materials
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-indigo-600">New Item</h2>
        <form
          onSubmit={handleSubmit}
          className="flex gap-4 items-end flex-wrap"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Code
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Stock
            </label>
            <input
              type="number"
              required
              className="mt-1 block w-24 rounded-md border-slate-300 shadow-sm p-2 border"
              value={formData.stockQuantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stockQuantity: Number(e.target.value),
                })
              }
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Add
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Stock
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {list.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  #{item.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  {item.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {item.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 text-right font-bold">
                  {item.stockQuantity}
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-4 text-center text-slate-400"
                >
                  No items registered.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
