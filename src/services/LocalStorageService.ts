export class LocalStorageService {
  static getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  static setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  static getSelectedComptetionId(): number | null {
    const strValue = this.getItem("selectedCompetition");

    if (!strValue) return null;

    const value = parseInt(strValue, 10);
    return isNaN(value) ? null : value;
  }
}
