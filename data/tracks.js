const tracks = [
  {
    id: 1,
    title: "Midnight Drive",
    artist: "Synthwave Dreams",
    album: "Neon Nights",
    duration: "3:42",
    durationSeconds: 222,
    src: "/audio/midnight-drive.mp3",
    cover: "/images/covers/neon-nights.jpg",
    genre: "Synthwave",
    year: 2023,
    color: "#8B5CF6"
  },
  {
    id: 2,
    title: "Ocean Waves",
    artist: "Ambient Collective",
    album: "Natural Sounds",
    duration: "4:15",
    durationSeconds: 255,
    src: "/audio/ocean-waves.mp3",
    cover: "/images/covers/natural-sounds.jpg",
    genre: "Ambient",
    year: 2023,
    color: "#06B6D4"
  },
  {
    id: 3,
    title: "Electric Pulse",
    artist: "Digital Frequency",
    album: "Cyber City",
    duration: "3:28",
    durationSeconds: 208,
    src: "/audio/electric-pulse.mp3",
    cover: "/images/covers/cyber-city.jpg",
    genre: "Electronic",
    year: 2024,
    color: "#EF4444"
  },
  {
    id: 4,
    title: "Starlight Serenade",
    artist: "Luna Orchestra",
    album: "Celestial Melodies",
    duration: "5:03",
    durationSeconds: 303,
    src: "/audio/starlight-serenade.mp3",
    cover: "/images/covers/celestial-melodies.jpg",
    genre: "Classical",
    year: 2023,
    color: "#F59E0B"
  },
  {
    id: 5,
    title: "Urban Jungle",
    artist: "Street Beats",
    album: "City Life",
    duration: "2:56",
    durationSeconds: 176,
    src: "/audio/urban-jungle.mp3",
    cover: "/images/covers/city-life.jpg",
    genre: "Hip Hop",
    year: 2024,
    color: "#10B981"
  },
  {
    id: 6,
    title: "Retro Funk",
    artist: "Groove Machine",
    album: "Disco Revival",
    duration: "4:21",
    durationSeconds: 261,
    src: "/audio/retro-funk.mp3",
    cover: "/images/covers/disco-revival.jpg",
    genre: "Funk",
    year: 2023,
    color: "#F97316"
  },
  {
    id: 7,
    title: "Mountain Echo",
    artist: "Nature Sounds Co.",
    album: "Wilderness",
    duration: "6:12",
    durationSeconds: 372,
    src: "/audio/mountain-echo.mp3",
    cover: "/images/covers/wilderness.jpg",
    genre: "Nature",
    year: 2024,
    color: "#059669"
  },
  {
    id: 8,
    title: "Digital Dreams",
    artist: "Pixel Perfect",
    album: "8-Bit Memories",
    duration: "3:33",
    durationSeconds: 213,
    src: "/audio/digital-dreams.mp3",
    cover: "/images/covers/8bit-memories.jpg",
    genre: "Chiptune",
    year: 2023,
    color: "#8B5A2B"
  },
  {
    id: 9,
    title: "Jazz Café",
    artist: "Smooth Operators",
    album: "Late Night Sessions",
    duration: "4:47",
    durationSeconds: 287,
    src: "/audio/jazz-cafe.mp3",
    cover: "/images/covers/late-night-sessions.jpg",
    genre: "Jazz",
    year: 2024,
    color: "#DC2626"
  },
  {
    id: 10,
    title: "Future Bass",
    artist: "Neon Lights",
    album: "Tomorrow's Sound",
    duration: "3:19",
    durationSeconds: 199,
    src: "/audio/future-bass.mp3",
    cover: "/images/covers/tomorrows-sound.jpg",
    genre: "Future Bass",
    year: 2024,
    color: "#7C3AED"
  },
  {
    id: 11,
    title: "Acoustic Sunrise",
    artist: "Morning Dew",
    album: "Golden Hour",
    duration: "4:08",
    durationSeconds: 248,
    src: "/audio/acoustic-sunrise.mp3",
    cover: "/images/covers/golden-hour.jpg",
    genre: "Acoustic",
    year: 2023,
    color: "#FBBF24"
  },
  {
    id: 12,
    title: "Space Odyssey",
    artist: "Cosmic Voyager",
    album: "Interstellar Journey",
    duration: "5:34",
    durationSeconds: 334,
    src: "/audio/space-odyssey.mp3",
    cover: "/images/covers/interstellar-journey.jpg",
    genre: "Space Ambient",
    year: 2024,
    color: "#1E40AF"
  }
];

