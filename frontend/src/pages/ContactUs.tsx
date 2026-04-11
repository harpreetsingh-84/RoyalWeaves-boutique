import { MapPin, Mail, Phone, Send, Clock, User, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <div className="w-full text-lightText pb-20">
      {/* Hero Section */}
      <div className="relative py-24 bg-darkBg border-b border-secondaryAction/20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #e71d36 0%, transparent 50%)', backgroundSize: '100% 100%' }}></div>
        <div className="max-w-4xl mx-auto px-6 text-center fade-in">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondaryAction mb-6">Contact Us</h1>
          <p className="text-xl md:text-2xl font-light text-lightText/90 mb-4 font-serif italic">
            "We'd love to hear from you"
          </p>
          <p className="text-lg text-lightText/70 max-w-2xl mx-auto mb-8">
            Whether you have a question about our collections, need styling advice, or want to discuss a custom order, our team is ready to answer all your questions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Information Cards */}
        <div className="col-span-1 lg:col-span-5 space-y-6">
          <h2 className="text-2xl font-serif font-bold text-lightText mb-8 fade-in">Get in Touch</h2>
          
          <div className="glass-panel p-6 flex items-start gap-4 transition-all duration-300 hover:border-secondaryAction/40 fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="p-3 bg-darkBg rounded-full border border-secondaryAction/30 text-secondaryAction shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-secondaryAction mb-1">Our Boutique</h3>
              <p className="text-lightText/80 leading-relaxed">
                123 Fashion Avenue, Suite 400<br />
                New York, NY 10018<br />
                United States
              </p>
            </div>
          </div>

          <div className="glass-panel p-6 flex items-start gap-4 transition-all duration-300 hover:border-secondaryAction/40 fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="p-3 bg-darkBg rounded-full border border-secondaryAction/30 text-secondaryAction shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-secondaryAction mb-1">Email Us</h3>
              <p className="text-lightText/80 leading-relaxed">
                support@wovenwonder.com<br />
                info@wovenwonder.com
              </p>
            </div>
          </div>

          <div className="glass-panel p-6 flex items-start gap-4 transition-all duration-300 hover:border-secondaryAction/40 fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="p-3 bg-darkBg rounded-full border border-secondaryAction/30 text-secondaryAction shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-secondaryAction mb-1">Call Us</h3>
              <p className="text-lightText/80 leading-relaxed">
                +1 (555) 123-4567<br />
                Toll Free: 1-800-WOVEN-CO
              </p>
            </div>
          </div>
          
          <div className="glass-panel p-6 flex items-start gap-4 transition-all duration-300 hover:border-secondaryAction/40 fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="p-3 bg-darkBg rounded-full border border-secondaryAction/30 text-secondaryAction shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-secondaryAction mb-1">Business Hours</h3>
              <p className="text-lightText/80 leading-relaxed">
                Monday - Friday: 9AM - 6PM EST<br />
                Saturday: 10AM - 4PM EST<br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="col-span-1 lg:col-span-7 fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="premium-card p-8 md:p-10 relative">
            {submitStatus === 'success' ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#03233c] z-10 p-8 text-center fade-in">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                 <Send className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-lightText mb-4">Message Sent Successfully!</h3>
                <p className="text-lightText/80 max-w-md">
                  Thank you for reaching out. A member of our team will get back to you shortly.
                </p>
                <button 
                  onClick={() => setSubmitStatus('idle')}
                  className="mt-8 btn-secondary"
                >
                  Send Another Message
                </button>
              </div>
            ) : null}

            <h2 className="text-2xl font-serif font-bold text-lightText mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2 relative group">
                <label htmlFor="name" className="text-sm font-medium text-lightText/80 block">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-lightText/40 group-focus-within:text-primaryAction transition-colors" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-darkBg border border-secondaryAction/30 rounded-lg text-lightText placeholder-lightText/40 focus:outline-none focus:border-primaryAction focus:ring-1 focus:ring-primaryAction transition-all duration-300"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>

              <div className="space-y-2 relative group">
                <label htmlFor="email" className="text-sm font-medium text-lightText/80 block">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-lightText/40 group-focus-within:text-primaryAction transition-colors" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-darkBg border border-secondaryAction/30 rounded-lg text-lightText placeholder-lightText/40 focus:outline-none focus:border-primaryAction focus:ring-1 focus:ring-primaryAction transition-all duration-300"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2 relative group">
                <label htmlFor="message" className="text-sm font-medium text-lightText/80 block">Your Message</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <MessageSquare className="h-5 w-5 text-lightText/40 group-focus-within:text-primaryAction transition-colors" />
                  </div>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-darkBg border border-secondaryAction/30 rounded-lg text-lightText placeholder-lightText/40 focus:outline-none focus:border-primaryAction focus:ring-1 focus:ring-primaryAction transition-all duration-300 resize-none"
                    placeholder="How can we help you today?"
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary flex items-center justify-center gap-3 mt-4"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
