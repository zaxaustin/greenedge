import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Star, 
  Award, 
  Trophy, 
  Target, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Gift, 
  MapPin, 
  Clock,
  Leaf,
  Microscope,
  FlaskConical,
  Zap,
  Heart,
  Share2,
  MessageCircle,
  Upload,
  X,
  Plus,
  Crown,
  Badge,
  Calendar,
  Sparkles
} from 'lucide-react';

const CannabisReviewSystem = () => {
  const [currentView, setCurrentView] = useState('scanner');
  const [scannedProduct, setScannedProduct] = useState(null);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    effects: [],
    flavors: [],
    consumption: '',
    experience: '',
    photos: [],
    wouldRecommend: null
  });
  const [userProfile, setUserProfile] = useState({
    username: 'CannabisExplorer',
    level: 'Silver',
    totalReviews: 47,
    badges: ['Strain Explorer', 'Detail Master', 'Local Legend', 'Terpene Hunter'],
    points: 2340,
    nextReward: 'Gold Status',
    streak: 12
  });
  const [showRewards, setShowRewards] = useState(false);
  const [scanAnimation, setScanAnimation] = useState(false);

  // Mock product data that would come from scanning
  const productDatabase = {
    'NYC001': {
      name: 'NYC Diesel',
      brand: 'Empire Cannabis',
      type: 'Sativa',
      thc: '22.5%',
      cbd: '0.3%',
      batch: 'ED-2024-0712',
      harvestDate: '2024-06-15',
      testDate: '2024-07-01',
      dispensary: 'Green Goddess Manhattan',
      price: '$45/3.5g',
      genetics: 'Sour Diesel x Afghani',
      terpenes: ['Myrcene', 'Limonene', 'Pinene'],
      labResults: {
        pesticides: 'Pass',
        heavy_metals: 'Pass',
        microbials: 'Pass',
        residual_solvents: 'Pass'
      },
      effects: ['Energetic', 'Creative', 'Uplifting', 'Focused'],
      flavors: ['Diesel', 'Citrus', 'Pine', 'Earthy'],
      description: 'A classic NYC strain perfect for daytime use and creative endeavors.'
    }
  };

  const availableEffects = [
    'Relaxed', 'Energetic', 'Happy', 'Euphoric', 'Uplifted', 'Focused',
    'Creative', 'Sleepy', 'Hungry', 'Giggly', 'Talkative', 'Aroused'
  ];

  const availableFlavors = [
    'Earthy', 'Pine', 'Citrus', 'Berry', 'Floral', 'Herbal',
    'Diesel', 'Skunk', 'Sweet', 'Spicy', 'Vanilla', 'Tropical'
  ];

  const rewardTiers = [
    { name: 'Bronze', reviews: 5, color: 'bg-amber-600', benefits: ['5% off codes', 'Early access'] },
    { name: 'Silver', reviews: 25, color: 'bg-gray-400', benefits: ['10% off codes', 'Free samples', 'Exclusive events'] },
    { name: 'Gold', reviews: 100, color: 'bg-yellow-500', benefits: ['15% off codes', 'VIP status', 'Product testing'] },
    { name: 'Platinum', reviews: 250, color: 'bg-purple-600', benefits: ['20% off codes', 'Brand partnerships', 'Expert status'] }
  ];

  const handleScan = () => {
    setScanAnimation(true);
    setTimeout(() => {
      setScannedProduct(productDatabase['NYC001']);
      setCurrentView('product-details');
      setScanAnimation(false);
    }, 2000);
  };

  const handleReviewSubmit = () => {
    // Simulate review submission
    const newBadge = Math.random() > 0.7 ? 'Photography Pro' : null;
    const pointsEarned = 50 + (reviewData.photos.length * 10);
    
    setUserProfile(prev => ({
      ...prev,
      totalReviews: prev.totalReviews + 1,
      points: prev.points + pointsEarned,
      badges: newBadge ? [...prev.badges, newBadge] : prev.badges
    }));

    setShowRewards(true);
    setTimeout(() => {
      setShowRewards(false);
      setCurrentView('success');
    }, 3000);
  };

  const Scanner = () => (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Camera className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Scan Product</h2>
        </div>
        <p className="text-green-100">Scan the QR code or barcode on your cannabis product to verify authenticity and start your review</p>
      </div>

      <div className="p-6">
        <div className="relative mb-6">
          <div className={`w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center relative overflow-hidden ${scanAnimation ? 'animate-pulse' : ''}`}>
            {scanAnimation ? (
              <div className="relative">
                <div className="w-32 h-32 border-4 border-green-500 rounded-lg animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-green-500 rounded-full animate-ping"></div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-24 h-24 border-4 border-dashed border-gray-300 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-500">Position QR code within frame</p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleScan}
          disabled={scanAnimation}
          className="w-full bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {scanAnimation ? 'Scanning...' : 'Start Scan'}
        </button>

        <div className="mt-6 bg-blue-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-800">Why scan?</span>
          </div>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Verify product authenticity</li>
            <li>• Access detailed lab results</li>
            <li>• Earn review rewards</li>
            <li>• Help the community</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const ProductDetails = () => (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Product Verified!</h2>
        </div>
        <p className="text-purple-100">Legal product confirmed from licensed dispensary</p>
      </div>

      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{scannedProduct.name}</h3>
            <p className="text-gray-600 mb-4">{scannedProduct.brand}</p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  {scannedProduct.type}
                </span>
                <span className="text-gray-600">THC: {scannedProduct.thc}</span>
                <span className="text-gray-600">CBD: {scannedProduct.cbd}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{scannedProduct.dispensary}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Harvest: {scannedProduct.harvestDate}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Lab Results</h4>
            <div className="space-y-2">
              {Object.entries(scannedProduct.labResults).map(([test, result]) => (
                <div key={test} className="flex items-center justify-between">
                  <span className="text-gray-600 capitalize">{test.replace('_', ' ')}</span>
                  <span className="text-green-600 font-medium flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {result}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <h4 className="font-semibold text-gray-800 mb-2">Terpenes</h4>
              <div className="flex flex-wrap gap-2">
                {scannedProduct.terpenes.map((terpene, idx) => (
                  <span key={idx} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-sm">
                    {terpene}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-6">
          <p className="text-gray-700">{scannedProduct.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Expected Effects</h4>
            <div className="flex flex-wrap gap-2">
              {scannedProduct.effects.map((effect, idx) => (
                <span key={idx} className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
                  {effect}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Flavor Profile</h4>
            <div className="flex flex-wrap gap-2">
              {scannedProduct.flavors.map((flavor, idx) => (
                <span key={idx} className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-sm">
                  {flavor}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('review-form')}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all"
        >
          Write Review & Earn Rewards
        </button>
      </div>
    </div>
  );

  const ReviewForm = () => (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Star className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Write Your Review</h2>
        </div>
        <p className="text-blue-100">Share your experience with {scannedProduct.name}</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                onClick={() => setReviewData(prev => ({ ...prev, rating }))}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  reviewData.rating >= rating
                    ? 'bg-yellow-400 text-white'
                    : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                }`}
              >
                <Star className="w-6 h-6" />
              </button>
            ))}
          </div>
        </div>

        {/* Effects */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Effects You Experienced</label>
          <div className="flex flex-wrap gap-2">
            {availableEffects.map(effect => (
              <button
                key={effect}
                onClick={() => {
                  setReviewData(prev => ({
                    ...prev,
                    effects: prev.effects.includes(effect)
                      ? prev.effects.filter(e => e !== effect)
                      : [...prev.effects, effect]
                  }));
                }}
                className={`px-3 py-2 rounded-full text-sm transition-all ${
                  reviewData.effects.includes(effect)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {effect}
              </button>
            ))}
          </div>
        </div>

        {/* Flavors */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Flavors You Tasted</label>
          <div className="flex flex-wrap gap-2">
            {availableFlavors.map(flavor => (
              <button
                key={flavor}
                onClick={() => {
                  setReviewData(prev => ({
                    ...prev,
                    flavors: prev.flavors.includes(flavor)
                      ? prev.flavors.filter(f => f !== flavor)
                      : [...prev.flavors, flavor]
                  }));
                }}
                className={`px-3 py-2 rounded-full text-sm transition-all ${
                  reviewData.flavors.includes(flavor)
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {flavor}
              </button>
            ))}
          </div>
        </div>

        {/* Consumption Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Consumption Method</label>
          <select
            value={reviewData.consumption}
            onChange={(e) => setReviewData(prev => ({ ...prev, consumption: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select method</option>
            <option value="joint">Joint</option>
            <option value="pipe">Pipe</option>
            <option value="bong">Bong</option>
            <option value="vaporizer">Vaporizer</option>
            <option value="edible">Edible</option>
            <option value="dab">Dab</option>
          </select>
        </div>

        {/* Written Review */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Experience</label>
          <textarea
            value={reviewData.experience}
            onChange={(e) => setReviewData(prev => ({ ...prev, experience: e.target.value }))}
            placeholder="Describe your experience, setting, duration, and any other details..."
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Add Photos (Bonus Points!)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Upload photos of your product</p>
            <p className="text-sm text-gray-500">+10 points per photo</p>
            <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Choose Photos
            </button>
          </div>
        </div>

        {/* Recommendation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Would you recommend this product?</label>
          <div className="flex gap-4">
            <button
              onClick={() => setReviewData(prev => ({ ...prev, wouldRecommend: true }))}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                reviewData.wouldRecommend === true
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Yes, I recommend it
            </button>
            <button
              onClick={() => setReviewData(prev => ({ ...prev, wouldRecommend: false }))}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                reviewData.wouldRecommend === false
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              No, not for me
            </button>
          </div>
        </div>

        <button
          onClick={handleReviewSubmit}
          disabled={!reviewData.rating || !reviewData.experience}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Review & Earn Rewards
        </button>
      </div>
    </div>
  );

  const RewardAnimation = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 text-center max-w-md mx-4 animate-bounce">
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Reward Earned!</h3>
        <p className="text-gray-600 mb-4">+50 points for your detailed review</p>
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-yellow-500" />
          <span className="text-lg font-semibold text-gray-800">New Badge Unlocked!</span>
          <Sparkles className="w-6 h-6 text-yellow-500" />
        </div>
      </div>
    </div>
  );

  const UserProfile = () => (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Crown className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{userProfile.username}</h2>
            <p className="text-purple-100">{userProfile.level} Member</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{userProfile.totalReviews}</div>
            <div className="text-sm text-purple-100">Reviews</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{userProfile.points}</div>
            <div className="text-sm text-purple-100">Points</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{userProfile.streak}</div>
            <div className="text-sm text-purple-100">Day Streak</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Your Badges</h3>
          <div className="grid grid-cols-2 gap-3">
            {userProfile.badges.map((badge, idx) => (
              <div key={idx} className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-3 rounded-lg text-center">
                <Badge className="w-6 h-6 mx-auto mb-1" />
                <div className="text-sm font-medium">{badge}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Progress to {userProfile.nextReward}</h3>
          <div className="bg-gray-200 rounded-full h-3 mb-2">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <p className="text-sm text-gray-600">53 more reviews to unlock Gold status</p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">Available Rewards</h3>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Gift className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-800">10% Off Code</span>
            </div>
            <p className="text-sm text-green-700">Use at any partner dispensary</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-800">VIP Event Access</span>
            </div>
            <p className="text-sm text-blue-700">Exclusive tasting events</p>
          </div>
        </div>
      </div>
    </div>
  );

  const SuccessScreen = () => (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden text-center">
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-8 text-white">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Review Submitted!</h2>
        <p className="text-green-100">Thank you for helping the community</p>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">You Earned:</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-yellow-50 p-3 rounded-lg">
              <span className="text-yellow-800">Review Points</span>
              <span className="font-bold text-yellow-600">+50</span>
            </div>
            <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
              <span className="text-green-800">Photo Bonus</span>
              <span className="font-bold text-green-600">+20</span>
            </div>
            <div className="flex items-center justify-between bg-purple-50 p-3 rounded-lg">
              <span className="text-purple-800">New Badge</span>
              <span className="font-bold text-purple-600">Photography Pro</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setCurrentView('scanner')}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            Scan Another Product
          </button>
          <button
            onClick={() => setCurrentView('profile')}
            className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">NYC Cannabis Reviews</h1>
          <p className="text-gray-600">Scan, Review, Earn Rewards</p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow-lg p-2 flex gap-2">
            {[
              { key: 'scanner', label: 'Scanner', icon: Camera },
              { key: 'profile', label: 'Profile', icon: Users },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setCurrentView(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  currentView === key
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex justify-center">
          {currentView === 'scanner' && <Scanner />}
          {currentView === 'product-details' && <ProductDetails />}
          {currentView === 'review-form' && <ReviewForm />}
          {currentView === 'profile' && <UserProfile />}
          {currentView === 'success' && <SuccessScreen />}
        </div>

        {/* Reward Animation */}
        {showRewards && <RewardAnimation />}
      </div>
    </div>
  );
};

export default CannabisReviewSystem;