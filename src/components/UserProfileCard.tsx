import { useState } from "react";
import { DisplayNameBadge } from "./DisplayNameBadge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Upload, Image as ImageIcon } from "lucide-react";
import supabase from "@/supabase";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { UserService } from "@/services/UserService";

interface UserProfileCardProps {
  displayName: string;
  setDisplayName: (name: string) => void;
  displayNameLoading: boolean;
  isSaving: boolean;
  handleUpdateDisplayName: (e: React.FormEvent) => void;
  userId?: string;
  profileImageUrl?: string;
}

export const UserProfileCard = ({
  displayName,
  setDisplayName,
  displayNameLoading,
  isSaving,
  handleUpdateDisplayName,
  userId,
  profileImageUrl,
}: UserProfileCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | undefined>(
    profileImageUrl
  );

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
      // Generate a unique file name
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId || "profile"}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to Supabase Storage
      const { error } = await supabase()
        .storage.from("profile-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        throw error;
      }

      // Get public URL for the uploaded image
      const { data: urlData } = supabase()
        .storage.from("profile-images")
        .getPublicUrl(filePath);

      setUploadedImageUrl(urlData.publicUrl);

      if (userId) {
        await UserService.setProfileImageUrl(userId, urlData.publicUrl);
      }

      toast.success("Profile image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full" style={{ background: "#ffffffed" }}>
      <CardHeader>
        <CardTitle className="text-xl font-bold flex gap-x-2">
          Your Profile <DisplayNameBadge />
        </CardTitle>
        <CardDescription>
          Set your display name and profile image
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center">
            <div className="mb-2 text-center">
              <p className="text-sm text-muted-foreground mb-1">
                Profile Image
              </p>
              {uploadedImageUrl ? (
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-muted mb-2">
                  <img
                    src={uploadedImageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mb-2">
                  <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                </div>
              )}
            </div>

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
          </div>

          {/* Display Name Form */}
          <div className="flex-1">
            <form onSubmit={handleUpdateDisplayName} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  className="bg-white"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your preferred display name"
                  disabled={displayNameLoading || isSaving}
                />
              </div>
              <Button
                type="submit"
                disabled={displayNameLoading || isSaving || !displayName.trim()}
              >
                {isSaving ? "Saving..." : "Save Display Name"}
              </Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
