import { Inbox } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";

interface ImageUploadProps {
  images: File[];
  setImages: (files: File[]) => void;
}

function SortableImage({
  url,
  index,
  onRemove,
}: {
  url: string;
  index: number;
  onRemove: (index: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: url,
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className="relative">
        {url ? (
          <Image
            src={url}
            alt={`Upload ${index + 1}`}
            className="w-full h-24 object-cover rounded"
            width={100}
            height={100}
          />
        ) : (
          <div className="w-full h-24 bg-gray-200 rounded"></div>
        )}
        <button
          onClick={() => onRemove(index)}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default function ImageUpload({ images, setImages }: ImageUploadProps) {
  const [error, setError] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<Map<File, string>>(new Map());

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = images.findIndex(
        (file) => imageUrls.get(file) === active.id,
      );
      const newIndex = images.findIndex(
        (file) => imageUrls.get(file) === over?.id,
      );

      setImages(arrayMove(images, oldIndex, newIndex));
    }
    console.log("images", images);
  }

  useEffect(() => {
    const newImageUrls = new Map(imageUrls);

    images.forEach((file) => {
      if (!newImageUrls.has(file)) {
        newImageUrls.set(file, URL.createObjectURL(file));
      }
    });

    for (const [file, url] of imageUrls.entries()) {
      if (!images.includes(file)) {
        URL.revokeObjectURL(url);
        newImageUrls.delete(file);
      }
    }

    setImageUrls(newImageUrls);

    return () => {
      newImageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

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
        <Inbox className="w-8 h-8 text-indigo-600 mx-auto" />
        <p>Drag & drop images here, or click to select files</p>
        <p className="text-sm text-gray-500">({images.length}/50 images)</p>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <div className="mt-4 p-4 grid grid-cols-4 max-h-72 gap-4 overflow-y-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map((file) => imageUrls.get(file) || "")}
          >
            {images.map((file, index) => (
              <SortableImage
                key={`${file.name}-${file.size}-${index}`}
                url={imageUrls.get(file) || ""}
                index={index}
                onRemove={removeImage}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
