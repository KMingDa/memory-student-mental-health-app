//mood of the day, 4x2 moods

import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MoodPage() {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const router = useRouter();

  // Format today's date as "DD MMM YYYY" in all caps
  const today = new Date();
  const months = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'
  ];
  const formattedDate = `${today.getDate().toString().padStart(2, '0')} ${months[today.getMonth()]} ${today.getFullYear()}`;

  const moods = [
    { id: 'happy', emoji: require('../../../assets/images/happy.png'), label: 'Happy' }, // <----- (change PNG path here)
    { id: 'unsure', emoji: require('../../../assets/images/unsure.png'), label: 'Unsure' }, // <----- (change PNG path here)
    { id: 'sad', emoji: require('../../../assets/images/sad.png'), label: 'Sad' }, // <----- (change PNG path here)
    { id: 'sick', emoji: require('../../../assets/images/sick.png'), label: 'Sick' }, // <----- (change PNG path here)
    { id: 'glad', emoji: require('../../../assets/images/glad.png'), label: 'Glad' }, // <----- (change PNG path here)
    { id: 'neutral', emoji: require('../../../assets/images/neutral.png'), label: 'Neutral' }, // <----- (change PNG path here)
    { id: 'cool', emoji: require('../../../assets/images/cool.png'), label: 'Cool' }, // <----- (change PNG path here)
    { id: 'relaxed', emoji: require('../../../assets/images/relaxed.png'), label: 'Relaxed' } // <----- (change PNG path here)
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4A90E2" barStyle="light-content" />

      {/* Header from journal/index.tsx */}
      <View style={styles.header}>
        <Text style={styles.dateText}>{formattedDate}</Text>
        <View style={styles.profileIcon}>
          <Image
            source={require('../../../assets/images/misahead.png')}
            style={{ width: 28, height: 28, borderRadius: 14 }}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Journal Container with Notebook Design */}
      <View style={styles.journalContainer}>
        {/* Spiral Binding */}
        <View style={styles.spiralBinding}>
          {Array.from({ length: 12 }, (_, i) => (
            <View key={i} style={styles.spiralRing} />
          ))}
        </View>

        {/* Journal Content */}
        <View style={styles.journalContent}>
          {/* Mood of the Day Title */}
          <Text style={styles.moodOfTheDayTitle}>Mood of the Day</Text>
          {/* Mood Grid - 4 rows, 2 columns */}
          <View style={styles.moodGrid}>
            {moods.map((mood, index) => (
              <TouchableOpacity
                key={mood.id}
                onPress={() => setSelectedMood(mood.id)}
                style={[
                  styles.moodButton,
                  selectedMood === mood.id && styles.selectedMood
                ]}
              >
                <Image 
                  source={mood.emoji} 
                  style={styles.moodEmoji} 
                  resizeMode="contain" 
                />
                <Text style={styles.moodLabel}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Next Button */}
          <View style={styles.nextContainer}>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => router.push('/journal/entry/page')}
            >
              <Text style={styles.nextArrow}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bookmark */}
        <View style={styles.bookmark} />
      </View>

      {/* Bottom Navigation from journal/index.tsx */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require('../../../assets/images/home.png')}
            style={styles.navImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require('../../../assets/images/bear.png')}
            style={styles.navImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require('../../../assets/images/trophy.png')}
            style={styles.navImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require('../../../assets/images/settings.png')}
            style={styles.navImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F3FF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF5F5',
  },
  dateText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'PressStart2P-Regular',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileEmoji: {
    fontSize: 20,
  },
  journalContainer: {
    flex: 1,
    margin: 20,
    backgroundColor: '#FFF5F5',
    borderRadius: 10,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  spiralBinding: {
    width: 30,
    backgroundColor: '#FF8B94',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  spiralRing: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#FF6B7A',
    marginVertical: 2,
  },
  journalContent: {
    flex: 1,
    padding: 20,
    position: 'relative',
  },
  moodOfTheDayTitle: {
    fontSize: 15,
    color: '#000',
    fontFamily: 'PressStart2P-Regular',
    textAlign: 'center',
    marginBottom: 18,
    marginTop: 4,
    letterSpacing: 1,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  pageTitle: {
    // (keep for other usages if needed)
  },
  pageTitleMood: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'serif',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // <----- (creates 2 columns with space between)
    marginBottom: 30,
  },
  moodButton: {
    width: '45%', // <----- (45% width for 2 columns with gap)
    aspectRatio: 1, // <----- (keeps square shape)
    backgroundColor: '#ffffff', // <----- (white background)
    borderRadius: 12, // <----- (rounded corners)
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16, // <----- (spacing between rows)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#f0f0f0', // <----- (subtle border)
  },
  selectedMood: {
    borderWidth: 4,
    borderColor: '#4A90E2', // <----- (blue border when selected)
    backgroundColor: '#f0f8ff', // <----- (light blue background when selected)
  },
  moodEmoji: {
    width: 40, // <----- (change emoji size here)
    height: 40, // <----- (change emoji size here)
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1F2937',
    fontFamily: 'PressStart2P-Regular',
  },
  nextContainer: {
    alignItems: 'flex-end',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  nextButton: {
    width: 50,
    height: 50,
    backgroundColor: '#4A90E2',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  nextArrow: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'PressStart2P-Regular',
  },
  bookmark: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 20,
    height: 60,
    backgroundColor: '#FF8B94',
    borderTopRightRadius: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navImage: {
    width: 48,
    height: 48,
  },
  navIcon: {
    fontSize: 24,
    opacity: 0.6,
    fontFamily: 'PressStart2P-Regular',
  },
  activeNavIcon: {
    opacity: 1,
  },
});