const playlists = [
  {
    id: 1,
    name: "Chill Vibes",
    description: "Perfect for relaxing and unwinding",
    cover: "/images/playlists/chill-vibes.jpg",
    trackIds: [2, 4, 7, 11],
    color: "#06B6D4",
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    name: "Electronic Mix",
    description: "High energy electronic beats",
    cover: "/images/playlists/electronic-mix.jpg",
    trackIds: [1, 3, 8, 10],
    color: "#8B5CF6",
    createdAt: "2024-01-20"
  },
  {
    id: 3,
    name: "Night Drive",
    description: "Perfect soundtrack for late night drives",
    cover: "/images/playlists/night-drive.jpg",
    trackIds: [1, 6, 9, 12],
    color: "#1F2937",
    createdAt: "2024-02-01"
  },
  {
    id: 4,
    name: "Focus Flow",
    description: "Instrumental tracks for productivity",
    cover: "/images/playlists/focus-flow.jpg",
    trackIds: [2, 4, 7, 8, 12],
    color: "#059669",
    createdAt: "2024-02-10"
  }
];

const genres = [
  { name: "Synthwave", count: 1, color: "#8B5CF6" },
  { name: "Ambient", count: 2, color: "#06B6D4" },
  { name: "Electronic", count: 1, color: "#EF4444" },
  { name: "Classical", count: 1, color: "#F59E0B" },
  { name: "Hip Hop", count: 1, color: "#10B981" },
  { name: "Funk", count: 1, color: "#F97316" },
  { name: "Nature", count: 1, color: "#059669" },
  { name: "Chiptune", count: 1, color: "#8B5A2B" },
  { name: "Jazz", count: 1, color: "#DC2626" },
  { name: "Future Bass", count: 1, color: "#7C3AED" },
  { name: "Acoustic", count: 1, color: "#FBBF24" },
  { name: "Space Ambient", count: 1, color: "#1E40AF" }
];

const recentlyPlayed = [
  {
    trackId: 3,
    playedAt: new Date(Date.now() - 1000 * 60 * 30),
    playCount: 1
  },
  {
    trackId: 1,
    playedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    playCount: 1
  },
  {
    trackId: 9,
    playedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    playCount: 1
  },
  {
    trackId: 6,
    playedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    playCount: 1
  },
  {
    trackId: 11,
    playedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    playCount: 1
  }
];

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const getTrackById = (id) => {
  return tracks.find(track => track.id === id);
};

const getTracksByIds = (ids) => {
  return ids.map(id => getTrackById(id)).filter(Boolean);
};

const getPlaylistById = (id) => {
  return playlists.find(playlist => playlist.id === id);
};

const getPlaylistWithTracks = (id) => {
  const playlist = getPlaylistById(id);
  if (!playlist) return null;
  
  return {
    ...playlist,
    tracks: getTracksByIds(playlist.trackIds)
  };
};

const searchTracks = (query) => {
  const searchTerm = query.toLowerCase();
  return tracks.filter(track => 
    track.title.toLowerCase().includes(searchTerm) ||
    track.artist.toLowerCase().includes(searchTerm) ||
    track.album.toLowerCase().includes(searchTerm) ||
    track.genre.toLowerCase().includes(searchTerm)
  );
};

const getTracksByGenre = (genre) => {
  return tracks.filter(track => track.genre === genre);
};

const shuffleTracks = (trackArray) => {
  const shuffled = [...trackArray];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const getRecommendedTracks = (currentTrack, limit = 5) => {
  if (!currentTrack) return tracks.slice(0, limit);
  
  const sameGenre = tracks.filter(track => 
    track.genre === currentTrack.genre && track.id !== currentTrack.id
  );
  
  const others = tracks.filter(track => 
    track.genre !== currentTrack.genre && track.id !== currentTrack.id
  );
  
  const recommended = [...sameGenre, ...others].slice(0, limit);
  return shuffleTracks(recommended);
};

export {
  tracks,
  playlists,
  genres,
  recentlyPlayed,
  formatDuration,
  getTrackById,
  getTracksByIds,
  getPlaylistById,
  getPlaylistWithTracks,
  searchTracks,
  getTracksByGenre,
  shuffleTracks,
  getRecommendedTracks
};

export default tracks;