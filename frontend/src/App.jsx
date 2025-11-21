import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Package, AlertTriangle, Trash2, DollarSign, RefreshCw, Pencil } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // NEW: Are we editing?
  const [editId, setEditId] = useState(null);        // NEW: Which ID are we editing?
  
  const [formData, setFormData] = useState({
    name: '', category: 'Mobile', price: '', quantity: '', minStock: 5, sku: '', description: '' 
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/products'); // Ensure this matches your backend port
      setProducts(response.data);
      setError('');
    } catch (err) {
      setError('Failed to connect to backend.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // NEW: Prepare the form for editing
  const handleEdit = (product) => {
    setIsEditing(true);
    setEditId(product._id);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      minStock: product.minStock,
      sku: product.sku,
      description: product.description || ''
    });
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: '', category: 'Mobile', price: '', quantity: '', minStock: 5, sku: '', description: '' });
    setIsEditing(false);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      minStock: Number(formData.minStock)
    };

    try {
      if (isEditing) {
        // --- UPDATE LOGIC (PUT) ---
        const response = await axios.put(`http://localhost:5000/products/${editId}`, productData);
        setProducts(products.map(p => (p._id === editId ? response.data.updatedProduct : p)))
        // Update the specific item in the list without refreshing
      } else {
        // --- CREATE LOGIC (POST) ---
        const response = await axios.post('http://localhost:5000/products', productData);
        setProducts([response.data, ...products]);
      }
      
      setIsFormOpen(false);
      resetForm();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure?")) return; // Simple confirmation
    try {
        await axios.delete(`http://localhost:5000/products/${id}`); 
        setProducts(products.filter((p) => p._id !== id)); 
    } catch (error) {
        console.error("Error deleting:", error);
    }
  };

  // Calculation Logic
  const totalValue = products.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const lowStockCount = products.filter(p => p.quantity <= p.minStock).length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="bg-indigo-600 text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Package className="h-6 w-6" />
            <span className="font-bold text-xl tracking-tight">InventoryFlow</span>
          </div>
          <div className="text-sm opacity-80">Dev: Junior Engineer</div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error: </strong><span>{error}</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div><p className="text-slate-500 text-sm font-medium">Total Stock Value</p><h3 className="text-2xl font-bold text-slate-800">₨ {totalValue}</h3></div>
            <div className="bg-emerald-100 p-3 rounded-full text-emerald-600"><DollarSign className="h-6 w-6" /></div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div><p className="text-slate-500 text-sm font-medium">Total Products</p><h3 className="text-2xl font-bold text-slate-800">{products.length}</h3></div>
            <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Package className="h-6 w-6" /></div>
          </div>
          <div className={`p-5 rounded-xl shadow-sm border flex items-center justify-between ${lowStockCount > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
            <div><p className={`${lowStockCount > 0 ? 'text-red-600' : 'text-slate-500'} text-sm font-medium`}>Low Stock Alerts</p><h3 className={`text-2xl font-bold ${lowStockCount > 0 ? 'text-red-700' : 'text-slate-800'}`}>{lowStockCount} Items</h3></div>
            <div className={`${lowStockCount > 0 ? 'bg-red-200 text-red-700' : 'bg-slate-100 text-slate-500'} p-3 rounded-full`}><AlertTriangle className="h-6 w-6" /></div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-800">Product Inventory</h2>
          <div className="flex gap-2">
            <button onClick={fetchProducts} className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-300" title="Refresh"><RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} /></button>
            <button onClick={() => { resetForm(); setIsFormOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm active:scale-95">
              <Plus className="h-5 w-5" /> Add New Product
            </button>
          </div>
        </div>

        {/* Modal Form */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center sticky top-0">
                {/* DYNAMIC TITLE */}
                <h3 className="font-bold text-lg">{isEditing ? 'Edit Product' : 'Add New Stock'}</h3>
                <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label><input required name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Description</label><textarea required name="description" value={formData.description} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" rows="2"></textarea></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Category</label><select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg"><option>Mobile</option><option>Laptop</option><option>Accessories</option><option>Parts</option></select></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">SKU</label><input name="sku" value={formData.sku} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Price (₨)</label><input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label><input required type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" /></div>
                </div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Low Stock Alert</label><input required type="number" name="minStock" value={formData.minStock} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" /></div>
                
                <div className="pt-2">
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-md active:scale-95 transition-all">
                    {/* DYNAMIC BUTTON TEXT */}
                    {isEditing ? 'Update Product' : 'Save Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                <tr><th className="p-4">Product Name</th><th className="p-4">Category</th><th className="p-4">Price</th><th className="p-4">Stock Level</th><th className="p-4 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.length > 0 ? products.map((product) => {
                  const isLowStock = product.quantity <= product.minStock;
                  return (
                    <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-900">{product.name}<div className="text-xs text-slate-400 font-normal">{product.sku}</div></td>
                      <td className="p-4"><span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">{product.category}</span></td>
                      <td className="p-4 text-slate-600">₨ {product.price}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2"><span className={`font-bold ${isLowStock ? 'text-red-600' : 'text-emerald-600'}`}>{product.quantity}</span>{isLowStock && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-medium">Low</span>}</div>
                      </td>
                      <td className="p-4 text-right">
                        {/* NEW: EDIT BUTTON */}
                        <button onClick={() => handleEdit(product)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors mr-2"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(product._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan="5" className="p-8 text-center text-slate-400 italic">{isLoading ? "Loading..." : "No products found."}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}