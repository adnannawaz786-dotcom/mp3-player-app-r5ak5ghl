import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, Minimize2, Music } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

const mockTracks = [
  { id: 1, title: 'Summer Nights', artist: 'Electronic Dreams', duration: '3:24', src: '/audio/track1.mp3' },
  { id: 2, title: 'Midnight Drive', artist: 'Synthwave Collective', duration: '4:12', src: '/audio/track2.mp3' },
  { id: 3, title: 'Ocean Waves', artist: 'Ambient Nature', duration: '5:03', src: '/audio/track3.mp3' },
  { id: 4, title: 'City Lights', artist: 'Urban Beats', duration: '3:45', src: '/audio/track4.mp3' },
  { id: 5, title: 'Cosmic Journey', artist: 'Space Sounds', duration: '6:18', src: '/audio/track5.mp3' }
];

const AudioVisualizer = ({ audioRef, isPlaying }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current || !canvasRef.current) return;

    const setupAudioContext = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        const source = audioContextRef.current.createMediaElementSource(audioRef.current);
        source.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
        analyserRef.current.fftSize = 256;
      }
    };

    const draw = () => {
      if (!analyserRef.current || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      analyserRef.current.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#8b5cf6');
      gradient.addColorStop(1, '#06b6d4');

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height;

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    if (isPlaying) {
      setupAudioContext();
      draw();
    } else {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, audioRef]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={200}
      className="w-full h-32 rounded-lg bg-slate-900/50"
    />
  );
};

export default function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (currentTrack < mockTracks.length - 1) {
        setCurrentTrack(currentTrack + 1);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playTrack = (index) => {
    setCurrentTrack(index);
    setIsPlaying(true);
    setTimeout(() => {
      audioRef.current.play();
    }, 100);
  };

  const nextTrack = () => {
    if (currentTrack < mockTracks.length - 1) {
      playTrack(currentTrack + 1);
    }
  };

  const prevTrack = () => {
    if (currentTrack > 0) {
      playTrack(currentTrack - 1);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    const progressBar = e.currentTarget;
    const clickX = e.nativeEvent.offsetX;
    const width = progressBar.offsetWidth;
    const newTime = (clickX / width) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const MiniPlayer = () => (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-t border-slate-700">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Music className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white font-medium text-sm">{mockTracks[currentTrack]?.title}</p>
            <p className="text-slate-400 text-xs">{mockTracks[currentTrack]?.artist}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={prevTrack}>
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={togglePlay}>
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={nextTrack}>
            <SkipForward className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(true)}>
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="px-4 pb-2">
        <div 
          className="w-full h-1 bg-slate-700 rounded-full cursor-pointer"
          onClick={handleSeek}
        >
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  );

  const FullScreenPlayer = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-cyan-900/20 z-50 flex flex-col"
    >
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Now Playing</h1>
          <Button variant="ghost" onClick={() => setIsFullscreen(false)}>
            <Minimize2 className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
          <div className="w-64 h-64 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl">
            <Music className="w-32 h-32 text-white" />
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">{mockTracks[currentTrack]?.title}</h2>
            <p className="text-xl text-slate-400">{mockTracks[currentTrack]?.artist}</p>
          </div>

          <AudioVisualizer audioRef={audioRef} isPlaying={isPlaying} />

          <div className="w-full max-w-md">
            <div 
              className="w-full h-2 bg-slate-700 rounded-full cursor-pointer mb-4"
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-slate-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <Button variant="ghost" size="lg" onClick={prevTrack}>
              <SkipBack className="w-8 h-8" />
            </Button>
            <Button 
              variant="default" 
              size="lg" 
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </Button>
            <Button variant="ghost" size="lg" onClick={nextTrack}>
              <SkipForward className="w-8 h-8" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pb-24">
      <audio
        ref={audioRef}
        src={mockTracks[currentTrack]?.src}
        volume={volume}
      />

      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-8">Music Player</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Now Playing</h2>
              <AudioVisualizer audioRef={audioRef} isPlaying={isPlaying} />
              
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-white">{mockTracks[currentTrack]?.title}</h3>
                    <p className="text-slate-400">{mockTracks[currentTrack]?.artist}</p>
                  </div>
                  <Button variant="outline" onClick={() => setIsFullscreen(true)}>
                    <Maximize2 className="w-4 h-4 mr-2" />
                    Full Screen
                  </Button>
                </div>
                
                <div 
                  className="w-full h-2 bg-slate-700 rounded-full cursor-pointer mb-2"
                  onClick={handleSeek}
                >
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-sm text-slate-400 mb-4">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                
                <div className="flex items-center justify-center space-x-4">
                  <Button variant="ghost" onClick={prevTrack}>
                    <SkipBack className="w-5 h-5" />
                  </Button>
                  <Button 
                    variant="default" 
                    onClick={togglePlay}
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </Button>
                  <Button variant="ghost" onClick={nextTrack}>
                    <SkipForward className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Playlist</h2>
              <div className="space-y-2">
                              {mockTracks.map((track, index) => (
                  <div
                    key={track.id}
                    className={`cursor-pointer p-3 rounded-md ${
                      index === currentTrack
                        ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                    onClick={() => playTrack(index)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        playTrack(index);
                      }
                    }}
                    role="button"
                    aria-current={index === currentTrack ? 'true' : 'false'}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{track.title}</p>
                        <p className="text-sm text-slate-400">{track.artist}</p>
                      </div>
                      <p className="text-xs text-slate-400">{track.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isFullscreen && <FullScreenPlayer />}
      </AnimatePresence>

      <MiniPlayer />
    </div>
  );
}
