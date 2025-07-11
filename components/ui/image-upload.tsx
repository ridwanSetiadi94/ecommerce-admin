"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
  disabled: boolean;
  value: string[];
  onChange: (urls: string[]) => void;
  onRemove: (url: string) => void;
}

function ImageUpload({
  disabled,
  value,
  onChange,
  onRemove,
}: ImageUploadProps): React.ReactElement | null {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleUpload = (result: any) => {
    const url = result?.info?.secure_url;
    if (!url) return;

    // Safely append to the array without stale state
    if (!value.includes(url)) {
      const updated = [...value, url];
      onChange(updated); // updates react-hook-form field
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="absolute top-2 right-2 z-10">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              src={url}
              alt="Uploaded image"
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{
          multiple: false,
          maxFiles: 1,
          sources: ["local", "url", "camera"],
          clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
        }}
      >
        {({ open, cloudinary }) => {
          function handleClick() {
            const widget = cloudinary?.createUploadWidget(
              {
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
                multiple: true,
              },
              (error: any, result: any) => {
                if (!error && result.event === "success") {
                  handleUpload(result);
                }
              }
            );
            widget?.open();
          }

          return (
            <Button
              type="button"
              disabled={disabled || value.length > 5}
              variant="secondary"
              onClick={handleClick}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              {value.length > 5 ? "Maximum Images Reached" : "Upload Image(s)"}
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}

export default ImageUpload;
