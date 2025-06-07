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

interface UserProfileCardProps {
  displayName: string;
  setDisplayName: (name: string) => void;
  displayNameLoading: boolean;
  isSaving: boolean;
  handleUpdateDisplayName: (e: React.FormEvent) => void;
}

export const UserProfileCard = ({
  displayName,
  setDisplayName,
  displayNameLoading,
  isSaving,
  handleUpdateDisplayName,
}: UserProfileCardProps) => {
  return (
    <Card className="w-full" style={{ background: "#ffffffed" }}>
      <CardHeader>
        <CardTitle className="text-xl font-bold flex gap-x-2">
          Your Profile <DisplayNameBadge />
        </CardTitle>
        <CardDescription>
          Set your display name for the leaderboard
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};
