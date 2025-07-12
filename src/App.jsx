import React, { useState } from 'react';
import { Wand2, Download, RefreshCw, Smartphone, Monitor, Tablet } from 'lucide-react';

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedMockups, setGeneratedMockups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('mobile');
  const [selectedStyle, setSelectedStyle] = useState('modern');
  const [seed, setSeed] = useState(null);

  const platforms = {
    mobile: { icon: Smartphone, label: 'Mobile App' },
    web: { icon: Monitor, label: 'Web App' },
    tablet: { icon: Tablet, label: 'Tablet App' }
  };

  const styles = {
    modern: 'modern minimalist design',
    wireframe: 'wireframe style, black and white',
    material: 'material design, google style',
    dark: 'dark theme, sleek interface',
    glassmorphism: 'glassmorphism, translucent elements'
  };

  const generateConsistentPrompt = (userPrompt, screenType = 'main') => {
    const platformText = selectedPlatform === 'mobile' ? 'mobile app' :
      selectedPlatform === 'web' ? 'web application' : 'tablet app';

    const styleText = styles[selectedStyle];

    return `single ${userPrompt} ${platformText} ${screenType} screen mockup, ${styleText}, UI/UX design, clean interface, high quality, one screen only, portrait orientation, centered composition`;
  };

  const generateMockup = async (screenType = 'main') => {
    if (!prompt.trim()) return;

    setLoading(true);

    try {
      // Use the same seed for consistency across screens
      const currentSeed = seed || Math.floor(Math.random() * 1000000);
      if (!seed) setSeed(currentSeed);

      const designPrompt = generateConsistentPrompt(prompt, screenType);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(designPrompt)}?seed=${currentSeed}&width=300&height=500&nologo=true`;

      const newMockup = {
        id: Date.now() + Math.random(),
        type: screenType,
        url: imageUrl,
        prompt: designPrompt
      };

      setGeneratedMockups(prev => [...prev, newMockup]);
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

    // Generate a new seed for this app concept
    const newSeed = Math.floor(Math.random() * 1000000);
    setSeed(newSeed);

    const screens = ['main', 'login', 'settings', 'profile'];

    try {
      const mockups = await Promise.all(
        screens.map(async (screenType, index) => {
          const designPrompt = generateConsistentPrompt(prompt, screenType);
          const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(designPrompt)}?seed=${newSeed}&width=300&height=500&nologo=true`;

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
  };

  const downloadImage = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            AI App Mockup Generator
          </h1>
          <p className="text-gray-600">
            Generate consistent app mockups from your ideas
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform
              </label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(platforms).map(([key, { icon: Icon, label }]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedPlatform(key)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${selectedPlatform === key
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <Icon className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-xs">{label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Design Style
              </label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(styles).map(([key, description]) => (
                  <option key={key} value={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Prompt Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your app idea
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A fitness tracking app with workout plans and progress tracking"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={generateMultipleScreens}
              disabled={loading || !prompt.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Wand2 className="h-5 w-5" />
              {loading ? 'Generating...' : 'Generate App Screens'}
            </button>

            <button
              onClick={() => generateMockup('main')}
              disabled={loading || !prompt.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Smartphone className="h-5 w-5" />
              Single Screen
            </button>

            <button
              onClick={regenerateWithNewSeed}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <RefreshCw className="h-5 w-5" />
              New Variation
            </button>
          </div>

          {seed && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Consistency Seed:</strong> {seed} (All screens will use this seed for consistent styling)
              </p>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Generating your mockups...</p>
          </div>
        )}

        {/* Generated Mockups */}
        {generatedMockups.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Generated Mockups
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {generatedMockups.map((mockup) => (
                <div key={mockup.id} className="group">
                  <div className="relative bg-gray-50 rounded-lg overflow-hidden">
                    <img
                      src={mockup.url}
                      alt={`${mockup.type} screen mockup`}
                      className="w-full h-auto object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDQwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2QjcyODAiPkxvYWRpbmcuLi48L3RleHQ+Cjwvc3ZnPg==';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                      <button
                        onClick={() => downloadImage(mockup.url, `${mockup.type}-mockup.png`)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-2 shadow-lg"
                      >
                        <Download className="h-5 w-5 text-gray-700" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h3 className="font-medium text-gray-800 capitalize">
                      {mockup.type} Screen
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {mockup.prompt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;