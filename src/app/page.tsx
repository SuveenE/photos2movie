"use client";

import { useState } from "react";
import ImageUpload from "../components/imageUpload";
import AudioSelector from "../components/audioSelector";
import VideoGenerator from "../components/videoGenerator";
import Image from "next/image";

export default function Home() {
  const [images, setImages] = useState<File[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<string>("");
  const [startGeneration, setStartGeneration] = useState<boolean>(false);
  const [triggerGeneration, setTriggerGeneration] = useState<boolean>(false);

  const handleCreateVideo = () => {
    setStartGeneration(true);
    setTriggerGeneration(true);
  };

  return (
    <div className="flex bg-white text-black flex-col items-center justify-items-center min-h-screen p-12  pb-20 mx-auto">
      <p className="text-xl font-bold">Create Your Photo Montage</p>
      <p className="text-gray-600 mt-2">
        Upload up to 50 images to create a video montage!
      </p>
      <div className="grid grid-cols-5 gap-4 mt-4 md:min-w-[1000px]">
        <div className="flex flex-col gap-4 col-span-3">
          <ImageUpload images={images} setImages={setImages} />
          <AudioSelector
            selectedAudio={selectedAudio}
            setSelectedAudio={setSelectedAudio}
          />

          <button
            onClick={handleCreateVideo}
            disabled={images.length === 0 || !selectedAudio}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Video
          </button>
        </div>
        <div className="col-span-2">
          <div className="flex flex-col gap-4 border-2 border-gray-300 p-4 rounded-md min-h-128">
            {startGeneration ? (
              <VideoGenerator
                images={images}
                audioTrack={selectedAudio}
                triggerGeneration={triggerGeneration}
                setTriggerGeneration={setTriggerGeneration}
              />
            ) : (
              <div className="relative md:h-[560px] mx-auto rounded-3xl border-4 border-gray-300 w-72 p-4">
                <Image
                  src="/video.png"
                  alt="phone"
                  width={400}
                  height={800}
                  className="mt-10"
                />
                <p className="text-gray-400 text-center">
                  Your video will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
