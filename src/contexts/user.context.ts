import { AsyncLocalStorage } from 'node:async_hooks';

const storage = new AsyncLocalStorage<{ userId: number }>();

export class UserContext {
  public static run(userId: number, callback: () => void) {
    storage.run({ userId }, callback);
  }

  public static getUserId(): number {
    const store = storage.getStore();
    if (!store) throw new Error('No user context found');
    const userId = store.userId;
    console.log(userId);
    return userId;
  }
}