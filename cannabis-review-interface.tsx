import React, { useState, useEffect } from 'react';
import { Star, Leaf, Camera, Info, ChevronRight, ChevronLeft, Trophy, Badge, Target, Users, TrendingUp, Award, Search, Filter, MapPin, Clock } from 'lucide-react';

// NY Legal Cannabis Database
const NY_LEGAL_STRAINS = [
  {
    id: 1,
    name: "Wedding Cake",
    type: "Hybrid",
    thc: "25%",
    cbd: "0.5%",
    dispensary: "MedMen NYC",
    price: "$60/eighth",
    description: "Sweet vanilla flavor with relaxing effects",
    effects: ["Relaxed", "Happy", "Sleepy"],
    reviews: 47,
    avgRating: 4.2,
    trending: true
  },
  {
    id: 2,
    name: "Blue Dream",
    type: "Sativa-Dominant Hybrid",
    thc: "22%",
    cbd: "1%",
    dispensary: "Curaleaf Queens",
    price: "$55/eighth",
    description: "Blueberry aroma with uplifting cerebral effects",
    effects: ["Happy", "Creative", "Uplifted"],
    reviews: 89,
    avgRating: 4.5,
    trending: false
  },
  {
    id: 3,
    name: "Gorilla Glue #4",
    type: "Hybrid",
    thc: "28%",
    cbd: "0.3%",
    dispensary: "RISE Manhattan",
    price: "$65/eighth",
    description: "Potent strain with earthy pine flavors",
    effects: ["Relaxed", "Euphoric", "Sleepy"],
    reviews: 62,
    avgRating: 4.6,
    trending: true
  },
  {
    id: 4,
    name: "Sour Diesel",
    type: "Sativa",
    thc: "24%",
    cbd: "0.7%",
    dispensary: "Columbia Care",
    price: "$58/eighth",
    description: "Energizing diesel aroma with cerebral effects",
    effects: ["Energetic", "Creative", "Focused"],
    reviews: 73,
    avgRating: 4.3,
    trending: false
  },
  {
    id: 5,
    name: "Purple Haze",
    type: "Sativa",
    thc: "20%",
    cbd: "0.4%",
    dispensary: "Verilife Bronx",
    price: "$52/eighth",
    description: "Classic strain with sweet berry flavors",
    effects: ["Happy", "Creative", "Uplifted"],
    reviews: 35,
    avgRating: 4.1,
    trending: true
  }
];

