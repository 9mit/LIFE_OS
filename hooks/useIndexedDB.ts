
import { useCallback } from "react";
import { nanoid } from "nanoid";
import { db } from "../storage/db";
import {
  LifeOSChatMessage,
  LifeOSDataRecord,
  LifeOSSource,
} from "../types/data";

export function useIndexedDB() {
  const addSource = useCallback(
    async (
      name: string,
      type: LifeOSSource["type"],
      description?: string
    ): Promise<LifeOSSource> => {
      const source: LifeOSSource = {
        id: nanoid(),
        name,
        type,
        description,
        addedAt: Date.now(),
      };
      await db.sources.put(source);
      return source;
    },
    []
  );

  const addRecords = useCallback(async (records: LifeOSDataRecord[]) => {
    if (!records.length) return records;
    await db.records.bulkPut(records);
    return records;
  }, []);

  const getAllRecords = useCallback(async () => {
    return db.records.toArray();
  }, []);

  const getAllSources = useCallback(async () => {
    return db.sources.toArray();
  }, []);

  const clearAll = useCallback(async () => {
    await db.transaction("rw", [db.sources, db.records, db.chats], async () => {
      await db.sources.clear();
      await db.records.clear();
      await db.chats.clear();
    });
  }, []);

  const addChatMessage = useCallback(async (message: LifeOSChatMessage) => {
    await db.chats.add(message);
  }, []);

  const getChatHistory = useCallback(async () => {
    return db.chats.orderBy("createdAt").toArray();
  }, []);

  const resetChatHistory = useCallback(async () => {
    await db.chats.clear();
  }, []);

  return {
    addSource,
    addRecords,
    getAllRecords,
    getAllSources,
    clearAll,
    addChatMessage,
    getChatHistory,
    resetChatHistory,
  };
}
