import '../styles/globals.css';
import { AnimatePresence } from 'framer-motion';
import { useState, useEffect, createContext, useContext } from 'react';

const PlayerContext = createContext();

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
};

const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioRef, setAudioRef] = useState(null);
  const [playlist, setPlaylist] = useState([
    {
      id: 1,
      title: 'Electronic Dreams',
      artist: 'Synth Wave',
      duration: '3:45',
      url: '/demo-track-1.mp3',
      cover: '/cover-1.jpg'
    },
    {
      id: 2,
      title: 'Midnight City',
      artist: 'Neon Lights',
      duration: '4:12',
      url: '/demo-track-2.mp3',
      cover: '/cover-2.jpg'
    },
    {
      id: 3,
      title: 'Digital Horizon',
      artist: 'Cyber Pulse',
      duration: '3:28',
      url: '/demo-track-3.mp3',
      cover: '/cover-3.jpg'
    },
    {
      id: 4,
      title: 'Neon Nights',
      artist: 'Retro Future',
      duration: '4:01',
      url: '/demo-track-4.mp3',
      cover: '/cover-4.jpg'
    },
    {
      id: 5,
      title: 'Synthwave Sunset',
      artist: 'Electric Dreams',
      duration: '3:56',
      url: '/demo-track-5.mp3',
      cover: '/cover-5.jpg'
    }
  ]);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('off');
  const [isFullScreen, setIsFullScreen] = useState(false);

  const playTrack = (track) => {
    if (audioRef) {
      audioRef.pause();
    }
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const pauseTrack = () => {
    if (audioRef) {
      audioRef.pause();
    }
    setIsPlaying(false);
  };

  const resumeTrack = () => {
    if (audioRef) {
      audioRef.play();
    }
    setIsPlaying(true);
  };

  const nextTrack = () => {
    if (!currentTrack) return;
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    let nextIndex;
    
    if (shuffle) {
      do {
        nextIndex = Math.floor(Math.random() * playlist.length);
      } while (nextIndex === currentIndex && playlist.length > 1);
    } else {
      nextIndex = (currentIndex + 1) % playlist.length;
    }
    
    playTrack(playlist[nextIndex]);
  };

  const previousTrack = () => {
    if (!currentTrack) return;
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    let prevIndex;
    
    if (shuffle) {
      do {
        prevIndex = Math.floor(Math.random() * playlist.length);
      } while (prevIndex === currentIndex && playlist.length > 1);
    } else {
      prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    }
    
    playTrack(playlist[prevIndex]);
  };

  const seekTo = (time) => {
    if (audioRef) {
      audioRef.currentTime = time;
      setCurrentTime(time);
    }
  };

  const changeVolume = (newVolume) => {
    setVolume(newVolume);
    if (audioRef) {
      audioRef.volume = newVolume;
    }
  };

  const toggleShuffle = () => {
    setShuffle(!shuffle);
  };

  const toggleRepeat = () => {
    const modes = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeat);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeat(modes[nextIndex]);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    if (audioRef && currentTrack) {
      const handleTimeUpdate = () => {
        setCurrentTime(audioRef.currentTime);
      };

      const handleLoadedMetadata = () => {
        setDuration(audioRef.duration);
      };

      const handleEnded = () => {
        if (repeat === 'one') {
          audioRef.currentTime = 0;
          audioRef.play();
        } else if (repeat === 'all' || playlist.length > 1) {
          nextTrack();
        } else {
          setIsPlaying(false);
        }
      };

      audioRef.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.addEventListener('ended', handleEnded);

      return () => {
        audioRef.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.removeEventListener('ended', handleEnded);
      };
    }
  }, [audioRef, currentTrack, repeat]);

  const value = {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    playlist,
    shuffle,
    repeat,
    isFullScreen,
    audioRef,
    setAudioRef,
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack,
    seekTo,
    changeVolume,
    toggleShuffle,
    toggleRepeat,
    toggleFullScreen,
    setPlaylist
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

export default function App({ Component, pageProps, router }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <PlayerProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <AnimatePresence mode="wait" initial={false}>
          <Component {...pageProps} key={router.asPath} />
        </AnimatePresence>
      </div>
    </PlayerProvider>
  );
}