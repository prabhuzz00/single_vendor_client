import { useContext, useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useCart } from "react-use-cart";
import { IoSearchOutline } from "react-icons/io5";
import { FiShoppingCart, FiUser, FiBell, FiMenu, FiX } from "react-icons/fi";
import useTranslation from "next-translate/useTranslation";

import { getUserSession } from "@lib/auth";
import useGetSetting from "@hooks/useGetSetting";
import { handleLogEvent } from "src/lib/analytics";
import NavbarPromo from "@layout/navbar/NavbarPromo";
import CartDrawer from "@components/drawer/CartDrawer";
import { SidebarContext } from "@context/SidebarContext";
import ProductServices from "@services/ProductServices";
import useUtilsFunction from "@hooks/useUtilsFunction";

const Navbar = () => {
  const { t } = useTranslation("common");
  const [searchText, setSearchText] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const { toggleCartDrawer } = useContext(SidebarContext);
  const { totalItems } = useCart();
  const router = useRouter();

  const userInfo = getUserSession();
  const { storeCustomizationSetting } = useGetSetting();
  const { showingImage, showingTranslateValue, currency } = useUtilsFunction();

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions with debounce
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchText.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoadingSuggestions(true);
      try {
        const res = await ProductServices.getShowingStoreProducts({
          title: searchText,
        });
        setSuggestions(res?.products?.slice(0, 5) || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchText]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchText) {
      router.push(`/search?query=${searchText}`, null, { scroll: false });
      setSearchText("");
      setIsSearchOpen(false);
      setShowSuggestions(false);
      handleLogEvent("search", `searched ${searchText}`);
    } else {
      router.push(`/ `, null, { scroll: false });
      setSearchText("");
    }
  };

  const handleSuggestionClick = (slug) => {
    router.push(`/product/${slug}`);
    setSearchText("");
    setShowSuggestions(false);
    setIsSearchOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedIndex].slug);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const MobileUserSection = () => {
    if (userInfo?.image) {
      return (
        <Link
          href="/user/dashboard"
          className="flex items-center space-x-3"
          onClick={handleMobileLinkClick}
        >
          <Image
            width={40}
            height={40}
            src={userInfo?.image}
            alt="user"
            className="w-10 h-10 rounded-full ring-2 ring-yellow-400"
          />
          <span className="text-white font-medium">{userInfo?.name}</span>
        </Link>
      );
    }

    if (userInfo?.name) {
      return (
        <Link
          href="/user/dashboard"
          className="flex items-center space-x-3"
          onClick={handleMobileLinkClick}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-400 text-black font-bold">
            {userInfo?.name[0].toUpperCase()}
          </div>
          <span className="text-white font-medium">{userInfo?.name}</span>
        </Link>
      );
    }

    return (
      <Link
        href="/auth/login"
        className="flex items-center space-x-3 text-yellow-400 hover:text-yellow-500 transition-all"
        onClick={handleMobileLinkClick}
      >
        <FiUser className="w-6 h-6" />
        <span className="font-medium">Sign In</span>
      </Link>
    );
  };

  const MobileMenuLink = ({ href, text }) => {
    return (
      <Link
        href={href}
        className="block px-4 py-3 rounded-lg text-white hover:bg-gray-800 hover:text-yellow-400 transition-all"
        onClick={handleMobileLinkClick}
      >
        {text}
      </Link>
    );
  };

  const UserProfile = () => {
    if (userInfo?.image) {
      return (
        <Link
          href="/user/dashboard"
          className="block w-10 h-10 rounded-full ring-2 ring-gray-700 hover:ring-yellow-400 transition-all overflow-hidden"
        >
          <Image
            width={40}
            height={40}
            src={userInfo?.image}
            alt="user"
            className="w-full h-full object-cover"
          />
        </Link>
      );
    }

    if (userInfo?.name) {
      return (
        <Link
          href="/user/dashboard"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-400 text-black font-bold text-lg hover:scale-110 transition-transform"
        >
          {userInfo?.name[0].toUpperCase()}
        </Link>
      );
    }

    return (
      <Link
        href="/auth/login"
        className="flex items-center space-x-2 px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold transition-all hover:scale-105 active:scale-95"
      >
        <FiUser className="w-5 h-5" />
        <span className="hidden xl:inline">Sign In</span>
      </Link>
    );
  };

  return (
    <>
      <CartDrawer />

      <nav className="bg-black sticky top-0 z-30 shadow-xl backdrop-blur-sm bg-opacity-95 border-b border-gray-800">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-20">
            <button
              onClick={handleMobileMenuToggle}
              className="lg:hidden text-white hover:text-yellow-400 transition-all p-2"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>

            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-36 h-12 lg:w-40 lg:h-14 transition-transform group-hover:scale-105 duration-300">
                <Image
                  width="0"
                  height="0"
                  sizes="100vw"
                  className="w-full h-full object-contain"
                  priority
                  src={
                    storeCustomizationSetting?.navbar?.logo ||
                    "/logo/logo-light.svg"
                  }
                  alt="logo"
                />
              </div>
            </Link>

            <div
              className="hidden lg:flex flex-1 max-w-2xl mx-8 xl:mx-12"
              ref={searchRef}
            >
              <form onSubmit={handleSubmit} className="w-full relative group">
                <input
                  onChange={(e) => setSearchText(e.target.value)}
                  value={searchText}
                  onKeyDown={handleKeyDown}
                  className="w-full h-12 pl-5 pr-12 bg-white/10 backdrop-blur-sm border-2 border-gray-700 rounded-full text-white placeholder-gray-400 focus:bg-white/20 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300 outline-none"
                  placeholder={
                    t("search-placeholder") || "Search for products..."
                  }
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400 hover:bg-yellow-500 text-black transition-all hover:scale-110 active:scale-95"
                  aria-label="Search"
                >
                  <IoSearchOutline className="w-5 h-5" />
                </button>

                {/* Desktop Suggestions Dropdown */}
                {showSuggestions && (
                  <div className="absolute top-full mt-2 w-full bg-gray-900 border-2 border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-50">
                    {isLoadingSuggestions ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-yellow-400 border-t-transparent"></div>
                      </div>
                    ) : suggestions.length > 0 ? (
                      <ul className="py-2">
                        {suggestions.map((product, index) => (
                          <li
                            key={product._id}
                            onClick={() => handleSuggestionClick(product.slug)}
                            className={`px-4 py-3 flex items-center space-x-4 cursor-pointer transition-all ${
                              selectedIndex === index
                                ? "bg-yellow-400/20 border-l-4 border-yellow-400"
                                : "hover:bg-gray-800"
                            }`}
                          >
                            <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                              <Image
                                src={showingImage(product?.image)}
                                alt={showingTranslateValue(product?.title)}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-medium truncate">
                                {showingTranslateValue(product?.title)}
                              </h4>
                              <p className="text-yellow-400 text-sm font-semibold mt-1">
                                {currency}
                                {product?.prices?.price?.toFixed(2)}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="py-8 text-center text-gray-400">
                        No products found
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>

            <div className="hidden lg:flex items-center space-x-6">
              <button
                className="relative text-white hover:text-yellow-400 transition-all group"
                aria-label="Notifications"
              >
                <FiBell className="w-6 h-6 group-hover:animate-pulse" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
              </button>

              <button
                onClick={toggleCartDrawer}
                className="relative text-white hover:text-yellow-400 transition-all group"
                aria-label="Shopping Cart"
              >
                <FiShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-black bg-yellow-400 rounded-full group-hover:scale-110 transition-transform">
                    {totalItems}
                  </span>
                )}
              </button>

              <div className="relative">
                <UserProfile />
              </div>
            </div>

            <div className="flex lg:hidden items-center space-x-4">
              <button
                onClick={handleSearchToggle}
                className="text-white hover:text-yellow-400 transition-all"
                aria-label="Search"
              >
                <IoSearchOutline className="w-6 h-6" />
              </button>

              <button
                onClick={toggleCartDrawer}
                className="relative text-white hover:text-yellow-400 transition-all"
                aria-label="Cart"
              >
                <FiShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-black bg-yellow-400 rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {isSearchOpen && (
            <div
              className="lg:hidden pb-4 animate-in slide-in-from-top duration-300"
              ref={mobileSearchRef}
            >
              <form onSubmit={handleSubmit} className="relative">
                <input
                  onChange={(e) => setSearchText(e.target.value)}
                  value={searchText}
                  onKeyDown={handleKeyDown}
                  className="w-full h-12 pl-5 pr-12 bg-white/10 backdrop-blur-sm border-2 border-gray-700 rounded-full text-white placeholder-gray-400 focus:bg-white/20 focus:border-yellow-400 transition-all outline-none"
                  placeholder={t("search-placeholder") || "Search..."}
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400 hover:bg-yellow-500 text-black transition-all"
                  aria-label="Search"
                >
                  <IoSearchOutline className="w-5 h-5" />
                </button>

                {/* Mobile Suggestions Dropdown */}
                {showSuggestions && (
                  <div className="absolute top-full mt-2 w-full bg-gray-900 border-2 border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-50">
                    {isLoadingSuggestions ? (
                      <div className="flex items-center justify-center py-6">
                        <div className="animate-spin rounded-full h-6 w-6 border-4 border-yellow-400 border-t-transparent"></div>
                      </div>
                    ) : suggestions.length > 0 ? (
                      <ul className="py-2">
                        {suggestions.map((product, index) => (
                          <li
                            key={product._id}
                            onClick={() => handleSuggestionClick(product.slug)}
                            className={`px-4 py-3 flex items-center space-x-3 cursor-pointer transition-all ${
                              selectedIndex === index
                                ? "bg-yellow-400/20 border-l-4 border-yellow-400"
                                : "hover:bg-gray-800"
                            }`}
                          >
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                              <Image
                                src={showingImage(product?.image)}
                                alt={showingTranslateValue(product?.title)}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white text-sm font-medium truncate">
                                {showingTranslateValue(product?.title)}
                              </h4>
                              <p className="text-yellow-400 text-xs font-semibold mt-1">
                                {currency}
                                {product?.prices?.price?.toFixed(2)}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="py-6 text-center text-gray-400 text-sm">
                        No products found
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>
          )}

          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-800 bg-black/98 backdrop-blur-sm">
              <div className="px-4 py-6 space-y-4">
                <div className="flex items-center space-x-4 pb-4 border-b border-gray-800">
                  <MobileUserSection />
                </div>

                <div className="space-y-2">
                  <MobileMenuLink href="/" text="Home" />
                  <MobileMenuLink href="/products" text="Shop" />
                  <MobileMenuLink href="/about" text="About" />
                  <button
                    className="w-full text-left px-4 py-3 rounded-lg text-white hover:bg-gray-800 hover:text-yellow-400 transition-all flex items-center space-x-2"
                    aria-label="Notifications"
                  >
                    <FiBell className="w-5 h-5" />
                    <span>Notifications</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      <NavbarPromo />
    </>
  );
};

export default dynamic(() => Promise.resolve(Navbar), { ssr: false });
