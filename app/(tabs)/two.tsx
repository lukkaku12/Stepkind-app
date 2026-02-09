import React, { useCallback, useMemo } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { tutorials } from '@/data/tutorials';
import { useBookmarks } from '@/components/useBookmarks';
import { router } from 'expo-router';

export default function TabTwoScreen() {
  const { bookmarkedIds, toggleBookmark, refresh } = useBookmarks();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const savedTutorials = useMemo(
    () => tutorials.filter((tutorial) => bookmarkedIds.includes(tutorial.id)),
    [bookmarkedIds],
  );

  if (savedTutorials.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.iconCircle}>
            <FontAwesome name="bookmark" size={28} color="#FFF8F3" />
          </View>
          <Text style={styles.title}>No saved tutorials yet</Text>
          <Text style={styles.subtitle}>
            When you find something useful, save it here to come back quickly.
          </Text>
          <View style={styles.tipCard}>
            <FontAwesome name="lightbulb-o" size={18} color="#F05A28" />
            <Text style={styles.tipText}>Tap the bookmark icon on any tutorial.</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.savedContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.savedTitle}>Saved tutorials</Text>
        <View style={styles.savedList}>
          {savedTutorials.map((tutorial) => (
            <Pressable
              key={tutorial.id}
              style={[styles.savedCard, { backgroundColor: tutorial.color }]}
              onPress={() => router.push(`/tutorial/${tutorial.id}`)}>
              <View style={styles.savedTop}>
                <Text style={styles.savedMinutes}>{tutorial.minutes} min</Text>
                <Pressable
                  hitSlop={10}
                  style={styles.savedBookmark}
                  onPress={(event) => {
                    event.stopPropagation?.();
                    toggleBookmark(tutorial.id);
                  }}>
                  <FontAwesome name="bookmark" size={14} color="#1B120C" />
                </Pressable>
              </View>
              <Text style={styles.savedCardTitle}>{tutorial.title}</Text>
              <Text style={styles.savedFocus}>{tutorial.focus}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF8F3',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  savedContainer: {
    padding: 20,
    gap: 16,
  },
  savedTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1B120C',
  },
  savedList: {
    gap: 12,
  },
  savedCard: {
    padding: 16,
    borderRadius: 18,
    gap: 8,
  },
  savedTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  savedMinutes: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1B120C',
  },
  savedBookmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF8F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1B120C',
  },
  savedFocus: {
    fontSize: 12,
    color: '#7A4A38',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F05A28',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B120C',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: '#7A4A38',
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF1E8',
    borderRadius: 14,
    marginTop: 12,
  },
  tipText: {
    fontSize: 12,
    color: '#7A4A38',
    flex: 1,
  },
});
