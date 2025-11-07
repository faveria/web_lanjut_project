import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Leaf, Clock, Sun, Droplets, Thermometer, AlertCircle, CheckCircle, X } from 'lucide-react';
import { plantAPI } from '../../utils/api';

const PlantProfileSelector = ({ userId, selectedPlants, onPlantSelect, onRemovePlant, onAddPlant }) => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [error, setError] = useState(null);

  const categories = [
    { id: 'all', name: 'All Plants' },
    { id: 'leafy', name: 'Leafy Greens' },
    { id: 'herb', name: 'Herbs' },
    { id: 'fruit', name: 'Fruiting Plants' },
    { id: 'vegetable', name: 'Vegetables' }
  ];

  const difficulties = [
    { id: 'all', name: 'All Levels' },
    { id: 'easy', name: 'Easy' },
    { id: 'moderate', name: 'Moderate' },
    { id: 'difficult', name: 'Difficult' }
  ];

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      setLoading(true);
      const response = await plantAPI.getAllPlantProfiles();
      setPlants(response.data.data);
    } catch (err) {
      setError('Failed to load plant profiles');
      console.error('Error fetching plants:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plant.scientificName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || plant.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || plant.difficulty === selectedDifficulty;
    const isAlreadySelected = selectedPlants.some(sp => sp.PlantProfile.id === plant.id);

    return matchesSearch && matchesCategory && matchesDifficulty && !isAlreadySelected;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'moderate': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'difficult': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'Easy';
      case 'moderate': return 'Moderate';
      case 'difficult': return 'Difficult';
      default: return 'Unknown';
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 dark:bg-red-900/20 dark:border-red-800">
        <div className="flex items-center text-red-700 dark:text-red-300">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/30 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search plants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-primary-200/30 rounded-lg focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-primary-200/30 rounded-lg focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          
          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-3 border border-primary-200/30 rounded-lg focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {difficulties.map(difficulty => (
              <option key={difficulty.id} value={difficulty.id}>{difficulty.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Plants */}
      {selectedPlants && selectedPlants.length > 0 && (
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/30 dark:border-gray-700 p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Active Garden</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedPlants.map((selectedPlant, index) => (
              <motion.div
                key={selectedPlant.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl border border-green-200/30 dark:border-gray-600"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{selectedPlant.PlantProfile.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{selectedPlant.PlantProfile.scientificName}</p>
                    <div className="flex items-center mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedPlant.PlantProfile.difficulty)}`}>
                        {getDifficultyText(selectedPlant.PlantProfile.difficulty)}
                      </span>
                      <span className="ml-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-3 h-3 mr-1" />
                        {selectedPlant.PlantProfile.growthTime} days
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemovePlant(selectedPlant.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Available Plants */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/30 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Available Plants {filteredPlants.length > 0 && `(${filteredPlants.length})`}
          </h3>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredPlants.length === 0 ? (
          <div className="text-center py-12">
            <Leaf className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No plants found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlants.map((plant, index) => (
              <motion.div
                key={plant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border border-gray-200/30 dark:border-gray-600 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{plant.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{plant.scientificName}</p>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(plant.difficulty)}`}>
                      {getDifficultyText(plant.difficulty)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    {plant.growthTime} days to harvest
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Sun className="w-4 h-4 mr-2" />
                    {plant.lightRequirements}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Droplets className="w-3 h-3 mr-1" />
                    pH: {plant.optimalPhMin}-{plant.optimalPhMax}
                  </div>
                  <div className="flex items-center">
                    <Thermometer className="w-3 h-3 mr-1" />
                    TDS: {plant.optimalTdsMin}-{plant.optimalTdsMax}
                  </div>
                </div>

                <button
                  onClick={() => onAddPlant(plant)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-2 px-4 rounded-lg font-medium transition-all"
                >
                  Add to Garden
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantProfileSelector;