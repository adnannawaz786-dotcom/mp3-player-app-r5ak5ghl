import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

const MusicPlayer = ({ 
  tracks = [], 
  currentTrack = 0, 
  onTrackChange, 
  isMinimized = false,
  onToggleMinimize 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [visualizerData, setVisualizerData] = useState([]);
  
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);

  const currentTrackData = tracks[currentTrack] || {
    title: 'No Track Selected',
    artist: 'Unknown Artist',
    album: 'Unknown Album',
    cover: '/placeholder-cover.jpg',
    src: ''
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current && currentTrackData.src) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentTrack, currentTrackData.src]);

  useEffect(() => {
    setupAudioContext();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const setupAudioContext = () => {
    if (!audioContextRef.current && audioRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        const source = audioContextRef.current.createMediaElementSource(audioRef.current);
        source.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
        analyserRef.current.fftSize = 256;
        startVisualization();
      } catch (error) {
        console.error('Error setting up audio context:', error);
      }
    }
  };

  const startVisualization = () => {
    if (!analyserRef.current) return;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const animate = () => {
      analyserRef.current.getByteFrequencyData(dataArray);
      setVisualizerData([...dataArray]);
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
  };

  const togglePlayPause = async () => {
    if (!audioRef.current || !currentTrackData.src) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        if (audioContextRef.current?.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        await audioRef.current.play();
        setupAudioContext();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newVolume = Math.max(0, Math.min(1, percent));
    setVolume(newVolume);
    setIsMuted(false);
  };

  const nextTrack = () => {
    if (tracks.length === 0) return;
    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * tracks.length);
    } else {
      nextIndex = (currentTrack + 1) % tracks.length;
    }
    onTrackChange?.(nextIndex);
  };

  const previousTrack = () => {
    if (tracks.length === 0) return;
    let prevIndex;
    if (isShuffle) {
      prevIndex = Math.floor(Math.random() * tracks.length);
    } else {
      prevIndex = currentTrack === 0 ? tracks.length - 1 : currentTrack - 1;
    }
    onTrackChange?.(prevIndex);
  };

  const handleEnded = () => {
    if (isRepeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      nextTrack();
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const Visualizer = () => (
    <div className="flex items-end justify-center h-16 gap-1 px-4">
      {visualizerData.slice(0, 32).map((value, index) => (
        <motion.div
          key={index}
          className="bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"
          style={{
            width: '4px',
            height: isPlaying ? `${(value / 255) * 64 + 4}px` : '4px',
          }}
          animate={{
            height: isPlaying ? `${(value / 255) * 64 + 4}px` : '4px',
          }}
          transition={{ duration: 0.1 }}
        />
      ))}
    </div>
  );

  if (isMinimized) {
    return (
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Card className="p-4 bg-black/80 backdrop-blur-lg border-gray-800">
          <div className="flex items-center gap-3">
            <img
              src={currentTrackData.cover}
              alt={currentTrackData.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{currentTrackData.title}</p>
              <p className="text-gray-400 text-sm truncate">{currentTrackData.artist}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={previousTrack}
                className="text-white hover:bg-white/20"
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlayPause}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextTrack}
                className="text-white hover:bg-white/20"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleMinimize}
                className="text-white hover:bg-white/20"
              >
                ↗
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      >
        {currentTrackData.src && <source src={currentTrackData.src} type="audio/mpeg" />}
      </audio>

      <Card className="bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 border-gray-700 overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-shrink-0">
              <motion.img
                src={currentTrackData.cover}
                alt={currentTrackData.title}
                className="w-64 h-64 rounded-2xl object-cover shadow-2xl"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{currentTrackData.title}</h1>
                <p className="text-xl text-gray-300 mb-1">{currentTrackData.artist}</p>
                <p className="text-lg text-gray-400">{currentTrackData.album}</p>
              </div>

              <Visualizer />

              <div className="space-y-4">
                <div 
                  className="w-full h-2 bg-gray-700 rounded-full cursor-pointer"
                  onClick={handleSeek}
                >
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full relative"
                    style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                  >
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg" />
                  </div>
                </div>

                <div className="flex justify-between text-sm text-gray-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsShuffle(!isShuffle)}
                    className={`text-white hover:bg-white/20 ${isShuffle ? 'text-purple-400' : ''}`}
                  >
                    <Shuffle className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLiked(!isLiked)}
                    className={`text-white hover:bg-white/20 ${isLiked ? 'text-red-400' : ''}`}
                  >
                    <Heart className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={previousTrack}
                    className="text-white hover:bg-white/20"
                  >
                    <SkipBack className="w-6 h-6" />
                  </Button>
                  <Button
                    onClick={togglePlayPause}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={nextTrack}
                    className="text-white hover:bg-white/20"
                  >
                    <SkipForward className="w-6 h-6" />
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsRepeat(!isRepeat)}
                    className={`text-white hover:bg-white/20 ${isRepeat ? 'text-purple-400' : ''}`}
                  >
                    <Repeat className="w-5 h-5" />
                  </Button>
                  {onToggleMinimize && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onToggleMinimize}
                      className="text-white hover:bg-white/20"
                    >
                      ↙
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                <div 
                  className="flex-1 h-2 bg-gray-700 rounded-full cursor-pointer"
                  onClick={handleVolumeChange}
                >
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full