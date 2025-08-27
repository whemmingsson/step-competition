import {useUser} from "@/context/user/UserContext.tsx";
import type {AppUser} from "@/types/User.ts";
import {CircleImage} from "@/components/CircleImage.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserListProps{
    members?: AppUser[];
}

export const UserList = ({
    members
}: UserListProps) => {
    const userContext = useUser();

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Team Members</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                    {members?.map((member) => (
                        <div
                            key={member.id}
                            className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                            <CircleImage
                                name={member.displayName ?? ""}
                                url={member.profileImageUrl}
                            />
                            <div className="flex-1 min-w-0">
                                <span className="font-medium text-gray-900">
                                    {member.displayName}
                                </span>
                            </div>
                            {member.id === userContext.user?.id && (
                                <Badge variant="secondary" className="text-xs">
                                    You
                                </Badge>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}