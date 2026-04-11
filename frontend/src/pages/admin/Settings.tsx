import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { CreditCard, Target, Sparkles, Upload } from 'lucide-react';

const Settings: React.FC = () => {
  const [siteContent, setSiteContent] = useState<any>(null);
  const [isUpdatingContent, setIsUpdatingContent] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      const res = await apiService.getContent();
      if (res.ok) {
        setSiteContent(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

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
     if(!siteContent.featuredCategories) return;
     const updated = { ...siteContent };
     updated.featuredCategories[index][field] = value;
     setSiteContent(updated);
  };

  const uploadSiteImage = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uploadData = new FormData();
    uploadData.append('image', file);
    setUploading(true);
    try {
      const res = await apiService.upload(uploadData);
      if (res.ok) {
        const data = await res.json();
        callback(data.url);
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
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

  if (loading || !siteContent) {
     return <div className="animate-pulse p-12 text-center text-gray-400">Loading Configuration...</div>;
  }

  return (
    <div className="fade-in space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div>
            <h1 className="text-2xl font-bold text-gray-100">Platform Settings</h1>
            <p className="text-sm text-gray-400 mt-1">Manage public landing page content and payment configurations.</p>
         </div>
      </div>

      <form onSubmit={handleUpdateContent} className="space-y-10">
        
        {/* UPI Config Section */}
        <section className="bg-[#1a1a1a] rounded-xl shadow-sm border border-[#333] overflow-hidden">
           <div className="bg-[#222] border-b border-[#333] p-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><CreditCard size={16}/></span>
              <h2 className="text-lg font-bold text-gray-200">Payment Configuration</h2>
           </div>
           <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Store UPI ID</label>
                <input 
                  type="text" 
                  className="w-full text-sm border border-[#444] p-3 rounded-lg focus:ring-2 focus:ring-blue-500/20 font-mono" 
                  value={siteContent.upiId || ''} 
                  onChange={(e) => setSiteContent({...siteContent, upiId: e.target.value})} 
                  placeholder="e.g. 8824656153@axl" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">UPI QR Code URL / Upload</label>
                <div className="flex flex-col sm:flex-row gap-2">
                   <input 
                     type="text" 
                     className="flex-1 text-sm border border-[#444] p-3 rounded-lg focus:ring-2 w-full" 
                     value={siteContent.upiQrCode || ''} 
                     onChange={(e) => setSiteContent({...siteContent, upiQrCode: e.target.value})} 
                     placeholder="Direct URL or upload" 
                   />
                   <input type="file" accept="image/*" id="qrUpload" className="hidden" onChange={uploadUpiQr} />
                   <label htmlFor="qrUpload" className={`px-4 py-3 bg-[#2a2a2a] text-sm font-medium rounded-lg cursor-pointer hover:bg-[#333] transition flex items-center justify-center gap-2 shrink-0 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      <Upload size={16}/> {uploading ? '...' : 'Upload'}
                   </label>
                </div>
                {siteContent.upiQrCode && (
                  <div className="mt-3 p-2 bg-[#222] inline-block border rounded-lg">
                    <img src={siteContent.upiQrCode} alt="QR Code" className="h-24 object-contain mix-blend-multiply" />
                  </div>
                )}
              </div>
           </div>
        </section>

        {/* Global Contact Info Section */}
        <section className="bg-[#1a1a1a] rounded-xl shadow-sm border border-[#333] overflow-hidden">
           <div className="bg-[#222] border-b border-[#333] p-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center"><Target size={16}/></span>
              <h2 className="text-lg font-bold text-gray-200">Global Contact Details</h2>
           </div>
           <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Contact Email</label>
                <input 
                  type="email" 
                  className="w-full text-sm border border-[#444] p-3 rounded-lg focus:ring-2 focus:ring-blue-500/20" 
                  value={siteContent.contactEmail || ''} 
                  onChange={(e) => setSiteContent({...siteContent, contactEmail: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Contact Phone</label>
                <input 
                  type="text" 
                  className="w-full text-sm border border-[#444] p-3 rounded-lg focus:ring-2 focus:ring-blue-500/20" 
                  value={siteContent.contactPhone || ''} 
                  onChange={(e) => setSiteContent({...siteContent, contactPhone: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Store Address</label>
                <textarea 
                  rows={3}
                  className="w-full text-sm border border-[#444] p-3 rounded-lg focus:ring-2 focus:ring-blue-500/20 resize-none" 
                  value={siteContent.contactAddress || ''} 
                  onChange={(e) => setSiteContent({...siteContent, contactAddress: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Store Hours</label>
                <textarea 
                  rows={3}
                  className="w-full text-sm border border-[#444] p-3 rounded-lg focus:ring-2 focus:ring-blue-500/20 resize-none" 
                  value={siteContent.storeHours || ''} 
                  onChange={(e) => setSiteContent({...siteContent, storeHours: e.target.value})} 
                />
              </div>
           </div>
        </section>

        {/* Hero Slides Section */}
        <section className="bg-[#1a1a1a] rounded-xl shadow-sm border border-[#333] overflow-hidden">
           <div className="bg-[#222] border-b border-[#333] p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold"><Target size={16}/></span>
                 <h2 className="text-lg font-bold text-gray-200">Landing Page Carousel</h2>
              </div>
              <span className="text-xs bg-[#1a1a1a] border px-3 py-1 rounded-full text-gray-400 font-medium shadow-sm">3 Active Slides</span>
           </div>
           <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {siteContent.heroSlides?.map((slide: any, idx: number) => (
                <div key={idx} className="bg-[#222] border border-[#444] rounded-lg p-5 space-y-4 hover:border-[#555] transition-colors relative">
                   <div className="absolute top-4 right-4 text-xs font-bold text-gray-400">0{idx + 1}</div>
                   
                   {slide.image ? (
                      <div className="w-full h-32 bg-[#333] rounded-md overflow-hidden mb-2 border shadow-inner">
                         <img src={slide.image} className="w-full h-full object-cover" alt={`Slide ${idx + 1}`} />
                      </div>
                   ) : (
                      <div className="w-full h-32 bg-[#333] rounded-md mb-2 flex flex-col items-center justify-center text-gray-400 text-xs border border-dashed border-[#555]">
                         No Image Added
                      </div>
                   )}
                   
                   <div>
                     <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Image URL / Upload</label>
                     <div className="flex flex-col sm:flex-row gap-2">
                        <input required type="text" className="flex-1 text-sm border p-2 rounded focus:ring-2 outline-none w-full" value={slide.image} onChange={(e) => updateHeroSlide(idx, 'image', e.target.value)} />
                        <input type="file" accept="image/*" id={`heroUpload-${idx}`} className="hidden" onChange={(e) => uploadSiteImage(e, (url) => updateHeroSlide(idx, 'image', url))} />
                        <label htmlFor={`heroUpload-${idx}`} className={`px-3 py-2 bg-[#1a1a1a] border text-xs font-semibold rounded cursor-pointer hover:bg-[#222] flex items-center justify-center gap-1.5 shrink-0 ${uploading ? 'opacity-50' : ''}`}>
                          <Upload size={14}/> Upload
                        </label>
                     </div>
                   </div>

                   <div>
                     <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Subtitle Banner</label>
                     <input required type="text" className="w-full text-sm border p-2 rounded focus:ring-2 outline-none" value={slide.subtitle} onChange={(e) => updateHeroSlide(idx, 'subtitle', e.target.value)} />
                   </div>

                   <div>
                     <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Main Headline</label>
                     <input required type="text" className="w-full text-sm border p-2 rounded focus:ring-2 font-bold text-gray-200 outline-none block" value={slide.title} onChange={(e) => updateHeroSlide(idx, 'title', e.target.value)} />
                   </div>

                   <div>
                     <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Description Paragraph</label>
                     <textarea required rows={2} className="w-full text-sm border p-2 rounded focus:ring-2 outline-none resize-none" value={slide.description} onChange={(e) => updateHeroSlide(idx, 'description', e.target.value)} />
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Categories Spotlight */}
        <section className="bg-[#1a1a1a] rounded-xl shadow-sm border border-[#333] overflow-hidden">
           <div className="bg-[#222] border-b border-[#333] p-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold"><Sparkles size={16}/></span>
              <h2 className="text-lg font-bold text-gray-200">Featured Categories Spotlight</h2>
           </div>
           <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {siteContent.featuredCategories?.map((cat: any, idx: number) => (
                <div key={idx} className="bg-[#1a1a1a] border rounded-lg p-5 space-y-4 shadow-sm">
                   {cat.image && (
                      <div className="w-full h-40 bg-[#2a2a2a] rounded-md overflow-hidden mb-2 border">
                         <img src={cat.image} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" alt={cat.name} />
                      </div>
                   )}
                   <div>
                     <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Category Target Name</label>
                     <input required type="text" className="w-full text-sm border p-2 rounded bg-[#222] outline-none" value={cat.name} onChange={(e) => updateCategory(idx, 'name', e.target.value)} />
                   </div>
                   <div>
                     <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Spotlight Image</label>
                     <div className="flex flex-col sm:flex-row gap-2">
                        <input required type="text" className="flex-1 text-sm border p-2 rounded outline-none w-full" value={cat.image} onChange={(e) => updateCategory(idx, 'image', e.target.value)} />
                        <input type="file" accept="image/*" id={`catUpload-${idx}`} className="hidden" onChange={(e) => uploadSiteImage(e, (url) => updateCategory(idx, 'image', url))} />
                        <label htmlFor={`catUpload-${idx}`} className={`px-3 py-2 bg-[#2a2a2a] border text-xs font-semibold rounded cursor-pointer hover:bg-[#333] flex items-center justify-center gap-1.5 shrink-0 ${uploading ? 'opacity-50' : ''}`}>
                          <Upload size={14}/> Upload
                        </label>
                     </div>
                   </div>
                </div>
              ))}
           </div>
        </section>

        <div className="flex justify-end bg-[#222] p-4 rounded-xl border border-[#333] mt-8">
           <button 
             type="submit" 
             disabled={isUpdatingContent} 
             className="w-full sm:w-auto px-10 py-3 bg-black text-white font-bold rounded-lg hover:scale-105 active:scale-95 transition-all text-sm disabled:opacity-50"
           >
             {isUpdatingContent ? 'Saving Configuration...' : 'Publish Live Settings'}
           </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
