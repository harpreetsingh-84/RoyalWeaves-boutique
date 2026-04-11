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
          <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
            <FileText size={24} className="text-primaryAction" /> Page Layout Builder
          </h1>
          <p className="text-sm text-gray-400 mt-1">Manage sections and rich text for informational pages.</p>
        </div>
        <select 
          className="bg-[#222] border border-[#444] rounded-lg p-3 text-sm text-gray-200 outline-none"
          value={selectedSlug}
          onChange={(e) => setSelectedSlug(e.target.value)}
        >
          {managedPages.map(page => <option key={page.slug} value={page.slug}>{page.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="animate-pulse p-12 text-center text-gray-400 bg-[#1a1a1a] rounded-xl">Loading Page Contents...</div>
      ) : activePage && (
        <div className="space-y-8">
           <div className="flex justify-between items-center bg-[#1a1a1a] p-4 rounded-xl border border-[#333]">
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
                 <div className="text-center p-12 border border-dashed border-[#555] rounded-xl text-gray-500">
                    No sections added to this page yet.
                 </div>
              )}
              {activePage.sections.map((section: any, idx: number) => (
                <div key={section.id} className={`bg-[#222] border border-[#333] rounded-xl overflow-hidden transition-opacity ${section.enabled ? 'opacity-100' : 'opacity-60'}`}>
                   <div className="bg-[#1a1a1a] border-b border-[#333] px-4 py-3 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1 pr-3 border-r border-[#444]">
                          <button onClick={() => moveSection(idx, -1)} disabled={idx === 0} className="text-gray-500 hover:text-white disabled:opacity-30"><ArrowUp size={14}/></button>
                          <button onClick={() => moveSection(idx, 1)} disabled={idx === activePage.sections.length - 1} className="text-gray-500 hover:text-white disabled:opacity-30"><ArrowDown size={14}/></button>
                        </div>
                        <input 
                           type="text" 
                           value={section.title} 
                           onChange={(e) => updateSection(idx, 'title', e.target.value)}
                           className="bg-transparent font-bold text-gray-200 outline-none w-64 border-b border-transparent focus:border-primaryAction"
                           placeholder="Section Title"
                        />
                     </div>
                     <div className="flex items-center gap-4 border-l border-[#333] pl-4">
                        <button onClick={() => updateSection(idx, 'enabled', !section.enabled)} className={`flex items-center gap-1.5 text-xs font-bold uppercase transition-colors tracking-wide ${section.enabled ? 'text-green-500 hover:text-green-400' : 'text-gray-500 hover:text-gray-400'}`}>
                          {section.enabled ? <><Eye size={16}/> Visible</> : <><EyeOff size={16}/> Hidden</>}
                        </button>
                        <button onClick={() => removeSection(idx)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                     </div>
                   </div>
                   <div className="p-4 bg-white text-black quill-dark-theme-override">
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
