import { Inbox } from "lucide-react";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

interface ImageUploadProps {
  images: File[];
  setImages: (files: File[]) => void;
}

export default function ImageUpload({ images, setImages }: ImageUploadProps) {
  const [error, setError] = useState<string>("");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (images.length + acceptedFiles.length > 50) {
        setError("Maximum 50 images allowed");
        return;
      }
      setImages([...images, ...acceptedFiles]);
      setError("");
    },
    [images, setImages],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
  });

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-3xl">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-6 rounded-lg text-center cursor-pointer
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
      >
        <input {...getInputProps()} />
        <Inbox className="w-8 h-8 text-blue-500 mx-auto" />
        <p>Drag & drop images here, or click to select files</p>
        <p className="text-sm text-gray-500">({images.length}/50 images)</p>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <div className="mt-4 p-4 grid grid-cols-4 max-h-8 gap-4 overflow-y-auto">
        {images.map((file, index) => (
          <div key={index} className="relative">
            <Image
              src={URL.createObjectURL(file)}
              alt={`Upload ${index + 1}`}
              className="w-full h-24 object-cover rounded"
              width={100}
              height={100}
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
