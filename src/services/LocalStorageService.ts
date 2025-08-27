export class LocalStorageService {
  static getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  static setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  static getSelectedCompetitionId(): number | null {
    const strValue = this.getItem("selectedCompetition");

    if (!strValue) return null;

    const value = parseInt(strValue, 10);
    return isNaN(value) ? null : value;
  }

  static setSelectedCompetitionId(id: number): void {
    this.setItem("selectedCompetition", id.toString());
  }

  static setCompetitionMode(mode: "public" | "invite-only"): void {
    this.setItem("competitionMode", mode);
  }

  static getCompetitionMode(): "public" | "invite-only" | null {
    const mode = this.getItem("competitionMode");
    if (mode === "public" || mode === "invite-only") {
      return mode;
    }
    return null;
  }

  static setInviteKey(inviteKey: string) {
    this.setItem("inviteKey", inviteKey);
  }

  static getInviteKey(): string | null {
    return this.getItem("inviteKey");
  }

  static clear(): void {
    localStorage.clear();
  }
}
