import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { tutorials } from '@/data/tutorials';
import { useBookmarks } from '@/components/useBookmarks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function TabOneScreen() {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [profileName, setProfileName] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem('stepkind_profile');
      if (!raw) {
        setProfileName(null);
        return;
      }
      const parsed = JSON.parse(raw) as { name?: string };
      setProfileName(parsed.name?.trim() ?? null);
    } catch (error) {
      setProfileName(null);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  useFocusEffect(
    useCallback(() => {
      void loadProfile();
    }, [loadProfile]),
  );

  const initials = useMemo(() => {
    if (!profileName) return 'SK';
    const parts = profileName.split(' ').filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const second = parts[1]?.[0] ?? '';
    return (first + second).toUpperCase() || 'SK';
  }, [profileName]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.backgroundGlow} />
      <View style={styles.backgroundGlowSecondary} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brand}>
            <View style={styles.brandIcon}>
              <FontAwesome name="heart" size={14} color="#FFF8F3" />
            </View>
            <Text style={styles.brandText}>StepKind</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable style={styles.onboardingButton} onPress={() => router.push('/onboarding')}>
              <Text style={styles.onboardingButtonText}>Onboarding</Text>
            </Pressable>
            <Pressable style={styles.profile}>
              <Text style={styles.profileText}>{initials}</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Short app tutorials to move forward today</Text>
          <Text style={styles.heroSubtitle}>
            Learn how to use apps and tech tools fast, step by step.
          </Text>
        </View>

        <Pressable style={styles.searchWrap} onPress={() => router.push('/search')}>
          <FontAwesome name="search" size={16} color="#8A5B49" />
          <TextInput
            editable={false}
            placeholder="Search for an app tutorial"
            placeholderTextColor="#B98B78"
            style={styles.searchInput}
          />
          <View style={styles.searchBadge}>
            <Text style={styles.searchBadgeText}>New</Text>
          </View>
        </Pressable>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>App tutorials</Text>
          <Pressable onPress={() => router.push('/search?showAll=1')}>
            <Text style={styles.sectionAction}>See all</Text>
          </Pressable>
        </View>
        <View style={styles.tutorialList}>
          {tutorials.slice(0, 4).map((tutorial) => (
            <Pressable
              key={tutorial.id}
              style={[styles.tutorialCard, { backgroundColor: tutorial.color }]}
              onPress={() => router.push(`/tutorial/${tutorial.id}`)}>
              <View style={styles.tutorialTop}>
                <Text style={styles.tutorialMinutes}>{tutorial.minutes} min</Text>
                <View style={styles.focusPill}>
                  <Text style={styles.focusText}>{tutorial.focus}</Text>
                </View>
              </View>
              <Text style={styles.tutorialTitle}>{tutorial.title}</Text>
              <View style={styles.tutorialFooter}>
                <View style={styles.playCircle}>
                  <FontAwesome name="play" size={14} color="#FFF8F3" />
                </View>
                <Text style={styles.tutorialAction}>Start now</Text>
                <Pressable
                  style={styles.bookmarkButton}
                  hitSlop={10}
                  onPress={(event) => {
                    event.stopPropagation?.();
                    toggleBookmark(tutorial.id);
                  }}>
                  <FontAwesome
                    name={isBookmarked(tutorial.id) ? 'bookmark' : 'bookmark-o'}
                    size={16}
                    color="#1B120C"
                  />
                </Pressable>
              </View>
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
    padding: 20,
    paddingBottom: 40,
    gap: 24,
  },
  backgroundGlow: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: '#FFE1D4',
    top: -120,
    right: -80,
    opacity: 0.7,
  },
  backgroundGlowSecondary: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: '#FFEBD6',
    bottom: -120,
    left: -60,
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F05A28',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 20,
    fontFamily: 'SpaceMono',
    color: '#1B120C',
  },
  profile: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1B120C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    color: '#FFF8F3',
    fontSize: 12,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  onboardingButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#FFF1E8',
    borderWidth: 1,
    borderColor: '#F5D2C2',
  },
  onboardingButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7A4A38',
  },
  hero: {
    gap: 10,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1B120C',
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 21,
    color: '#7A4A38',
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
  },
  searchInput: {
    flex: 1,
    color: '#1B120C',
    fontSize: 15,
  },
  searchBadge: {
    backgroundColor: '#F05A28',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  searchBadgeText: {
    color: '#FFF8F3',
    fontSize: 11,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B120C',
  },
  sectionAction: {
    fontSize: 13,
    color: '#F05A28',
    fontWeight: '600',
  },
  tutorialList: {
    gap: 14,
  },
  tutorialCard: {
    padding: 18,
    borderRadius: 20,
    gap: 14,
  },
  tutorialTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tutorialMinutes: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1B120C',
  },
  focusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#FFF8F3',
  },
  focusText: {
    fontSize: 11,
    color: '#7A4A38',
    fontWeight: '600',
  },
  tutorialTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B120C',
  },
  tutorialFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  playCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F05A28',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tutorialAction: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1B120C',
  },
  bookmarkButton: {
    marginLeft: 'auto',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF8F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
