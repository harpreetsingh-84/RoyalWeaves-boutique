import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { CreditCard, Target, Sparkles, Upload, ShieldCheck, ListOrdered, MessageSquare, Plus, Trash2 } from 'lucide-react';

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

  const updateArrayItem = (arrayName: string, index: number, field: string, value: any) => {
    if (!siteContent[arrayName]) return;
    const updated = { ...siteContent };
    updated[arrayName][index][field] = value;
    setSiteContent(updated);
  };

  const addArrayItem = (arrayName: string, defaultObj: any) => {
    const updated = { ...siteContent };
    if (!updated[arrayName]) updated[arrayName] = [];
    updated[arrayName].push(defaultObj);
    setSiteContent(updated);
  };

  const removeArrayItem = (arrayName: string, index: number) => {
    const updated = { ...siteContent };
    updated[arrayName].splice(index, 1);
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
        setSiteContent({ ...siteContent, upiQrCode: data.url });
      }
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading || !siteContent) {
    return <div className="animate-pulse p-12 text-center text-lightText/60">Loading Configuration...</div>;
  }

  return (
    <div className="fade-in space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-lightText">Platform Settings</h1>
          <p className="text-sm text-lightText/60 mt-1">Manage public landing page content and payment configurations.</p>
        </div>
      </div>

      <form onSubmit={handleUpdateContent} className="space-y-10">

        {/* UPI Config Section */}
        <section className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 p-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-secondaryAction/10 text-secondaryAction flex items-center justify-center"><CreditCard size={16} /></span>
            <h2 className="text-lg font-bold text-lightText">Payment Configuration</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-bold text-lightText/60 uppercase tracking-wide mb-2">Store UPI ID</label>
              <input
                type="text"
                className="w-full text-sm bg-white text-lightText border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-secondaryAction/30 outline-none font-mono"
                value={siteContent.upiId || ''}
                onChange={(e) => setSiteContent({ ...siteContent, upiId: e.target.value })}
                placeholder="e.g. 8824656153@axl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-lightText/60 uppercase tracking-wide mb-2">UPI QR Code URL / Upload</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  className="flex-1 text-sm bg-white text-lightText border border-gray-200 p-3 rounded-lg focus:ring-2 outline-none w-full"
                  value={siteContent.upiQrCode || ''}
                  onChange={(e) => setSiteContent({ ...siteContent, upiQrCode: e.target.value })}
                  placeholder="Direct URL or upload"
                />
                <input type="file" accept="image/*" id="qrUpload" className="hidden" onChange={uploadUpiQr} />
                <label htmlFor="qrUpload" className={`px-4 py-3 bg-secondaryAction/10 text-secondaryAction border border-secondaryAction/30 text-sm font-medium rounded-lg cursor-pointer hover:bg-secondaryAction/20 transition flex items-center justify-center gap-2 shrink-0 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <Upload size={16} /> {uploading ? '...' : 'Upload'}
                </label>
              </div>
              {siteContent.upiQrCode && (
                <div className="mt-3 p-2 bg-gray-50 flex inline-block border border-gray-200 rounded-lg">
                  <img src={siteContent.upiQrCode} alt="QR Code" className="h-24 object-contain" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Global Contact Info Section */}
        <section className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 p-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-primaryAction/10 text-primaryAction flex items-center justify-center"><Target size={16} /></span>
            <h2 className="text-lg font-bold text-lightText">Global Contact Details</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-bold text-lightText/60 uppercase tracking-wide mb-2">Contact Email</label>
              <input
                type="email"
                className="w-full text-sm bg-white text-lightText border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-secondaryAction/30 outline-none"
                value={siteContent.contactEmail || ''}
                onChange={(e) => setSiteContent({ ...siteContent, contactEmail: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-lightText/60 uppercase tracking-wide mb-2">Contact Phone</label>
              <input
                type="text"
                className="w-full text-sm bg-white text-lightText border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-secondaryAction/30 outline-none"
                value={siteContent.contactPhone || ''}
                onChange={(e) => setSiteContent({ ...siteContent, contactPhone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-lightText/60 uppercase tracking-wide mb-2">Store Address</label>
              <textarea
                rows={3}
                className="w-full text-sm bg-white text-lightText border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-secondaryAction/30 outline-none resize-none"
                value={siteContent.contactAddress || ''}
                onChange={(e) => setSiteContent({ ...siteContent, contactAddress: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-lightText/60 uppercase tracking-wide mb-2">Store Hours</label>
              <textarea
                rows={3}
                className="w-full text-sm bg-white text-lightText border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-secondaryAction/30 outline-none resize-none"
                value={siteContent.storeHours || ''}
                onChange={(e) => setSiteContent({ ...siteContent, storeHours: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* Hero Slides Section */}
        <section className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-secondaryAction/10 text-secondaryAction flex items-center justify-center font-bold"><Target size={16} /></span>
              <h2 className="text-lg font-bold text-lightText">Landing Page Carousel</h2>
            </div>
            <span className="text-xs bg-[#03233c] border border-secondaryAction/20 px-3 py-1 rounded-full text-lightText/60 font-medium">
              {siteContent.heroSlides?.length || 0} Slides
            </span>
          </div>
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {siteContent.heroSlides?.map((slide: any, idx: number) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-lg shadow-sm p-5 space-y-4 relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-lightText/60 uppercase tracking-widest">Slide 0{idx + 1}</span>
                  <button type="button" onClick={() => removeArrayItem('heroSlides', idx)} className="text-primaryAction hover:bg-primaryAction/10 p-1.5 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>

                {slide.image ? (
                  <div className="w-full h-32 bg-gray-50 border border-gray-200 rounded-md overflow-hidden mb-2">
                    <img src={slide.image} className="w-full h-full object-cover" alt={`Slide ${idx + 1}`} />
                  </div>
                ) : (
                  <div className="w-full h-32 bg-gray-50 rounded-md mb-2 flex flex-col items-center justify-center text-lightText/40 text-xs border border-dashed border-gray-200">
                    No Image Added
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-lightText/60 uppercase tracking-wide mb-1">Image URL / Upload</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input required type="text" className="flex-1 text-sm bg-white border border-gray-200 p-2 rounded outline-none text-lightText w-full focus:border-secondaryAction/60" value={slide.image} onChange={(e) => updateArrayItem('heroSlides', idx, 'image', e.target.value)} />
                    <input type="file" accept="image/*" id={`heroUpload-${idx}`} className="hidden" onChange={(e) => uploadSiteImage(e, (url) => updateArrayItem('heroSlides', idx, 'image', url))} />
                    <label htmlFor={`heroUpload-${idx}`} className={`px-3 py-2 bg-secondaryAction/10 text-secondaryAction border border-secondaryAction/30 text-xs font-semibold rounded cursor-pointer hover:bg-secondaryAction/20 flex items-center justify-center gap-1.5 shrink-0 ${uploading ? 'opacity-50' : ''}`}>
                      <Upload size={14} /> Upload
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-lightText/60 uppercase tracking-wide mb-1">Subtitle Banner</label>
                  <input required type="text" className="w-full text-sm bg-white border border-gray-200 p-2 rounded outline-none text-lightText focus:border-secondaryAction/60" value={slide.subtitle} onChange={(e) => updateArrayItem('heroSlides', idx, 'subtitle', e.target.value)} />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-lightText/60 uppercase tracking-wide mb-1">Main Headline</label>
                  <input required type="text" className="w-full text-sm bg-white border border-gray-200 p-2 rounded font-bold text-lightText outline-none block focus:border-secondaryAction/60" value={slide.title} onChange={(e) => updateArrayItem('heroSlides', idx, 'title', e.target.value)} />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-lightText/60 uppercase tracking-wide mb-1">Description Paragraph</label>
                  <textarea required rows={2} className="w-full text-sm bg-white border border-gray-200 p-2 rounded outline-none text-lightText resize-none focus:border-secondaryAction/60" value={slide.description} onChange={(e) => updateArrayItem('heroSlides', idx, 'description', e.target.value)} />
                </div>
              </div>
            ))}

            <div
              onClick={() => addArrayItem('heroSlides', { title: 'New Slide', subtitle: 'Subtitle', description: 'Description', image: '' })}
              className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-lightText/40 hover:text-lightText hover:border-gray-300 transition-colors cursor-pointer min-h-[300px]"
            >
              <Plus size={32} className="mb-2" />
              <span className="font-medium">Add New Slide</span>
            </div>
          </div>
        </section>

        {/* Features Management */}
        <section className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-secondaryAction/10 text-secondaryAction flex items-center justify-center font-bold"><ShieldCheck size={16} /></span>
              <h2 className="text-lg font-bold text-lightText">Core Features</h2>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {siteContent.features?.map((feat: any, idx: number) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-lg shadow-sm p-5 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-lightText/60 uppercase tracking-widest">Feature 0{idx + 1}</span>
                  <button type="button" onClick={() => removeArrayItem('features', idx)} className="text-primaryAction hover:bg-primaryAction/10 p-1.5 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-lightText/60 uppercase tracking-wide mb-1">Feature Title</label>
                  <input required type="text" className="w-full text-sm bg-white border border-gray-200 p-2 rounded text-lightText outline-none focus:border-secondaryAction/60" value={feat.title} onChange={(e) => updateArrayItem('features', idx, 'title', e.target.value)} />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-lightText/60 uppercase tracking-wide mb-1">Icon Name (Lucide)</label>
                  <input required type="text" className="w-full text-sm bg-white border border-gray-200 p-2 rounded text-lightText outline-none focus:border-secondaryAction/60" value={feat.icon} onChange={(e) => updateArrayItem('features', idx, 'icon', e.target.value)} placeholder="e.g. Sparkles, ShieldCheck, Truck, Clock" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-lightText/60 uppercase tracking-wide mb-1">Description</label>
                  <textarea required rows={3} className="w-full text-sm bg-white border border-gray-200 p-2 rounded text-lightText outline-none resize-none focus:border-secondaryAction/60" value={feat.description} onChange={(e) => updateArrayItem('features', idx, 'description', e.target.value)} />
                </div>
              </div>
            ))}

            <div
              onClick={() => addArrayItem('features', { title: 'New Feature', description: 'Feature details', icon: 'Sparkles' })}
              className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-lightText/40 hover:text-lightText hover:border-gray-300 transition-colors cursor-pointer min-h-[250px]"
            >
              <Plus size={32} className="mb-2" />
              <span className="font-medium">Add Feature</span>
            </div>
          </div>
        </section>

        {/* How It Works Management */}
        <section className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-secondaryAction/10 text-secondaryAction flex items-center justify-center font-bold"><ListOrdered size={16} /></span>
              <h2 className="text-lg font-bold text-lightText">How It Works Steps</h2>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {siteContent.howItWorks?.map((step: any, idx: number) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-lg shadow-sm p-5 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-lightText/60 uppercase tracking-widest">Step {step.num}</span>
                  <button type="button" onClick={() => removeArrayItem('howItWorks', idx)} className="text-primaryAction hover:bg-primaryAction/10 p-1.5 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>

                {step.image ? (
                  <div className="w-full h-32 bg-gray-50 border border-gray-200 rounded-md overflow-hidden mb-2">
                    <img src={step.image} className="w-full h-full object-cover" alt={`Step ${idx + 1}`} />
                  </div>
                ) : (
                  <div className="w-full h-32 bg-gray-50 rounded-md mb-2 flex flex-col items-center justify-center text-lightText/40 text-xs border border-dashed border-gray-200">
                    No Image Added
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-lightText/60 uppercase tracking-wide mb-1">Step Number</label>
                    <input required type="text" className="w-full text-sm bg-white border border-gray-200 p-2 rounded text-lightText outline-none focus:border-secondaryAction/60" value={step.num} onChange={(e) => updateArrayItem('howItWorks', idx, 'num', e.target.value)} placeholder="01" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-lightText/60 uppercase tracking-wide mb-1">Title</label>
                    <input required type="text" className="w-full text-sm bg-white border border-gray-200 p-2 rounded text-lightText outline-none focus:border-secondaryAction/60" value={step.title} onChange={(e) => updateArrayItem('howItWorks', idx, 'title', e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-lightText/60 uppercase tracking-wide mb-1">Image URL / Upload</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input required type="text" className="flex-1 text-sm bg-white border border-gray-200 p-2 rounded outline-none text-lightText w-full focus:border-secondaryAction/60" value={step.image} onChange={(e) => updateArrayItem('howItWorks', idx, 'image', e.target.value)} />
                    <input type="file" accept="image/*" id={`stepUpload-${idx}`} className="hidden" onChange={(e) => uploadSiteImage(e, (url) => updateArrayItem('howItWorks', idx, 'image', url))} />
                    <label htmlFor={`stepUpload-${idx}`} className={`px-3 py-2 bg-secondaryAction/10 text-secondaryAction border border-secondaryAction/30 text-xs font-semibold rounded cursor-pointer hover:bg-secondaryAction/20 flex items-center justify-center gap-1.5 shrink-0 ${uploading ? 'opacity-50' : ''}`}>
                      <Upload size={14} /> Upload
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-lightText/60 uppercase tracking-wide mb-1">Description</label>
                  <textarea required rows={2} className="w-full text-sm bg-white border border-gray-200 p-2 rounded outline-none text-lightText resize-none focus:border-secondaryAction/60" value={step.desc} onChange={(e) => updateArrayItem('howItWorks', idx, 'desc', e.target.value)} />
                </div>
              </div>
            ))}

            <div
              onClick={() => addArrayItem('howItWorks', { num: `0${(siteContent.howItWorks?.length || 0) + 1}`, title: 'Process Step', desc: 'Step description', image: '' })}
              className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-lightText/40 hover:text-lightText hover:border-gray-300 transition-colors cursor-pointer min-h-[300px]"
            >
              <Plus size={32} className="mb-2" />
              <span className="font-medium">Add Step</span>
            </div>
          </div>
        </section>

        {/* Testimonials Management */}
        <section className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-secondaryAction/10 text-secondaryAction flex items-center justify-center font-bold"><MessageSquare size={16} /></span>
              <h2 className="text-lg font-bold text-lightText">Testimonials</h2>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {siteContent.testimonials?.map((review: any, idx: number) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-lg shadow-sm p-5 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-lightText/60 uppercase tracking-widest">Review 0{idx + 1}</span>
                  <button type="button" onClick={() => removeArrayItem('testimonials', idx)} className="text-primaryAction hover:bg-primaryAction/10 p-1.5 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-lightText/60 uppercase tracking-wide mb-1">Customer Name</label>
                    <input required type="text" className="w-full text-sm bg-white border border-gray-200 p-2 rounded text-lightText outline-none focus:border-secondaryAction/60" value={review.name} onChange={(e) => updateArrayItem('testimonials', idx, 'name', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-lightText/60 uppercase tracking-wide mb-1">Role / Subtitle</label>
                    <input required type="text" className="w-full text-sm bg-white border border-gray-200 p-2 rounded text-lightText outline-none focus:border-secondaryAction/60" value={review.role} onChange={(e) => updateArrayItem('testimonials', idx, 'role', e.target.value)} placeholder="Verified Buyer" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-lightText/60 uppercase tracking-wide mb-1">Star Rating (1-5)</label>
                  <input required type="number" min="1" max="5" className="w-full text-sm bg-white border border-gray-200 p-2 rounded text-lightText outline-none focus:border-secondaryAction/60" value={review.rating} onChange={(e) => updateArrayItem('testimonials', idx, 'rating', Number(e.target.value))} />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-lightText/60 uppercase tracking-wide mb-1">Review Content</label>
                  <textarea required rows={4} className="w-full text-sm bg-white border border-gray-200 p-2 rounded outline-none text-lightText resize-none focus:border-secondaryAction/60" value={review.content} onChange={(e) => updateArrayItem('testimonials', idx, 'content', e.target.value)} />
                </div>
              </div>
            ))}

            <div
              onClick={() => addArrayItem('testimonials', { name: 'Jane Doe', role: 'Verified Buyer', content: 'Amazing experience.', rating: 5 })}
              className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-lightText/40 hover:text-lightText hover:border-gray-300 transition-colors cursor-pointer min-h-[300px]"
            >
              <Plus size={32} className="mb-2" />
              <span className="font-medium">Add Testimonial</span>
            </div>
          </div>
        </section>

        {/* Categories Spotlight */}
        <section className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 p-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-secondaryAction/10 text-secondaryAction flex items-center justify-center font-bold"><Sparkles size={16} /></span>
            <h2 className="text-lg font-bold text-lightText">Featured Categories</h2>
          </div>
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {siteContent.featuredCategories?.map((cat: any, idx: number) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-lg shadow-sm p-5 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-lightText/60 uppercase tracking-widest">Category 0{idx + 1}</span>
                  <button type="button" onClick={() => removeArrayItem('featuredCategories', idx)} className="text-primaryAction hover:bg-primaryAction/10 p-1.5 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>

                {cat.image && (
                  <div className="w-full h-40 bg-gray-50 border border-gray-200 rounded-md overflow-hidden mb-2">
                    <img src={cat.image} className="w-full h-full object-cover" alt={cat.name} />
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-bold text-lightText/60 uppercase tracking-wide mb-1">Target Category Name</label>
                  <input required type="text" className="w-full text-sm bg-white border border-gray-200 p-2 rounded text-lightText outline-none focus:border-secondaryAction/60" value={cat.name} onChange={(e) => updateArrayItem('featuredCategories', idx, 'name', e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-lightText/60 uppercase tracking-wide mb-1">Spotlight Image</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input required type="text" className="flex-1 text-sm bg-white border border-gray-200 p-2 rounded outline-none text-lightText w-full focus:border-secondaryAction/60" value={cat.image} onChange={(e) => updateArrayItem('featuredCategories', idx, 'image', e.target.value)} />
                    <input type="file" accept="image/*" id={`catUpload-${idx}`} className="hidden" onChange={(e) => uploadSiteImage(e, (url) => updateArrayItem('featuredCategories', idx, 'image', url))} />
                    <label htmlFor={`catUpload-${idx}`} className={`px-3 py-2 bg-secondaryAction/10 text-secondaryAction border border-secondaryAction/30 text-xs font-semibold rounded cursor-pointer hover:bg-secondaryAction/20 flex items-center justify-center gap-1.5 shrink-0 ${uploading ? 'opacity-50' : ''}`}>
                      <Upload size={14} /> Upload
                    </label>
                  </div>
                </div>
              </div>
            ))}

            <div
              onClick={() => addArrayItem('featuredCategories', { name: 'Category', image: '' })}
              className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-lightText/40 hover:text-lightText hover:border-gray-300 transition-colors cursor-pointer min-h-[300px]"
            >
              <Plus size={32} className="mb-2" />
              <span className="font-medium">Add Category</span>
            </div>
          </div>
        </section>

        <div className="flex justify-end bg-white border-t border-gray-200 shadow-sm">
          <button
            type="submit"
            disabled={isUpdatingContent}
            className="w-full sm:w-auto px-10 py-3 btn-primary text-sm disabled:opacity-50 transition-all font-bold tracking-widest"
          >
            {isUpdatingContent ? 'Saving Configuration...' : 'Publish Live Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
