import { useState } from "react";
import { PauseCircleIcon, PlayCircleIcon, Music } from "lucide-react";
import { audioTracks } from "../utils/audio";

interface AudioSelectorProps {
  selectedAudio: string;
  setSelectedAudio: (audio: string) => void;
}

export default function AudioSelector({
  selectedAudio,
  setSelectedAudio,
}: AudioSelectorProps) {
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const togglePlay = (trackFile: string) => {
    const audio = document.getElementById(trackFile) as HTMLAudioElement;

    if (playingAudio === trackFile) {
      audio.pause();
      setPlayingAudio(null);
    } else {
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
      <h3 className="flex flex-row gap-4 text-md font-semibold mb-4">
        <span className="text-indigo-600">
          <Music />
        </span>{" "}
        Select Background Music:
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {audioTracks.map((track) => (
          <div
            key={track.id}
            className={`flex flex-row  gap-2 border w-full mx-auto rounded-lg p-3 ${
              selectedAudio === track.file
                ? "border-2 border-indigo-600 bg-indigo-50"
                : "border-gray-200"
            }`}
          >
            <button
              onClick={() => setSelectedAudio(track.file)}
              className={`rounded-lg flex-auto`}
            >
              {track.name}
            </button>
            <button
              onClick={() => togglePlay(track.file)}
              className="text-sm text-indigo-600 hover:text-indigo-800 w-max"
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
