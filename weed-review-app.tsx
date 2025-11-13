import React, { useState, useEffect } from 'react';
import { Star, MapPin, Plus, X, Search, Filter } from 'lucide-react';

const StrainReviewApp = () => {
  const [strains, setStrains] = useState([]);
  const [stores, setStores] = useState([]);
  const [activeTab, setActiveTab] = useState('strains');
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterBy, setFilterBy] = useState('recent');
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  // Form states
  const [newItem, setNewItem] = useState({
    name: '',
    type: '',
    rating: 5,
    price: '',
    notes: '',
    effects: [],
    storeName: '',
    address: '',
    lat: '',
    lng: '',
    reviewer: ''
  });

  // Demo data
  const demoStrains = [
    {
      id: 1,
      name: "Blue Dream",
      type: "Hybrid",
      rating: 5,
      price: "$50/eighth",
      notes: "Perfect balance of relaxation and euphoria. Great for daytime use, helped with creativity and stress relief. Blueberry taste is amazing!",
      effects: ["Happy", "Euphoric", "Creative", "Relaxed"],
      storeName: "HOUSING WORKS Cannabis Co.",
      reviewer: "Alex",
      date: "2024-11-10T10:00:00.000Z"
    },
    {
      id: 2,
      name: "Sour Diesel",
      type: "Sativa",
      rating: 4,
      price: "$55/eighth",
      notes: "Classic energizing strain. Great for getting things done during the day. Strong diesel aroma, very uplifting and focused high.",
      effects: ["Energetic", "Focused", "Happy", "Creative"],
      storeName: "The Travel Agency",
      reviewer: "Jordan",
      date: "2024-11-08T14:30:00.000Z"
    },
    {
      id: 3,
      name: "Granddaddy Purple",
      type: "Indica",
      rating: 5,
      price: "$60/eighth",
      notes: "Best for nighttime! Deep relaxation and amazing sleep. Purple buds with sweet grape flavor. Perfect for unwinding after work.",
      effects: ["Relaxed", "Sleepy", "Happy"],
      storeName: "Union Square Travel Agency",
      reviewer: "Alex",
      date: "2024-11-05T20:00:00.000Z"
    },
    {
      id: 4,
      name: "Girl Scout Cookies",
      type: "Hybrid",
      rating: 5,
      price: "$65/eighth",
      notes: "Premium quality! Sweet and earthy flavor with strong euphoria. Got the giggles hard, great for hanging with friends.",
      effects: ["Euphoric", "Happy", "Hungry", "Relaxed"],
      storeName: "Smacked LLC",
      reviewer: "Jordan",
      date: "2024-11-03T16:00:00.000Z"
    },
    {
      id: 5,
      name: "Green Crack",
      type: "Sativa",
      rating: 4,
      price: "$45/eighth",
      notes: "Energy boost is real! Great for morning wake and bake. Helps with focus and motivation. Citrus and mango flavors.",
      effects: ["Energetic", "Focused", "Happy"],
      storeName: "HOUSING WORKS Cannabis Co.",
      reviewer: "Alex",
      date: "2024-10-28T09:00:00.000Z"
    },
    {
      id: 6,
      name: "Northern Lights",
      type: "Indica",
      rating: 5,
      price: "$55/eighth",
      notes: "Classic indica, super relaxing without being too sedating. Great for anxiety relief. Sweet and spicy earth aroma.",
      effects: ["Relaxed", "Happy", "Sleepy"],
      storeName: "The Travel Agency",
      reviewer: "Jordan",
      date: "2024-10-25T19:00:00.000Z"
    }
  ];

  const demoStores = [
    {
      id: 101,
      name: "HOUSING WORKS Cannabis Co.",
      address: "750 Broadway, New York, NY 10003",
      rating: 5,
      notes: "First legal dispensary in NYC! Beautiful store, knowledgeable staff, great selection. Supporting a good cause too. Can get busy on weekends.",
      lat: 40.7298,
      lng: -73.9918,
      reviewer: "Alex",
      date: "2024-11-01T12:00:00.000Z"
    },
    {
      id: 102,
      name: "The Travel Agency",
      address: "163 7th Avenue South, New York, NY 10014",
      rating: 4,
      notes: "Cool vibe in the West Village. Good variety of products. Staff is friendly but sometimes the wait can be long. Prices are reasonable.",
      lat: 40.7350,
      lng: -74.0010,
      reviewer: "Jordan",
      date: "2024-10-29T15:00:00.000Z"
    },
    {
      id: 103,
      name: "Union Square Travel Agency",
      address: "828 Broadway, New York, NY 10003",
      rating: 5,
      notes: "Prime location near Union Square. Super convenient. Staff really knows their stuff and helped me find the perfect strain for sleep issues.",
      lat: 40.7335,
      lng: -73.9911,
      reviewer: "Alex",
      date: "2024-10-20T14:00:00.000Z"
    },
    {
      id: 104,
      name: "Smacked LLC",
      address: "15 W 27th St, New York, NY 10001",
      rating: 4,
      notes: "Modern setup near Madison Square Park. Good selection of edibles and concentrates. A bit pricey but quality is consistently high.",
      lat: 40.7445,
      lng: -73.9886,
      reviewer: "Jordan",
      date: "2024-10-15T11:00:00.000Z"
    }
  ];

  // Load data from storage on mount
  useEffect(() => {
    loadData();
    getUserLocation();
  }, []);

  const loadData = async () => {
    try {
      const strainsResult = await window.storage.get('strains-data');
      const storesResult = await window.storage.get('stores-data');
      
      if (strainsResult) {
        setStrains(JSON.parse(strainsResult.value));
      } else {
        // Load demo data if no saved data exists
        setStrains(demoStrains);
        await window.storage.set('strains-data', JSON.stringify(demoStrains));
      }
      
      if (storesResult) {
        setStores(JSON.parse(storesResult.value));
      } else {
        // Load demo data if no saved data exists
        setStores(demoStores);
        await window.storage.set('stores-data', JSON.stringify(demoStores));
      }
    } catch (error) {
      console.log('Loading demo data');
      setStrains(demoStrains);
      setStores(demoStores);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.log('Location access denied')
      );
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  const saveStrains = async (data) => {
    await window.storage.set('strains-data', JSON.stringify(data));
    setStrains(data);
  };

  const saveStores = async (data) => {
    await window.storage.set('stores-data', JSON.stringify(data));
    setStores(data);
  };

  const addStrain = async () => {
    const strain = {
      id: Date.now(),
      name: newItem.name,
      type: newItem.type,
      rating: newItem.rating,
      price: newItem.price,
      notes: newItem.notes,
      effects: newItem.effects,
      storeName: newItem.storeName,
      reviewer: newItem.reviewer,
      date: new Date().toISOString()
    };
    await saveStrains([...strains, strain]);
    resetForm();
  };

  const addStore = async () => {
    const store = {
      id: Date.now(),
      name: newItem.name,
      address: newItem.address,
      rating: newItem.rating,
      notes: newItem.notes,
      lat: parseFloat(newItem.lat),
      lng: parseFloat(newItem.lng),
      reviewer: newItem.reviewer,
      date: new Date().toISOString()
    };
    await saveStores([...stores, store]);
    resetForm();
  };

  const deleteStrain = async (id) => {
    await saveStrains(strains.filter(s => s.id !== id));
  };

  const deleteStore = async (id) => {
    await saveStores(stores.filter(s => s.id !== id));
  };

  const resetForm = () => {
    setNewItem({
      name: '', type: '', rating: 5, price: '', notes: '',
      effects: [], storeName: '', address: '', lat: '', lng: '', reviewer: ''
    });
    setShowAddModal(false);
  };

  const getSortedStrains = () => {
    let filtered = strains.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.storeName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterBy === 'rating') {
      return filtered.sort((a, b) => b.rating - a.rating);
    }
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const getSortedStores = () => {
    let filtered = stores.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterBy === 'rating') {
      return filtered.sort((a, b) => b.rating - a.rating);
    } else if (filterBy === 'distance' && userLocation) {
      return filtered.sort((a, b) => {
        const distA = calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
        const distB = calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
        return parseFloat(distA) - parseFloat(distB);
      });
    }
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const effectOptions = ['Relaxed', 'Euphoric', 'Happy', 'Energetic', 'Creative', 'Focused', 'Sleepy', 'Hungry'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h1 className="text-4xl font-bold text-green-800 mb-2">Cannabis Review Tracker</h1>
          <p className="text-gray-600">Track and share your favorite strains and stores</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('strains')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'strains'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Strains ({strains.length})
          </button>
          <button
            onClick={() => setActiveTab('stores')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'stores'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Stores ({stores.length})
          </button>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-600" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="recent">Most Recent</option>
              <option value="rating">Highest Rated</option>
              {activeTab === 'stores' && userLocation && (
                <option value="distance">Closest to Me</option>
              )}
            </select>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Plus size={20} />
            Add {activeTab === 'strains' ? 'Strain' : 'Store'}
          </button>
        </div>

        {/* Content */}
        {activeTab === 'strains' ? (
          <div className="grid gap-4 md:grid-cols-2">
            {getSortedStrains().map(strain => (
              <div key={strain.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{strain.name}</h3>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm mt-2">
                      {strain.type}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteStrain(strain.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < strain.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                  <span className="ml-2 text-gray-600 font-semibold">{strain.rating}/5</span>
                </div>

                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">Price:</span> {strain.price}</p>
                  <p><span className="font-semibold">Store:</span> {strain.storeName}</p>
                  {strain.effects.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {strain.effects.map((effect, idx) => (
                        <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                          {effect}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-gray-700 mt-3">{strain.notes}</p>
                  <p className="text-gray-500 text-xs mt-2">
                    Reviewed by {strain.reviewer} on {new Date(strain.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {getSortedStores().map(store => (
              <div key={store.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-2xl font-bold text-gray-800">{store.name}</h3>
                  <button
                    onClick={() => deleteStore(store.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < store.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                  <span className="ml-2 text-gray-600 font-semibold">{store.rating}/5</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-green-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">{store.address}</p>
                  </div>
                  {userLocation && (
                    <p className="text-green-600 font-semibold">
                      {calculateDistance(userLocation.lat, userLocation.lng, store.lat, store.lng)} miles away
                    </p>
                  )}
                  <p className="text-gray-700 mt-3">{store.notes}</p>
                  <p className="text-gray-500 text-xs mt-2">
                    Reviewed by {store.reviewer} on {new Date(store.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Add {activeTab === 'strains' ? 'Strain' : 'Store'}
              </h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />

              {activeTab === 'strains' ? (
                <>
                  <select
                    value={newItem.type}
                    onChange={(e) => setNewItem({...newItem, type: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Type</option>
                    <option value="Indica">Indica</option>
                    <option value="Sativa">Sativa</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Price"
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="text"
                    placeholder="Store Name"
                    value={newItem.storeName}
                    onChange={(e) => setNewItem({...newItem, storeName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                  <div>
                    <label className="block text-sm font-semibold mb-2">Effects</label>
                    <div className="grid grid-cols-2 gap-2">
                      {effectOptions.map(effect => (
                        <label key={effect} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={newItem.effects.includes(effect)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewItem({...newItem, effects: [...newItem.effects, effect]});
                              } else {
                                setNewItem({...newItem, effects: newItem.effects.filter(ef => ef !== effect)});
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{effect}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Address"
                    value={newItem.address}
                    onChange={(e) => setNewItem({...newItem, address: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      step="0.0001"
                      placeholder="Latitude"
                      value={newItem.lat}
                      onChange={(e) => setNewItem({...newItem, lat: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      type="number"
                      step="0.0001"
                      placeholder="Longitude"
                      value={newItem.lng}
                      onChange={(e) => setNewItem({...newItem, lng: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2">Rating: {newItem.rating}</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={newItem.rating}
                  onChange={(e) => setNewItem({...newItem, rating: parseInt(e.target.value)})}
                  className="w-full"
                />
              </div>

              <input
                type="text"
                placeholder="Your Name"
                value={newItem.reviewer}
                onChange={(e) => setNewItem({...newItem, reviewer: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />

              <textarea
                placeholder="Notes"
                value={newItem.notes}
                onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 h-24"
              />

              <button
                onClick={activeTab === 'strains' ? addStrain : addStore}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
              >
                Add {activeTab === 'strains' ? 'Strain' : 'Store'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrainReviewApp;