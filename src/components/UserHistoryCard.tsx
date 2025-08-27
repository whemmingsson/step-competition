import {useState} from "react";
import {BarChart3, Medal, Table as TableIcon} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import {cn} from "@/lib/utils";
import type {StepsRecord} from "@/types/StepsRecord";
import {UserStepsChart} from "./charts/UserStepsChart";
import {UserStepsTable} from "./UserStepsTable";
import {CircleImage} from "@/components/CircleImage.tsx";

interface UserHistoryCardProps {
    steps: StepsRecord[];
    totalSteps: number;
    avgStepsPerDay?: number; // Optional, can be calculated if needed
    userPositionInLeaderboard?: number;
    loading: boolean;
    error: string | null;
    handleDeleteClick: (record: StepsRecord) => void;
    refetch?: () => Promise<void>; // Optional refetch function
    badgeIcons: string[]; // Array of badge icon URLs or identifiers
}

type ViewMode = "table" | "chart" | "badges";

export const UserHistoryCard = ({
                                    steps,
                                    totalSteps,
                                    avgStepsPerDay = 0, // Default to 0 if not provided
                                    userPositionInLeaderboard = 0, // Default to 0 if not provided
                                    loading,
                                    error,
                                    handleDeleteClick,
                                    refetch, badgeIcons,
                                }: UserHistoryCardProps) => {
    const [viewMode, setViewMode] = useState<ViewMode>("table");

    const select = (value: number) => {
        if (loading || (!value && value !== 0)) return "Loading...";
        try {
            return value.toLocaleString();
        } catch (error) {
            console.error("Error accessing statistics data:", error);
            return "N/A";
        }
    };

    // Grouped steps by date
    const groupedSteps = steps.reduce((acc, step) => {
        const date = new Date(step.date).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(step);
        return acc;
    }, {} as Record<string, StepsRecord[]>);

    return (
        <Card className="w-full" style={{background: "#ffffffed"}}>
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                    My progress
                </CardTitle>
                <CardDescription className="text-center">
                    Track your progress over time. View your step history in a table or
                    chart format.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-3 gap-4 mt-2 mb-6 text-center">
                    <div className="bg-background rounded-md p-4">
                        <p className="text-sm text-muted-foreground">Total steps</p>
                        <p className="text-2xl font-bold">{select(totalSteps)}</p>
                    </div>
                    <div className="bg-background rounded-md p-4">
                        <p className="text-sm text-muted-foreground">Avg. steps per day</p>
                        <p className="text-2xl font-bold">{select(avgStepsPerDay)}</p>
                    </div>
                    <div className="bg-background rounded-md p-4">
                        <p className="text-sm text-muted-foreground">Pos. in leaderboard</p>
                        <p className="text-2xl font-bold">{userPositionInLeaderboard}</p>
                    </div>
                </div>

                <div className="flex border-b mb-4">
                    <button
                        onClick={() => setViewMode("table")}
                        className={cn(
                            "px-4 py-2 font-medium text-sm flex items-center gap-1",
                            viewMode === "table"
                                ? "border-b-2 border-primary text-primary"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <TableIcon className="h-4 w-4"/>
                        Table
                    </button>
                    <button
                        onClick={() => setViewMode("chart")}
                        className={cn(
                            "px-4 py-2 font-medium text-sm flex items-center gap-1",
                            viewMode === "chart"
                                ? "border-b-2 border-primary text-primary"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <BarChart3 className="h-4 w-4"/>
                        Chart
                    </button>
                    <button
                        onClick={() => setViewMode("badges")}
                        className={cn(
                            "px-4 py-2 font-medium text-sm flex items-center gap-1",
                            viewMode === "badges"
                                ? "border-b-2 border-primary text-primary"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Medal className="h-4 w-4"/>
                        Badges
                    </button>
                </div>


                {error ? (
                    <div className="text-center text-red-500 py-4">{error}</div>
                ) : steps.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No step data available. Start recording your steps!
                    </div>
                ) : (
                    <>
                        {viewMode === "table" && (<UserStepsTable
                            groupedSteps={groupedSteps}
                            handleDeleteClick={handleDeleteClick}
                            refetch={refetch}
                        />)}
                        {viewMode === "chart" && (<div
                            className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-4 text-center">
                            <UserStepsChart stepsData={steps}/>
                        </div>)}
                        {viewMode === "badges" && (<>
                            {badgeIcons?.map((icon) => (
                                <CircleImage
                                    size={32}
                                    name=""
                                    url={icon}
                                />
                            ))}</>)}

                    </>
                )}
            </CardContent>
        </Card>
    );
};
