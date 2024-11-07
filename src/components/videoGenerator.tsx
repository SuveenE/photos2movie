import { useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import Image from "next/image";
import { DownloadIcon } from "lucide-react";

interface VideoGeneratorProps {
  images: File[];
  audioTrack: string;
}

export default function VideoGenerator({
  images,
  audioTrack,
}: VideoGeneratorProps) {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const generateVideo = async () => {
    setGenerating(true);
    setProgress(0);

    try {
      const ffmpeg = new FFmpeg();
      await ffmpeg.load();
      setProgress(10);

      for (let i = 0; i < images.length; i++) {
        const imageData = await fetchFile(images[i]);
        await ffmpeg.writeFile(`image${i}.jpg`, imageData);
        setProgress(10 + (i / images.length) * 30);
      }

      const concat = images
        .map((_, i) => `file 'image${i}.jpg'\nduration 1`)
        .join("\n");
      await ffmpeg.writeFile("concat.txt", concat);
      setProgress(45); 

      const audioResponse = await fetch(audioTrack);
      const audioData = await audioResponse.arrayBuffer();
      await ffmpeg.writeFile("audio.mp3", new Uint8Array(audioData));
      setProgress(55);

      await ffmpeg.exec([
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        "concat.txt",
        "-i",
        "audio.mp3",
        "-c:v",
        "libx264",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-pix_fmt",
        "yuv420p",
        "-vf",
        "scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2",
        "-shortest",
        "-y",
        "output.mp4",
      ]);
      setProgress(85);

      const data = await ffmpeg.readFile("output.mp4");
      const blob = new Blob([data], { type: "video/mp4" });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setProgress(100);
    } catch (error) {
      console.error("Error generating video:", error);
      alert("Error generating video. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (videoUrl) {
      const a = document.createElement("a");
      a.href = videoUrl;
      a.download = "montage.mp4";
      a.click();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4 items-center">
        <button
          onClick={generateVideo}
          disabled={images.length === 0 || !audioTrack || generating}
          className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-4 mb-4 md:mb-0 rounded disabled:opacity-50 disabled:cursor-not-allowed w-full"
        >
          {generating ? "Generating..." : "Create Video"}
        </button>
        {videoUrl && progress === 100 ? (
          <DownloadIcon className="w-[10%]" onClick={handleDownload} />
        ) : null}
      </div>
      <div className="flex flex-col gap-4 border-2 border-gray-300 p-4 rounded-md min-h-128">
        {videoUrl && progress === 100 ? (
          <div className="mt-4 space-y-4 ">
            <video
              controls
              className="w-full rounded-lg w-72 md:h-[560px] "
              src={videoUrl}
            />
          </div>
        ) : (
          <div className="relative md:h-[560px] mx-auto rounded-3xl border-4 border-gray-300 w-72 p-4">
            <Image
              src="/video.png"
              alt="phone"
              width={400}
              height={800}
              className="mt-10"
            />
            {generating ? (
              <p className="text-gray-400 text-center mt-2">
                We are generating your video. {Math.floor(progress)}% complete.
              </p>
            ) : (
              <p className="text-gray-400 text-center mt-2">
                Your video will appear here
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
