import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'stepkind_bookmarks';

export function useBookmarks() {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const refresh = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as string[]) : [];
      setBookmarkedIds(parsed);
    } catch (error) {
      setBookmarkedIds([]);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarkedIds((prev) => {
      const nextSet = new Set(prev);
      if (nextSet.has(id)) {
        nextSet.delete(id);
      } else {
        nextSet.add(id);
      }
      const next = Array.from(nextSet);
      void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isBookmarked = useCallback(
    (id: string) => bookmarkedIds.includes(id),
    [bookmarkedIds],
  );

  return {
    bookmarkedIds,
    isBookmarked,
    toggleBookmark,
    refresh,
  };
}
