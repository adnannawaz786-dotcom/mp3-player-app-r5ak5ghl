import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Search, Library, Heart, Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, Shuffle, Repeat } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

export default function Layout({ children, currentTrack, isPlaying, onPlayPause, onNext, onPrevious, onShuffle, onRepeat, isShuffled, isRepeating, progress, volume, onVolumeChange, onSeek, onFullscreen }) {
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'library', label: 'Library', icon: Library },
    { id: 'favorites', label: 'Favorites', icon: Heart }
  ];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col">
      <main className="flex-1 overflow-auto pb-32">
        {children}
      </main>

      {currentTrack && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-20 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/10"
        >
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold">
                    {currentTrack.title?.charAt(0) || 'M'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{currentTrack.title}</h4>
                  <p className="text-xs text-gray-400 truncate">{currentTrack.artist}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShuffle}
                  className={`h-8 w-8 p-0 ${isShuffled ? 'text-green-400' : 'text-gray-400'}`}
                >
                  <Shuffle className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onPrevious}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onPlayPause}
                  className="h-10 w-10 p-0 bg-white text-black hover:bg-gray-200 rounded-full"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNext}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRepeat}
                  className={`h-8 w-8 p-0 ${isRepeating ? 'text-green-400' : 'text-gray-400'}`}
                >
                  <Repeat className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onFullscreen}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-xs text-gray-400 w-10 text-right">
                {formatTime(progress.current)}
              </span>
              
              <div className="flex-1 relative">
                <div className="w-full h-1 bg-gray-600 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                    initial={false}
                    animate={{ width: `${(progress.current / progress.total) * 100}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max={progress.total}
                  value={progress.current}
                  onChange={(e) => onSeek(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              
              <span className="text-xs text-gray-400 w-10">
                {formatTime(progress.total)}
              </span>
              
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-gray-400" />
                <div className="w-16 relative">
                  <div className="w-full h-1 bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full"
                      style={{ width: `${volume}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-white/10">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center space-y-1 h-auto py-2 px-3 ${
                  isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="w-1 h-1 bg-white rounded-full"
                  />
                )}
              </Button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}