import React, { useEffect, useState, useRef } from "react";
import { ShoppingBag, Heart, Search, Menu, X, Star, Phone, Mail } from "lucide-react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import JewelryChatbot from './JewelryChatbot';

const App = () => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("");
  const [metal, setMetal] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const searchRef = useRef(null);

  // Jewelry categories for homepage showcase and carousel
  const categories = [
    {
      id: "rings",
      title: "Elegant Rings",
      subtitle: "COLLECTIONS",
      description: "Discover Your Perfect Style",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      color: "from-amber-900/20 to-amber-600/10",
    },
    {
      id: "necklaces",
      title: "Golden Memory",
      subtitle: "SHOP",
      description: "Indulge in the opulence of Golden Memory, a mesmerizing jewelry collection fit for a queen.",
      image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      color: "from-rose-900/20 to-rose-600/10",
    },
    {
      id: "bangles",
      title: "Royal Bangles",
      subtitle: "HERITAGE",
      description: "Embrace Traditional Elegance",
      image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      color: "from-purple-900/20 to-purple-600/10",
    },
    {
      id: "earrings",
      title: "Divine Earrings",
      subtitle: "LUXURY",
      description: "Celestial Beauty for Every Occasion",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      color: "from-emerald-900/20 to-emerald-600/10",
    },
  ];

  // Style Categories
  const styleCategories = [
    {
      id: 'traditional',
      title: 'Traditional Heritage',
      description: 'Timeless pieces inspired by Indian craftsmanship',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      accent: 'from-amber-500 to-yellow-600'
    },
    {
      id: 'contemporary',
      title: 'Contemporary Chic',
      description: 'Modern designs for the modern woman',
      image: 'https://images.unsplash.com/photo-1723807105984-3fab5c225fd4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      accent: 'from-purple-500 to-pink-600'
    },
    {
      id: 'vintage',
      title: 'Vintage Elegance',
      description: 'Classic pieces with timeless appeal',
      image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      accent: 'from-rose-500 to-red-600'
    },
    {
      id: 'minimalist',
      title: 'Minimalist Grace',
      description: 'Subtle elegance for everyday luxury',
      image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      accent: 'from-gray-500 to-slate-600'
    }
  ];

  // Carousel auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % categories.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [categories.length]);

  useEffect(() => {
    loadFeaturedProducts();
    loadProducts();
  }, [search, sort, category, metal, priceRange]);

  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => setToastMsg(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadSearchResults = async () => {
      if (searchInput.trim() === "") {
        setSearchResults([]);
        return;
      }
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products?search=${encodeURIComponent(searchInput)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.slice(0, 5)); // Limit to 5 results for dropdown
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error('Failed to load search results:', err);
        setSearchResults([]);
      }
    };
    loadSearchResults();
  }, [searchInput]);

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products?featured=true&limit=8`);
      if (res.ok) {
        const data = await res.json();
        setFeaturedProducts(data);
      } else {
        const fallbackRes = await fetch(`${import.meta.env.VITE_API_URL}/api/products?limit=8`);
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          setFeaturedProducts(fallbackData);
        }
      }
    } catch (err) {
      console.error('Failed to load featured products:', err);
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    let url = `${import.meta.env.VITE_API_URL}/api/products?`;
    if (search) url += `search=${encodeURIComponent(search)}&`;
    if (sort) url += `sort=${sort}&`;
    if (category) url += `category=${category}&`;
    if (metal) url += `metalType=${metal}&`;

    try {
      const res = await fetch(url);
      if (res.ok) {
        let data = await res.json();

        if (priceRange) {
          const [min, max] = priceRange.split("-").map(Number);
          data = data.filter((p) => p.price >= min && p.price <= max);
        }

        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
      setProducts([]);
    }
  };

  const handleAddToCart = async (product, productName) => {
    const userId = localStorage.getItem("userEmail");
    if (!userId) {
      setToastMsg("Please log in to add items to cart.");
      setTimeout(() => {
        setToastMsg("Redirecting to login...");
        window.location.href = "/login"; // Redirect to login page
      }, 1000);
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cart/add?userId=${encodeURIComponent(userId)}&productId=${product.id || product._id}&quantity=1&grams=${product.grams || 1}&finalPrice=${product.price}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error("Add to cart failed.");
      setToastMsg(`"${productName}" added to cart successfully!`);
    } catch (err) {
      console.error(err);
      setToastMsg("Failed to add to cart. Please try again.");
    }
  };

  const viewProduct = (id) => {
    window.location.href = `/product/${id}`;
  };

  const viewCategory = (categoryId) => {
    window.location.href = `/category/${categoryId}`;
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setSearchOpen(false);
    window.location.href = `/collections?search=${encodeURIComponent(searchInput)}`;
  };

  const handleSearchClick = () => {
    window.location.href = `/collections?focus=true`;
  };

  const getBadgeColor = (badge) => {
    switch (badge?.toLowerCase()) {
      case 'bestseller': return 'bg-amber-500 text-white';
      case 'new': return 'bg-green-500 text-white';
      case 'trending': return 'bg-purple-500 text-white';
      case 'limited': return 'bg-red-500 text-white';
      case 'heritage': return 'bg-orange-500 text-white';
      case 'modern': return 'bg-blue-500 text-white';
      case 'exclusive': return 'bg-pink-500 text-white';
      case 'vintage': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        handleSearchSubmit={handleSearchSubmit}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        searchResults={searchResults}
        viewProduct={viewProduct}
        handleSearchClick={handleSearchClick}
        setSearchOpen={setSearchOpen}
        searchOpen={searchOpen}
      />

      {/* Banner Carousel */}
      <div className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {categories.map((cat) => (
            <div key={cat.id} className="min-w-full h-[50vh] md:h-[60vh] bg-cover bg-center relative">
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4 text-center"> {/* Adjusted padding */}
                <p className="text-xs md:text-sm tracking-[0.3em] mb-2 md:mb-4 opacity-90">{cat.subtitle}</p> {/* Smaller text on mobile */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-4 md:mb-6 leading-tight"> {/* Smaller text on mobile */}
                  {cat.title}
                </h2>
                <p className="text-sm md:text-lg opacity-80 max-w-md px-4">{cat.description}</p> {/* Adjusted padding */}
                <button
                  onClick={() => viewCategory(cat.id)}
                  className="mt-4 md:mt-6 border-2 border-white px-6 py-2 md:px-8 md:py-3 text-xs md:text-sm tracking-wider hover:bg-white hover:text-gray-900 transition-all duration-300"
                >
                  SHOP NOW
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Navigation Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {categories.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${
                currentSlide === index ? 'bg-white' : 'bg-white/50'
              } transition-all duration-300`}
            ></button>
          ))}
        </div>
        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + categories.length) % categories.length)}
          className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-1 md:p-2 rounded-full transition-all"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % categories.length)}
          className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-1 md:p-2 rounded-full transition-all"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Hero Categories Grid */}
