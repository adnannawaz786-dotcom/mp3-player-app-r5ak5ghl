import { useState, useRef, useEffect, useCallback } from 'react';

export const useAudio = () => {
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none');
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [dataArray, setDataArray] = useState(null);

  const initializeAudioContext = useCallback(() => {
    if (!audioRef.current || audioContext) return;

    try {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const analyserNode = context.createAnalyser();
      const source = context.createMediaElementSource(audioRef.current);
      
      analyserNode.fftSize = 256;
      const bufferLength = analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      source.connect(analyserNode);
      analyserNode.connect(context.destination);
      
      setAudioContext(context);
      setAnalyser(analyserNode);
      setDataArray(dataArray);
    } catch (err) {
      console.warn('Web Audio API not supported:', err);
    }
  }, [audioContext]);

  const loadTrack = useCallback((track) => {
    if (!audioRef.current) return;

    setIsLoading(true);
    setError(null);
    setCurrentTime(0);
    setDuration(0);

    audioRef.current.src = track.src;
    setCurrentTrack(track);

    audioRef.current.load();
  }, []);

  const play = useCallback(async () => {
    if (!audioRef.current || !currentTrack) return;

    try {
      setIsLoading(true);
      setError(null);

      if (audioContext && audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      await audioRef.current.play();
      setIsPlaying(true);
      initializeAudioContext();
    } catch (err) {
      setError('Failed to play audio');
      console.error('Play error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentTrack, audioContext, initializeAudioContext]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seek = useCallback((time) => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  const changeVolume = useCallback((newVolume) => {
    if (!audioRef.current) return;

    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    audioRef.current.volume = clampedVolume;
    setVolume(clampedVolume);
    
    if (clampedVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  const changePlaybackRate = useCallback((rate) => {
    if (!audioRef.current) return;

    const clampedRate = Math.max(0.25, Math.min(2, rate));
    audioRef.current.playbackRate = clampedRate;
    setPlaybackRate(clampedRate);
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffled(prev => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeatMode(prev => {
      switch (prev) {
        case 'none':
          return 'all';
        case 'all':
          return 'one';
        case 'one':
          return 'none';
        default:
          return 'none';
      }
    });
  }, []);

  const getVisualizerData = useCallback(() => {
    if (!analyser || !dataArray) return null;

    analyser.getByteFrequencyData(dataArray);
    return Array.from(dataArray);
  }, [analyser, dataArray]);

  const formatTime = useCallback((time) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        play();
      }
    };

    const handleError = (e) => {
      setError('Failed to load audio');
      setIsLoading(false);
      setIsPlaying(false);
      console.error('Audio error:', e);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [play, repeatMode]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  useEffect(() => {
    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [audioContext]);

  return {
    audioRef,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoading,
    error,
    playbackRate,
    isShuffled,
    repeatMode,
    loadTrack,
    play,
    pause,
    togglePlayPause,
    seek,
    changeVolume,
    toggleMute,
    changePlaybackRate,
    toggleShuffle,
    toggleRepeat,
    getVisualizerData,
    formatTime
  };
};