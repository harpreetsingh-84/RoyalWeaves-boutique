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

  const fallbackSections = [
    {
      icon: 'CheckCircle',
      title: "1. Acceptance of Terms",
      content: "<p>By accessing and using the Woven Wonder Creation website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>",
      enabled: true,
      order: 1
    },
    {
      icon: 'Users',
      title: "2. User Responsibilities",
      content: "<p>As a user of our website, you agree to:</p><ul class='list-disc pl-5 mt-2 space-y-1'><li>Provide accurate, current, and complete information during the registration and checkout process.</li><li>Maintain the security of your password and identification.</li><li>Promptly update your personal information to keep it accurate and complete.</li><li>Accept all risks of unauthorized access to the information and your account.</li></ul>",
      enabled: true,
      order: 2
    },
    {
      icon: 'Ban',
      title: "3. Prohibited Activities",
      content: "<p>You are specifically prohibited from engaging in any of the following activities:</p><ul class='list-disc pl-5 mt-2 space-y-1'><li>Using the website in any way that is or may be damaging to the website or its infrastructure.</li><li>Using the website contrary to applicable laws and regulations, or in any way that may cause harm to the website, or to any person or business entity.</li><li>Engaging in any data mining, data harvesting, data extracting, or any other similar activity.</li><li>Using the site to engage in any advertising or marketing without our express written consent.</li></ul>",
      enabled: true,
      order: 3
    },
    {
      icon: 'Scale',
      title: "4. Intellectual Property Rights",
      content: "<p>Other than the content you own, under these Terms, Woven Wonder Creation and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted limited license only for purposes of viewing the material contained on this Website.</p>",
      enabled: true,
      order: 4
    },
    {
      icon: 'AlertTriangle',
      title: "5. Limitation of Liability",
      content: "<p>In no event shall Woven Wonder Creation, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. Woven Wonder Creation, including its officers, directors, and employees, shall not be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this Website.</p>",
      enabled: true,
      order: 5
    },
    {
      icon: 'Ban',
      title: "6. Termination Clause",
      content: "<p>We may terminate or suspend your access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p><p class='mt-2'>All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.</p>",
      enabled: true,
      order: 6
    },
    {
      icon: 'RefreshCw',
      title: "7. Changes to Terms",
      content: "<p>Woven Wonder Creation is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review these Terms on a regular basis. We reserve the right to modify these terms from time to time at our sole discretion.</p>",
      enabled: true,
      order: 7
    },
    {
      icon: 'FileText',
      title: "8. Contact Information",
      content: "<p>If you have any questions about these Terms, please contact us at:</p><ul class='list-disc pl-5 mt-2 space-y-1'><li><strong>Email address:</strong> support@wovenwonder.com</li><li><strong>Postal address:</strong> 123 Fashion Street, Boutique District</li></ul>",
      enabled: true,
      order: 8
    }
  ];

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center text-lightText/60">Loading terms...</div>;
  if (!pageData && !loading) {
     // fallback used below
  }

  let sections = fallbackSections;
  if (pageData && pageData.sections && pageData.sections.length > 0) {
    const activeSections = pageData.sections.filter((s: any) => s.enabled).sort((a: any, b: any) => a.order - b.order);
    if (activeSections.length > 0) sections = activeSections;
  }

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
