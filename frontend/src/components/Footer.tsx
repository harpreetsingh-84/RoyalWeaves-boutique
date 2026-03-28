const Footer = () => {
  return (
    <footer className="bg-primary text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6 text-center px-6">
        <p className="text-gray-300">&copy; {new Date().getFullYear()} Woven Wonder Creation. All rights reserved.</p>
        <div className="flex gap-8 text-sm">
          <a href="#" className="text-gray-400 hover:text-accent transition-colors">Privacy Policy</a>
          <a href="#" className="text-gray-400 hover:text-accent transition-colors">Terms of Service</a>
          <a href="#" className="text-gray-400 hover:text-accent transition-colors">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
