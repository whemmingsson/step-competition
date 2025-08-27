import { cn } from "@/lib/utils";

interface GoalProgressBarProps {
  goal: number;
  goalUnit: "steps" | "meters";
  currentSteps: number;
  stepLength?: number; // Required when goalUnit is "meters"
  className?: string;
}

export const GoalProgressBar = ({
  goal,
  goalUnit,
  currentSteps,
  stepLength = 0.75,
  className,
}: GoalProgressBarProps) => {
  // Convert current steps to the goal unit
  const getCurrentValue = () => {
    if (goalUnit === "steps") {
      return currentSteps;
    } else {
      // Convert steps to meters using step length
      return currentSteps * stepLength;
    }
  };

  const currentValue = getCurrentValue();
  const progressPercentage = Math.min((currentValue / goal) * 100, 100);
  const isCompleted = currentValue >= goal;

  // Format numbers for display
  const formatValue = (value: number, unit: string) => {
    if (unit === "steps") {
      return value.toLocaleString();
    } else {
      return value.toFixed(1);
    }
  };

  return (
    <div className={cn("flex flex-col items-center space-y-4", className)}>
      {/* Goal Label */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800">
          {goalUnit === "steps" ? "Daily Steps Goal" : "Daily Distance Goal"}
        </h3>
        <p className="text-sm text-gray-600">
          {formatValue(goal, goalUnit)} {goalUnit}
        </p>
      </div>

      {/* Progress Bar Container */}
      <div className="relative w-full max-w-md">
        {/* Progress Bar */}
        <div className="relative h-8 bg-gray-200 rounded-md border-2 border-gray-300 overflow-hidden shadow-inner">
          {/* Fill */}
          <div
            className={cn(
              "absolute left-0 top-0 bottom-0 rounded-sm transition-all duration-500 ease-out",
              isCompleted
                ? "bg-gradient-to-r from-green-500 to-green-400"
                : "bg-gradient-to-r from-blue-500 to-blue-400"
            )}
            style={{
              width: `${progressPercentage}%`,
            }}
          />

          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent rounded-sm" />

          {/* Percentage Label - Inside the progress bar */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white drop-shadow-md">
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>
      </div>

      {/* Current Progress */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-2xl font-bold text-gray-800">
            {formatValue(currentValue, goalUnit)}
          </span>
          <span className="text-sm text-gray-600">
            / {formatValue(goal, goalUnit)}
          </span>
        </div>
        <p className="text-xs text-gray-500 uppercase tracking-wider">
          {goalUnit} {isCompleted ? "- Goal Completed! 🎉" : ""}
        </p>
      </div>

      {/* Status Message */}
      {!isCompleted && (
        <div className="text-center text-sm text-gray-600">
          <p>
            {formatValue(goal - currentValue, goalUnit)} {goalUnit} remaining
          </p>
          {goalUnit === "meters" && (
            <p className="text-xs text-gray-500 mt-1">
              ≈ {Math.ceil((goal - currentValue) / stepLength).toLocaleString()}{" "}
              steps to go
            </p>
          )}
        </div>
      )}

      {isCompleted && (
        <div className="text-center">
          <p className="text-green-600 font-medium">🎯 Goal Achieved!</p>
          <p className="text-xs text-gray-500">
            You exceeded your goal by{" "}
            {formatValue(currentValue - goal, goalUnit)} {goalUnit}
          </p>
        </div>
      )}
    </div>
  );
};

// Example usage component for testing
export const GoalProgressBarExample = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Steps Goal - Not Completed */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <GoalProgressBar goal={10000} goalUnit="steps" currentSteps={6500} />
        </div>

        {/* Steps Goal - Completed */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <GoalProgressBar goal={8000} goalUnit="steps" currentSteps={8500} />
        </div>

        {/* Meters Goal */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <GoalProgressBar
            goal={5000}
            goalUnit="meters"
            currentSteps={4000}
            stepLength={0.75}
          />
        </div>
      </div>
    </div>
  );
};
