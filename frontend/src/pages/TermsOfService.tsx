import { Scale, Users, CheckCircle, CreditCard, Ban, AlertTriangle, RefreshCw, FileText } from 'lucide-react';
import { useEffect } from 'react';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      icon: <FileText className="w-6 h-6 text-primaryAction" />,
      title: "1. Introduction",
      content: "These Terms of Service govern your use of the Woven Wonder Creation website and all related services. By accessing or using our services, you agree to be bound by these terms. If you disagree with any part of the terms, then you do not have permission to access the service."
    },
    {
      icon: <Users className="w-6 h-6 text-primaryAction" />,
      title: "2. User Responsibilities",
      content: "As a user of our service, you are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.",
      list: [
        "Provide accurate and complete information when creating an account",
        "Notify us immediately of any unauthorized use of your account",
        "Use the service for lawful purposes only"
      ]
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-primaryAction" />,
      title: "3. Acceptable Use",
      content: "You agree not to use the service in any way that causes, or may cause, damage to the service or impairment of the availability or accessibility of the service. Prohibited activities include:",
      list: [
        "Engaging in unauthorized scraping or data mining",
        "Transmitting malware or malicious code",
        "Attempting to bypass our security measures",
        "Harassing or abusing other users"
      ]
    },
    {
      icon: <Scale className="w-6 h-6 text-primaryAction" />,
      title: "4. Account Terms",
      content: "We reserve the right to refuse service, terminate accounts, remove or edit content, or cancel orders at our sole discretion. If your account is terminated, you will remain liable for all amounts due up to and including the date of termination."
    },
    {
      icon: <CreditCard className="w-6 h-6 text-primaryAction" />,
      title: "5. Payment & Refund Policy",
      content: "All payments are processed securely. We offer a 14-day return and refund policy for eligible physical products provided they are in their original condition. Customized or made-to-order items may not be eligible for returns.",
      list: [
        "Prices are subject to change without notice",
        "We accept major credit cards and other secure digital payment methods",
        "Refunds are processed to the original payment method within 5-10 business days"
      ]
    },
    {
      icon: <Ban className="w-6 h-6 text-primaryAction" />,
      title: "6. Termination",
      content: "We may terminate or suspend your access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease."
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-primaryAction" />,
      title: "7. Limitation of Liability",
      content: "In no event shall Woven Wonder Creation, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service."
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-primaryAction" />,
      title: "8. Changes to Terms",
      content: "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion."
    }
  ];

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

export default TermsOfService;
