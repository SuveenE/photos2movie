"use client";

import { useState } from "react";
import ImageUpload from "../components/imageUpload";
import AudioSelector from "../components/audioSelector";
import VideoGenerator from "../components/videoGenerator";

export default function Home() {
  const [images, setImages] = useState<File[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<string>("");

  return (
    <div className="flex bg-white text-black flex-col items-center justify-items-center min-h-screen p-12  pb-20 mx-auto">
      <p className="text-xl font-bold">Photos to video in seconds.</p>
      <p className="text-gray-600 mt-2">
        Upload images, add music, and create a beautiful photo montage!
      </p>
      <div className="md:grid md:grid-cols-5 gap-4 mt-4 md:min-w-[1000px]">
        <div className="flex flex-col gap-2 md:gap-4 col-span-3">
          <ImageUpload images={images} setImages={setImages} />
          <AudioSelector
            selectedAudio={selectedAudio}
            setSelectedAudio={setSelectedAudio}
          />
        </div>x
        <div className="col-span-2 mt-4 md:mt-0">
          <VideoGenerator images={images} audioTrack={selectedAudio} />
        </div>
      </div>
    </div>
  );
}
