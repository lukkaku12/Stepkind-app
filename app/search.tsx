import React, { useEffect, useMemo, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { tutorials } from '@/data/tutorials';
import { useBookmarks } from '@/components/useBookmarks';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { showAll } = useLocalSearchParams<{ showAll?: string }>();
  const shouldShowAll = showAll === '1';

  useEffect(() => {
    if (!query.trim()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(timer);
  }, [query]);

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return shouldShowAll ? tutorials : [];
    return tutorials.filter((tutorial) =>
      `${tutorial.title} ${tutorial.focus}`.toLowerCase().includes(trimmed),
    );
  }, [query, shouldShowAll]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
      </View>

      <View style={styles.searchWrap}>
        <FontAwesome name="search" size={16} color="#8A5B49" />
        <TextInput
          autoFocus
          placeholder="Search for a tutorial"
          placeholderTextColor="#B98B78"
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!query.trim() && !shouldShowAll && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Type what you want to learn</Text>
            <Text style={styles.emptySubtitle}>Try "prioritize", "email", or "morning routine".</Text>
          </View>
        )}

        {loading && (
          <View style={styles.skeletonList}>
            {[0, 1, 2].map((item) => (
              <View key={item} style={styles.skeletonCard} />
            ))}
          </View>
        )}

        {!loading && (query.trim() || shouldShowAll) && (
          <View style={styles.results}>
            <Text style={styles.resultsCount}>{results.length} tutorials</Text>
            {results.map((tutorial) => (
              <Pressable
                key={tutorial.id}
                style={[styles.resultCard, { backgroundColor: tutorial.color }]}
                onPress={() => router.push(`/tutorial/${tutorial.id}`)}>
                <View style={styles.resultTop}>
                  <Text style={styles.resultMinutes}>{tutorial.minutes} min</Text>
                  <View style={styles.resultRight}>
                    <Text style={styles.resultFocus}>{tutorial.focus}</Text>
                    <Pressable
                      hitSlop={10}
                      style={styles.bookmarkButton}
                      onPress={(event) => {
                        event.stopPropagation?.();
                        toggleBookmark(tutorial.id);
                      }}>
                      <FontAwesome
                        name={isBookmarked(tutorial.id) ? 'bookmark' : 'bookmark-o'}
                        size={14}
                        color="#1B120C"
                      />
                    </Pressable>
                  </View>
                </View>
                <Text style={styles.resultTitle}>{tutorial.title}</Text>
                <Text style={styles.resultSummary}>{tutorial.summary}</Text>
              </Pressable>
            ))}
            {results.length === 0 && (
              <View style={styles.emptyResults}>
                <Text style={styles.emptyTitle}>No matches yet</Text>
                <Text style={styles.emptySubtitle}>Try a different word or phrase.</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF8F3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1B120C',
  },
  cancel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F05A28',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1E8',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: '#F5D2C2',
    marginHorizontal: 20,
    marginTop: 16,
  },
  searchInput: {
    flex: 1,
    color: '#1B120C',
    fontSize: 15,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyState: {
    marginTop: 32,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B120C',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#7A4A38',
  },
  skeletonList: {
    gap: 12,
    marginTop: 24,
  },
  skeletonCard: {
    height: 92,
    borderRadius: 18,
    backgroundColor: '#FDE8DD',
    opacity: 0.6,
  },
  results: {
    gap: 12,
    marginTop: 20,
  },
  emptyResults: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFF1E8',
    gap: 6,
  },
  resultsCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7A4A38',
  },
  resultCard: {
    padding: 16,
    borderRadius: 18,
    gap: 8,
  },
  resultTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resultMinutes: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1B120C',
  },
  resultFocus: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7A4A38',
  },
  bookmarkButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFF8F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1B120C',
  },
  resultSummary: {
    fontSize: 12,
    lineHeight: 18,
    color: '#7A4A38',
  },
});
