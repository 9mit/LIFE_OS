import Dexie, { Table } from "dexie";
import {
  LifeOSChatMessage,
  LifeOSDataRecord,
  LifeOSSource,
} from "../types/data";

// FIX: Switched from a class-based approach to a direct instance to resolve type inheritance issues.
// The subclass pattern was causing errors where Dexie methods were not found on the instance.
export const db = new Dexie("lifeos-db") as Dexie & {
  sources: Table<LifeOSSource, string>;
  records: Table<LifeOSDataRecord, string>;
  chats: Table<LifeOSChatMessage, string>;
};

db.version(1).stores({
  sources: "id, type, addedAt",
  records: "id, sourceId, timestamp",
  chats: "id, createdAt",
});
