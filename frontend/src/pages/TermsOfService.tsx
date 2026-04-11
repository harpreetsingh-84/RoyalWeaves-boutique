import { Scale, Users, CheckCircle, CreditCard, Ban, AlertTriangle, RefreshCw, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiService } from '../services/api';

const iconMap: Record<string, any> = {
  Scale: <Scale className="w-6 h-6 text-primaryAction" />,
  Users: <Users className="w-6 h-6 text-primaryAction" />,
  CheckCircle: <CheckCircle className="w-6 h-6 text-primaryAction" />,
  CreditCard: <CreditCard className="w-6 h-6 text-primaryAction" />,
  Ban: <Ban className="w-6 h-6 text-primaryAction" />,
  AlertTriangle: <AlertTriangle className="w-6 h-6 text-primaryAction" />,
  RefreshCw: <RefreshCw className="w-6 h-6 text-primaryAction" />,
  FileText: <FileText className="w-6 h-6 text-primaryAction" />
};

const TermsOfService = () => {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPage = async () => {
       try {
         const res = await apiService.get('/api/pages/terms-of-service');
         if (res.ok) setPageData(await res.json());
       } catch (e) {
         console.error(e);
       } finally {
         setLoading(false);
       }
    };
    fetchPage();
  }, []);

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center text-lightText/60">Loading terms...</div>;
  if (!pageData) return <div className="min-h-[50vh] flex items-center justify-center text-lightText/60">Terms not found.</div>;

  const sections = pageData.sections?.filter((s: any) => s.enabled).sort((a: any, b: any) => a.order - b.order) || [];

  return (
    <div className="w-full text-lightText pb-20">
      {/* Hero Section */}
      <div className="relative py-24 bg-darkBg border-b border-secondaryAction/20 overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="max-w-4xl mx-auto px-6 text-center fade-in">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondaryAction mb-6">Terms of Service</h1>
          <p className="text-lg md:text-xl text-lightText/80 max-w-2xl mx-auto">
            Please read these terms carefully before using our services.
          </p>
          <p className="text-sm text-lightText/50 mt-4">Effective Date: April 11, 2026</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 mt-16 space-y-12">
        {sections.map((section: any, index: number) => (
          <div 
            key={index} 
            className="glass-panel p-8 md:p-10 transition-all duration-300 hover:border-secondaryAction/40 fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-darkBg rounded-lg border border-secondaryAction/20">
                {iconMap[section.icon] || <FileText className="w-6 h-6 text-primaryAction" />}
              </div>
              <h2 className="text-2xl font-serif font-bold text-lightText">{section.title}</h2>
            </div>
            
            <div 
              className="text-lightText/80 leading-relaxed text-lg prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
            
            {section.image && (
              <img src={section.image} alt={section.title} className="mt-6 rounded-lg w-full max-w-2xl mx-auto opacity-90" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermsOfService;
