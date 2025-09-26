// MoodPage.tsx
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PixelDialog from '../../memory-modal/popout';

export default function MoodPage() {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [showDialog, setShowDialog] = useState(false); // 控制弹窗
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    'PressStart2P-Regular': require('../../../assets/fonts/PressStart2P-Regular.ttf'),
  });

  const today = new Date();
  const months = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'
  ];
  const formattedDate = `${today.getDate().toString().padStart(2, '0')} ${months[today.getMonth()]} ${today.getFullYear()}`;

  const moods = [
    { id: 'happy', emoji: require('../../../assets/images/happy.png'), label: 'Happy' },
    { id: 'unsure', emoji: require('../../../assets/images/unsure.png'), label: 'Unsure' },
    { id: 'sad', emoji: require('../../../assets/images/sad.png'), label: 'Sad' },
    { id: 'sick', emoji: require('../../../assets/images/sick.png'), label: 'Sick' },
    { id: 'glad', emoji: require('../../../assets/images/glad.png'), label: 'Glad' },
    { id: 'neutral', emoji: require('../../../assets/images/neutral.png'), label: 'Neutral' },
    { id: 'cool', emoji: require('../../../assets/images/cool.png'), label: 'Cool' },
    { id: 'relaxed', emoji: require('../../../assets/images/relaxed.png'), label: 'Relaxed' }
  ];

  const goNext = () => {
    if (!selectedMood) {
      Alert.alert("Please select a mood first!");
      return;
    }
    router.push({ pathname: '/journal/entry/page', params: { mood: selectedMood } });
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4A90E2" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.dateText}>{formattedDate}</Text>
        <View style={styles.profileIcon}>
          <Image source={require('../../../assets/images/misahead.png')} style={{ width: 28, height: 28, borderRadius: 14 }} />
        </View>
      </View>

      {/* Journal Container */}
      <View style={styles.journalContainer}>
        <View style={styles.spiralBinding}>
          {Array.from({ length: 12 }).map((_, i) => <View key={i} style={styles.spiralRing} />)}
        </View>

        <View style={styles.journalContent}>
          <Text style={styles.moodOfTheDayTitle}>Mood of the Day</Text>

          {/* Mood Grid */}
          <View style={styles.moodGrid}>
            {moods.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                onPress={() => setSelectedMood(mood.id)}
                style={[styles.moodButton, selectedMood === mood.id && styles.selectedMood]}
              >
                <Image source={mood.emoji} style={styles.moodEmoji} resizeMode="contain" />
                <Text style={styles.moodLabel}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Next Button */}
          <View style={styles.nextContainer}>
            <TouchableOpacity style={styles.nextButton} onPress={goNext}>
              <Text style={styles.nextArrow}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bookmark} />
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('../../furni-home/homesc')}>
          <Image source={require('../../../assets/images/home.png')} style={styles.navImage} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setShowDialog(true)}>
          <Image source={require('../../../assets/images/bear.png')} style={styles.navImage} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('../../leaderboard/lead')}>
          <Image source={require('../../../assets/images/trophy.png')} style={styles.navImage} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Image source={require('../../../assets/images/settings.png')} style={styles.navImage} />
        </TouchableOpacity>
      </View>

      {/* PixelDialog 弹窗 */}
      <PixelDialog visible={showDialog} onClose={() => setShowDialog(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E6F3FF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFF5F5', marginTop: 0 },
  dateText: { color: '#000', fontSize: 16, fontWeight: '600', fontFamily: 'PressStart2P-Regular' },
  profileIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  journalContainer: { flex: 1, margin: 20, backgroundColor: '#FFF5F5', borderRadius: 10, flexDirection: 'row', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4.65, elevation: 8 },
  spiralBinding: { width: 30, backgroundColor: '#FF8B94', borderTopLeftRadius: 10, borderBottomLeftRadius: 10, paddingVertical: 20, alignItems: 'center', justifyContent: 'space-around' },
  spiralRing: { width: 15, height: 15, borderRadius: 7.5, backgroundColor: '#FF6B7A', marginVertical: 2 },
  journalContent: { flex: 1, padding: 20, position: 'relative' },
  moodOfTheDayTitle: { fontSize: 15, color: '#000', fontFamily: 'PressStart2P-Regular', textAlign: 'center', marginBottom: 18, marginTop: 4, letterSpacing: 1 },
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 30 },
  moodButton: { width: '45%', aspectRatio: 1, backgroundColor: '#ffffff', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, borderWidth: 2, borderColor: '#f0f0f0' },
  selectedMood: { borderWidth: 4, borderColor: '#4A90E2', backgroundColor: '#f0f8ff' },
  moodEmoji: { width: 40, height: 40, marginBottom: 8 },
  moodLabel: { fontSize: 12, fontWeight: '500', color: '#1F2937', fontFamily: 'PressStart2P-Regular' },
  nextContainer: { alignItems: 'flex-end', position: 'absolute', bottom: 20, right: 20 },
  nextButton: { width: 50, height: 50, backgroundColor: '#4A90E2', borderRadius: 25, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 6 },
  nextArrow: { fontSize: 20, color: 'white', fontWeight: 'bold', fontFamily: 'PressStart2P-Regular' },
  bookmark: { position: 'absolute', right: 0, top: 0, width: 20, height: 60, backgroundColor: '#FF8B94', borderTopRightRadius: 10 },
  bottomNav: { flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 15, paddingHorizontal: 20, justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: '#E0E0E0', marginBottom: -30 },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navImage: { width: 48, height: 48 },
});
