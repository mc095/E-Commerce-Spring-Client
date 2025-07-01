import React, { useState, useEffect, useRef } from "react";
import { ShoppingBag, Heart, Search, Menu, X, Phone } from "lucide-react";

const Navbar = ({ handleSearchSubmit, searchInput, setSearchInput, searchResults, viewProduct, handleSearchClick, setSearchOpen, searchOpen }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setSearchOpen]);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-2 sm:py-3 text-xs sm:text-sm border-b border-gray-50">
          <div className="flex items-center text-gray-600">
            <Heart className="w-4 h-4 mr-2 text-amber-600" />
            <span className="hidden sm:inline">Join the Social Club for exclusive Rewards</span>
            <span className="sm:hidden">Join Social Club</span>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex items-center justify-between py-4 sm:py-6">
          <div className="flex-1 hidden md:flex items-center space-x-4 sm:space-x-8">
            <div className="flex items-center text-gray-600 text-xs sm:text-sm">
              <Phone className="w-5 h-5 mr-1 sm:mr-2" />
              (+91) 123 456 7890
            </div>
          </div>
          <div className="flex-shrink-0">
            <a href="/" className="text-xl sm:text-3xl font-light tracking-[0.2em] sm:tracking-[0.3em] text-gray-800 hover:text-amber-600 transition-colors">
              KATENKELLY
            </a>
          </div>
          <div className="flex-1 flex justify-end items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <a href="/login" className="text-xs sm:text-sm text-gray-600 hover:text-amber-600 transition-colors">Login</a>
              <a href="/signup" className="text-xs sm:text-sm text-gray-600 hover:text-amber-600 transition-colors">Signup</a>
            </div>
            <div className="flex items-center space-x-4 relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-5 h-5 text-gray-600 hover:text-amber-600 cursor-pointer transition-colors"
              >
                <Search />
              </button>
              <a href="/cart">
                <ShoppingBag className="w-5 h-5 text-gray-600 hover:text-amber-600 cursor-pointer transition-colors" />
              </a>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              {searchOpen && (
                <div
                  ref={searchRef}
                  className="absolute top-10 sm:top-12 right-0 w-full sm:w-80 md:w-96 bg-white shadow-2xl border border-gray-200 rounded-lg z-50"
                >
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Search for jewelry..."
                      className="w-full pl-10 pr-4 py-2 sm:py-3 border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EBD6FB] text-sm sm:text-base text-gray-700 rounded-t-lg"
                    />
                    <Search className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </form>
                  {searchResults.length > 0 && (
                    <div className="max-h-64 sm:max-h-80 overflow-y-auto">
                      {searchResults.map((product) => (
                        <div
                          key={product.id || product._id}
                          className="p-3 sm:p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                          onClick={() => viewProduct(product.id || product._id)}
                        >
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <img
                              src={product.image || product.imageUrl || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                              alt={product.name}
                              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                            />
                            <div>
                              <p className="text-xs sm:text-sm font-light text-gray-900">{product.name}</p>
                              <p className="text-xs text-gray-500">Weight: {product.weight}g</p>
                              <p className="text-xs text-gray-500">{product.category}</p>
                              <p className="text-xs sm:text-sm font-medium text-gray-900">₹{product.price?.toLocaleString()} <span className="text-xs text-gray-500">per gram</span></p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {searchInput.trim() !== "" && searchResults.length === 0 && (
                    <div className="p-3 sm:p-4 text-center text-gray-500 text-xs sm:text-sm">
                      No products found.
                    </div>
                  )}
                  <div className="p-3 sm:p-4 border-t border-gray-200">
                    <button
                      onClick={handleSearchClick}
                      className="w-full text-xs sm:text-sm text-gray-700 hover:text-amber-600 transition-colors text-center"
                    >
                      View all results
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center justify-center space-x-8 lg:space-x-12 py-4 border-t border-gray-50">
          <a href="/" className="text-gray-700 hover:text-amber-600 transition-colors font-medium text-sm lg:text-base">HOME</a>
          <a href="/collections" className="text-gray-700 hover:text-amber-600 transition-colors font-medium text-sm lg:text-base">COLLECTIONS</a>
          <a href="/cart" className="text-gray-700 hover:text-amber-600 transition-colors font-medium flex items-center text-sm lg:text-base">
            <ShoppingBag className="w-4 h-4 mr-2" />
            CART
          </a>
          <a href="/account" className="text-gray-700 hover:text-amber-600 transition-colors font-medium text-sm lg:text-base">ACCOUNT</a>
          <a href="/contact" className="text-gray-700 hover:text-amber-600 transition-colors font-medium text-sm lg:text-base">CUSTOM JEWELRY</a>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-50 py-4">
            <div className="flex flex-col space-y-3">
              <a href="/" className="text-gray-700 hover:text-amber-600 transition-colors font-medium text-sm">HOME</a>
              <a href="/collections" className="text-gray-700 hover:text-amber-600 transition-colors font-medium text-sm">COLLECTIONS</a>
              <a href="/cart" className="text-gray-700 hover:text-amber-600 transition-colors font-medium text-sm">CART</a>
              <a href="/account" className="text-gray-700 hover:text-amber-600 transition-colors font-medium text-sm">ACCOUNT</a>
              <a href="/contact" className="text-gray-700 hover:text-amber-600 transition-colors font-medium text-sm">CONTACT</a>
              <div className="pt-3 border-t border-gray-100">
                <button className="text-xs text-gray-600 hover:text-amber-600 transition-colors block mb-2">Login</button>
                <button className="text-xs text-gray-600 hover:text-amber-600 transition-colors block">Signup</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;