<div className="max-w-7xl mx-auto px-4 py-8 md:px-6 lg:py-12"> {/* Adjusted padding for consistency, removed md:pb-12 as py covers it */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:h-[800px]"> {/* Changed lg:max-h-[800px] to lg:h-[800px] for a more consistent height on desktop */}
    {/* Large Featured Category */}
    <div
      className="relative overflow-hidden rounded-none group cursor-pointer h-96 md:h-[400px] lg:h-full" // More explicit heights for different breakpoints
      onClick={() => viewCategory(categories[0].id)}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${categories[0].color} transition-opacity duration-700 group-hover:opacity-80`}></div>
      <div
        className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-start p-6 md:p-12 text-white">
          <p className="text-xs md:text-sm tracking-[0.3em] mb-2 md:mb-4 opacity-90">{categories[0].subtitle}</p>
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-light mb-4 md:mb-6 leading-tight">
            {categories[0].description.split(" ").map((word, i) => (
              <span key={i} className="block">{word}</span>
            ))}
          </h2>
          <button className="border-2 border-white px-6 py-2 md:px-8 md:py-3 text-xs md:text-sm tracking-wider hover:bg-white hover:text-gray-900 transition-all duration-300 mt-4 md:mt-8">
            SHOP NOW
          </button>
        </div>
      </div>
    </div>

    {/* Right Side Categories */}
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Golden Memory Section */}
      <div
        className="relative overflow-hidden rounded-none group cursor-pointer flex-1 h-80 md:h-[350px] lg:h-1/2" // More explicit heights
        onClick={() => viewCategory(categories[1].id)}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${categories[1].color} transition-opacity duration-700 group-hover:opacity-80`}></div>
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')`,
          }}
        >
          <div className="absolute inset-0 flex flex-col justify-center items-start p-6 md:p-8 text-gray-900">
            <p className="text-xs tracking-[0.3em] mb-2 opacity-70">{categories[1].subtitle}</p>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-light mb-3 md:mb-4 leading-tight">
              {categories[1].title.split(" ").map((word, i) => (
                <span key={i} className="block">{word}</span>
              ))}
            </h3>
            <p className="text-xs md:text-sm opacity-80 max-w-xs leading-relaxed mb-4 md:mb-6">{categories[1].description}</p>
            <div className="flex flex-wrap gap-2 md:space-x-4">
              <button className="bg-gray-900 text-white px-4 py-2 text-xs tracking-wider hover:bg-gray-800 transition-colors duration-300">
                Purchase Now
              </button>
              <button className="border border-gray-900 text-gray-900 px-4 py-2 text-xs tracking-wider hover:bg-gray-900 hover:text-white transition-all duration-300">
                View Collection
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Two Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 flex-1">
        {categories.slice(2).map((cat, index) => (
          <div
            key={cat.id}
            className="relative overflow-hidden rounded-none group cursor-pointer h-64 md:h-[350px] lg:h-full" // More explicit heights
            onClick={() => viewCategory(cat.id)}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} transition-opacity duration-700 group-hover:opacity-80`}></div>
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: index === 0
                  ? `url('https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')`
                  : `url('https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')`,
              }}
            >
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute inset-0 flex flex-col justify-center items-start p-4 md:p-6 text-white">
                <p className="text-xs tracking-[0.3em] mb-1 opacity-90">{cat.subtitle}</p>
                <h4 className="text-xl md:text-2xl font-light mb-2 leading-tight">
                  {cat.title.split(" ").map((word, i) => (
                    <span key={i} className="block">{word}</span>
                  ))}
                </h4>
                <p className="text-xs opacity-80 mb-3">{cat.description}</p>
                <button className="border border-white px-3 py-1 text-xs tracking-wider hover:bg-white hover:text-gray-900 transition-all duration-300">
                  EXPLORE
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
      {/* Choose Your Style Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:px-6 md:py-20"> {/* Adjusted padding */}
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-light mb-3 tracking-wide">Choose Your Style</h2> {/* Adjusted text size */}
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed px-4"> {/* Adjusted text size and padding */}
            Discover your unique aesthetic through our carefully curated style collections,
            each designed to reflect your personality and celebrate life's precious moments.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"> {/* Changed to 2 cols on sm */}
          {styleCategories.map((style, index) => (
            <div key={style.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img
                  src={style.image}
                  alt={style.title}
                  className="w-full h-64 md:h-80 object-cover transition-transform duration-700 group-hover:scale-110" // Adjusted height
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${style.accent} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white"> {/* Adjusted padding */}
                  <div className={`w-10 h-1 md:w-12 bg-gradient-to-r ${style.accent} mb-3 md:mb-4`}></div> {/* Adjusted width */}
                  <h3 className="text-lg md:text-xl font-light mb-1 md:mb-2">{style.title}</h3> {/* Adjusted text size */}
                  <p className="text-xs md:text-sm opacity-90">{style.description}</p> {/* Adjusted text size */}
                </div>
              </div>
              <div className="text-center">
                <button
                  onClick={() => viewCategory(style.id)}
                  className="text-sm tracking-wider text-gray-700 hover:text-amber-600 transition-colors border-b border-transparent hover:border-amber-600 pb-1"
                >
                  EXPLORE COLLECTION
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12 md:px-6 md:py-20"> {/* Adjusted padding */}
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-light mb-3 tracking-wide">Curated Favorites</h2> {/* Adjusted text size */}
            <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed px-4"> {/* Adjusted text size and padding */}
              Our most cherished pieces, handpicked for their exceptional beauty and craftsmanship.
              Each item represents the pinnacle of jewelry artistry.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-10 md:py-20">
              <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-amber-600"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"> {/* Changed to 2 cols on sm */}
                {featuredProducts.slice(0, 8).map((product, index) => (
                  <div key={product.id || product._id} className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                    <div className="relative overflow-hidden">
                      <img
                        src={product.image || product.imageUrl || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                        alt={product.name}
                        className="w-full h-64 md:h-80 object-cover transition-transform duration-700 group-hover:scale-110" // Adjusted height
                      />
                      {product.badge && (
                        <div className="absolute top-3 left-3 md:top-4 md:left-4"> {/* Adjusted position */}
                          <span className={`px-2 py-1 text-xs font-medium tracking-wider ${getBadgeColor(product.badge)}`}>
                            {product.badge.toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => handleAddToCart(product, product.name)}
                          className="bg-white text-gray-900 px-4 py-2 text-sm font-medium tracking-wider hover:bg-gray-100 transition-colors duration-200"
                        >
                          ADD TO CART
                        </button>
                      </div>
                    </div>
                    <div className="p-4 md:p-6"> {/* Adjusted padding */}
                      <p className="text-xs text-gray-500 tracking-wider mb-1">{product.category}</p>
                      <h3
                        className="text-base md:text-lg font-light mb-2 group-hover:text-amber-600 transition-colors cursor-pointer" // Adjusted text size
                        onClick={() => viewProduct(product.id || product._id)}
                      >
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">Weight: {product.weight}g</p> {/* Added mb-2 for spacing */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0"> {/* Adjusted layout for prices */}
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <span className="text-lg md:text-xl font-medium text-gray-900">₹{product.price?.toLocaleString()} <span className="text-xs ml-1 text-gray-500">per gram</span></span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                          )}
                        </div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="bg-red-100 text-red-600 px-2 py-1 text-xs font-medium rounded mt-1 sm:mt-0">
                            SAVE ₹{(product.originalPrice - product.price).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-10 md:mt-12">
                <button
                  onClick={() => window.location.href = '/collections'}
                  className="border-2 border-gray-900 text-gray-900 px-6 py-2 md:px-8 md:py-3 text-sm tracking-wider hover:bg-gray-900 hover:text-white transition-all duration-300"
                >
                  VIEW ALL PRODUCTS
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 right-4 md:top-6 md:right-6 bg-white shadow-2xl border border-green-200 text-green-800 px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl z-50 animate-slide-in-right max-w-sm"> {/* Adjusted position and padding */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"> {/* Adjusted size */}
              <svg className="w-3 h-3 md:w-4 md:h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-medium text-sm md:text-base">{toastMsg}</p> {/* Adjusted text size */}
            <button
              onClick={() => setToastMsg("")}
              className="ml-auto flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <X className="w-3 h-3 text-gray-600" />
            </button>
          </div>
        </div>
      )}
      <JewelryChatbot />
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default App;