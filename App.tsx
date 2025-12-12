import React, { useState, useEffect, Suspense, lazy, useMemo } from 'react';
import { FoodItem, VisualObject, LogEntry } from './types';
import { FOOD_DATA } from './constants';

// Lazy load the Camera component to speed up initial page load
const CameraOverlay = lazy(() => import('./components/CameraOverlay'));

// --- VISUAL OBJECTS ---
const VISUAL_OBJECTS: Record<string, VisualObject> = {
  'Deck of Cards': { id: 'deck-of-cards', name: 'Deck of Cards', emoji: '🃏', realWorldSize: '100g meat', dimensions: '3.5" x 2.5"' },
  'Baseball': { id: 'baseball', name: 'Baseball', emoji: '⚾', realWorldSize: '1 cup', dimensions: 'Fist size' },
  'Tennis Ball': { id: 'tennis-ball', name: 'Tennis Ball', emoji: '🎾', realWorldSize: 'Medium fruit', dimensions: '2.7" diameter' },
  'Tennis Ball (Half)': { id: 'tennis-ball-half', name: 'Tennis Ball (Half)', emoji: '🎾', realWorldSize: '1/2 cup', dimensions: '1.35" radius' },
  'Computer Mouse': { id: 'computer-mouse', name: 'Computer Mouse', emoji: '🖱️', realWorldSize: 'Medium potato', dimensions: '4" x 2.5"' },
  'Poker Chip': { id: 'poker-chip', name: 'Poker Chip', emoji: '🪙', realWorldSize: '1 tbsp', dimensions: '1.5" diameter' },
  'Compact Disc (CD)': { id: 'cd', name: 'Compact Disc', emoji: '💿', realWorldSize: 'Roti/Paratha', dimensions: '4.7" diameter' },
  'Golf Ball': { id: 'golf-ball', name: 'Golf Ball', emoji: '⛳', realWorldSize: 'Small portion', dimensions: '1.7" diameter' },
  'Checkbook': { id: 'checkbook', name: 'Checkbook', emoji: '📖', realWorldSize: 'Fish fillet', dimensions: '6" x 3"' },
  '4 Dice': { id: 'dice', name: '4 Dice', emoji: '🎲', realWorldSize: 'Cheese cube', dimensions: '1" cube stack' },
  'Pencil': { id: 'pencil', name: 'Pencil', emoji: '✏️', realWorldSize: 'Banana/Kebab', dimensions: '7-8" length' },
  'Hockey Puck': { id: 'hockey-puck', name: 'Hockey Puck', emoji: '🏒', realWorldSize: 'Tikki/Patty', dimensions: '3" diameter' }
};

// Helper for category badge class
const getCategoryBadgeClass = (category: string) => {
  switch (category) {
    case 'Protein': return 'badge-protein';
    case 'Carbs': return 'badge-carbs';
    case 'Fats': return 'badge-fats';
    case 'Produce': return 'badge-produce';
    case 'Sweets': return 'badge-sweets';
    case 'Dairy': return 'badge-dairy';
    case 'Snacks': return 'badge-snacks';
    default: return 'bg-secondary';
  }
};

