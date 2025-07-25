export class UserContext {
  private static userId: number | null = null;

  public static setUserId(id: number) {
    this.userId = id;
  }

  public static getUserId(): number {
    if (this.userId === null) throw new Error('No userId set');
    return this.userId;
  }

  public static clear() {
    this.userId = null;
  }
}