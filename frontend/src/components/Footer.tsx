import { useShop } from '../context/ShopContext';

const Footer = () => {
  const { user, isAuthenticated } = useShop();

  return (
    <footer className="bg-darkBg border-t border-secondaryAction/20 text-lightText py-12 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6 text-center px-6">
        <div className="flex flex-col items-center gap-2">
          <p className="text-lightText/80">&copy; {new Date().getFullYear()} Woven Wonder Creation. All rights reserved.</p>
          <p className="text-lightText/60 text-xs tracking-wider">
            {isAuthenticated && user ? `Logged in as: ${user.email}` : 'Guest User'}
          </p>
        </div>
        <div className="flex gap-8 text-sm">
          <a href="#" className="text-lightText/60 hover:text-secondaryAction transition-colors duration-300">Privacy Policy</a>
          <a href="#" className="text-lightText/60 hover:text-secondaryAction transition-colors duration-300">Terms of Service</a>
          <a href="#" className="text-lightText/60 hover:text-secondaryAction transition-colors duration-300">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
