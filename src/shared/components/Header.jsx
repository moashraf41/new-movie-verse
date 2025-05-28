import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Search, Bookmark, User, LogIn } from "lucide-react";
import logo from "../../assets/Logo-with-text.png";
import { MovieCard } from "./MovieCard";
import { filterBySearch } from "../utils/movieUtils";
import { getAllSeries } from "../../features/series/seriesApi";
import { getAllMovies } from "../../features/movies/movieApi";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [allMovies, setAllMovies] = useState([]);
  const searchInputRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    async function loadData() {
      try {
        const [moviesRes, seriesRes] = await Promise.all([
          getAllMovies(),
          getAllSeries(),
        ]);

        const combined = [
          ...moviesRes.data.map((m) => ({ ...m, type: "movie" })),
          ...seriesRes.data.map((s) => ({ ...s, type: "series" })),
        ];

        setAllMovies(combined);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      const filtered = filterBySearch(allMovies, searchQuery);
      setSearchResults(filtered);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, allMovies]);

  useEffect(() => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  }, [location]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsSearchOpen(false);
    }
  };

  const handleCloseModal = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuRef]);

  return (
    <header className="w-full bg-gradient-to-b from-zinc-900 to-zinc-900/95 backdrop-blur-md sticky top-0 z-50 shadow-lg border-b border-zinc-800/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src={logo}
              alt="MovieDB Logo"
              className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              to="/movies"
              className="px-4 py-2 rounded-lg text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-all duration-200"
            >
              Movies
            </Link>
            <Link
              to="/series"
              className="px-4 py-2 rounded-lg text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-all duration-200"
            >
              Series
            </Link>
            <Link
              to="/people"
              className="px-4 py-2 rounded-lg text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-all duration-200"
            >
              Actors
            </Link>
            <Link
              to="/watchlist"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-all duration-200"
            >
              <Bookmark className="h-5 w-5" />
              <span>Watchlist</span>
            </Link>
          </nav>

          {/* Right Section - Search and Auth */}
          <div className="hidden lg:flex items-center space-x-3">
            <button
              onClick={() => {
                setIsSearchOpen(true);
                setTimeout(() => searchInputRef.current?.focus(), 100);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 hover:bg-zinc-700/70 text-zinc-300 hover:text-white transition-all duration-200"
              aria-label="Search movies"
            >
              <Search className="h-5 w-5" />
              <span className="text-sm">Search...</span>
              <kbd className="ml-2 text-xs bg-zinc-700/50 px-2 py-1 rounded">Ctrl+K</kbd>
            </button>

            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white transition-all duration-200 shadow-lg shadow-pink-500/20"
            >
              <User className="h-5 w-5" />
              <span>Login</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-full bg-zinc-800/50 hover:bg-zinc-700/70 text-white transition-all duration-200"
              aria-label="Search movies"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              className="text-white p-2 rounded-lg hover:bg-zinc-800/50 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          ref={mobileMenuRef}
          className={`${
            isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          } lg:hidden overflow-hidden transition-all duration-300 ease-in-out bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800/50`}
        >
          <nav className="flex flex-col items-center py-4 space-y-2">
            <Link
              to="/movies"
              className="w-full text-center px-6 py-3 text-lg font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Movies
            </Link>
            <Link
              to="/series"
              className="w-full text-center px-6 py-3 text-lg font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Series
            </Link>
            <Link
              to="/people"
              className="w-full text-center px-6 py-3 text-lg font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Actors
            </Link>
            <Link
              to="/watchlist"
              className="w-full text-center px-6 py-3 text-lg font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center justify-center gap-2">
                <Bookmark className="h-5 w-5" />
                <span>Watchlist</span>
              </div>
            </Link>
            <div className="w-full border-t border-zinc-800/50 pt-4 mt-2">
              <Link
                to="/login"
                className="w-full text-center px-6 py-3 text-lg font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center justify-center gap-2">
                  <LogIn className="h-5 w-5" />
                  <span>Login</span>
                </div>
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* Search Modal */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/70 z-50 flex justify-center items-start pt-16 pb-8 animate-fade-in"
          onClick={handleBackdropClick}
        >
          <div
            className="w-[90vw] max-w-3xl bg-zinc-900 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border border-zinc-800/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Header */}
            <div className="sticky top-0 bg-zinc-900 p-4 border-b border-zinc-800/50 z-10">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search for movies, series, or actors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-lg hover:bg-zinc-800/50 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto p-4">
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((item) => (
                    <MovieCard key={item.id} movie={item} />
                  ))}
                </div>
              ) : searchQuery.trim() ? (
                <NoResults
                  message="No results found"
                  sub="Try different keywords or check your spelling"
                />
              ) : (
                <NoResults
                  message="Start typing to search"
                  sub="Search for movies, series, or actors"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NoResults({ message, sub }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-xl font-medium text-zinc-300">{message}</p>
      <p className="text-sm text-zinc-400 mt-1">{sub}</p>
    </div>
  );
}
