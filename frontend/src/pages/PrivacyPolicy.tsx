import { Shield, Eye, Database, Cookie, Globe, Lock, UserCheck, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiService } from '../services/api';

const iconMap: Record<string, any> = {
  Shield: <Shield className="w-6 h-6 text-primaryAction" />,
  Eye: <Eye className="w-6 h-6 text-primaryAction" />,
  Database: <Database className="w-6 h-6 text-primaryAction" />,
  Cookie: <Cookie className="w-6 h-6 text-primaryAction" />,
  Globe: <Globe className="w-6 h-6 text-primaryAction" />,
  Lock: <Lock className="w-6 h-6 text-primaryAction" />,
  UserCheck: <UserCheck className="w-6 h-6 text-primaryAction" />,
  Mail: <Mail className="w-6 h-6 text-primaryAction" />
};

const PrivacyPolicy = () => {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPage = async () => {
       try {
         const res = await apiService.get('/api/pages/privacy-policy');
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
      icon: 'Shield',
      title: "Introduction",
      content: "<p>Welcome to Woven Wonder Creation. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>",
      enabled: true,
      order: 1
    },
    {
      icon: 'Eye',
      title: "Information We Collect",
      content: "<p>We may collect, use, store and transfer different kinds of personal data about you to process orders and improve our service. This includes:</p><ul class='list-disc pl-5 mt-2 space-y-1'><li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li><li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li><li><strong>Technical & Usage Data:</strong> includes internet protocol (IP) address, browser type and version, time zone setting, browser plug-in types and versions, operating system and platform, and information about how you use our website.</li><li><strong>Cookies:</strong> data collected automatically through cookies and similar tracking technologies.</li></ul>",
      enabled: true,
      order: 2
    },
    {
      icon: 'Database',
      title: "How We Use the Data",
      content: "<p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p><ul class='list-disc pl-5 mt-2 space-y-1'><li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., fulfilling your order).</li><li>Where it is necessary for our legitimate interests and your interests and fundamental rights do not override those interests.</li><li>Where we need to comply with a legal obligation.</li><li>To improve our website functionality, customer service, and marketing efforts.</li></ul>",
      enabled: true,
      order: 3
    },
    {
      icon: 'Cookie',
      title: "Cookies Policy",
      content: "<p>Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site.</p><p class='mt-2'>You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.</p>",
      enabled: true,
      order: 4
    },
    {
      icon: 'Lock',
      title: "Data Protection & Security",
      content: "<p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. We utilize secure data hosting practices and encryption where appropriate.</p><p class='mt-2'>In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know. They will only process your personal data on our instructions and they are subject to a duty of confidentiality.</p>",
      enabled: true,
      order: 5
    },
    {
      icon: 'Globe',
      title: "Third-Party Services",
      content: "<p>We may share your personal data with external third parties who provide services safely and securely on our behalf. These include:</p><ul class='list-disc pl-5 mt-2 space-y-1'><li>Service providers who provide IT and system administration services (e.g., website hosting).</li><li>Professional advisers including lawyers, bankers, auditors and insurers.</li><li>Analytics providers to help us better understand how users engage with our website.</li></ul><p class='mt-2'>We require all third parties to respect the security of your personal data and to treat it in accordance with the law.</p>",
      enabled: true,
      order: 6
    },
    {
      icon: 'UserCheck',
      title: "User Rights",
      content: "<p>Under certain circumstances, you have rights under data protection laws in relation to your personal data. These include the right to:</p><ul class='list-disc pl-5 mt-2 space-y-1'><li>Request access to your personal data.</li><li>Request correction of your personal data.</li><li>Request erasure of your personal data.</li><li>Object to processing of your personal data.</li><li>Request restriction of processing your personal data.</li><li>Request transfer of your personal data.</li><li>Withdraw consent at any time.</li></ul>",
      enabled: true,
      order: 7
    },
    {
      icon: 'Mail',
      title: "Contact Information",
      content: "<p>If you have any questions about this privacy policy or our privacy practices, please contact us.</p><ul class='list-disc pl-5 mt-2 space-y-1'><li><strong>Email address:</strong> privacy@wovenwonder.com</li><li><strong>Postal address:</strong> 123 Fashion Street, Boutique District</li></ul><p class='mt-2'>You have the right to make a complaint at any time to the relevant data protection supervisory authority.</p>",
      enabled: true,
      order: 8
    }
  ];

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center text-lightText/60">Loading policy...</div>;
  if (!pageData && !loading) {
     // Use fallback if api fails
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
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="max-w-4xl mx-auto px-6 text-center fade-in">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondaryAction mb-6">Privacy Policy</h1>
          <p className="text-lg md:text-xl text-lightText/80 max-w-2xl mx-auto">
            Your privacy is critically important to us. Learn how we collect, use, and protect your data.
          </p>
          <p className="text-sm text-lightText/50 mt-4">Last Updated: April 11, 2026</p>
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
                {iconMap[section.icon] || <Shield className="w-6 h-6 text-primaryAction" />}
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

export default PrivacyPolicy;
