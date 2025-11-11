import React, { useState, useEffect } from 'react';
import { Leaf, Sun, Droplets, Calendar, Award, AlertCircle, CheckCircle } from 'lucide-react';

const CannabisGrowingGame = () => {
  const [gameState, setGameState] = useState({
    day: 1,
    plants: [],
    score: 0,
    money: 500,
    experience: 0,
    level: 1,
    gamePhase: 'planning',
    selectedSeed: null,
    maxPlants: 6,
    players: 1
  });

  const [notifications, setNotifications] = useState([]);
  const [showLegalInfo, setShowLegalInfo] = useState(true);

  const seedTypes = [
    { id: 'indica', name: 'Indica Strain', growTime: 70, difficulty: 'Easy', yield: 3, cost: 50 },
    { id: 'sativa', name: 'Sativa Strain', growTime: 85, difficulty: 'Medium', yield: 4, cost: 75 },
    { id: 'hybrid', name: 'Hybrid Strain', growTime: 77, difficulty: 'Medium', yield: 3.5, cost: 60 },
    { id: 'autoflower', name: 'Auto-flower', growTime: 60, difficulty: 'Easy', yield: 2.5, cost: 40 }
  ];

  const growthStages = [
    { name: 'Seedling', duration: 14, waterNeeds: 2, lightNeeds: 3 },
    { name: 'Vegetative', duration: 35, waterNeeds: 4, lightNeeds: 5 },
    { name: 'Flowering', duration: 28, waterNeeds: 3, lightNeeds: 4 },
    { name: 'Ready', duration: 0, waterNeeds: 0, lightNeeds: 0 }
  ];

  const addNotification = (message, type = 'info') => {
    const notification = { id: Date.now(), message, type };
    setNotifications(prev => [...prev, notification]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 3000);
  };

  const plantSeed = (seedType) => {
    if (gameState.plants.length >= gameState.maxPlants) {
      addNotification(`Maximum of ${gameState.maxPlants} plants allowed!`, 'error');
      return;
    }
    
    if (gameState.money < seedType.cost) {
      addNotification('Not enough money for seeds!', 'error');
      return;
    }

    const newPlant = {
      id: Date.now(),
      type: seedType,
      stage: 0,
      daysInStage: 0,
      health: 100,
      waterLevel: 5,
      lightLevel: 5,
      problems: []
    };

    setGameState(prev => ({
      ...prev,
      plants: [...prev.plants, newPlant],
      money: prev.money - seedType.cost,
      gamePhase: 'growing'
    }));

    addNotification(`Planted ${seedType.name} seed!`, 'success');
  };

  const waterPlant = (plantId) => {
    setGameState(prev => ({
      ...prev,
      plants: prev.plants.map(plant => {
        if (plant.id === plantId && plant.waterLevel < 10) {
          return { ...plant, waterLevel: Math.min(10, plant.waterLevel + 3) };
        }
        return plant;
      })
    }));
    addNotification('Plant watered!', 'success');
  };

  const adjustLight = (plantId) => {
    setGameState(prev => ({
      ...prev,
      plants: prev.plants.map(plant => {
        if (plant.id === plantId) {
          return { ...plant, lightLevel: Math.min(10, plant.lightLevel + 2) };
        }
        return plant;
      })
    }));
    addNotification('Light adjusted!', 'success');
  };

  const harvestPlant = (plantId) => {
    const plant = gameState.plants.find(p => p.id === plantId);
    if (plant.stage === 3) {
      const baseYield = plant.type.yield;
      const healthMultiplier = plant.health / 100;
      const actualYield = baseYield * healthMultiplier;
      const earnings = Math.floor(actualYield * 100);

      setGameState(prev => ({
        ...prev,
        plants: prev.plants.filter(p => p.id !== plantId),
        money: prev.money + earnings,
        score: prev.score + Math.floor(actualYield * 50),
        experience: prev.experience + 100
      }));

      addNotification(`Harvested ${actualYield.toFixed(1)} oz! Earned $${earnings}`, 'success');
    }
  };

  const advanceDay = () => {
    setGameState(prev => {
      const newPlants = prev.plants.map(plant => {
        const currentStage = growthStages[plant.stage];
        if (!currentStage) return plant;

        let newPlant = { ...plant };
        
        newPlant.daysInStage += 1;
        if (newPlant.daysInStage >= currentStage.duration && plant.stage < 3) {
          newPlant.stage += 1;
          newPlant.daysInStage = 0;
        }

        newPlant.waterLevel = Math.max(0, newPlant.waterLevel - 1);
        newPlant.lightLevel = Math.max(0, newPlant.lightLevel - 1);

        const waterNeed = currentStage.waterNeeds;
        const lightNeed = currentStage.lightNeeds;
        
        let healthChange = 0;
        if (newPlant.waterLevel < waterNeed) healthChange -= 5;
        if (newPlant.lightLevel < lightNeed) healthChange -= 3;
        if (newPlant.waterLevel > 8) healthChange -= 2;
        
        newPlant.health = Math.max(0, Math.min(100, newPlant.health + healthChange));

        return newPlant;
      });

      return {
        ...prev,
        day: prev.day + 1,
        plants: newPlants,
        experience: prev.experience + 5,
        level: Math.floor(prev.experience / 500) + 1
      };
    });
  };

  const updateMaxPlants = (players) => {
    const maxPlants = Math.min(12, players * 6);
    setGameState(prev => ({ ...prev, players, maxPlants }));
  };

  const getStageInfo = (plant) => {
    const stage = growthStages[plant.stage];
    if (!stage) return { name: 'Unknown', progress: 0 };
    
    const progress = plant.stage === 3 ? 100 : (plant.daysInStage / stage.duration) * 100;
    return { ...stage, progress };
  };

  const getHealthColor = (health) => {
    if (health > 80) return 'text-green-600';
    if (health > 60) return 'text-yellow-600';
    if (health > 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      {showLegalInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl">
            <h2 className="text-2xl font-bold mb-4 text-green-800">NYC Cannabis Growing - Legal Information</h2>
            <div className="space-y-3 text-sm">
              <p><strong>Legal Limits:</strong></p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Adults 21+ can possess up to 3 oz of cannabis</li>
                <li>Home cultivation: Up to 6 mature plants per person</li>
                <li>Maximum 12 plants per household (regardless of number of adults)</li>
                <li>Plants must be in a locked space away from public view</li>
                <li>Cannot sell homegrown cannabis</li>
              </ul>
              <p className="text-xs text-gray-600 mt-4">
                This is an educational game. Always check current local laws and regulations.
              </p>
            </div>
            <button 
              onClick={() => setShowLegalInfo(false)}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Start Game
            </button>
          </div>
        </div>
      )}

      <div className="fixed top-4 right-4 z-40 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-3 rounded shadow-lg ${
              notification.type === 'success' ? 'bg-green-500 text-white' :
              notification.type === 'error' ? 'bg-red-500 text-white' :
              'bg-blue-500 text-white'
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-green-800 mb-4 flex items-center">
            <Leaf className="mr-2" />
            NYC Cannabis Growing Simulator
          </h1>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <Calendar className="w-6 h-6 mx-auto mb-1 text-blue-600" />
              <p className="text-sm text-gray-600">Day</p>
              <p className="font-bold">{gameState.day}</p>
            </div>
            <div className="text-center">
              <Award className="w-6 h-6 mx-auto mb-1 text-yellow-600" />
              <p className="text-sm text-gray-600">Score</p>
              <p className="font-bold">{gameState.score}</p>
            </div>
            <div className="text-center">
              <span className="text-green-600 text-xl font-bold">$</span>
              <p className="text-sm text-gray-600">Money</p>
              <p className="font-bold">${gameState.money}</p>
            </div>
            <div className="text-center">
              <Leaf className="w-6 h-6 mx-auto mb-1 text-green-600" />
              <p className="text-sm text-gray-600">Plants</p>
              <p className="font-bold">{gameState.plants.length}/{gameState.maxPlants}</p>
            </div>
            <div className="text-center">
              <span className="text-purple-600 text-xl font-bold">L</span>
              <p className="text-sm text-gray-600">Level</p>
              <p className="font-bold">{gameState.level}</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded">
            <label className="block text-sm font-medium mb-2">Number of Adults (21+) in Household:</label>
            <select 
              value={gameState.players}
              onChange={(e) => updateMaxPlants(parseInt(e.target.value))}
              className="border rounded px-3 py-1"
            >
              <option value={1}>1 Person (Max 6 plants)</option>
              <option value={2}>2 People (Max 12 plants)</option>
            </select>
            <p className="text-xs text-gray-600 mt-1">
              NYC law: Max 6 plants per person, 12 plants per household
            </p>
          </div>
        </div>

        {(gameState.gamePhase === 'planning' || gameState.plants.length < gameState.maxPlants) && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-green-800">Select Seeds to Plant</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {seedTypes.map(seed => (
                <div key={seed.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-lg">{seed.name}</h3>
                  <p className="text-sm text-gray-600">Cost: ${seed.cost}</p>
                  <p className="text-sm text-gray-600">Grow Time: {seed.growTime} days</p>
                  <p className="text-sm text-gray-600">Difficulty: {seed.difficulty}</p>
                  <p className="text-sm text-gray-600">Expected Yield: {seed.yield} oz</p>
                  <button
                    onClick={() => plantSeed(seed)}
                    disabled={gameState.money < seed.cost || gameState.plants.length >= gameState.maxPlants}
                    className="mt-2 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                  >
                    Plant Seed
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {gameState.plants.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-green-800">Your Plants</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gameState.plants.map(plant => {
                const stageInfo = getStageInfo(plant);
                return (
                  <div key={plant.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold">{plant.type.name}</h3>
                      <div className={`text-sm font-bold ${getHealthColor(plant.health)}`}>
                        {plant.health}% Health
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm font-medium">Stage: {stageInfo.name}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${stageInfo.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                      <div className="flex items-center">
                        <Droplets className="w-4 h-4 text-blue-600 mr-1" />
                        <span>Water: {plant.waterLevel}/10</span>
                      </div>
                      <div className="flex items-center">
                        <Sun className="w-4 h-4 text-yellow-600 mr-1" />
                        <span>Light: {plant.lightLevel}/10</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => waterPlant(plant.id)}
                        className="flex-1 bg-blue-600 text-white py-1 px-2 rounded text-sm hover:bg-blue-700"
                      >
                        Water
                      </button>
                      <button
                        onClick={() => adjustLight(plant.id)}
                        className="flex-1 bg-yellow-600 text-white py-1 px-2 rounded text-sm hover:bg-yellow-700"
                      >
                        Light
                      </button>
                      {plant.stage === 3 && (
                        <button
                          onClick={() => harvestPlant(plant.id)}
                          className="flex-1 bg-green-600 text-white py-1 px-2 rounded text-sm hover:bg-green-700"
                        >
                          Harvest
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-center">
            <button
              onClick={advanceDay}
              className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-bold hover:bg-green-700 transition-colors"
            >
              Advance to Next Day
            </button>
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>Take care of your plants daily! Water them, ensure proper lighting, and watch them grow.</p>
            <p className="mt-1">Remember: This is for educational purposes only. Always follow local laws.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CannabisGrowingGame;