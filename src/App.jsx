import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import CategoryFilter from './components/CategoryFilter';
import ProductGrid from './components/ProductGrid';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import AdminProductModal from './components/AdminProductModal';
import MarketplaceDashboard from './components/MarketplaceDashboard';
import BrandDnaProfileView from './components/BrandDnaProfileView';
import ListingGapReportView from './components/ListingGapReportView';
import HumanApprovalWorkspace from './components/HumanApprovalWorkspace';
import BatchOptimizerView from './components/BatchOptimizerView';
import CompetitorBenchmarkView from './components/CompetitorBenchmarkView';
import KeywordOpportunityView from './components/KeywordOpportunityView';
import ReviewSentimentView from './components/ReviewSentimentView';
import AuthModal from './components/AuthModal';
import { api } from './services/api';
import { PRODUCTS } from './data/catalogData';
import { 
  Boxes, 
  ShieldCheck, 
  Plus, 
  Database, 
  Globe, 
  Dna, 
  BarChart3, 
  CheckSquare,
  Layers,
  Award,
  KeyRound,
  MessageSquare
} from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('expert-audit');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  // Authorized Access State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('oct_auth_token'));
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiOnline, setApiOnline] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [auditTargetProduct, setAuditTargetProduct] = useState(null);
  const [auditTargetChannel, setAuditTargetChannel] = useState('amazon');
  const [favorites, setFavorites] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('oct_auth_token');
    localStorage.removeItem('oct_user');
    setIsAuthenticated(false);
  };

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Fetch live products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts({
        category: selectedCategory,
        search: searchQuery,
        sort: sortBy
      });
      const finalProducts = (data && data.length > 0) ? data : PRODUCTS;
      setProducts(finalProducts);
      if (finalProducts.length > 0) {
        setAuditTargetProduct(prev => prev || finalProducts[0]);
      }
      setApiOnline(true);
    } catch (err) {
      console.error('Failed to load products:', err);
      setProducts(PRODUCTS);
      if (PRODUCTS.length > 0) {
        setAuditTargetProduct(prev => prev || PRODUCTS[0]);
      }
      setApiOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery, sortBy]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleToggleFav = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const handleUpdateQty = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCartItems(prev => prev.map(item => item.id === productId ? { ...item, quantity: newQty } : item));
    }
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleSaveProduct = async (productPayload) => {
    await api.createProduct(productPayload);
    await fetchProducts();
  };

  const handleOrderSubmit = async (promoCode) => {
    const payload = {
      items: cartItems.map(item => ({ id: item.id, quantity: item.quantity })),
      promoCode
    };
    await api.submitOrder(payload);
    await fetchProducts();
    handleClearCart();
  };

  const handleStartOptimization = (product, channel) => {
    setAuditTargetProduct(product);
    setAuditTargetChannel(channel);
    setActiveTab('human-approval');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      
      {/* Authorized Access Lock Modal */}
      {!isAuthenticated && (
        <AuthModal onLoginSuccess={() => setIsAuthenticated(true)} />
      )}

      {/* Top Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        theme={theme}
        toggleTheme={toggleTheme}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        favCount={favorites.length}
        onOpenCart={() => setIsCartOpen(true)}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />

      {/* Navigation Sub-Header Hub */}
      <div className="glass-panel border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/50 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('expert-audit')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'expert-audit'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> 6-Metric Gap Audit
            </button>

            <button
              onClick={() => setActiveTab('brand-dna')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'brand-dna'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Dna className="w-3.5 h-3.5" /> Brand DNA
            </button>

            <button
              onClick={() => setActiveTab('human-approval')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'human-approval'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" /> Human Approval
            </button>

            <button
              onClick={() => setActiveTab('batch-optimizer')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'batch-optimizer'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Batch SKU Mode
            </button>

            <button
              onClick={() => setActiveTab('competitor-benchmark')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'competitor-benchmark'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Award className="w-3.5 h-3.5" /> Competitor Benchmark
            </button>

            <button
              onClick={() => setActiveTab('keyword-discovery')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'keyword-discovery'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" /> Keywords
            </button>

            <button
              onClick={() => setActiveTab('review-sentiment')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'review-sentiment'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> Reviews
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'catalog'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> Catalog
            </button>
          </div>

          <button
            onClick={() => setIsAdminOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all border border-indigo-500/20"
          >
            <Plus className="w-3.5 h-3.5" /> Add Listing
          </button>

        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'expert-audit' && (
          <ListingGapReportView
            products={products}
            onSelectForOptimization={handleStartOptimization}
          />
        )}

        {activeTab === 'brand-dna' && (
          <BrandDnaProfileView />
        )}

        {activeTab === 'human-approval' && (
          <HumanApprovalWorkspace
            product={auditTargetProduct || products[0]}
            channel={auditTargetChannel}
            onApproved={() => fetchProducts()}
          />
        )}

        {activeTab === 'batch-optimizer' && (
          <BatchOptimizerView
            products={products}
            onSelectForApproval={handleStartOptimization}
          />
        )}

        {activeTab === 'competitor-benchmark' && (
          <CompetitorBenchmarkView products={products} />
        )}

        {activeTab === 'keyword-discovery' && (
          <KeywordOpportunityView products={products} />
        )}

        {activeTab === 'review-sentiment' && (
          <ReviewSentimentView products={products} />
        )}

        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <MarketplaceDashboard onRefreshProducts={fetchProducts} />
            <HeroBanner onExploreClick={() => setSelectedCategory('all')} />
            <CategoryFilter
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              sortBy={sortBy}
              setSortBy={setSortBy}
              showFilters={showFilters}
            />
            {loading ? (
              <div className="py-20 text-center glass-panel rounded-3xl border border-[var(--border-color)] my-6">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm font-semibold text-[var(--text-muted)]">Loading catalog...</p>
              </div>
            ) : (
              <ProductGrid
                products={products}
                onQuickView={(prod) => setSelectedProduct(prod)}
                onAddToCart={handleAddToCart}
                favorites={favorites}
                onToggleFav={handleToggleFav}
                cartItems={cartItems}
              />
            )}
          </div>
        )}

      </main>

      {/* Quick View Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          isFav={favorites.includes(selectedProduct.id)}
          onToggleFav={handleToggleFav}
        />
      )}

      {/* Admin Product Management Modal */}
      <AdminProductModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onSaveProduct={handleSaveProduct}
      />

      {/* Slide-out Order Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onSubmitOrder={handleOrderSubmit}
      />

      {/* Footer */}
      <footer className="glass-panel border-t border-[var(--border-color)] py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-[var(--text-primary)]">OCT E-Commerce Listing Intelligence Platform</span>
            <span>© 2026 Phase 3 Complete</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-400" /> FTC Claim Guard</span>
            <span className="flex items-center gap-1"><Award className="w-4 h-4 text-purple-400" /> Competitor Benchmarks</span>
            <span className="flex items-center gap-1"><KeyRound className="w-4 h-4 text-sky-400" /> Keyword Discovery</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
