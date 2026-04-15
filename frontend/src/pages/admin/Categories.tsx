import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Trash2 } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await apiService.getCategories();
      if (res.ok) {
        setCategories(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setIsAdding(true);
    try {
      const res = await apiService.addCategory({ name: newCategoryName });
      if (res.ok) {
        fetchCategories();
        setNewCategoryName('');
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to add category');
      }
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setIsAdding(false);
    }
  };

  // Delete Category route
  const handleDeleteCategory = async (id: string, name: string) => {
     if(window.confirm(`Are you sure you want to delete ${name}? Important: Make sure no products are using this category before deleting.`)) {
         try {
             const res = await apiService.deleteCategory(id);
             if (res.ok) {
                 fetchCategories();
             } else {
                 const err = await res.json();
                 alert(err.message || 'Failed to delete category');
             }
         } catch(e) {
             console.error("Error deleting category", e);
             alert("Network error deleting category");
         }
     }
  };

  return (
    <div className="fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div>
            <h1 className="text-2xl font-bold text-lightText">Categories</h1>
            <p className="text-sm text-lightText/60 mt-1">Organize products structurally.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="md:col-span-1 border border-gray-100 bg-white p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-fit">
            <h2 className="font-semibold text-lg mb-4 text-lightText">Add New Category</h2>
            <form onSubmit={handleAddCategory} className="flex flex-col gap-4">
               <div>
                  <label className="text-xs font-bold text-lightText/60 uppercase tracking-wide">Category Name</label>
                  <input 
                    type="text" 
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g. T-Shirts"
                    className="mt-1 w-full border rounded p-2.5 focus:ring-2 outline-none text-lightText" 
                    required 
                  />
               </div>
               <button 
                 type="submit" 
                 disabled={isAdding || !newCategoryName.trim()} 
                 className="w-full btn-primary text-xs shadow-sm py-3 transition disabled:opacity-50"
               >
                 {isAdding ? 'Adding...' : 'Create Category'}
               </button>
            </form>
         </div>

         <div className="md:col-span-2 border border-gray-100 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="bg-darkBg px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-semibold text-lightText">Existing Categories</h2>
              <span className="text-xs font-bold bg-gray-100 text-lightText/60 px-2 py-1 rounded-full">{categories.length} Categories</span>
            </div>
            
            {loading ? (
               <div className="p-8 text-center text-lightText/60 animate-pulse">Loading categories...</div>
            ) : categories.length === 0 ? (
               <div className="p-12 text-center text-lightText/60">No categories found.</div>
            ) : (
               <ul className="divide-y divide-gray-100">
                  {categories.map((cat) => (
                    <li key={cat._id} className="p-4 px-6 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                       <div className="flex items-center gap-3">
                         <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">#</span>
                         <span className="font-medium text-lightText">{cat.name}</span>
                       </div>
                       <button 
                         onClick={() => handleDeleteCategory(cat._id, cat.name)}
                         className="text-red-500 lg:opacity-0 group-hover:opacity-100 transition p-2 bg-red-50 lg:bg-transparent hover:bg-red-50 rounded-lg flex items-center justify-center shrink-0 w-10 h-10 shadow-sm lg:shadow-none"
                         title="Delete Category"
                       >
                          <Trash2 size={18} />
                       </button>
                    </li>
                  ))}
               </ul>
            )}
         </div>
      </div>
    </div>
  );
};

export default Categories;
