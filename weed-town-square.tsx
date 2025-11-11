import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageCircle, Users, TrendingUp, Award, Flame, Leaf, Search, Filter, Plus } from 'lucide-react';

const GreenTownSquare = () => {
  const [activeTab, setActiveTab] = useState('reviews');
  const [selectedStrain, setSelectedStrain] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, text: '', strain: '', brand: '', effects: [] });
  const [showNewReviewForm, setShowNewReviewForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Sample data with more variety
  const [reviews, setReviews] = useState([
    {
      id: 1,
      strain: "Purple Haze",
      brand: "Green Valley Co.",
      rating: 4.8,
      user: "Tokemaster420",
      avatar: "🌿",
      text: "Absolutely mind-blowing! The purple buds are gorgeous and the high is perfect for creativity. Highly recommend!",
      effects: ["Creative", "Euphoric", "Relaxed"],
      upvotes: 23,
      downvotes: 2,
      comments: 8,
      timestamp: "2 hours ago",
      type: "flower"
    },
    {
      id: 2,
      strain: "Gelato #33",
      brand: "Premium Genetics",
      rating: 2.1,
      user: "CannaCritic",
      avatar: "🔥",
      text: "Disappointing. Harsh smoke, weak effects, and overpriced. Save your money folks.",
      effects: ["Dry mouth", "Weak"],
      upvotes: 15,
      downvotes: 5,
      comments: 12,
      timestamp: "4 hours ago",
      type: "flower"
    },
    {
      id: 3,
      strain: "Blue Dream Cartridge",
      brand: "Sky High Extracts",
      rating: 4.5,
      user: "VapeQueen",
      avatar: "💨",
      text: "Clean, smooth hits with amazing flavor. Perfect for daytime use without couch lock!",
      effects: ["Uplifting", "Focus", "Happy"],
      upvotes: 31,
      downvotes: 1,
      comments: 6,
      timestamp: "6 hours ago",
      type: "vape"
    },
    {
      id: 4,
      strain: "Sour Diesel Gummies",
      brand: "Sweet Leaf Edibles",
      rating: 3.8,
      user: "EdibleExplorer",
      avatar: "🍭",
      text: "Good taste but took forever to kick in. When it did, nice mellow high for about 4 hours.",
      effects: ["Relaxed", "Sleepy", "Mellow"],
      upvotes: 18,
      downvotes: 4,
      comments: 9,
      timestamp: "1 day ago",
      type: "edible"
    }
  ]);

  const [communityStats, setCommunityStats] = useState({
    totalReviews: 1247,
    activeUsers: 89,
    topStrains: ["Blue Dream", "Girl Scout Cookies", "OG Kush"],
    trendingBrands: ["Green Valley Co.", "Premium Genetics", "Sky High Extracts"]
  });

  const effectOptions = ["Relaxed", "Euphoric", "Creative", "Uplifting", "Sleepy", "Focus", "Happy", "Energetic", "Hungry", "Giggly"];

  const getStrainColor = (rating) => {
    if (rating >= 4.5) return "from-green-400 to-emerald-500";
    if (rating >= 3.5) return "from-yellow-400 to-orange-400";
    if (rating >= 2.5) return "from-orange-400 to-red-400";
    return "from-red-400 to-red-600";
  };

  const getRatingEmoji = (rating) => {
    if (rating >= 4.5) return "🔥";
    if (rating >= 3.5) return "👍";
    if (rating >= 2.5) return "😐";
    return "👎";
  };

  const handleVote = (reviewId, type) => {
    setReviews(reviews.map(review => {
      if (review.id === reviewId) {
        return type === 'up' 
          ? { ...review, upvotes: review.upvotes + 1 }
          : { ...review, downvotes: review.downvotes + 1 };
      }
      return review;
    }));
  };

  const handleSubmitReview = () => {
    if (newReview.strain && newReview.brand && newReview.text) {
      const review = {
        id: reviews.length + 1,
        ...newReview,
        user: "You",
        avatar: "🆕",
        upvotes: 0,
        downvotes: 0,
        comments: 0,
        timestamp: "Just now",
        type: "flower"
      };
      setReviews([review, ...reviews]);
      setNewReview({ rating: 5, text: '', strain: '', brand: '', effects: [] });
      setShowNewReviewForm(false);
      setCommunityStats(prev => ({ ...prev, totalReviews: prev.totalReviews + 1 }));
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.strain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || review.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-400 rounded-full opacity-10 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-purple-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-blue-400 rounded-full opacity-10 animate-bounce"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-black bg-opacity-30 backdrop-blur-md border-b border-green-500 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-2xl animate-pulse">
                  🏛️
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Green Town Square</h1>
                  <p className="text-green-300 text-sm">Where the community decides what's dope! 🌿</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-black bg-opacity-30 rounded-full px-4 py-2">
                  <Users className="w-5 h-5 text-green-400 mr-2" />
                  <span className="text-white font-semibold">{communityStats.activeUsers} online</span>
                </div>
                <button
                  onClick={() => setShowNewReviewForm(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Drop a Review</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar - Community Stats */}
            <div className="lg:col-span-1">
              <div className="bg-black bg-opacity-20 backdrop-blur-md rounded-2xl p-6 border border-green-500 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <TrendingUp className="w-6 h-6 text-green-400 mr-2" />
                  Community Pulse
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg p-4">
                    <div className="text-2xl font-bold text-white">{communityStats.totalReviews.toLocaleString()}</div>
                    <div className="text-green-100 text-sm">Total Reviews</div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-green-300 mb-2 flex items-center">
                      <Flame className="w-4 h-4 mr-1" />
                      Hottest Strains
                    </h4>
                    {communityStats.topStrains.map((strain, index) => (
                      <div key={strain} className="flex items-center justify-between py-1">
                        <span className="text-white text-sm">#{index + 1} {strain}</span>
                        <span className="text-xs text-green-400">🔥</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 className="font-semibold text-green-300 mb-2 flex items-center">
                      <Award className="w-4 h-4 mr-1" />
                      Top Brands
                    </h4>
                    {communityStats.trendingBrands.map((brand, index) => (
                      <div key={brand} className="text-white text-sm py-1">
                        #{index + 1} {brand}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {/* Search and Filter Bar */}
              <div className="bg-black bg-opacity-20 backdrop-blur-md rounded-2xl p-4 mb-6 border border-green-500">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search strains, brands, or effects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-black bg-opacity-30 border border-green-600 rounded-lg text-white placeholder-green-300 focus:border-green-400 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="text-green-400 w-5 h-5" />
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="bg-black bg-opacity-30 border border-green-600 rounded-lg text-white px-3 py-2 focus:border-green-400 focus:outline-none"
                    >
                      <option value="all">All Types</option>
                      <option value="flower">Flower</option>
                      <option value="vape">Vapes</option>
                      <option value="edible">Edibles</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Reviews Feed */}
              <div className="space-y-6">
                {filteredReviews.map((review) => (
                  <div key={review.id} className="bg-black bg-opacity-20 backdrop-blur-md rounded-2xl p-6 border border-green-500 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">
                          {review.avatar}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-lg">{review.strain}</h3>
                          <p className="text-green-300 text-sm">by {review.brand}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-gray-300 text-sm">@{review.user}</span>
                            <span className="text-gray-500 text-xs">•</span>
                            <span className="text-gray-400 text-xs">{review.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${getStrainColor(review.rating)} text-white font-bold text-lg`}>
                          {getRatingEmoji(review.rating)} {review.rating}
                        </div>
                      </div>
                    </div>

                    <p className="text-white mb-4 leading-relaxed">{review.text}</p>
                    
                    {/* Effects Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {review.effects.map((effect, index) => (
                        <span key={index} className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full">
                          {effect}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleVote(review.id, 'up')}
                          className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
                        >
                          <ThumbsUp className="w-5 h-5" />
                          <span>{review.upvotes}</span>
                        </button>
                        <button
                          onClick={() => handleVote(review.id, 'down')}
                          className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <ThumbsDown className="w-5 h-5" />
                          <span>{review.downvotes}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
                          <MessageCircle className="w-5 h-5" />
                          <span>{review.comments}</span>
                        </button>
                      </div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">
                        {review.type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* New Review Modal */}
        {showNewReviewForm && (
          <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-green-900 to-emerald-900 rounded-2xl p-8 max-w-md w-full border border-green-500 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Leaf className="w-6 h-6 text-green-400 mr-2" />
                Drop Your Review
              </h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Strain name"
                  value={newReview.strain}
                  onChange={(e) => setNewReview({...newReview, strain: e.target.value})}
                  className="w-full px-4 py-2 bg-black bg-opacity-30 border border-green-600 rounded-lg text-white placeholder-green-300 focus:border-green-400 focus:outline-none"
                />
                
                <input
                  type="text"
                  placeholder="Brand"
                  value={newReview.brand}
                  onChange={(e) => setNewReview({...newReview, brand: e.target.value})}
                  className="w-full px-4 py-2 bg-black bg-opacity-30 border border-green-600 rounded-lg text-white placeholder-green-300 focus:border-green-400 focus:outline-none"
                />
                
                <div>
                  <label className="block text-green-300 text-sm mb-2">Rating</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setNewReview({...newReview, rating: star})}
                        className={`text-2xl ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-600'} hover:text-yellow-300 transition-colors`}
                      >
                        ⭐
                      </button>
                    ))}
                    <span className="text-white ml-2">{newReview.rating}/5</span>
                  </div>
                </div>
                
                <textarea
                  placeholder="Share your experience..."
                  value={newReview.text}
                  onChange={(e) => setNewReview({...newReview, text: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-2 bg-black bg-opacity-30 border border-green-600 rounded-lg text-white placeholder-green-300 focus:border-green-400 focus:outline-none resize-none"
                />
                
                <div>
                  <label className="block text-green-300 text-sm mb-2">Effects (select all that apply)</label>
                  <div className="flex flex-wrap gap-2">
                    {effectOptions.map((effect) => (
                      <button
                        key={effect}
                        onClick={() => {
                          const effects = newReview.effects.includes(effect)
                            ? newReview.effects.filter(e => e !== effect)
                            : [...newReview.effects, effect];
                          setNewReview({...newReview, effects});
                        }}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          newReview.effects.includes(effect)
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {effect}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={handleSubmitReview}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105"
                >
                  Post Review 🚀
                </button>
                <button
                  onClick={() => setShowNewReviewForm(false)}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GreenTownSquare;