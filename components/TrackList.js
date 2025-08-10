import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, MoreVertical, Heart, Clock, Shuffle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

const TrackList = ({ 
  tracks = [], 
  currentTrack, 
  isPlaying, 
  onTrackSelect, 
  onPlayPause,
  onToggleFavorite,
  className = '' 
}) => {
  const [hoveredTrack, setHoveredTrack] = useState(null);
  const [selectedTracks, setSelectedTracks] = useState(new Set());
  const [sortBy, setSortBy] = useState('title');
  const [filterGenre, setFilterGenre] = useState('all');
  const listRef = useRef(null);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sortedTracks = [...tracks].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'artist':
        return a.artist.localeCompare(b.artist);
      case 'duration':
        return a.duration - b.duration;
      case 'dateAdded':
        return new Date(b.dateAdded) - new Date(a.dateAdded);
      default:
        return 0;
    }
  });

  const filteredTracks = sortedTracks.filter(track => 
    filterGenre === 'all' || track.genre === filterGenre
  );

  const genres = [...new Set(tracks.map(track => track.genre))];

  const handleTrackClick = (track, index) => {
    if (currentTrack?.id === track.id) {
      onPlayPause();
    } else {
      onTrackSelect(track, index);
    }
  };

  const handleDoubleClick = (track, index) => {
    onTrackSelect(track, index);
    if (!isPlaying) {
      onPlayPause();
    }
  };

  const toggleTrackSelection = (trackId, event) => {
    event.stopPropagation();
    const newSelected = new Set(selectedTracks);
    if (newSelected.has(trackId)) {
      newSelected.delete(trackId);
    } else {
      newSelected.add(trackId);
    }
    setSelectedTracks(newSelected);
  };

  const scrollToCurrentTrack = () => {
    if (currentTrack && listRef.current) {
      const trackElement = listRef.current.querySelector(`[data-track-id="${currentTrack.id}"]`);
      if (trackElement) {
        trackElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  useEffect(() => {
    if (currentTrack) {
      scrollToCurrentTrack();
    }
  }, [currentTrack]);

  const trackVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: 'easeOut'
      }
    }),
    hover: {
      scale: 1.02,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      transition: { duration: 0.2 }
    }
  };

  const playButtonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.2 }
    }
  };

  return (
    <Card className={`bg-gradient-to-b from-gray-900/50 to-black/50 backdrop-blur-lg border-gray-800/50 ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-white">Tracks</h2>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
              {filteredTracks.length} songs
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <select 
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="bg-gray-800/50 text-white border border-gray-700 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
            
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800/50 text-white border border-gray-700 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="title">Sort by Title</option>
              <option value="artist">Sort by Artist</option>
              <option value="duration">Sort by Duration</option>
              <option value="dateAdded">Sort by Date Added</option>
            </select>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const shuffled = [...filteredTracks].sort(() => Math.random() - 0.5);
                if (shuffled.length > 0) {
                  onTrackSelect(shuffled[0], 0);
                }
              }}
              className="text-gray-400 hover:text-white"
            >
              <Shuffle className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-1 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent" ref={listRef}>
          <AnimatePresence>
            {filteredTracks.map((track, index) => {
              const isCurrentTrack = currentTrack?.id === track.id;
              const isHovered = hoveredTrack === track.id;
              const isSelected = selectedTracks.has(track.id);
              
              return (
                <motion.div
                  key={track.id}
                  custom={index}
                  variants={trackVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  data-track-id={track.id}
                  className={`
                    group flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200
                    ${isCurrentTrack ? 'bg-purple-500/20 border border-purple-500/30' : 'hover:bg-white/5'}
                    ${isSelected ? 'bg-blue-500/20 border border-blue-500/30' : ''}
                  `}
                  onMouseEnter={() => setHoveredTrack(track.id)}
                  onMouseLeave={() => setHoveredTrack(null)}
                  onClick={() => handleTrackClick(track, index)}
                  onDoubleClick={() => handleDoubleClick(track, index)}
                >
                  <div className="flex items-center w-12 justify-center">
                    {isCurrentTrack && isPlaying ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex space-x-1"
                      >
                        <div className="w-1 h-4 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                        <div className="w-1 h-4 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                        <div className="w-1 h-4 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                      </motion.div>
                    ) : isHovered || isCurrentTrack ? (
                      <motion.div
                        variants={playButtonVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0 text-white hover:text-purple-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTrackClick(track, index);
                          }}
                        >
                          {isCurrentTrack && isPlaying ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4 ml-0.5" />
                          )}
                        </Button>
                      </motion.div>
                    ) : (
                      <span className="text-gray-500 text-sm font-mono">
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 mx-4">
                    <div className="flex items-center space-x-3">
                      {track.artwork && (
                        <img 
                          src={track.artwork} 
                          alt={track.title}
                          className="w-10 h-10 rounded-md object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${isCurrentTrack ? 'text-purple-300' : 'text-white'}`}>
                          {track.title}
                        </p>
                        <p className="text-gray-400 text-sm truncate">
                          {track.artist}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:block text-gray-400 text-sm min-w-0 flex-1">
                    <p className="truncate">{track.album}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(track.id);
                      }}
                      className={`w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                        track.isFavorite ? 'text-red-400 opacity-100' : 'text-gray-400 hover:text-red-400'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${track.isFavorite ? 'fill-current' : ''}`} />
                    </Button>

                    <div className="flex items-center text-gray-400 text-sm">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDuration(track.duration)}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => toggleTrackSelection(track.id, e)}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredTracks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400 text-lg">No tracks found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
          </motion.div>
        )}

        {selectedTracks.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <p className="text-blue-300 text-sm">
                {selectedTracks.size} track{selectedTracks.size > 1 ? 's' : ''} selected
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTracks(new Set())}
                  className="text-gray-400 hover:text-white"
                >
                  Clear
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-300 hover:text-blue-200"
                >
                  Add to Playlist
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
};

export default TrackList;