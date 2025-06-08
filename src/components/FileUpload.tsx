import { cn } from "@/lib/utils";
import { UserService } from "@/services/UserService";
import supabase from "@/supabase";
import { Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export interface FileUploadProps {
  userId?: string;
  onUploadSuccess?: (url: string) => void;
}

export const FileUpload = ({ userId, onUploadSuccess }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleImageUpload(e.target.files[0]);
    }
  };

  const resizeImage = (
    file: File,
    maxWidth = 200,
    maxHeight = 200
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      // Create file reader
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          // Calculate new dimensions while maintaining aspect ratio
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          // Create canvas and resize
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Could not get 2d context"));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error("Canvas to Blob conversion failed"));
              return;
            }
            resolve(blob);
          }, file.type);
        };

        img.onerror = () => {
          reject(new Error("Image loading failed"));
        };
      };

      reader.onerror = () => {
        reject(new Error("File reading failed"));
      };
    });
  };

  const handleImageUpload = async (file: File) => {
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    setIsUploading(true);

    try {
      // Resize the image before uploading
      const resizedBlob = await resizeImage(file, 200, 200);

      // Create a new filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId || "profile"}-${Date.now()}.${fileExt}`;

      // Upload the resized image to Supabase Storage
      const { error } = await supabase()
        .storage.from("profile-images")
        .upload(fileName, resizedBlob, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        throw error;
      }

      // Get public URL for the uploaded image
      const { data: urlData } = supabase()
        .storage.from("profile-images")
        .getPublicUrl(fileName);

      if (userId) {
        await UserService.setProfileImageUrl(userId, urlData.publicUrl);
      }

      onUploadSuccess?.(urlData.publicUrl);

      toast.success("Profile image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className={cn(
        "w-full max-w-[200px] h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors",
        isDragging
          ? "border-primary bg-primary/10"
          : "border-muted-foreground/25 hover:border-primary/50",
        isUploading && "opacity-70 cursor-not-allowed"
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() =>
        !isUploading && document.getElementById("fileInput")?.click()
      }
    >
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      {isUploading ? (
        <div className="flex flex-col items-center gap-1 text-sm">
          <div className="animate-spin h-5 w-5 border-2 border-primary rounded-full border-t-transparent"></div>
          <span className="text-xs">Uploading...</span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1 text-sm">
          <Upload className="h-5 w-5 text-muted-foreground" />
          <span className="text-xs">Drag image or click to upload</span>
        </div>
      )}
    </div>
  );
};
