export default {
  common: {},
  home: {
    // Page title
    title: "Registrera dagens steg",

    // Competition field
    competitionLabel: "Välj tävling",
    competitionPlaceholder: "Välj en tävling",
    competitionDescription: "Välj vilken tävling du vill registrera steg för",
    competitionRequired: "Vänligen välj en tävling",

    // Steps field
    stepsLabel: "Antal Steg",
    stepsPlaceholder: "Ange antal steg",
    stepsDescription: "Ange det totala antalet steg för denna dag",
    stepsRequired: "Antal steg krävs",
    stepsPositive: "Steg måste vara ett positivt tal större än noll",
    stepsInteger: "Steg måste vara ett heltal",

    // Date field
    dateLabel: "Datum",
    dateDescription: "Välj datum för din stegräkning",
    dateRequired: "Datum krävs",
    dateFuture: "Datumet kan inte vara i framtiden",

    // Team information
    teamLabel: "Bidrar till lag",
    teamLoading: "Laddar laginformation...",
    teamEmpty: "Inte del av ett lag - ",
    teamJoinLink: "Klicka här för att skapa eller ansluta till ett",
    teamDescription: "Dina steg bidrar också till lagets totala antal",

    // Button
    submitButton: "Spara",

    // Notifications
    notAuthenticated: "Användaren är inte autentiserad. Vänligen logga in.",
    registerFailed: "Misslyckades med att registrera steg",
    registerSuccess: "{steps} steg registrerade! 🎉",
  },
  progress: {},
  team: {},
  leaderboard: {},
  profile: {},
  stats: {},
  navigation: {
    home: "Hem",
    progress: "Framsteg",
    team: "Lag",
    leaderboards: "Topplista",
    profile: "Profil",
    stats: "Statistik",
  },
};
