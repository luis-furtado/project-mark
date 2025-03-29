import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { CollectionMap, getInitialSchema } from './schema-registry';

export class DatabaseService {
  private static instance: Low<CollectionMap>;

  static async getInstance(): Promise<Low<CollectionMap>> {
    if (!this.instance) {
      const file = path.join(__dirname, 'data.json');
      const adapter = new JSONFile<CollectionMap>(file);
      const db = new Low<CollectionMap>(adapter, {} as CollectionMap);

      await db.read();

      const defaults = getInitialSchema();
      db.data ||= {} as CollectionMap;

      for (const key of Object.keys(defaults)) {
        db.data[key] ||= defaults[key];
      }

      await db.write();
      this.instance = db;
    }

    return this.instance;
  }
}