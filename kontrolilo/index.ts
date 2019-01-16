export class Kontrolilo {
  constructor(private vortaro: Map<string, string>) {}

  validas(novaVorto: string): boolean {
    for (const vorto of this.vortaro.keys()) {
      if (
        vorto.startsWith(novaVorto)
        || novaVorto.startsWith(vorto)
        || vorto.endsWith(novaVorto)
        || novaVorto.endsWith(vorto)) {
        return false;
      }
    }
    return true;
  }
}