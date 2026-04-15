import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { FileText, Save, Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Pages: React.FC = () => {
  const [selectedSlug, setSelectedSlug] = useState('privacy-policy');
  const [activePage, setActivePage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Available managed pages
  const managedPages = [
    { slug: 'privacy-policy', label: 'Privacy Policy' },
    { slug: 'terms-of-service', label: 'Terms of Service' }
  ];

  const fetchPage = async (slug: string) => {
    setLoading(true);
    try {
      const res = await apiService.get(`/api/pages/${slug}`);
      if (res.ok) {
        setActivePage(await res.json());
      } else {
        // Init empty
        setActivePage({ slug, title: managedPages.find(p => p.slug === slug)?.label || slug, sections: [] });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(selectedSlug);
  }, [selectedSlug]);

  const savePage = async () => {
    setSaving(true);
    try {
      const res = await apiService.put(`/api/pages/${selectedSlug}`, activePage);
      if (res.ok) {
        alert("Page saved successfully!");
      }
    } catch (error) {
      alert("Error saving page");
    } finally {
      setSaving(false);
    }
  };

  const addSection = () => {
    const newSection = {
      id: Math.random().toString(36).substr(2, 9),
      title: "New Section",
      content: "<p>Content goes here...</p>",
      enabled: true,
      order: activePage.sections.length
    };
    setActivePage({ ...activePage, sections: [...activePage.sections, newSection] });
  };

  const updateSection = (index: number, field: string, value: any) => {
    const updated = [...activePage.sections];
    updated[index] = { ...updated[index], [field]: value };
    setActivePage({ ...activePage, sections: updated });
  };

  const removeSection = (index: number) => {
    if (!window.confirm("Delete this section?")) return;
     const updated = activePage.sections.filter((_: any, i: number) => i !== index);
     setActivePage({ ...activePage, sections: updated });
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    if (index + direction < 0 || index + direction >= activePage.sections.length) return;
    const updated = [...activePage.sections];
    const temp = updated[index];
    updated[index] = updated[index + direction];
    updated[index + direction] = temp;
    // Re-order mapping
    updated.forEach((s, i) => s.order = i);
    setActivePage({ ...activePage, sections: updated });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-lightText flex items-center gap-3">
            <FileText size={24} className="text-primaryAction" /> Page Layout Builder
          </h1>
          <p className="text-sm text-lightText/60 mt-1">Manage sections and rich text for informational pages.</p>
        </div>
        <select 
          className="bg-white border border-gray-200 rounded-lg p-3 text-sm text-lightText outline-none shadow-sm"
          value={selectedSlug}
          onChange={(e) => setSelectedSlug(e.target.value)}
        >
          {managedPages.map(page => <option key={page.slug} value={page.slug}>{page.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="animate-pulse p-12 text-center text-lightText/60 bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">Loading Page Contents...</div>
      ) : activePage && (
        <div className="space-y-8">
           <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="text-lg font-bold">Editing: {activePage.title}</h2>
              <div className="flex gap-3">
                 <button onClick={addSection} className="btn-secondary px-4 py-2 flex items-center gap-2">
                   <Plus size={16} /> Add Section
                 </button>
                 <button onClick={savePage} disabled={saving} className="btn-primary px-6 py-2 flex items-center gap-2 disabled:opacity-50">
                   <Save size={16} /> {saving ? 'Saving...' : 'Publish Formats'}
                 </button>
              </div>
           </div>

           <div className="space-y-6">
              {activePage.sections.length === 0 && (
                 <div className="text-center p-12 border border-dashed border-secondaryAction/40 rounded-xl text-lightText/40">
                    No sections added to this page yet.
                 </div>
              )}
              {activePage.sections.map((section: any, idx: number) => (
                <div key={section.id} className={`bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-opacity ${section.enabled ? 'opacity-100' : 'opacity-60'}`}>
                   <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1 pr-3 border-r border-gray-200">
                          <button onClick={() => moveSection(idx, -1)} disabled={idx === 0} className="text-lightText/40 hover:text-black disabled:opacity-30"><ArrowUp size={14}/></button>
                          <button onClick={() => moveSection(idx, 1)} disabled={idx === activePage.sections.length - 1} className="text-lightText/40 hover:text-black disabled:opacity-30"><ArrowDown size={14}/></button>
                        </div>
                        <input 
                           type="text" 
                           value={section.title} 
                           onChange={(e) => updateSection(idx, 'title', e.target.value)}
                           className="bg-transparent font-bold text-lightText outline-none w-64 border-b border-transparent focus:border-primaryAction"
                           placeholder="Section Title"
                        />
                     </div>
                     <div className="flex items-center gap-4 border-l border-gray-200 pl-4">
                        <button onClick={() => updateSection(idx, 'enabled', !section.enabled)} className={`flex items-center gap-1.5 text-xs font-bold uppercase transition-colors tracking-wide ${section.enabled ? 'text-green-500 hover:text-green-400' : 'text-lightText/40 hover:text-lightText/60'}`}>
                          {section.enabled ? <><Eye size={16}/> Visible</> : <><EyeOff size={16}/> Hidden</>}
                        </button>
                        <button onClick={() => removeSection(idx)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                     </div>
                   </div>
                   <div className="p-4 bg-white text-black">
                     <ReactQuill 
                       value={section.content} 
                       onChange={(val) => updateSection(idx, 'content', val)}
                       className="bg-white text-black min-h-[150px]"
                     />
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default Pages;
