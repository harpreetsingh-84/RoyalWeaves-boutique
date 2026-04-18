import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { apiService } from '../../services/api';
import { Plus, Pencil, Trash2, Loader2, Upload, UploadCloud, ArrowLeft } from 'lucide-react';

const Products: React.FC = () => {
  const { products: _publicProducts, refreshProducts, formatPrice } = useShop();
  const [adminProducts, setAdminProducts] = useState<any[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', image: '', galleryUrls: '', category: '', quantity: '', colors: [] as { color: string, stock: string, images: string[] }[]
  });
  const [categories, setCategories] = useState<{ _id: string, name: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchAdminProducts();
  }, []);

  const fetchAdminProducts = async () => {
    try {
      const res = await apiService.getAdminProducts();
      if (res.ok) {
        setAdminProducts(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await apiService.getCategories();
      if (res.ok) {
        setCategories(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>, isPrimary: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);
    setUploading(true);

    try {
      const res = await apiService.upload(uploadData);
      const data = await res.json();
      if (res.ok) {
        if (isPrimary) {
          setFormData({ ...formData, image: data.url });
        } else {
          const current = formData.galleryUrls ? formData.galleryUrls + ', ' : '';
          setFormData({ ...formData, galleryUrls: current + data.url });
        }
      }
    } catch (err) {
      console.error(err);
      alert('File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const uploadMultipleHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const uploadData = new FormData();
    Array.from(e.target.files).forEach((file: File) => {
      uploadData.append('images', file);
    });
    setUploading(true);

    try {
      const res = await apiService.uploadMultiple(uploadData);
      const data = await res.json();
      const current = formData.galleryUrls ? formData.galleryUrls + ', ' : '';
      setFormData({ ...formData, galleryUrls: current + data.urls.join(', ') });
    } catch (err) {
      console.error(err);
      alert('Gallery upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        gallery: formData.galleryUrls.split(',').map((url: string) => url.trim()).filter((url: string) => url),
        colors: formData.colors.map((c: any) => ({ color: c.color, stock: Number(c.stock), images: c.images || [] }))
      };

      if (editingId) {
        await apiService.updateProduct(editingId, payload);
      } else {
        await apiService.addProduct(payload);
      }

      refreshProducts();
      fetchAdminProducts();
      cancelForm();
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
      galleryUrls: Array.isArray(product.gallery) ? product.gallery.join(', ') : '',
      quantity: product.quantity ? product.quantity.toString() : '0',
      colors: product.colors ? product.colors.map((c: any) => ({ color: c.color, stock: c.stock.toString(), images: c.images?.length > 0 ? c.images : (c.image ? [c.image] : []) })) : []
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', description: '', price: '', image: '', galleryUrls: '', category: '', quantity: '', colors: [] });
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setDeletingId(id);
    try {
      await apiService.deleteProduct(id);
      refreshProducts();
      fetchAdminProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const addColorVariant = () => {
    setFormData({ ...formData, colors: [...formData.colors, { color: '', stock: '0', images: [] }] });
  };

  const updateColorVariant = (index: number, key: 'color' | 'stock', value: string) => {
    const updated = [...formData.colors];
    updated[index][key] = value;
    setFormData({ ...formData, colors: updated });
  };

  const uploadMultipleColorImagesHandler = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (!e.target.files?.length) return;

    const uploadData = new FormData();
    Array.from(e.target.files).forEach((file: File) => {
      uploadData.append('images', file);
    });
    setUploading(true);

    try {
      const res = await apiService.uploadMultiple(uploadData);
      const data = await res.json();
      const currentImages = formData.colors[index].images || [];
      const updated = [...formData.colors];
      updated[index].images = [...currentImages, ...data.urls];
      setFormData({ ...formData, colors: updated });
    } catch (err) {
      console.error(err);
      alert('Gallery upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeColorVariant = (index: number) => {
    const updated = formData.colors.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, colors: updated });
  };

  return (
    <div className="fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-lightText">Products Inventory</h1>
          <p className="text-sm text-lightText/60 mt-1">Manage and track your entire catalog.</p>
        </div>
        <button
          onClick={showForm ? cancelForm : () => setShowForm(true)}
          className={`px-4 py-2 font-medium rounded-md transition-colors shadow-sm ${showForm
              ? 'bg-gray-100 text-lightText border border-gray-200 hover:bg-gray-200'
              : 'bg-primaryAction text-darkBg hover:bg-opacity-90'
            }`}
        >
          {showForm ? <span className="flex items-center gap-2"><ArrowLeft size={18} /> Back to List</span> : <span className="flex items-center gap-2"><Plus size={18} /> Add Product</span>}
        </button>
      </div>

      {showForm && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in relative">
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-lg text-lightText">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            </div>
            <form onSubmit={handleAddProduct} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-lightText/60 mb-1 uppercase tracking-wide">Product Name</label>
                  <input required type="text" placeholder="e.g. Vintage Cotton Shirt" className="w-full border border-gray-200 p-2.5 rounded focus:ring-2 focus:ring-primaryAction/20 outline-none transition-all text-lightText bg-white" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-lightText/60 mb-1 uppercase tracking-wide">Category</label>
                  <select
                    required
                    className="w-full border border-gray-200 p-2.5 rounded focus:ring-2 focus:ring-primaryAction/20 outline-none appearance-none bg-white text-lightText"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">Select a Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-lightText/60 mb-1 uppercase tracking-wide">Price (₹)</label>
                    <input required type="number" min="0" className="w-full border border-gray-200 bg-white text-lightText p-2.5 rounded focus:ring-2 focus:ring-primaryAction/20 outline-none" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-lightText/60 mb-1 uppercase tracking-wide">Stock Quantity</label>
                    <input required type="number" min="0" className="w-full border border-gray-200 bg-white text-lightText p-2.5 rounded focus:ring-2 focus:ring-primaryAction/20 outline-none" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-lightText/60 mb-1 uppercase tracking-wide">Primary Cover Image</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input required type="text" placeholder="Direct URL or upload ->" className="flex-1 border border-gray-200 bg-white text-lightText p-2.5 rounded w-full outline-none" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                    <input type="file" accept="image/*" id="primaryUpload" className="hidden" onChange={(e) => uploadFileHandler(e, true)} />
                    <label htmlFor="primaryUpload" className={`px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-lightText font-medium rounded cursor-pointer flex items-center justify-center gap-2 shrink-0 shadow-sm ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                      {uploading ? 'Uploading...' : 'Upload'}
                    </label>
                  </div>
                  {formData.image && <img src={formData.image} className="mt-2 h-20 rounded border border-gray-200 bg-gray-50 object-cover" alt="preview" />}
                </div>

                <div>
                  <label className="block text-xs font-bold text-lightText/60 mb-1 uppercase tracking-wide">Gallery Images</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input type="text" placeholder="Urls separated by commas" className="flex-1 border border-gray-200 bg-white text-lightText p-2.5 rounded w-full outline-none" value={formData.galleryUrls} onChange={e => setFormData({ ...formData, galleryUrls: e.target.value })} />
                    <input type="file" accept="image/*" multiple id="galleryUpload" className="hidden" onChange={uploadMultipleHandler} />
                    <label htmlFor="galleryUpload" className={`px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-lightText font-medium rounded cursor-pointer flex items-center justify-center gap-2 shrink-0 shadow-sm ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      {uploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                      {uploading ? 'Uploading...' : 'Upload Many'}
                    </label>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-lightText/60 mb-1 uppercase tracking-wide">Detailed Description</label>
                <textarea required placeholder="Write a description for the product..." className="w-full border border-gray-200 bg-white text-lightText p-2.5 rounded h-32 resize-y outline-none focus:ring-2 focus:ring-primaryAction/20" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>

              <div className="md:col-span-2 border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-lightText/60 uppercase tracking-wide">Color Variants (Optional)</label>
                  <button type="button" onClick={addColorVariant} className="text-xs text-secondaryAction font-bold hover:underline">+ Add Variant</button>
                </div>
                {formData.colors.map((c, index) => (
                  <div key={index} className="flex gap-4 items-center mb-2">
                    <input required placeholder="Color Name (e.g. Red)" type="text" className="border border-gray-200 bg-white text-lightText p-2 rounded flex-1 outline-none" value={c.color} onChange={e => updateColorVariant(index, 'color', e.target.value)} />
                    <input required placeholder="Stock" type="number" min="0" className="border border-gray-200 bg-white text-lightText p-2 rounded w-24 outline-none" value={c.stock} onChange={e => updateColorVariant(index, 'stock', e.target.value)} />

                    <div className="flex items-center gap-2">
                      <div className="flex gap-1 overflow-x-auto max-w-[120px] scrollbar-hide">
                        {c.images && c.images.map((imgUrl, iIdx) => (
                          <img key={iIdx} src={imgUrl} alt="Variant" className="w-8 h-8 object-cover rounded border border-gray-200 shrink-0" />
                        ))}
                      </div>
                      <input type="file" accept="image/*" multiple id={`colorUpload-${index}`} className="hidden" onChange={(e) => uploadMultipleColorImagesHandler(e, index)} />
                      <label htmlFor={`colorUpload-${index}`} className={`px-3 py-1.5 bg-gray-100 border border-gray-200 hover:bg-gray-200 text-lightText text-xs font-medium rounded cursor-pointer flex items-center justify-center gap-1 shrink-0 shadow-sm ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                        <UploadCloud size={14} /> <span className="hidden sm:inline">Upload Photos</span>
                      </label>
                    </div>

                    <button type="button" onClick={() => removeColorVariant(index)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={cancelForm} className="px-5 py-2 text-lightText/60 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-bold text-sm border border-gray-200">Cancel</button>
                <button type="submit" disabled={isAdding || uploading} className="px-6 py-2 btn-primary text-sm shadow-sm transition disabled:opacity-70 disabled:cursor-wait">
                  {isAdding ? 'Saving...' : (editingId ? 'Save Changes' : 'Create Product')}
                </button>
              </div>
            </form>
          </div>

          {/* Product Status Overview */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col h-full max-h-[800px]">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 shrink-0">
              <h2 className="font-semibold text-lg">Product Status Overview</h2>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-red-600 uppercase tracking-wide mb-3 flex items-center gap-2"><Trash2 size={16} /> Deleted Products</h3>
                <div className="space-y-3">
                  {adminProducts.filter(p => p.isDeleted).length === 0 ? (
                    <p className="text-xs text-gray-400">No deleted products.</p>
                  ) : (
                    adminProducts.filter(p => p.isDeleted).map(p => (
                      <div key={p._id} className="flex items-center gap-3 bg-red-50 p-2 rounded border border-red-100">
                        <img src={p.image} className="w-10 h-10 object-cover rounded" alt={p.name} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-100 font-semibold truncate">{p.name}</p>
                          <p className="text-[10px] text-red-600 font-bold">Deleted</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-orange-600 uppercase tracking-wide mb-3 flex items-center gap-2"><Loader2 size={16} /> Sold Out</h3>
                <div className="space-y-3">
                  {adminProducts.filter(p => !p.isDeleted && p.quantity === 0 && (!p.colors || p.colors.length === 0 || p.colors.every((c: any) => c.stock === 0))).length === 0 ? (
                    <p className="text-xs text-gray-400">No sold out products.</p>
                  ) : (
                    adminProducts.filter(p => !p.isDeleted && p.quantity === 0 && (!p.colors || p.colors.length === 0 || p.colors.every((c: any) => c.stock === 0))).map(p => (
                      <div key={p._id} className="flex items-center gap-3 bg-orange-50 p-2 rounded border border-orange-100">
                        <img src={p.image} className="w-10 h-10 object-cover rounded" alt={p.name} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-100 font-semibold truncate">{p.name}</p>
                          <p className="text-[10px] text-orange-600 font-bold">Sold Out</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product List Grid/Table */}
      {!showForm && (
        <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-darkBg border-b border-gray-100">
                  <tr>
                    <th className="p-4 font-bold text-lightText/60 text-xs uppercase tracking-wider">Product</th>
                    <th className="p-4 font-bold text-lightText/60 text-xs uppercase tracking-wider">Category</th>
                    <th className="p-4 font-bold text-lightText/60 text-xs uppercase tracking-wider">Stock</th>
                    <th className="p-4 font-bold text-lightText/60 text-xs uppercase tracking-wider">Price</th>
                    <th className="p-4 font-bold text-lightText/60 text-xs uppercase tracking-wider w-32">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {adminProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-lightText/60">
                        No products found. Start by adding a new one!
                      </td>
                    </tr>
                  ) : (
                    adminProducts.map((product) => (
                      <tr key={product._id} className={`hover:bg-gray-50/50 transition-colors ${product.isDeleted ? 'opacity-50' : ''}`}>
                        <td className="p-4 w-1/3">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded shadow-sm border border-gray-200" />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lightText text-sm truncate" title={product.name}>{product.name}</h3>
                              <p className="text-xs text-lightText/60 line-clamp-1 mt-0.5" title={product.description}>{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 uppercase tracking-wide">
                            {product.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            {product.colors && product.colors.length > 0 ? (
                              product.colors.map((c: any, i: number) => (
                                <div key={i} className="flex items-center gap-2 text-xs">
                                  <span className={`w-1.5 h-1.5 rounded-full ${product.isDeleted ? 'bg-gray-400' : c.stock > 5 ? 'bg-green-500' : c.stock > 0 ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                                  <span className="font-medium text-lightText/80">{c.color}: {c.stock}</span>
                                </div>
                              ))
                            ) : (
                              <div className="flex items-center gap-2 text-xs">
                                <span className={`w-2 h-2 rounded-full ${product.isDeleted ? 'bg-gray-400' : product.quantity > 5 ? 'bg-green-500' : product.quantity > 0 ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                                <span className="font-medium">Base: {product.quantity}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-emerald-600 font-bold">{formatPrice(product.price)}</td>                            <td className="p-4">
                          <div className="flex gap-2">
                            <button onClick={() => handleEditProduct(product)} disabled={product.isDeleted} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition flex items-center justify-center h-9 w-9 disabled:opacity-30" aria-label="Edit">
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              disabled={deletingId === product._id || product.isDeleted}
                              className="p-2 text-red-600 hover:bg-red-50 rounded transition disabled:opacity-30 flex items-center justify-center h-9 w-9"
                              aria-label="Delete"
                            >
                              {deletingId === product._id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden flex flex-col divide-y divide-gray-100">
              {adminProducts.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  No products found. Start by adding a new one!
                </div>
              ) : (
                adminProducts.map((product) => (
                  <div key={product._id} className={`p-5 flex gap-4 items-start ${product.isDeleted ? 'opacity-50' : ''}`}>
                    <img src={product.image} alt={product.name} className="w-20 h-24 object-cover rounded shadow-sm border shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="font-bold text-gray-100 text-sm leading-snug line-clamp-2">{product.name}</h3>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => handleEditProduct(product)} disabled={product.isDeleted} className="p-2 text-blue-600 hover:bg-blue-50 bg-blue-50/50 rounded transition flex items-center justify-center h-8 w-8 disabled:opacity-30" aria-label="Edit">
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            disabled={deletingId === product._id || product.isDeleted}
                            className="p-2 text-red-600 hover:bg-red-50 bg-red-50/50 rounded transition disabled:opacity-30 flex items-center justify-center h-8 w-8"
                            aria-label="Delete"
                          >
                            {deletingId === product._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                          </button>
                        </div>
                      </div>
                      <p className="text-emerald-600 font-bold mb-2 text-sm">{formatPrice(product.price)}</p>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-adminCardAlt text-gray-400 uppercase tracking-wide">
                          {product.category}
                        </span>
                        {product.colors && product.colors.length > 0 ? (
                          product.colors.map((c: any, i: number) => (
                            <span key={i} className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${product.isDeleted ? 'bg-gray-200 text-gray-500' : c.stock > 5 ? 'bg-green-50 text-green-700' : c.stock > 0 ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${product.isDeleted ? 'bg-gray-400' : c.stock > 5 ? 'bg-green-500' : c.stock > 0 ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                              {c.color}: {c.stock}
                            </span>
                          ))
                        ) : (
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${product.isDeleted ? 'bg-gray-200 text-gray-500' : product.quantity > 5 ? 'bg-green-50 text-green-700' : product.quantity > 0 ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${product.isDeleted ? 'bg-gray-400' : product.quantity > 5 ? 'bg-green-500' : product.quantity > 0 ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                            Stock: {product.quantity}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete History Section */}
      {!showForm && adminProducts.some(p => p.isDeleted) && (
        <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden mt-8 animate-fade-in">
          <div className="bg-red-50/50 px-6 py-4 border-b border-red-100">
            <h2 className="font-semibold text-lg text-red-900 flex items-center gap-2">
              <Trash2 size={20} className="text-red-500" /> Delete History
            </h2>
            <p className="text-xs text-red-600 mt-1">Products that have been removed from the catalog.</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {adminProducts.filter(p => p.isDeleted).map(product => (
                <div key={product._id} className="flex flex-col border border-red-100 bg-white rounded-lg p-3 relative shadow-sm">
                  <div className="flex gap-3 items-center mb-3">
                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded object-cover border border-gray-200 bg-gray-50" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-lightText truncate" title={product.name}>{product.name}</h4>
                      <p className="text-xs text-lightText/60 truncate">{product.category}</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center text-xs">
                    <span className="text-red-600 font-medium">Deleted</span>
                    <span className="text-lightText/60">
                      {product.deletedAt ? new Date(product.deletedAt).toLocaleDateString() : 'Unknown date'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
