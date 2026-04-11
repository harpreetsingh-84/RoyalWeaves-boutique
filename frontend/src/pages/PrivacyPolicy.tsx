import { Shield, Eye, Database, Cookie, Globe, Lock, UserCheck, Mail } from 'lucide-react';
import { useEffect } from 'react';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      icon: <Shield className="w-6 h-6 text-primaryAction" />,
      title: "Introduction",
      content: "Welcome to Woven Wonder Creation. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you."
    },
    {
      icon: <Eye className="w-6 h-6 text-primaryAction" />,
      title: "Information We Collect",
      content: "We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:",
      list: [
        "Identity Data (first name, last name, username)",
        "Contact Data (billing address, delivery address, email, telephone)",
        "Financial Data (payment card details - securely processed by third parties)",
        "Transaction Data (details about payments and orders)",
        "Technical Data (IP address, browser type, time zone setting)"
      ]
    },
    {
      icon: <Database className="w-6 h-6 text-primaryAction" />,
      title: "How We Use Information",
      content: "We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:",
      list: [
        "To process and deliver your order",
        "To manage our relationship with you",
        "To improve our website, products, and services",
        "To recommend products or services that may be of interest to you"
      ]
    },
    {
      icon: <Cookie className="w-6 h-6 text-primaryAction" />,
      title: "Cookies Policy",
      content: "You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly."
    },
    {
      icon: <Globe className="w-6 h-6 text-primaryAction" />,
      title: "Third-Party Services",
      content: "We may share your personal data with third-party service providers who help us deliver our services (e.g., payment gateways, shipping providers). We require all third parties to respect the security of your personal data and to treat it in accordance with the law."
    },
    {
      icon: <Lock className="w-6 h-6 text-primaryAction" />,
      title: "Data Protection",
      content: "We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. We limit access to your personal data to those employees and partners who have a business need to know."
    },
    {
      icon: <UserCheck className="w-6 h-6 text-primaryAction" />,
      title: "User Rights",
      content: "Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:",
      list: [
        "Request access to your personal data",
        "Request correction of your personal data",
        "Request erasure of your personal data",
        "Object to processing of your personal data"
      ]
    },
    {
      icon: <Mail className="w-6 h-6 text-primaryAction" />,
      title: "Contact Information",
      content: "If you have any questions about this privacy policy or our privacy practices, please contact us at:",
      list: [
        "Email: privacy@wovenwonder.com",
        "Phone: +1 (555) 123-4567"
      ]
    }
  ];

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
        {sections.map((section, index) => (
          <div 
            key={index} 
            className="glass-panel p-8 md:p-10 transition-all duration-300 hover:border-secondaryAction/40 fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-darkBg rounded-lg border border-secondaryAction/20">
                {section.icon}
              </div>
              <h2 className="text-2xl font-serif font-bold text-lightText">{section.title}</h2>
            </div>
            
            <p className="text-lightText/80 leading-relaxed text-lg">
              {section.content}
            </p>
            
            {section.list && (
              <ul className="mt-6 space-y-3">
                {section.list.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-lightText/80">
                    <span className="text-primaryAction mt-1.5">•</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
