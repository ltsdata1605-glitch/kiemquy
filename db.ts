import Dexie, { type Table } from 'dexie';
import { AuditState } from './types';

export type AuditVersion = AuditState & { id: number };

class CashAuditDB extends Dexie {
  currentState!: Table<AuditState, number>;
  versions!: Table<AuditVersion, number>;

  constructor() {
    super('CashAuditDatabase');
    // Version 1 had 'audits' table
    // FIX: The `version` method is not being correctly inferred from the `Dexie` base class. Casting `this` to `Dexie` resolves the issue.
    (this as Dexie).version(1).stores({
      audits: 'id',
    });
    // Version 2 introduces versioning
    // FIX: The `version` method is not being correctly inferred from the `Dexie` base class. Casting `this` to `Dexie` resolves the issue.
    (this as Dexie).version(2).stores({
      currentState: 'id', // Stores the current working draft, ID will always be 1
      versions: '++id, auditTimestamp', // Stores saved versions with auto-incrementing ID
      audits: null // Remove old table
    }).upgrade(tx => {
      // Migrate the last saved state from 'audits' to 'currentState'
      return tx.table('audits').get(1).then(oldState => {
        if (oldState) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, ...rest } = oldState;
          return tx.table('currentState').add({ ...rest, id: 1 });
        }
      });
    });
  }
}

const db = new CashAuditDB();

const CURRENT_STATE_ID = 1;

export const saveCurrentState = async (state: Omit<AuditState, 'id'>) => {
  try {
    await db.currentState.put({ ...state, id: CURRENT_STATE_ID });
  } catch (error) {
    console.error("Failed to save current state:", error);
  }
};

export const loadCurrentState = async (): Promise<Omit<AuditState, 'id'> | null> => {
  try {
    const savedState = await db.currentState.get(CURRENT_STATE_ID);
    if (savedState) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = savedState;
      return rest;
    }
    return null;
  } catch (error) {
    console.error("Failed to load current state:", error);
    return null;
  }
};

export const saveVersion = async (state: Omit<AuditState, 'id'>) => {
  try {
    // Dexie will auto-increment the 'id' since it's defined as '++id'
    await db.versions.add(state as AuditVersion);
  } catch (error) {
    console.error("Failed to save version:", error);
  }
};

export const loadAllVersions = async (): Promise<AuditVersion[]> => {
  try {
    // Sort by timestamp descending to get newest first
    return await db.versions.orderBy('auditTimestamp').reverse().toArray();
  } catch (error) {
    console.error("Failed to load versions:", error);
    return [];
  }
};

export const loadVersion = async (id: number): Promise<AuditVersion | null> => {
    try {
        const version = await db.versions.get(id);
        return version || null;
    } catch (error) {
        console.error(`Failed to load version ${id}:`, error);
        return null;
    }
};