interface ComparisonModalProps {
  food: FoodItem;
  onClose: () => void;
  onOpenCamera: (visualObject: VisualObject) => void;
  onToggleFavorite: (foodId: string | number) => void;
  isFavorite: boolean;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ food, onClose, onOpenCamera, onToggleFavorite, isFavorite }) => {
  const visualObj = VISUAL_OBJECTS[food.visualReference || 'Baseball'];

  return (
    <div className="modal-backdrop-custom animate-fade-in" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-card p-4 p-md-5">

        {/* Header */}
        <div className="text-center mb-4">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <button
              onClick={() => onToggleFavorite(food.id)}
              className="btn btn-sm btn-outline-warning"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <i className={`bi bi-star${isFavorite ? '-fill' : ''}`}></i>
            </button>
            <button onClick={onClose} className="btn btn-sm btn-outline-secondary" aria-label="Close">
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          <h2 className="fw-bold mb-1">{food.name}</h2>
          <span className={`badge rounded-pill ${getCategoryBadgeClass(food.category)} fs-6 px-3 py-2`}>
            {food.category} • {food.portionSize}
          </span>
        </div>

        {/* Calorie Info */}
        <div className="glass-panel p-4 rounded-3 mb-4 text-center">
          <div className="row">
            <div className="col-6">
              <small className="text-white-50 d-block">Calories</small>
              <h3 className="fw-bold text-warning mb-0">{food.calories}</h3>
            </div>
            <div className="col-6">
              <small className="text-white-50 d-block">Portion</small>
              <h3 className="fw-bold text-info mb-0">{food.portionSize}</h3>
            </div>
          </div>
        </div>

        {/* Visual Reference */}
        {visualObj && (
          <div className="object-card p-4 text-center mb-4">
            <div className="display-3 mb-2">{visualObj.emoji}</div>
            <h5 className="fw-bold mb-1">{visualObj.name}</h5>
            <small className="text-muted">{food.description}</small>
          </div>
        )}

        {/* Action Buttons */}
        <div className="d-flex gap-3 justify-content-center">
          <button className="btn btn-outline-secondary px-4 py-2" onClick={onClose}>
            Close
          </button>
          {visualObj && (
            <button
              className="btn btn-primary px-4 py-2 fw-bold"
              onClick={() => onOpenCamera(visualObj)}
              style={{ background: 'linear-gradient(to right, #3b82f6, #2563eb)' }}
            >
              <i className="bi bi-camera-fill me-2"></i>
              Use AR Camera
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

// --- LOG PROMPT MODAL ---
interface LogPromptModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  foodName: string;
  objectName: string;
}

const LogPromptModal: React.FC<LogPromptModalProps> = ({ onConfirm, onCancel, foodName, objectName }) => {
  return (
    <div className="modal-backdrop-custom animate-fade-in" style={{ zIndex: 1060 }}>
      <div className="modal-card p-4 text-center" style={{ maxWidth: '20rem' }}>
        <h4 className="fw-bold mb-3">Log this portion?</h4>
        <p className="text-muted mb-4">
          Did you eat <strong>{foodName}</strong> using <strong>{objectName}</strong> as a guide?
        </p>
        <div className="d-flex gap-2">
          <button onClick={onCancel} className="btn btn-light flex-grow-1">No</button>
          <button onClick={onConfirm} className="btn btn-success flex-grow-1 text-white">Yes, Log It</button>
        </div>
      </div>
    </div>
  );
};

// --- BROWSE TAB ---
interface BrowseTabProps {
  foods: FoodItem[];
  onSelectFood: (f: FoodItem) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (c: string) => void;
  favorites: Set<string | number>;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
}

const BrowseTab: React.FC<BrowseTabProps> = ({
  foods,
  onSelectFood,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  favorites,
  showFavoritesOnly,
  onToggleFavoritesOnly
}) => {
  const categories = ['All', 'Protein', 'Carbs', 'Snacks', 'Sweets', 'Dairy', 'Produce', 'Fats', 'Beverages'];

  return (
    <div className="pb-5">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="input-group input-group-lg">
          <span className="input-group-text bg-dark border-white/10 text-white-50">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control bg-dark border-white/10 text-white"
            placeholder="Search foods (e.g., biryani, samosa, roti)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              className="btn btn-outline-secondary"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-4 d-flex gap-2 flex-wrap align-items-center">
        {categories.map(cat => (
          <button
            key={cat}
            className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline-light'}`}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
        <div className="ms-auto">
          <button
            className={`btn btn-sm ${showFavoritesOnly ? 'btn-warning' : 'btn-outline-warning'}`}
            onClick={onToggleFavoritesOnly}
          >
            <i className="bi bi-star-fill me-1"></i>
            Favorites {favorites.size > 0 && `(${favorites.size})`}
          </button>
        </div>
      </div>

      {/* Food Count */}
      <div className="mb-3">
        <small className="text-white-50">
          Showing {foods.length} food{foods.length !== 1 ? 's' : ''}
        </small>
      </div>

      {/* Food Grid */}
      <div className="row g-4">
        {foods.length === 0 ? (
          <div className="col-12 text-center py-5">
            <i className="bi bi-search display-1 text-white-50 opacity-25 mb-3 d-block"></i>
            <p className="text-white-50">No foods found. Try a different search or category.</p>
          </div>
        ) : (
          foods.map((food) => (
            <div key={food.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
              <div className="card h-100 food-card p-3 shadow-lg position-relative">
                {favorites.has(food.id) && (
                  <div className="position-absolute top-0 end-0 p-2">
                    <i className="bi bi-star-fill text-warning"></i>
                  </div>
                )}
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className={`badge rounded-pill ${getCategoryBadgeClass(food.category)}`}>
                        {food.category}
                      </span>
                      <small className="text-light opacity-75">{food.calories} cal</small>
                    </div>
                    <h3 className="card-title h5 fw-bold mb-1 text-white">{food.name}</h3>
                    <p className="card-text text-light small mb-3">{food.portionSize}</p>
                  </div>
                  <button
                    className="btn btn-custom w-100 mt-auto shadow-md"
                    onClick={() => onSelectFood(food)}
                  >
                    View Details <i className="bi bi-arrow-right ms-2"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// --- MY PORTIONS TAB (with Analytics) ---
interface MyPortionsTabProps {
  logs: LogEntry[];
  onClear: () => void;
}

const MyPortionsTab: React.FC<MyPortionsTabProps> = ({ logs, onClear }) => {
  // Calculate analytics
  const totalCalories = useMemo(() => {
    return logs.reduce((sum, log) => sum + (log.calories || 0), 0);
  }, [logs]);

  const categoryBreakdown = useMemo(() => {
    const breakdown: Record<string, number> = {};
    logs.forEach(log => {
      if (log.category) {
        breakdown[log.category] = (breakdown[log.category] || 0) + (log.calories || 0);
      }
    });
    return breakdown;
  }, [logs]);

  return (
    <div className="container max-w-md mx-auto pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 fw-bold mb-0 text-white">Today's Log</h2>
        {logs.length > 0 && (
          <button onClick={onClear} className="btn btn-sm btn-outline-danger">Clear All</button>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-5 text-secondary">
          <i className="bi bi-clipboard-data display-1 opacity-25 mb-3 d-block"></i>
          <p className="text-white-50">No portions logged yet today.</p>
          <p className="small text-white-50">Use the camera or browse foods to add one!</p>
        </div>
      ) : (
        <>
          {/* Analytics Dashboard */}
          <div className="glass-panel p-4 rounded-3 mb-4">
            <h5 className="fw-bold text-white mb-3">
              <i className="bi bi-graph-up me-2"></i>Today's Summary
            </h5>

            {/* Total Calories */}
            <div className="text-center mb-4">
              <small className="text-white-50 d-block">Total Calories</small>
              <h2 className="fw-bold text-warning mb-0">{totalCalories}</h2>
            </div>

            {/* Category Breakdown */}
            {Object.keys(categoryBreakdown).length > 0 && (
              <div>
                <small className="text-white-50 d-block mb-2">By Category</small>
                {Object.entries(categoryBreakdown).map(([category, calories]) => (
                  <div key={category} className="d-flex justify-content-between align-items-center mb-2">
                    <span className={`badge ${getCategoryBadgeClass(category)}`}>{category}</span>
                    <span className="text-white fw-bold">{calories} cal</span>
                  </div>
                ))}
              </div>
            )}

            {/* Meal Count */}
            <div className="mt-3 pt-3 border-top border-white/10">
              <div className="d-flex justify-content-between">
                <small className="text-white-50">Items Logged</small>
                <small className="text-white fw-bold">{logs.length}</small>
              </div>
            </div>
          </div>

          {/* Log List */}
          <h6 className="text-white-50 mb-3">Recent Items</h6>
          <ul className="list-group list-group-flush bg-transparent gap-2">
            {logs.map((log) => (
              <li key={log.id} className="list-group-item bg-dark border border-white/10 rounded-3 text-light d-flex justify-content-between align-items-center p-3 shadow-sm">
                <div className="d-flex align-items-center gap-3 flex-grow-1">
                  <span className="fs-4">{log.emoji}</span>
                  <div className="flex-grow-1">
                    <h6 className="mb-0 fw-bold text-white">{log.foodName}</h6>
                    <small className="text-white-50">{log.objectName}</small>
                  </div>
                  <div className="text-end">
                    <small className="text-warning fw-bold d-block">{log.calories} cal</small>
                    <small className="text-white-50 font-monospace">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </small>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

// --- ABOUT TAB ---
const AboutTab = () => (
  <div className="container max-w-lg mx-auto text-center pb-5">
    <div className="mb-5">
      <h2 className="display-5 fw-bold gradient-text mb-3">How it Works</h2>
      <p className="lead text-secondary-light">PortionVision uses Augmented Reality to help you visualize serving sizes using objects you know.</p>
    </div>

    <div className="row g-4 text-start mb-5">
      <div className="col-12 glass-panel p-4 rounded-3 border border-white/10 bg-white/5">
        <h5 className="fw-bold text-primary"><i className="bi bi-1-circle-fill me-2"></i>Select Food</h5>
        <p className="text-white-50 mb-0">Browse 400+ South Asian foods to find what you're eating.</p>
      </div>
      <div className="col-12 glass-panel p-4 rounded-3 border border-white/10 bg-white/5">
        <h5 className="fw-bold text-success"><i className="bi bi-2-circle-fill me-2"></i>View Portion Size</h5>
        <p className="text-white-50 mb-0">See visual comparisons with familiar objects like a deck of cards or tennis ball.</p>
      </div>
      <div className="col-12 glass-panel p-4 rounded-3 border border-white/10 bg-white/5">
        <h5 className="fw-bold text-info"><i className="bi bi-3-circle-fill me-2"></i>Use AR Camera</h5>
        <p className="text-white-50 mb-0">Overlay the reference object on your real food to check your portion.</p>
      </div>
      <div className="col-12 glass-panel p-4 rounded-3 border border-white/10 bg-white/5">
        <h5 className="fw-bold text-warning"><i className="bi bi-4-circle-fill me-2"></i>Track Your Intake</h5>
        <p className="text-white-50 mb-0">Log portions and view daily calorie analytics.</p>
      </div>
    </div>

    <div className="alert alert-info border-0 text-white bg-opacity-10 bg-info">
      <i className="bi bi-lightbulb-fill me-2"></i>
      <strong>Pro Tip:</strong> Hold your phone about 12 inches away from your plate for the best accuracy.
    </div>

    <div className="glass-panel p-4 rounded-3 mt-4">
      <h6 className="text-white mb-3"><i className="bi bi-star-fill text-warning me-2"></i>Features</h6>
      <ul className="list-unstyled text-start text-white-50 small mb-0">
        <li className="mb-2">✓ 110+ South Asian foods</li>
        <li className="mb-2">✓ Search & filter by category</li>
        <li className="mb-2">✓ Favorites system</li>
        <li className="mb-2">✓ Daily calorie tracking</li>
        <li className="mb-2">✓ AR camera visualization</li>
        <li className="mb-2">✓ 100% offline & private</li>
      </ul>
    </div>
  </div>
);

// --- MAIN APP ---
const App: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<'browse' | 'log' | 'about'>('browse');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [highContrast, setHighContrast] = useState(false);
  const [favorites, setFavorites] = useState<Set<string | number>>(new Set());

  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [cameraVisualObject, setCameraVisualObject] = useState<VisualObject | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Logging Flow State
  const [showLogPrompt, setShowLogPrompt] = useState(false);
  const [pendingLog, setPendingLog] = useState<{ food: FoodItem, object: VisualObject } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load logs and favorites from localStorage
  useEffect(() => {
    const savedLogs = localStorage.getItem('portionLogs');
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }

    const savedFavorites = localStorage.getItem('portionFavorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Toggle High Contrast
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // Filter foods based on search and category
  const filteredFoods = useMemo(() => {
    let filtered = FOOD_DATA;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(food =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(food => food.category === selectedCategory);
    }

    // Filter by favorites
    if (showFavoritesOnly) {
      filtered = filtered.filter(food => favorites.has(food.id));
    }

    return filtered;
  }, [searchQuery, selectedCategory, showFavoritesOnly, favorites]);

  const handleOpenCamera = (obj: VisualObject) => {
    if (selectedFood) {
      setPendingLog({ food: selectedFood, object: obj });
    }
    setCameraVisualObject(obj);
  };

  const handleCameraCapture = () => {
    setCameraVisualObject(null);
    setTimeout(() => {
      setShowLogPrompt(true);
    }, 300);
  };

  const confirmLog = () => {
    if (pendingLog) {
      const newEntry: LogEntry = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        foodName: pendingLog.food.name,
        objectName: pendingLog.object.name,
        emoji: pendingLog.object.emoji,
        calories: pendingLog.food.calories || 0,
        category: pendingLog.food.category
      };

      const updatedLogs = [newEntry, ...logs];
      setLogs(updatedLogs);
      localStorage.setItem('portionLogs', JSON.stringify(updatedLogs));

      setPendingLog(null);
      setShowLogPrompt(false);

      setToastMessage("Logged! 🎉");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const clearLogs = () => {
    if (window.confirm("Clear all history?")) {
      setLogs([]);
      localStorage.removeItem('portionLogs');
    }
  };

  const toggleFavorite = (foodId: string | number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(foodId)) {
      newFavorites.delete(foodId);
    } else {
      newFavorites.add(foodId);
    }
    setFavorites(newFavorites);
    localStorage.setItem('portionFavorites', JSON.stringify(Array.from(newFavorites)));
  };

  return (
    <div className="container-fluid pt-4" style={{ maxWidth: '1200px' }}>

      {/* 1. Header */}
      <header className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h3 gradient-text mb-0">PortionVision</h1>
          {activeTab === 'browse' && <p className="text-secondary small mb-0">110+ South Asian Foods</p>}
          {activeTab === 'log' && <p className="text-secondary small mb-0">Your daily tracker</p>}
          {activeTab === 'about' && <p className="text-secondary small mb-0">Help & Tips</p>}
        </div>
        <button
          className={`btn btn-sm ${highContrast ? 'btn-warning text-dark fw-bold' : 'btn-outline-light text-secondary'}`}
          onClick={() => setHighContrast(!highContrast)}
          aria-pressed={highContrast}
        >
          <i className="bi bi-eye-fill me-1"></i> {highContrast ? 'HC ON' : 'HC OFF'}
        </button>
      </header>

      {/* 2. Main Content Area */}
      <main>
        {activeTab === 'browse' && (
          <BrowseTab
            foods={filteredFoods}
            onSelectFood={setSelectedFood}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            favorites={favorites}
            showFavoritesOnly={showFavoritesOnly}
            onToggleFavoritesOnly={() => setShowFavoritesOnly(!showFavoritesOnly)}
          />
        )}
        {activeTab === 'log' && <MyPortionsTab logs={logs} onClear={clearLogs} />}
        {activeTab === 'about' && <AboutTab />}
      </main>

      {/* 3. Bottom Navigation (Fixed) */}
      <nav className="fixed-bottom bottom-nav pb-safe">
        <div className="d-flex justify-content-around py-2">
          <button
            className={`btn nav-btn d-flex flex-column align-items-center ${activeTab === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveTab('browse')}
          >
            <i className="bi bi-grid-fill fs-4"></i>
            <span className="small">Browse</span>
          </button>
          <button
            className={`btn nav-btn d-flex flex-column align-items-center ${activeTab === 'log' ? 'active' : ''}`}
            onClick={() => setActiveTab('log')}
          >
            <i className="bi bi-journal-text fs-4"></i>
            <span className="small">Log</span>
          </button>
          <button
            className={`btn nav-btn d-flex flex-column align-items-center ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            <i className="bi bi-info-circle-fill fs-4"></i>
            <span className="small">About</span>
          </button>
        </div>
      </nav>

      {/* 4. Modals & Overlays */}

      {/* Selection Modal */}
      {selectedFood && !cameraVisualObject && !showLogPrompt && (
        <ComparisonModal
          food={selectedFood}
          onClose={() => setSelectedFood(null)}
          onOpenCamera={handleOpenCamera}
          onToggleFavorite={toggleFavorite}
          isFavorite={favorites.has(selectedFood.id)}
        />
      )}

      {/* Camera Overlay - Lazy Loaded */}
      <Suspense fallback={
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-black" style={{ zIndex: 2000 }}>
          <div className="loading-spinner mb-3"></div>
          <p className="text-white-50">Initializing AR...</p>
        </div>
      }>
        {cameraVisualObject && (
          <CameraOverlay
            visualObject={cameraVisualObject}
            onClose={() => setCameraVisualObject(null)}
            onCapture={handleCameraCapture}
          />
        )}
      </Suspense>

      {/* Log Prompt Modal */}
      {showLogPrompt && pendingLog && (
        <LogPromptModal
          foodName={pendingLog.food.name}
          objectName={pendingLog.object.name}
          onConfirm={confirmLog}
          onCancel={() => { setShowLogPrompt(false); setPendingLog(null); }}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed-top mt-4 d-flex justify-content-center" style={{ zIndex: 2000 }}>
          <div className="bg-success text-white px-4 py-2 rounded-pill shadow-lg animate-slide-up">
            {toastMessage}
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
