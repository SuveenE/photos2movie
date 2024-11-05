import { useState } from "react";
import { PauseCircleIcon, PlayCircleIcon } from "lucide-react";

interface AudioSelectorProps {
  selectedAudio: string;
  setSelectedAudio: (audio: string) => void;
}

const audioTracks = [
  { id: "evergeen", name: "Evergreen", file: "/audio/evergreen.mp3" },
];

export default function AudioSelector({
  selectedAudio,
  setSelectedAudio,
}: AudioSelectorProps) {
  // Add state to track which audio is currently playing
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  // Handle play/pause
  const togglePlay = (trackFile: string) => {
    const audio = document.getElementById(trackFile) as HTMLAudioElement;

    if (playingAudio === trackFile) {
      audio.pause();
      setPlayingAudio(null);
    } else {
      // Pause any currently playing audio
      if (playingAudio) {
        const currentAudio = document.getElementById(
          playingAudio,
        ) as HTMLAudioElement;
        currentAudio.pause();
      }
      audio.play();
      setPlayingAudio(trackFile);
    }
  };

  return (
    <div className="w-full max-w-3xl">
      <h3 className="text-md font-semibold mb-4">Select Background Music:</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {audioTracks.map((track) => (
          <div
            key={track.id}
            className={`flex flex-row gap-2 border w-[130px] mx-auto rounded-lg p-3 ${
              selectedAudio === track.file
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <button
              onClick={() => setSelectedAudio(track.file)}
              className={`rounded-lg `}
            >
              {track.name}
            </button>
            <button
              onClick={() => togglePlay(track.file)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {playingAudio === track.file ? (
                <PauseCircleIcon />
              ) : (
                <PlayCircleIcon />
              )}
            </button>
            <audio id={track.file} src={track.file} />
          </div>
        ))}
      </div>
    </div>
  );
}
