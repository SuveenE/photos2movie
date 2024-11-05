"use client"

import { useState } from "react";
import ImageUpload from "../components/imageUpload";
import AudioSelector from "../components/audioSelector";
import VideoGenerator from "../components/videoGenerator";


export default function Home() {
  const [images, setImages] = useState<File[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<string>("");
  const [startGeneration, setStartGeneration] = useState<boolean>(false);

  return (
    <div className="flex bg-white text-black flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 mx-auto">
      <h1 className="text-3xl font-bold">Create Your Photo Montage</h1>
      <p className="text-gray-600">Upload up to 50 images to create a video montage!</p>
      <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-4 w-max">
      <ImageUpload images={images} setImages={setImages} />
      <AudioSelector selectedAudio={selectedAudio} setSelectedAudio={setSelectedAudio} />
      
      <button 
        onClick={() => setStartGeneration(true)}
        disabled={images.length === 0 || !selectedAudio}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Create Video
      </button>
      </div>
      <div>
        <div className="flex flex-col gap-4 border-2 border-gray-300 p-4 rounded-md min-h-128">
        {startGeneration ? (
            <VideoGenerator images={images} audioTrack={selectedAudio} />
          ) : (
            <div className="relative h-128 mx-auto bg-gray-100 rounded-3xl border-4 border-gray-300 w-72">
              
            </div>
          )}
      </div>
      </div>
      </div>
    </div>
  );
}