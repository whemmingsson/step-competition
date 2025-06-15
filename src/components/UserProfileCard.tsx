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
import { Image as ImageIcon } from "lucide-react";
import { FileUpload } from "./forms/FileUpload";

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
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | undefined>(
    profileImageUrl
  );

  const displayUrl = uploadedImageUrl || profileImageUrl || undefined;

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
              {displayUrl ? (
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-muted mb-2">
                  <img
                    src={displayUrl}
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

            <FileUpload
              userId={userId}
              onUploadSuccess={(url) => setUploadedImageUrl(url)}
            />
          </div>

          {/* Display Name Form */}
          <div className="flex-1">
            <form onSubmit={handleUpdateDisplayName} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display name</Label>
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
