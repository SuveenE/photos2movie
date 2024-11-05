interface AudioSelectorProps {
    selectedAudio: string;
    setSelectedAudio: (audio: string) => void;
  }
  
  const audioTracks = [
    { id: 'happy', name: 'Happy Acoustic', file: '/audio/evergreen.mp3' },
    { id: 'relaxing', name: 'Relaxing Piano', file: '/audio/evergreen.mp3' },
    { id: 'upbeat', name: 'Upbeat Pop', file: '/audio/evergreen.mp3' },
  ];
  
  export default function AudioSelector({ selectedAudio, setSelectedAudio }: AudioSelectorProps) {
    return (
      <div className="w-full max-w-3xl">
        <h3 className="text-xl font-semibold mb-4">Select Background Music</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {audioTracks.map((track) => (
            <button
              key={track.id}
              onClick={() => setSelectedAudio(track.file)}
              className={`p-4 rounded-lg border ${
                selectedAudio === track.file
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              {track.name}
            </button>
          ))}
        </div>
      </div>
    );
  }