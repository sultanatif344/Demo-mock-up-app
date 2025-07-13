import React, { useState, useEffect } from 'react';
import { Wand2, Download, RefreshCw, Smartphone, Monitor, Tablet, Sparkles, Zap, Check, ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react';

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedMockups, setGeneratedMockups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('mobile');
  const [selectedStyle, setSelectedStyle] = useState('modern');
  const [seed, setSeed] = useState(null);

  // Slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlayInterval, setAutoPlayInterval] = useState(null);

  const platforms = {
    mobile: { icon: Smartphone, label: 'Mobile App' },
    // web: { icon: Monitor, label: 'Web App' },
    // tablet: { icon: Tablet, label: 'Tablet App' }
  };

  const styles = {
    modern: 'modern minimalist design',
    wireframe: 'wireframe style, black and white',
    material: 'material design, google style',
    dark: 'dark theme, sleek interface',
    glassmorphism: 'glassmorphism, translucent elements'
  };

  const generateConsistentPrompt = (userPrompt, screenType = 'main') => {
    const platformText =
      selectedPlatform === 'mobile' ? 'mobile app' :
        selectedPlatform === 'web' ? 'web application' : 'tablet app';
    const styleText = styles[selectedStyle];

    return `single ${userPrompt} ${platformText} ${screenType} screen mockup, ${styleText}, UI/UX design, clean interface, high quality, one screen only, portrait orientation, centered composition, transparent background`;
  };

  const generateMockup = async (screenType = 'main') => {
    if (!prompt.trim()) return;
    setLoading(true);

    try {
      const currentSeed = seed || Math.floor(Math.random() * 1000000);
      if (!seed) setSeed(currentSeed);

      const designPrompt = generateConsistentPrompt(prompt, screenType);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(designPrompt)}?seed=${currentSeed}&width=400&height=600&nologo=true`;

      const newMockup = {
        id: Date.now() + Math.random(),
        type: screenType,
        url: imageUrl,
        prompt: designPrompt
      };

      setGeneratedMockups(prev => [...prev, newMockup]);
      setCurrentSlide(prev => prev + 1);
    } catch (error) {
      console.error('Error generating mockup:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMultipleScreens = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setGeneratedMockups([]);
    setCurrentSlide(0);
    const newSeed = Math.floor(Math.random() * 1000000);
    setSeed(newSeed);
    const screens = ['main', 'login', 'settings', 'profile', 'dashboard', 'notifications'];

    try {
      const mockups = await Promise.all(
        screens.map(async (screenType, index) => {
          const designPrompt = generateConsistentPrompt(prompt, screenType);
          const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(designPrompt)}?seed=${newSeed}&width=400&height=600&nologo=true`;
          return {
            id: Date.now() + index,
            type: screenType,
            url: imageUrl,
            prompt: designPrompt
          };
        })
      );
      setGeneratedMockups(mockups);
    } catch (error) {
      console.error('Error generating mockups:', error);
    } finally {
      setLoading(false);
    }
  };

  const regenerateWithNewSeed = () => {
    setSeed(null);
    setGeneratedMockups([]);
    setCurrentSlide(0);
    stopAutoPlay();
  };

  // const downloadImage = (url, filename) => {
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.download = filename;
  //   link.click();
  // };

  const downloadImage = async (url, filename) => {
    try {
      // Fetch the image data
      const response = await fetch(url);
      const blob = await response.blob();

      // Create a download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to direct link method
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.target = '_blank';
      link.click();
    }
  };

  // Slideshow controls
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % generatedMockups.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + generatedMockups.length) % generatedMockups.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const startAutoPlay = () => {
    setIsPlaying(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % generatedMockups.length);
    }, 3000);
    setAutoPlayInterval(interval);
  };

  const stopAutoPlay = () => {
    setIsPlaying(false);
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      setAutoPlayInterval(null);
    }
  };

  const toggleAutoPlay = () => {
    if (isPlaying) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
      }
    };
  }, [autoPlayInterval]);

  // Reset slide when mockups change
  useEffect(() => {
    if (generatedMockups.length === 0) {
      setCurrentSlide(0);
    }
  }, [generatedMockups]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden lg:mx-80">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl">
                AI Mockup Generator
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Transform your app ideas into professional mockups with cinematic slideshow presentation
            </p>

            {/* Feature badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Free to use</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Slideshow presentation</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Auto-play feature</span>
              </div>
            </div>
          </header>

          {/* Main form */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 mb-8">
            <div className="space-y-8">
              {/* Platform Selection */}
              <div>
                <label className="block text-lg font-semibold mb-4 text-white">
                  Choose Platform
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(platforms).map(([key, { icon: Icon, label }]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedPlatform(key)}
                      className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 ${selectedPlatform === key
                        ? 'border-purple-400 bg-purple-500/20 shadow-lg shadow-purple-500/25'
                        : 'border-white/20 hover:border-white/40 bg-white/5'
                        }`}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Icon className={`w-8 h-8 ${selectedPlatform === key ? 'text-purple-300' : 'text-gray-300'}`} />
                        <span className={`font-medium ${selectedPlatform === key ? 'text-purple-200' : 'text-gray-300'}`}>
                          {label}
                        </span>
                      </div>
                      {selectedPlatform === key && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Selection */}
              <div>
                <label className="block text-lg font-semibold mb-4 text-white">
                  Design Style
                </label>
                <div className="relative">
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm appearance-none cursor-pointer"
                  >
                    {Object.entries(styles).map(([key]) => (
                      <option key={key} value={key} className="bg-gray-800 text-white">
                        {key.charAt(0).toUpperCase() + key.slice(1)} Style
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Prompt Input */}
              <div>
                <label className="block text-lg font-semibold mb-4 text-white">
                  Describe Your App Idea
                </label>
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A fitness tracking app with workout plans and progress tracking"
                    rows="4"
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm resize-none"
                  />
                  <div className="absolute bottom-4 right-4 text-sm text-gray-400">
                    {prompt.length}/500
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={generateMultipleScreens}
                  disabled={loading || !prompt.trim()}
                  className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <div className="flex items-center gap-3">
                    <Wand2 className="w-5 h-5" />
                    <span>{loading ? 'Generating...' : 'Generate Slideshow'}</span>
                  </div>
                </button>

                <button
                  onClick={() => generateMockup('main')}
                  disabled={loading || !prompt.trim()}
                  className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-semibold backdrop-blur-sm hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5" />
                    <span>Add Single Screen</span>
                  </div>
                </button>

                <button
                  onClick={regenerateWithNewSeed}
                  disabled={loading}
                  className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-semibold backdrop-blur-sm hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-3">
                    <RotateCcw className="w-5 h-5" />
                    <span>Reset</span>
                  </div>
                </button>
              </div>

              {/* Seed info */}
              {seed && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold text-purple-300">Consistency Seed:</span> {seed}
                    <br />
                    <span className="text-gray-400">All screens will use this seed for consistent styling</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <p className="mt-6 text-xl text-gray-300">Generating your mockup slideshow...</p>
              <p className="text-sm text-gray-400 mt-2">This may take a few moments</p>
            </div>
          )}

          {/* Slideshow */}
          {!loading && generatedMockups.length > 0 && (
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">Generated Mockups</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleAutoPlay}
                    className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl font-medium backdrop-blur-sm hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? 'Pause' : 'Auto Play'}
                  </button>
                  <span className="text-sm text-gray-400">
                    {currentSlide + 1} / {generatedMockups.length}
                  </span>
                </div>
              </div>

              {/* Main slideshow container */}
              <div className="relative">
                {/* Main slide display */}
                <div className="relative h-96 md:h-[600px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 mb-6">
                  {generatedMockups.map((mockup, index) => (
                    <div
                      key={mockup.id}
                      className={`absolute inset-0 transition-all duration-500 ease-in-out ${index === currentSlide
                        ? 'opacity-100 transform translate-x-0'
                        : index < currentSlide
                          ? 'opacity-0 transform -translate-x-full'
                          : 'opacity-0 transform translate-x-full'
                        }`}
                    >
                      <div className="flex items-center justify-center h-full p-8">
                        <div className="relative max-w-sm mx-auto">
                          <img
                            src={mockup.url}
                            alt={`${mockup.type} screen mockup`}
                            className="w-full h-full object-cover rounded-2xl shadow-2xl"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDQwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2QjcyODAiPkxvYWRpbmcuLi48L3RleHQ+Cjwvc3ZnPg==';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl"></div>
                        </div>
                      </div>

                      {/* Slide info overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-white capitalize mb-1">
                              {mockup.type} Screen
                            </h3>
                            <p className="text-sm text-gray-300">
                              {mockup.prompt.split(',').slice(0, 3).join(', ')}
                            </p>
                          </div>
                          <button
                            onClick={() => downloadImage(mockup.url, `${mockup.type}-mockup.png`)}
                            className="bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transform hover:scale-105 transition-all duration-300"
                          >
                            <Download className="w-5 h-5 text-gray-800" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Navigation arrows */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-300 backdrop-blur-sm"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-300 backdrop-blur-sm"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                {/* Thumbnail navigation */}
                <div className="flex justify-center gap-2 overflow-x-auto pb-2">
                  {generatedMockups.map((mockup, index) => (
                    <button
                      key={mockup.id}
                      onClick={() => goToSlide(index)}
                      className={`flex-shrink-0 w-16 h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 ${index === currentSlide
                        ? 'border-purple-400 shadow-lg shadow-purple-400/25'
                        : 'border-white/20 hover:border-white/40'
                        }`}
                    >
                      <img
                        src={mockup.url}
                        alt={`${mockup.type} thumbnail`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;