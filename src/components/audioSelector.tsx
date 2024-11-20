"use client";

import { useState } from "react";
import { PauseCircleIcon, PlayCircleIcon, Music, Upload } from "lucide-react";
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
  const [customAudio, setCustomAudio] = useState<string | null>(null);

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "audio/mpeg") {
      const url = URL.createObjectURL(file);
      setCustomAudio(url);
      setSelectedAudio(url);
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
        <div
          className={`flex flex-row gap-2 border w-full mx-auto rounded-lg bg-slate-200 p-3 cursor-pointer ${
            customAudio && selectedAudio === customAudio
              ? "border-2 border-indigo-600 bg-indigo-50"
              : "border-gray-200"
          }`}
        >
          <label className="flex flex-row gap-2 items-center cursor-pointer mx-auto ">
            <input
              type="file"
              accept="audio/mpeg"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Upload className="w-4 h-4 " />
            {customAudio ? "Custom Audio" : "Upload MP3"}
          </label>
          {customAudio && (
            <>
              <button
                onClick={() => togglePlay(customAudio)}
                className="text-sm text-indigo-600 hover:text-indigo-800 w-max"
              >
                {playingAudio === customAudio ? (
                  <PauseCircleIcon />
                ) : (
                  <PlayCircleIcon />
                )}
              </button>
              <audio id={customAudio} src={customAudio} />
            </>
          )}
        </div>
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
