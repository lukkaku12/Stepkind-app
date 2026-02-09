import React, { useMemo, useRef, useState, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const steps = [
  {
    title: 'Find in seconds',
    description: 'Discover short tutorials with one simple search.',
    icon: 'search',
  },
  {
    title: 'Learn without noise',
    description: 'Step-by-step guidance with clear examples.',
    icon: 'play-circle',
  },
  {
    title: 'Save the best',
    description: 'Build your collection and return anytime.',
    icon: 'bookmark',
  },
];

const heroIcons: Array<React.ComponentProps<typeof FontAwesome>['name']> = [
  'star',
  'play-circle',
  'user-circle',
];

export default function OnboardingScreen() {
  const [stepIndex, setStepIndex] = useState(0);
  const [name, setName] = useState('');
  const deviceLabel = useMemo(() => (Platform.OS === 'ios' ? 'iOS' : 'Android'), []);
  const canContinue = name.trim().length > 1;
  const isLastStep = stepIndex === 2;
  const transition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    transition.setValue(0);
    Animated.timing(transition, {
      toValue: 1,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [stepIndex, transition]);

  const transitionStyle = {
    opacity: transition,
    transform: [
      {
        translateY: transition.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
    ],
  };

  const handleContinue = async () => {
    try {
      const profile = {
        name: name.trim(),
        platform: deviceLabel,
        completedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem('stepkind_profile', JSON.stringify(profile));
      await AsyncStorage.setItem('stepkind_onboarding_done', 'true');
    } catch (error) {
      // Fallback to navigation even if storage fails.
    }
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.topGlow} />
      <View style={styles.bottomGlow} />
      <View style={styles.container}>
        <View style={styles.brand}>
          <View style={styles.brandIcon}>
            <FontAwesome name="heart" size={22} color="#FFF8F3" />
          </View>
          <Text style={styles.brandText}>StepKind</Text>
        </View>

        <Animated.View style={transitionStyle}>
          <View style={styles.hero}>
            <View style={styles.heroIconRow}>
              <View style={styles.heroIcon}>
                <FontAwesome name={heroIcons[stepIndex]} size={18} color="#F05A28" />
              </View>
              <Text style={styles.heroLabel}>Step {stepIndex + 1} of 3</Text>
            </View>
            {stepIndex === 0 && (
              <>
                <Text style={styles.title}>Learn apps fast, step by step</Text>
                <Text style={styles.subtitle}>
                  Quick tutorials for iPhone, Android, and everyday tools.
                </Text>
              </>
            )}
            {stepIndex === 1 && (
              <>
                <Text style={styles.title}>How it works</Text>
                <Text style={styles.subtitle}>
                  Search any app. Watch the steps. Do it right away.
                </Text>
              </>
            )}
            {stepIndex === 2 && (
              <>
                <Text style={styles.title}>Make it yours</Text>
                <Text style={styles.subtitle}>
                  Tell us your name to personalize your {deviceLabel} experience.
                </Text>
              </>
            )}
            <View style={styles.animationWrap}>
              <LottieView
                source={require('../assets/lottie/stepkind-orbit.json')}
                autoPlay
                loop
                style={styles.animation}
              />
            </View>
          </View>

          {stepIndex === 1 && (
            <View style={styles.stepList}>
              {steps.map((step) => (
                <View key={step.title} style={styles.stepRow}>
                  <View style={styles.stepIcon}>
                    <FontAwesome
                      name={step.icon as React.ComponentProps<typeof FontAwesome>['name']}
                      size={16}
                      color="#F05A28"
                    />
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <Text style={styles.stepDescription}>{step.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {stepIndex === 2 && (
            <View style={styles.profileCard}>
              <Text style={styles.profileTitle}>Tell us your name</Text>
              <Text style={styles.profileSubtitle}>
                We will personalize your experience on {deviceLabel}.
              </Text>
              <TextInput
                placeholder="Your name"
                placeholderTextColor="#B98B78"
                style={styles.profileInput}
                value={name}
                onChangeText={setName}
              />
            </View>
          )}
        </Animated.View>

        <View style={styles.actions}>
          <View style={styles.stepper}>
            {[0, 1, 2].map((index) => (
              <View
                key={index}
                style={[styles.stepDot, stepIndex === index && styles.stepDotActive]}
              />
            ))}
          </View>
          <Pressable
            style={[
              styles.primaryButton,
              isLastStep && !canContinue && styles.primaryButtonDisabled,
            ]}
            disabled={isLastStep && !canContinue}
            onPress={() => {
              if (isLastStep) {
                void handleContinue();
              } else {
                setStepIndex((prev) => prev + 1);
              }
            }}>
            <Text style={styles.primaryButtonText}>
              {isLastStep ? 'Get started' : 'Next'}
            </Text>
          </Pressable>
          <View style={styles.secondaryRow}>
            {stepIndex > 0 && (
              <Pressable style={styles.secondaryButton} onPress={() => setStepIndex((prev) => prev - 1)}>
                <Text style={styles.secondaryButtonText}>Back</Text>
              </Pressable>
            )}
            <Pressable style={styles.secondaryButton} onPress={() => router.replace('/(tabs)')}>
              <Text style={styles.secondaryButtonText}>Skip onboarding</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF8F3',
  },
  topGlow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#FFE1D4',
    top: -140,
    left: -80,
    opacity: 0.8,
  },
  bottomGlow: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#FFEBD6',
    bottom: -140,
    right: -60,
    opacity: 0.7,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F05A28',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 24,
    fontFamily: 'SpaceMono',
    color: '#1B120C',
  },
  hero: {
    gap: 12,
  },
  heroIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF1E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7A4A38',
  },
  animationWrap: {
    alignItems: 'center',
  },
  animation: {
    width: 180,
    height: 180,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1B120C',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#7A4A38',
  },
  stepList: {
    gap: 14,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF1E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContent: {
    flex: 1,
    gap: 4,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1B120C',
  },
  stepDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: '#7A4A38',
  },
  profileCard: {
    gap: 10,
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#FFF1E8',
    borderWidth: 1,
    borderColor: '#F5D2C2',
  },
  profileTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1B120C',
  },
  profileSubtitle: {
    fontSize: 12,
    color: '#7A4A38',
  },
  profileInput: {
    backgroundColor: '#FFF8F3',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1B120C',
  },
  actions: {
    gap: 12,
  },
  stepper: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 6,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F5D2C2',
  },
  stepDotActive: {
    backgroundColor: '#F05A28',
  },
  primaryButton: {
    backgroundColor: '#F05A28',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFF8F3',
    fontSize: 15,
    fontWeight: '700',
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  secondaryButtonText: {
    color: '#7A4A38',
    fontSize: 13,
    fontWeight: '600',
  },
  secondaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
