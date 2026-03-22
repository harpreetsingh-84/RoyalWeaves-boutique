import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="fade-in pb-0">
      {/* Hero Section */}
      <div className="relative h-screen bg-gray-900 flex items-center justify-center overflow-hidden mb-24">
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
          alt="RoyalWeaves Fashion" 
          className="absolute inset-0 w-full h-full object-cover object-top opacity-50 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/30"></div>
        <div className="relative z-10 text-center text-white px-6 mt-16">
          <span className="block text-accent font-medium tracking-widest uppercase text-xs md:text-sm mb-4">Autumn / Winter Collection</span>
          <h1 className="text-6xl md:text-8xl font-serif mb-6 tracking-wide drop-shadow-2xl font-normal">Elevate Your Style</h1>
          <p className="text-lg md:text-xl font-light max-w-2xl mx-auto mb-10 drop-shadow-md text-gray-200">
            A curated collection of premium garments and elegant accessories designed for the modern trailblazer.
          </p>
          <Link to="/collection" className="inline-block bg-white text-gray-900 font-medium px-10 py-4 hover:bg-accent hover:text-white transition-all duration-300 shadow-2xl tracking-widest uppercase text-sm rounded-sm">
            Explore Collection
          </Link>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto px-6 mb-32 fade-in">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 drop-shadow-sm">Shop by Category</h2>
          <div className="w-16 h-0.5 bg-accent mt-6"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[ 
            { name: 'Dresses', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600' }, 
            { name: 'Accessories', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600' }, 
            { name: 'Outerwear', img: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=600' }
          ].map(cat => (
            <Link to="/collection" key={cat.name} className="relative group h-96 overflow-hidden bg-gray-100 cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-500 rounded-sm block">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white/95 text-gray-900 px-8 py-3 rounded-sm font-semibold tracking-widest uppercase text-sm shadow-xl transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gray-900 py-24 px-6 border-t border-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-4 text-white">Join The List</h2>
          <p className="text-gray-400 mb-10 tracking-wide font-light">Subscribe to receive updates, access to exclusive deals, and more luxury fashion insights directly to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-0 justify-center max-w-xl mx-auto shadow-2xl">
            <input type="email" placeholder="Enter your email address" className="px-6 py-4 w-full border-none rounded-t-sm sm:rounded-l-sm sm:rounded-tr-none focus:outline-none text-gray-900 font-medium" />
            <button className="bg-accent text-white px-10 py-4 rounded-b-sm sm:rounded-r-sm sm:rounded-bl-none hover:bg-yellow-600 transition-colors uppercase tracking-widest text-sm font-bold">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