const NYCannabisReviewPlatform = () => {
  const [currentView, setCurrentView] = useState('spotlight'); // 'spotlight', 'review'
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedStrain, setSelectedStrain] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [userProfile, setUserProfile] = useState({
    level: 1,
    xp: 250,
    nextLevelXP: 500,
    badges: ['First Review', 'NY Explorer'],
    reviewCount: 3,
    helpfulVotes: 12,
    streak: 5
  });

  const [reviewData, setReviewData] = useState({
    strainId: null,
    experienceLevel: '',
    usageFrequency: '',
    consumptionMethod: '',
    aroma: { rating: 0, notes: '' },
    flavor: { rating: 0, notes: '' },
    effects: { rating: 0, notes: '', categories: [] },
    overall: { rating: 0, notes: '' },
    comparison: '',
    wouldRecommend: null,
    images: []
  });

  const steps = [
    'Choose Strain',
    'Your Experience',
    'Aroma & Flavor', 
    'Effects',
    'Overall & Comparison',
    'Submit Review'
  ];

  const effectCategories = [
    'Relaxed', 'Happy', 'Euphoric', 'Uplifted', 'Creative', 
    'Focused', 'Energetic', 'Sleepy', 'Hungry', 'Giggly'
  ];

  const badges = [
    { name: 'First Review', icon: '🌱', description: 'Completed your first review' },
    { name: 'NY Explorer', icon: '🗽', description: 'Reviewed strains from 3+ NY dispensaries' },
    { name: 'Flavor Master', icon: '👃', description: 'Detailed aroma descriptions in 5+ reviews' },
    { name: 'Effect Expert', icon: '🧠', description: 'Helpful effects analysis in 10+ reviews' },
    { name: 'Community Helper', icon: '🤝', description: 'Received 25+ helpful votes' },
    { name: 'Streak Master', icon: '🔥', description: 'Review streak of 7+ days' }
  ];

  const filteredStrains = NY_LEGAL_STRAINS.filter(strain => {
    const matchesSearch = strain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         strain.dispensary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || 
                         strain.type.includes(filterType) || 
                         (filterType === 'Trending' && strain.trending);
    return matchesSearch && matchesFilter;
  });

  const StarRating = ({ rating, onRatingChange, size = 'w-6 h-6', readonly = false }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={`${size} ${readonly ? '' : 'cursor-pointer'} transition-colors ${
            star <= rating 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'text-gray-300 hover:text-yellow-300'
          }`}
          onClick={readonly ? undefined : () => onRatingChange(star)}
        />
      ))}
    </div>
  );

  const updateReviewData = (field, value) => {
    setReviewData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedData = (section, field, value) => {
    setReviewData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const toggleEffect = (effect) => {
    setReviewData(prev => ({
      ...prev,
      effects: {
        ...prev.effects,
        categories: prev.effects.categories.includes(effect)
          ? prev.effects.categories.filter(e => e !== effect)
          : [...prev.effects.categories, effect]
      }
    }));
  };

  const startReview = (strain) => {
    setSelectedStrain(strain);
    setReviewData(prev => ({ ...prev, strainId: strain.id }));
    setCurrentStep(0);
    setCurrentView('review');
  };

  const renderSpotlightPage = () => (
    <div className="space-y-6">
      {/* User Profile Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Leaf className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Cannabis Connoisseur</h2>
              <p className="opacity-90">Level {userProfile.level} • {userProfile.reviewCount} Reviews</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5" />
              <span>{userProfile.xp} XP</span>
            </div>
            <div className="w-24 bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all"
                style={{ width: `${(userProfile.xp / userProfile.nextLevelXP) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{userProfile.helpfulVotes}</div>
            <div className="text-sm opacity-80">Helpful Votes</div>
          </div>
          <div>
            <div className="text-2xl font-bold flex items-center justify-center gap-1">
              🔥 {userProfile.streak}
            </div>
            <div className="text-sm opacity-80">Day Streak</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{userProfile.badges.length}</div>
            <div className="text-sm opacity-80">Badges Earned</div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Badge className="w-5 h-5" />
          Your Badges
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {badges.map(badge => (
            <div 
              key={badge.name}
              className={`p-3 rounded-lg border-2 text-center ${
                userProfile.badges.includes(badge.name)
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <div className="text-2xl mb-1">{badge.icon}</div>
              <div className="font-medium text-sm">{badge.name}</div>
              <div className="text-xs text-gray-600">{badge.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Search strains or dispensaries..."
            />
          </div>
          <div className="flex gap-2">
            {['All', 'Sativa', 'Indica', 'Hybrid', 'Trending'].map(filter => (
              <button
                key={filter}
                onClick={() => setFilterType(filter)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === filter
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Strain Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStrains.map(strain => (
            <div key={strain.id} className="border border-gray-200 rounded-xl p-4 hover:border-green-300 transition-colors">
              {strain.trending && (
                <div className="flex items-center gap-1 text-orange-600 text-sm mb-2">
                  <TrendingUp className="w-4 h-4" />
                  Trending
                </div>
              )}
              
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-lg">{strain.name}</h4>
                  <p className="text-green-600 font-medium">{strain.type}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <StarRating rating={Math.round(strain.avgRating)} readonly size="w-4 h-4" />
                    <span className="text-sm text-gray-600">({strain.reviews})</span>
                  </div>
                  <div className="text-lg font-bold text-green-600">{strain.price}</div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-3">{strain.description}</p>

              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{strain.dispensary}</span>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {strain.effects.slice(0, 3).map(effect => (
                  <span key={effect} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {effect}
                  </span>
                ))}
              </div>

              <div className="flex gap-2 text-sm mb-4">
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                  THC {strain.thc}
                </span>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                  CBD {strain.cbd}
                </span>
              </div>

              <button
                onClick={() => startReview(strain)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Review This Strain
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReviewStep = () => {
    switch(currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg">{selectedStrain?.name}</h3>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <span className="text-green-600 font-medium">+50 XP</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Type:</strong> {selectedStrain?.type}</div>
                <div><strong>THC:</strong> {selectedStrain?.thc}</div>
                <div><strong>Dispensary:</strong> {selectedStrain?.dispensary}</div>
                <div><strong>Price:</strong> {selectedStrain?.price}</div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-800 mb-2">Review Challenge!</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Complete all sections to earn <strong>50 XP</strong></li>
                    <li>• Get 5+ helpful votes for <strong>bonus XP</strong></li>
                    <li>• Include detailed notes for <strong>badge progress</strong></li>
                    <li>• Help build NY's cannabis community!</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-yellow-500" />
              <span className="text-sm font-medium">Experience Level Questions (+10 XP each)</span>
            </div>

            <div>
              <label className="block font-medium mb-3">How would you describe your cannabis experience level?</label>
              <div className="space-y-2">
                {[
                  { value: 'beginner', label: 'Beginner - New to cannabis or occasional use', xp: 10 },
                  { value: 'intermediate', label: 'Intermediate - Regular user with some experience', xp: 10 },
                  { value: 'experienced', label: 'Experienced - Daily user or cannabis enthusiast', xp: 10 }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => updateReviewData('experienceLevel', option.value)}
                    className={`w-full p-3 text-left rounded-lg border transition-colors flex items-center justify-between ${
                      reviewData.experienceLevel === option.value
                        ? 'bg-green-100 border-green-500'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <span>{option.label}</span>
                    <span className="text-green-600 font-medium">+{option.xp} XP</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium mb-3">How recently did you try this strain?</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Just tried it',
                  'Within the past week',
                  'Within the past month',
                  'Been using for a while'
                ].map(option => (
                  <button
                    key={option}
                    onClick={() => updateReviewData('usageFrequency', option)}
                    className={`p-3 rounded-lg border transition-colors ${
                      reviewData.usageFrequency === option
                        ? 'bg-green-100 border-green-500'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium mb-3">How did you consume it?</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Flower/Joint',
                  'Vaporizer',
                  'Edibles',
                  'Concentrates',
                  'Pre-roll',
                  'Other'
                ].map(method => (
                  <button
                    key={method}
                    onClick={() => updateReviewData('consumptionMethod', method)}
                    className={`p-3 rounded-lg border transition-colors ${
                      reviewData.consumptionMethod === method
                        ? 'bg-green-100 border-green-500'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      // Cases 2-5 remain the same as before but with XP indicators
      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-yellow-500" />
              <span className="text-sm font-medium">Sensory Analysis (+15 XP each rating)</span>
            </div>

            <div>
              <label className="block font-medium mb-3">Aroma Rating</label>
              <div className="flex items-center gap-4 mb-3">
                <StarRating 
                  rating={reviewData.aroma.rating} 
                  onRatingChange={(rating) => updateNestedData('aroma', 'rating', rating)}
                />
                <span className="text-sm text-gray-600">
                  {reviewData.aroma.rating}/5
                </span>
                {reviewData.aroma.rating > 0 && (
                  <span className="text-green-600 font-medium text-sm">+15 XP</span>
                )}
              </div>
              <textarea
                value={reviewData.aroma.notes}
                onChange={(e) => updateNestedData('aroma', 'notes', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                rows={3}
                placeholder="Describe the smell... earthy, sweet, citrusy, piney, skunky, fruity, etc. (Detailed descriptions help earn badges!)"
              />
            </div>

            <div>
              <label className="block font-medium mb-3">Flavor Rating</label>
              <div className="flex items-center gap-4 mb-3">
                <StarRating 
                  rating={reviewData.flavor.rating} 
                  onRatingChange={(rating) => updateNestedData('flavor', 'rating', rating)}
                />
                <span className="text-sm text-gray-600">
                  {reviewData.flavor.rating}/5
                </span>
                {reviewData.flavor.rating > 0 && (
                  <span className="text-green-600 font-medium text-sm">+15 XP</span>
                )}
              </div>
              <textarea
                value={reviewData.flavor.notes}
                onChange={(e) => updateNestedData('flavor', 'notes', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                rows={3}
                placeholder="How did it taste? Was it smooth? Did it match the aroma? Any aftertaste?"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-yellow-500" />
              <span className="text-sm font-medium">Effects Analysis (+20 XP)</span>
            </div>

            <div>
              <label className="block font-medium mb-3">Effects Rating</label>
              <div className="flex items-center gap-4 mb-3">
                <StarRating 
                  rating={reviewData.effects.rating} 
                  onRatingChange={(rating) => updateNestedData('effects', 'rating', rating)}
                />
                <span className="text-sm text-gray-600">
                  {reviewData.effects.rating}/5
                </span>
                {reviewData.effects.rating > 0 && (
                  <span className="text-green-600 font-medium text-sm">+20 XP</span>
                )}
              </div>
            </div>

            <div>
              <label className="block font-medium mb-3">Select effects you experienced: (+2 XP each)</label>
              <div className="grid grid-cols-3 gap-2">
                {effectCategories.map(effect => (
                  <button
                    key={effect}
                    onClick={() => toggleEffect(effect)}
                    className={`p-2 text-sm rounded-lg border transition-colors ${
                      reviewData.effects.categories.includes(effect)
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {effect} {reviewData.effects.categories.includes(effect) && '+2'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <textarea
                value={reviewData.effects.notes}
                onChange={(e) => updateNestedData('effects', 'notes', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                rows={4}
                placeholder="Describe the effects in detail... How long did they last? Were they what you expected? Good for what activities or times of day? (Detailed analysis helps with Effect Expert badge!)"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block font-medium mb-3">Overall Rating (+25 XP)</label>
              <div className="flex items-center gap-4 mb-3">
                <StarRating 
                  rating={reviewData.overall.rating} 
                  onRatingChange={(rating) => updateNestedData('overall', 'rating', rating)}
                />
                <span className="text-sm text-gray-600">
                  {reviewData.overall.rating}/5
                </span>
                {reviewData.overall.rating > 0 && (
                  <span className="text-green-600 font-medium text-sm">+25 XP</span>
                )}
              </div>
              <textarea
                value={reviewData.overall.notes}
                onChange={(e) => updateNestedData('overall', 'notes', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                rows={3}
                placeholder="Overall thoughts... Would you buy this again? Any standout qualities?"
              />
            </div>

            <div>
              <label className="block font-medium mb-3">How does this compare to your favorite strain?</label>
              <textarea
                value={reviewData.comparison}
                onChange={(e) => updateReviewData('comparison', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                rows={3}
                placeholder="Compare to strains you know well... Similar effects? Better/worse? What makes it unique?"
              />
            </div>

            <div>
              <label className="block font-medium mb-3">Would you recommend this strain to others?</label>
              <div className="flex gap-4">
                <button
                  onClick={() => updateReviewData('wouldRecommend', true)}
                  className={`flex-1 p-3 rounded-lg border transition-colors ${
                    reviewData.wouldRecommend === true
                      ? 'bg-green-100 border-green-500 text-green-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  👍 Yes, I'd recommend it
                </button>
                <button
                  onClick={() => updateReviewData('wouldRecommend', false)}
                  className={`flex-1 p-3 rounded-lg border transition-colors ${
                    reviewData.wouldRecommend === false
                      ? 'bg-red-100 border-red-500 text-red-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  👎 Not really
                </button>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-xl">Review Complete!</h3>
                <div className="flex items-center gap-2">
                  <Trophy className="w-6 h-6" />
                  <span className="text-xl font-bold">+127 XP</span>
                </div>
              </div>
              <div className="text-sm opacity-90">
                Awesome job! Your detailed review will help the NY cannabis community make better choices.
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-semibold text-green-800 mb-4">Review Summary</h3>
              <div className="space-y-3 text-sm">
                <div><strong>Strain:</strong> {selectedStrain?.name} ({selectedStrain?.type})</div>
                <div><strong>Experience Level:</strong> {reviewData.experienceLevel}</div>
                <div><strong>Consumption:</strong> {reviewData.consumptionMethod}</div>
                <div className="flex items-center gap-2">
                  <strong>Overall Rating:</strong> 
                  <StarRating rating={reviewData.overall.rating} onRatingChange={() => {}} size="w-4 h-4" readonly />
                  <span>({reviewData.overall.rating}/5)</span>
                </div>
                {reviewData.effects.categories.length > 0 && (
                  <div><strong>Effects:</strong> {reviewData.effects.categories.join(', ')}</div>
                )}
              </div>
            </div>

            <div>
              <label className="block font-medium mb-3">Add photos (optional) +10 XP</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Camera className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600 mb-2">Drag photos here or click to browse</p>
                <p className="text-sm text-gray-500">Max 3 photos, please follow community guidelines</p>
                <button className="mt-3 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                  Choose Files
                </button>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <strong>NY Legal Notice:</strong> This review is for legal NY cannabis products only. 
                Reviews help the community make informed choices at licensed dispensaries.
              </p>
            </div>

            <button 
              onClick={() => {
                alert('Review submitted! +127 XP earned. Keep up the streak!');
                setCurrentView('spotlight');
                setCurrentStep(0);
              }}
              className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-3"
            >
              <Trophy className="w-6 h-6" />
              Submit Review & Claim XP
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  if (currentView === 'spotlight') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Leaf className="w-10 h-10 text-green-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">NY Cannabis Reviews</h1>
                <p className="text-gray-600">Legal strains from licensed NY dispensaries</p>
              </div>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              <span className="font-medium">New York</span>
            </div>
          </div>
          {renderSpotlightPage()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('spotlight')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Write Review</h1>
                <p className="text-gray-600">Earn XP and badges</p>
              </div>
            </div>
            <div className="bg-green-100 px-4 py-2 rounded-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-green-600" />
              <span className="font-bold text-green-700">50+ XP</span>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              {steps.map((step, index) => (
                <span 
                  key={step}
                  className={`text-xs ${
                    index <= currentStep ? 'text-green-600 font-medium' : 'text-gray-400'
                  }`}
                >
                  {step}
                </span>
              ))}
            </div>
          </div>

          {/* Step content */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{steps[currentStep]}</h2>
            {renderReviewStep()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            
            {currentStep < steps.length - 1 && (
              <button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NYCannabisReviewPlatform;