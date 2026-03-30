import { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const Admin = () => {
  const { products, refreshProducts, isAdmin, isLoading, formatPrice } = useShop();
  const navigate = useNavigate();
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    galleryUrls: '',
    category: '',
    quantity: ''
  });

  const [uploading, setUploading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [categories, setCategories] = useState<{_id: string, name: string}[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>, isPrimary: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);
    setUploading(true);

    try {
      const res = await apiService.upload(uploadData);
      const data = await res.json();
      if (isPrimary) {
        setFormData({...formData, image: data.url});
      } else {
        const current = formData.galleryUrls ? formData.galleryUrls + ', ' : '';
        setFormData({...formData, galleryUrls: current + data.url});
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
    Array.from(e.target.files).forEach(file => {
      uploadData.append('images', file);
    });
    setUploading(true);
    
    try {
      const res = await apiService.uploadMultiple(uploadData);
      const data = await res.json();
      const current = formData.galleryUrls ? formData.galleryUrls + ', ' : '';
      setFormData({...formData, galleryUrls: current + data.urls.join(', ')});
    } catch (err) {
      console.error(err);
      alert('Gallery upload failed');
    } finally {
      setUploading(false);
    }
  };

  // OTP Management State
  const [adminAction, setAdminAction] = useState<'update' | 'add'>('add');
  const [adminEmail, setAdminEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [adminMsg, setAdminMsg] = useState({ text: '', type: '' });

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail) return;
    setIsSendingOtp(true);
    setAdminMsg({ text: '', type: '' });
    try {
      const res = await apiService.sendAdminOtp({ action: adminAction, targetEmail: adminEmail });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setAdminMsg({ text: 'OTP sent via email. Valid for 5 minutes.', type: 'success' });
      } else {
        setAdminMsg({ text: data.message || 'Failed to send OTP', type: 'error' });
      }
    } catch (err) {
      setAdminMsg({ text: 'Network Error', type: 'error' });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput) return;
    setIsVerifyingOtp(true);
    try {
      const res = await apiService.verifyAdminAction({ action: adminAction, targetEmail: adminEmail, otp: otpInput });
      const data = await res.json();
      if (res.ok) {
        setAdminMsg({ text: data.message || 'Success!', type: 'success' });
        setAdminEmail('');
        setOtpInput('');
        setOtpSent(false);
      } else {
        setAdminMsg({ text: data.message || 'Failed to verify OTP', type: 'error' });
      }
    } catch (err) {
      setAdminMsg({ text: 'Network Error', type: 'error' });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const resetAdminForm = (action: 'update' | 'add') => {
    setAdminAction(action);
    setAdminEmail('');
    setOtpSent(false);
    setOtpInput('');
    setAdminMsg({ text: '', type: '' });
  };

  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
    monthlyTraffic: 0
  });

  const fetchAnalytics = async () => {
    try {
      const res = await apiService.getAnalytics();
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const [orders, setOrders] = useState([]);
  const [siteContent, setSiteContent] = useState<any>(null);
  const [isUpdatingContent, setIsUpdatingContent] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const fetchOrders = async () => {
    try {
      const res = await apiService.getOrders();
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchContent = async () => {
    try {
      const res = await apiService.getContent();
      if (res.ok) {
        setSiteContent(await res.json());
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

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    } else {
      fetchAnalytics();
      fetchOrders();
      fetchContent();
      fetchCategories();
    }
  }, [isAdmin, navigate]);

  const handleCreateCategory = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setIsAddingCategory(true);
    try {
      const res = await apiService.addCategory({ name: newCategoryName });
      if (res.ok) {
        const created = await res.json();
        setCategories([...categories, created]);
        setFormData({ ...formData, category: created.name });
        setNewCategoryName('');
        setShowCategoryInput(false);
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to add category');
      }
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setIsAddingCategory(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        gallery: formData.galleryUrls.split(',').map(url => url.trim()).filter(url => url)
      };

      if (editingId) {
        await apiService.updateProduct(editingId, payload);
      } else {
        await apiService.addProduct(payload);
      }
      
      refreshProducts();
      setFormData({ name: '', description: '', price: '', image: '', galleryUrls: '', category: '', quantity: '' });
      setEditingId(null);
      setShowForm(false);
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
      quantity: product.quantity ? product.quantity.toString() : '0'
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', description: '', price: '', image: '', galleryUrls: '', category: '', quantity: '' });
  };

  const handleDeleteProduct = async (id: string) => {
    setDeletingId(id);
    try {
      await apiService.deleteProduct(id);
      refreshProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingContent(true);
    try {
      const res = await apiService.updateContent(siteContent);
      if (res.ok) {
        alert('Website content updated successfully!');
      } else {
        alert('Failed to update content');
      }
    } catch (error) {
      console.error("Error updating site content:", error);
      alert('Error updating site content');
    } finally {
      setIsUpdatingContent(false);
    }
  };

  const updateHeroSlide = (index: number, field: string, value: string) => {
    const updated = { ...siteContent };
    updated.heroSlides[index][field] = value;
    setSiteContent(updated);
  };

  const updateCategory = (index: number, field: string, value: string) => {
    const updated = { ...siteContent };
    updated.featuredCategories[index][field] = value;
    setSiteContent(updated);
  };

  const uploadUpiQr = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uploadData = new FormData();
    uploadData.append('image', file);
    setUploading(true);
    try {
      const res = await apiService.upload(uploadData);
      if (res.ok) {
        const data = await res.json();
        setSiteContent({...siteContent, upiQrCode: data.url});
      }
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4 fade-in">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-accent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  if (!isAdmin) return null; // Prevent flicker

  return (
    <div className="px-4 py-8 sm:p-8 max-w-7xl mx-auto fade-in">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button className="btn-primary" onClick={showForm ? cancelForm : () => setShowForm(true)}>
          {showForm ? 'Cancel' : 'Add New Product'}
        </button>
      </header>
      
      {showForm && (
        <form onSubmit={handleAddProduct} className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input required type="text" placeholder="Name" className="border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              {!showCategoryInput ? (
                <select 
                  required 
                  className="border p-2 rounded flex-grow" 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              ) : (
                <input 
                  type="text" 
                  placeholder="New Category Name" 
                  className="border p-2 rounded flex-grow" 
                  value={newCategoryName} 
                  onChange={e => setNewCategoryName(e.target.value)} 
                />
              )}
              <button 
                type="button"
                className="btn-primary text-xs px-3" 
                onClick={showCategoryInput ? handleCreateCategory : () => setShowCategoryInput(true)}
                disabled={isAddingCategory}
              >
                {showCategoryInput ? (isAddingCategory ? '...' : 'Save') : '+ New'}
              </button>
              {showCategoryInput && (
                <button 
                  type="button"
                  className="px-3 border rounded text-xs hover:bg-gray-50"
                  onClick={() => setShowCategoryInput(false)}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          <input required type="number" placeholder="Price (INR)" className="border p-2 rounded" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
          <input required type="number" placeholder="Stock Quantity" className="border p-2 rounded" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Primary Image</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input required type="text" placeholder="URL or Upload" className="border p-2 rounded flex-grow" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
              <input type="file" accept="image/*" id="primaryUpload" className="hidden" onChange={(e) => uploadFileHandler(e, true)} />
              <label htmlFor="primaryUpload" className={`btn-primary cursor-pointer flex items-center justify-center min-w-[120px] ${uploading ? 'opacity-70' : ''} text-sm sm:text-base`}>
                {uploading ? '...' : 'Upload File'}
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Gallery Images</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input type="text" placeholder="URLs (Comma Separated) or Upload" className="border p-2 rounded flex-grow" value={formData.galleryUrls} onChange={e => setFormData({...formData, galleryUrls: e.target.value})} />
              <input type="file" accept="image/*" multiple id="galleryUpload" className="hidden" onChange={uploadMultipleHandler} />
              <label htmlFor="galleryUpload" className={`btn-primary cursor-pointer flex items-center justify-center min-w-[120px] ${uploading ? 'opacity-70' : ''} text-sm sm:text-base`}>
                {uploading ? '...' : 'Upload Files'}
              </label>
            </div>
          </div>
          
          <textarea required placeholder="Description" className="border p-2 rounded md:col-span-2" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          <button type="submit" disabled={isAdding} className={`btn-primary md:col-span-2 mt-2 ${isAdding ? 'opacity-70 cursor-not-allowed' : ''}`}>
            {isAdding ? 'Saving...' : (editingId ? 'Update Product' : 'Submit Product')}
          </button>
        </form>
      )}

      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:-translate-y-1 transition-transform border border-gray-100 border-t-4 border-t-accent">
            <h3 className="text-gray-500 font-medium tracking-widest text-xs uppercase mb-3">Total Orders</h3>
            <p className="text-4xl font-bold text-gray-900">{analytics.totalOrders}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:-translate-y-1 transition-transform border border-gray-100 border-t-4 border-t-emerald-400">
            <h3 className="text-gray-500 font-medium tracking-widest text-xs uppercase mb-3">Turnover</h3>
            <p className="text-4xl font-bold text-gray-900">{formatPrice(analytics.totalRevenue)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:-translate-y-1 transition-transform border border-gray-100 border-t-4 border-t-blue-400">
            <h3 className="text-gray-500 font-medium tracking-widest text-xs uppercase mb-3">Customer Demand</h3>
            <p className="text-4xl font-bold text-gray-900">{analytics.totalCustomers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:-translate-y-1 transition-transform border border-gray-100 border-t-4 border-t-purple-400">
            <h3 className="text-gray-500 font-medium tracking-widest text-xs uppercase mb-3">Monthly Traffic</h3>
            <p className="text-4xl font-bold text-gray-900">{analytics.monthlyTraffic.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-8 rounded-lg shadow-sm overflow-x-auto">
          <h2 className="text-xl font-bold mb-6">Manage Products</h2>
          {products.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No products yet. Add some items to your database!</p>
          ) : (
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-4 px-4 font-semibold text-gray-600">Image</th>
                  <th className="py-4 px-4 font-semibold text-gray-600">Name</th>
                  <th className="py-4 px-4 font-semibold text-gray-600">Category</th>
                  <th className="py-4 px-4 font-semibold text-gray-600">Price</th>
                  <th className="py-4 px-4 font-semibold text-gray-600">Stock</th>
                  <th className="py-4 px-4 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                    </td>
                    <td className="py-4 px-4 font-medium">{product.name}</td>
                    <td className="py-4 px-4 text-gray-500 uppercase tracking-wider text-sm">{product.category}</td>
                    <td className="py-4 px-4 font-medium text-accent">{formatPrice(product.price)}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.quantity > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded font-medium hover:bg-blue-100 transition-colors text-sm" onClick={() => handleEditProduct(product)}>
                          Edit
                        </button>
                        <button disabled={deletingId === product._id} className={`px-4 py-2 bg-red-50 text-red-600 rounded font-medium hover:bg-red-100 transition-colors text-sm ${deletingId === product._id ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={() => handleDeleteProduct(product._id)}>
                          {deletingId === product._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>



        {/* CMS: Manage Website Content */}
        {siteContent && (
          <div className="bg-white p-4 sm:p-8 rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <h2 className="text-xl font-bold mb-2">Manage Website Content</h2>
            <p className="text-gray-500 mb-8 text-sm">Update the text and images shown on the public landing page instantly.</p>
            
            <form onSubmit={handleUpdateContent} className="flex flex-col gap-10">
              
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-serif font-bold mb-4 text-blue-900 border-b border-blue-200 pb-2">UPI Payment Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-blue-800 uppercase tracking-widest">Store UPI ID</label>
                    <input type="text" className="w-full text-sm border border-blue-200 p-3 rounded bg-white text-gray-900 font-mono tracking-wider" value={siteContent.upiId || ''} onChange={(e) => setSiteContent({...siteContent, upiId: e.target.value})} placeholder="e.g. 8824656153@axl" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-blue-800 uppercase tracking-widest">QR Code Image URL / Upload</label>
                    <div className="flex gap-2">
                       <input type="text" className="flex-1 text-sm border border-blue-200 p-3 rounded bg-white" value={siteContent.upiQrCode || ''} onChange={(e) => setSiteContent({...siteContent, upiQrCode: e.target.value})} placeholder="URL or Upload" />
                       <input type="file" accept="image/*" id="qrUpload" className="hidden" onChange={uploadUpiQr} />
                       <label htmlFor="qrUpload" className="btn-primary cursor-pointer flex items-center bg-blue-600 hover:bg-blue-700">
                          {uploading ? '...' : 'Upload'}
                       </label>
                    </div>
                    {siteContent.upiQrCode && <div className="mt-2"><img src={siteContent.upiQrCode} alt="QR Preview" className="h-20 object-contain border bg-white p-1 rounded"/></div>}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-serif font-bold mb-4 text-gray-900 border-b pb-2">Hero Slider Images</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {siteContent.heroSlides.map((slide: any, idx: number) => (
                    <div key={`slide-${idx}`} className="bg-gray-50 p-4 rounded-sm border border-gray-100 flex flex-col gap-3">
                      <div className="text-xs font-bold text-accent uppercase tracking-widest mb-2">Slide {idx + 1}</div>
                      
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Image URL</label>
                        <input required type="text" className="w-full text-sm border p-2 rounded" value={slide.image} onChange={(e) => updateHeroSlide(idx, 'image', e.target.value)} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subtitle / Tagline</label>
                        <input required type="text" className="w-full text-sm border p-2 rounded" value={slide.subtitle} onChange={(e) => updateHeroSlide(idx, 'subtitle', e.target.value)} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Main Title</label>
                        <input required type="text" className="w-full text-sm border p-2 rounded font-serif font-bold" value={slide.title} onChange={(e) => updateHeroSlide(idx, 'title', e.target.value)} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
                        <textarea required className="w-full text-sm border p-2 rounded" rows={3} value={slide.description} onChange={(e) => updateHeroSlide(idx, 'description', e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-serif font-bold mb-4 text-gray-900 border-b pb-2">Featured Category Links</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {siteContent.featuredCategories.map((cat: any, idx: number) => (
                    <div key={`cat-${idx}`} className="bg-gray-50 p-4 rounded-sm border border-gray-100 flex flex-col gap-3">
                      <div className="text-xs font-bold text-accent uppercase tracking-widest mb-2">Feature Block {idx + 1}</div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category Name</label>
                        <input required type="text" className="w-full text-sm border p-2 rounded" value={cat.name} onChange={(e) => updateCategory(idx, 'name', e.target.value)} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Image URL</label>
                        <input required type="text" className="w-full text-sm border p-2 rounded" value={cat.image} onChange={(e) => updateCategory(idx, 'image', e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={isUpdatingContent} className={`btn-primary w-full sm:w-auto self-end px-12 ${isUpdatingContent ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {isUpdatingContent ? 'Saving...' : 'Save Live Content'}
              </button>
            </form>
          </div>
        )}

        <div className="bg-white p-4 sm:p-8 rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
          <h2 className="text-xl font-bold mb-6">Recent Customer Orders</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No orders have been placed yet.</p>
          ) : (
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-4 px-4 font-semibold text-gray-600">Order ID</th>
                  <th className="py-4 px-4 font-semibold text-gray-600">Customer</th>
                  <th className="py-4 px-4 font-semibold text-gray-600">Items Purchased</th>
                  <th className="py-4 px-4 font-semibold text-gray-600">Total Paid</th>
                  <th className="py-4 px-4 font-semibold text-gray-600">Date</th>
                  <th className="py-4 px-4 font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="py-2 px-4 text-sm text-gray-500 font-mono flex flex-col items-start gap-1">
                      {order._id.substring(order._id.length - 6).toUpperCase()}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest mt-1
                        ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 
                          order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700 animate-pulse'}`}>
                        {order.paymentStatus || 'pending'}
                      </span>
                    </td>
                    <td className="py-2 px-4 font-medium">{order.user?.name || 'Guest'} <br/><span className="text-xs text-gray-400 font-normal">{order.user?.email}</span></td>
                    <td className="py-2 px-4 text-sm text-gray-600">
                      <ul>
                        {order.items?.map((item: any, idx: number) => (
                          <li key={idx} className="mb-1 pl-2 border-l-2 border-accent">
                            <span className="font-bold">{item.quantity}x</span> {item.name}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-2 px-4">
                       <div className="font-bold text-emerald-600">{formatPrice(order.totalAmount)}</div>
                       <div className="text-[10px] text-gray-400 font-mono mt-1 break-all uppercase" title="Transaction ID / UTR">{order.transactionId ? order.transactionId : 'N/A'}</div>
                    </td>
                    <td className="py-2 px-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-2 px-4">
                      <button onClick={() => navigate(`/admin/order/${order._id}`)} className="text-sm font-medium text-white bg-black px-3 py-1.5 rounded hover:bg-gray-800 transition shadow-sm whitespace-nowrap">
                        Verify & Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white p-4 sm:p-8 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-2">Admin Access Management</h2>
          <p className="text-gray-500 mb-6 text-sm">Securely manage your own admin email or grant access to a new user. OTP verification is mandatory.</p>
          
          <div className="flex border-b mb-6">
            <button 
              className={`px-4 py-2 font-medium text-sm transition-colors ${adminAction === 'add' ? 'border-b-2 border-accent text-accent' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => resetAdminForm('add')}
            >
              Add New Admin
            </button>
            <button 
              className={`px-4 py-2 font-medium text-sm transition-colors ${adminAction === 'update' ? 'border-b-2 border-accent text-accent' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => resetAdminForm('update')}
            >
              Update Own Email
            </button>
          </div>

          {adminMsg.text && (
            <div className={`p-4 rounded-sm text-sm font-medium mb-6 border flex items-start gap-3 ${adminMsg.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-100'}`}>
              <span className="mt-0.5">{adminMsg.type === 'success' ? '✓' : '⚠'}</span>
              <span>{adminMsg.text}</span>
            </div>
          )}
          
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="max-w-md">
              <label className="block text-gray-700 text-xs font-bold tracking-widest uppercase mb-2">
                {adminAction === 'add' ? "New Admin's Email Address" : 'Your New Email Address'}
              </label>
              <input 
                required 
                type="email" 
                placeholder="admin@wovenwonder.com" 
                className="w-full px-4 py-3 mb-4 border border-gray-200 rounded-sm focus:outline-none focus:border-accent" 
                value={adminEmail} 
                onChange={e => setAdminEmail(e.target.value)} 
                disabled={isSendingOtp}
              />
              <button type="submit" disabled={isSendingOtp || !adminEmail} className={`btn-primary w-full ${isSendingOtp ? 'opacity-70 cursor-wait' : ''}`}>
                {isSendingOtp ? 'Generating Transfer Securely...' : 'Send Magic Link OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="max-w-md bg-gray-50 p-6 border rounded shadow-inner">
              <label className="block text-gray-700 text-xs font-bold tracking-widest uppercase mb-2">
                Verification Code
              </label>
              <p className="text-xs text-gray-500 mb-4">Please enter the 6-digit code sent to <strong className="text-gray-900">{adminEmail}</strong>. Do not share this code.</p>
              <input 
                required 
                type="text" 
                maxLength={6}
                placeholder="••••••" 
                className="w-full px-4 py-3 mb-4 text-center tracking-[1em] font-mono text-xl border border-gray-200 rounded-sm focus:outline-none focus:border-accent" 
                value={otpInput} 
                onChange={e => setOtpInput(e.target.value)} 
                disabled={isVerifyingOtp}
              />
              <div className="flex gap-2 text-sm justify-between">
                 <button type="submit" disabled={isVerifyingOtp || otpInput.length < 6} className={`flex-grow btn-primary bg-green-600 hover:bg-green-700 disabled:bg-gray-400 ${isVerifyingOtp ? 'opacity-70 cursor-wait' : ''}`}>
                   {isVerifyingOtp ? 'Verifying Identity...' : 'Confirm Action'}
                 </button>
                 <button type="button" onClick={() => setOtpSent(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-white font-medium">
                   Cancel
                 </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
