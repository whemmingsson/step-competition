export interface CumulativeSteps {
  steps: number; // Total steps for the day
  date: string; // Date of the record
}

export interface Statistics {
  averageStepsPerTeam: number | null; // Average steps per team, can be null if no teams
  numberOfTeams: number;
  totalSteps: number; // Total number of steps
  averagePerDay: number; // Average steps per day
  averagePerMember: number; // Average steps per member
  averagePerDayAndMember: number; // Average steps per day and per member
  cumilativeSteps: CumulativeSteps[];
}
