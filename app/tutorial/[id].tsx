import React, { useEffect, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { fetchTutorialById, Tutorial } from '@/lib/tutorialApi';
import { useBookmarks } from '@/components/useBookmarks';

export default function TutorialDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const { isBookmarked, toggleBookmark } = useBookmarks();

  useEffect(() => {
    let active = true;

    const loadTutorial = async () => {
      if (!id) {
        if (active) {
          setTutorial(null);
          setLoading(false);
        }
        return;
      }

      try {
        const data = await fetchTutorialById(id);
        if (active) {
          setTutorial(data);
        }
      } catch (error) {
        if (active) {
          setTutorial(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadTutorial();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <View style={styles.notFound}>
          <Text style={styles.notFoundTitle}>Loading tutorial...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!tutorial) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <View style={styles.notFound}>
          <Text style={styles.notFoundTitle}>Tutorial not found</Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable style={styles.backIcon} onPress={() => router.back()}>
            <FontAwesome name="chevron-left" size={16} color="#1B120C" />
          </Pressable>
          <Text style={styles.headerTitle}>Tutorial</Text>
          <Pressable style={styles.bookmarkButton} onPress={() => toggleBookmark(tutorial.id)}>
            <FontAwesome
              name={isBookmarked(tutorial.id) ? 'bookmark' : 'bookmark-o'}
              size={16}
              color="#1B120C"
            />
          </Pressable>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaPill}>
            <Text style={styles.metaText}>{tutorial.minutes} min</Text>
          </View>
          <View style={styles.metaPill}>
            <Text style={styles.metaText}>{tutorial.focus}</Text>
          </View>
        </View>

        <Text style={styles.title}>{tutorial.title}</Text>
        <Text style={styles.summary}>{tutorial.summary}</Text>

        <View style={styles.media}>
          <FontAwesome name="play-circle" size={42} color="#F05A28" />
          <Text style={styles.mediaText}>Video or GIF preview</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Steps</Text>
          <View style={styles.stepList}>
            {tutorial.steps.map((step, index) => (
              <View key={step} style={styles.stepRow}>
                <View style={styles.stepIndex}>
                  <Text style={styles.stepIndexText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>

        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Start tutorial</Text>
        </Pressable>
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
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF1E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF1E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B120C',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metaPill: {
    backgroundColor: '#FFF1E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7A4A38',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1B120C',
  },
  summary: {
    fontSize: 14,
    lineHeight: 20,
    color: '#7A4A38',
  },
  media: {
    height: 190,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F5D2C2',
    backgroundColor: '#FFF1E8',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  mediaText: {
    fontSize: 13,
    color: '#7A4A38',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B120C',
  },
  stepList: {
    gap: 10,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#FFF1E8',
    borderRadius: 14,
  },
  stepIndex: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F05A28',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndexText: {
    color: '#FFF8F3',
    fontSize: 12,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: '#1B120C',
  },
  primaryButton: {
    backgroundColor: '#F05A28',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#FFF8F3',
    fontSize: 15,
    fontWeight: '700',
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B120C',
  },
  backButton: {
    backgroundColor: '#F05A28',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  backButtonText: {
    color: '#FFF8F3',
    fontSize: 13,
    fontWeight: '700',
  },
});
