import { useState } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

interface VideoGeneratorProps {
  images: File[];
  audioTrack: string;
}

export default function VideoGenerator({ images, audioTrack }: VideoGeneratorProps) {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const generateVideo = async () => {
    setGenerating(true);
    setProgress(0);

    try {
        const ffmpeg = new FFmpeg();
        await ffmpeg.load();
        setProgress(10); // Loading FFmpeg
  
        // Load images
        for (let i = 0; i < images.length; i++) {
          const imageData = await fetchFile(images[i]);
          await ffmpeg.writeFile(`image${i}.jpg`, imageData);
          setProgress(10 + (i / images.length) * 30); // Images take 30% of progress
        }
  
        // Create concat file
        const concat = images
          .map((_, i) => `file 'image${i}.jpg'\nduration 1`)
          .join('\n');
        await ffmpeg.writeFile('concat.txt', concat);
        setProgress(45); // Concat file created
  
        // Load audio
        const audioResponse = await fetch(audioTrack);
        const audioData = await audioResponse.arrayBuffer();
        await ffmpeg.writeFile('audio.mp3', new Uint8Array(audioData));
        setProgress(55); 

      // Generate video
      await ffmpeg.exec([
        '-f', 'concat',
        '-safe', '0',
        '-i', 'concat.txt',
        '-i', 'audio.mp3',
        '-c:v', 'libx264',  // Specify video codec
        '-c:a', 'aac',      // Specify audio codec
        '-b:a', '192k',     // Audio bitrate
        '-pix_fmt', 'yuv420p',
        '-vf', 'scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2',
        '-shortest',
        '-y',               // Overwrite output if exists
        'output.mp4'
      ]);
      setProgress(85); // Video generated

      // Get the output file
      const data = await ffmpeg.readFile('output.mp4');
      const blob = new Blob([data], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setProgress(100); // Complete

    } catch (error) {
      console.error('Error generating video:', error);
      alert('Error generating video. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (videoUrl) {
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = 'montage.mp4';
      a.click();
    }
  };

  return (
    <div className="w-full max-w-3xl">
      <button
        onClick={generateVideo}
        disabled={generating}
        className="w-fit bg-blue-500 text-black py-3 rounded-lg disabled:bg-gray-300 p-4 mb-4"
      >
        {generating ? `Generating... ${progress.toFixed(0)}%` : 'Generate Video'}
      </button>

      {videoUrl && (
        <div className="mt-4 space-y-4">
          <video 
            controls 
            className="w-full rounded-lg w-72"
            src={videoUrl}
          />
          <button
            onClick={handleDownload}
            className="w-fit bg-green-500 text-black py-3 rounded-lg p-4"
          >
            Download Video
          </button>
        </div>
      )}
    </div>
  );
}