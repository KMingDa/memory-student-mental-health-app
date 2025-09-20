import { useFonts } from "expo-font";
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Modal, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EntryPage() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    'Jersey15': require('../../../assets/fonts/Jersey15-Regular.ttf'),
    'Jersey10': require('../../../assets/fonts/Jersey10-Regular.ttf'),
  });

  // Format today's date as "DD MMM YYYY" in all caps
  const today = new Date();
  const months = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'
  ];
  const formattedDate = `${today.getDate().toString().padStart(2, '0')} ${months[today.getMonth()]} ${today.getFullYear()}`;

  // State for date picker and diary
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(formattedDate);
  const [diaryText, setDiaryText] = useState('');

  // Generate date options for the picker (last 30 days)
  const generateDateOptions = () => {
    const dates = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const formattedOption = `${date.getDate().toString().padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
      dates.push(formattedOption);
    }
    return dates;
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4A90E2" barStyle="light-content" />

      {/* Header from journal/mood/page.tsx */}
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
          {/* Entry Title overlapping the container */}
          <Text style={styles.topName}>Entry 01</Text>
          
          {/* Entry Title with Background Box */}
          <View style={styles.titleContainer}>
          </View>

          {/* Castle Image */}
          <View style={styles.imageContainer}>
            <View style={styles.imageWrapper}>
              <Image
                source={require('../../../assets/images/pixelcastle.jpg')}
                style={styles.castleImage}
                resizeMode="cover"
              />
              {/* Top left rotated rectangle */}
              <View style={[styles.cornerRectangle, styles.topLeftCorner]} />
              {/* Bottom right rotated rectangle */}
              <View style={[styles.cornerRectangle, styles.bottomRightCorner]} />
            </View>
          </View>

          {/* Date Selector and Selected Date in horizontal layout */}
          <View style={styles.dateRow}>
            <TouchableOpacity 
              style={styles.dateSelector}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateSelectorText}>📅</Text>
            </TouchableOpacity>

            <Text style={styles.selectedDateText}>{selectedDate}</Text>
          </View>

          {/* Diary Input */}
          <View style={styles.diaryContainer}>
            <TextInput
              style={styles.diaryInput}
              placeholder="Write your entry here..."
              placeholderTextColor="#9999"
              multiline
              value={diaryText}
              onChangeText={setDiaryText}
              textAlignVertical="top"
            />
            
            {/* Save Button positioned at bottom right of diary */}
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={() => router.push('/journal/chat/page')}
            >
              <Image
                source={require('../../../assets/images/save.png')}
                style={styles.saveImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

        </View>

        {/* Bookmark */}
        <View style={styles.bookmark} />
      </View>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.datePickerModal}>
            <Text style={styles.modalTitle}>Select Date</Text>
            <ScrollView style={styles.dateOptions}>
              {generateDateOptions().map((date, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dateOption}
                  onPress={() => {
                    setSelectedDate(date);
                    setShowDatePicker(false);
                  }}
                >
                  <Text style={styles.dateOptionText}>{date}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation from journal/mood/page.tsx */}
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
  titleContainer: {
    backgroundColor: '#ECD5D5',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: -21,
  },
  headerTitle: {
    fontSize: 15,
    color: '#000',
    fontFamily: 'Jersey20-Regular',
    letterSpacing: 1,
  },
  scrollContent: {
    flex: 1,
    marginBottom: 20,
  },
  iconsContainer: {
    marginBottom: 16,
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weatherIcon: {
    fontSize: 18,
  },
  moodIcon: {
    fontSize: 18,
  },
  saveButton: {
    position: 'absolute',
    bottom: -30,
    right: 10,
    backgroundColor: 'transparent',
    padding: 5,
  },
  saveImage: {
    width: 60,
    height: 30,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 8,
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
  imageContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
  },
  castleImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cornerRectangle: {
    position: 'absolute',
    width: 42,
    height: 12,
    backgroundColor: '#FF8B94',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    transform: [{ rotate: '135deg' }],
  },
  topLeftCorner: {
    top: 6,
    left: -6,
  },
  bottomRightCorner: {
    bottom: 6,
    right: -6,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 5,
  },
  dateSelector: {
    backgroundColor: '#E6F3FF',
    borderWidth: 1,
    borderColor: '#4A90E2',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginRight: 15,
    minWidth: 35,
    alignItems: 'center',
  },
  dateSelectorText: {
    fontSize: 14,
    color: '#4A90E2',
  },
  selectedDateText: {
    fontSize: 12,
    color: '#000',
    fontFamily: 'PressStart2P-Regular',
    flex: 1,
    alignSelf: 'center',
  },
  diaryContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    padding: 5,
    marginBottom: 15,
    minHeight: 120,
    position: 'relative',
  },
  diaryInput: {
    flex: 1,
    fontSize: 22,
    color: '#333',
    fontFamily: 'Jersey10',
    lineHeight: 20,
    paddingTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerModal: {
    backgroundColor: '#FFF5F5',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  dateOptions: {
    maxHeight: 200,
  },
  dateOption: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dateOptionText: {
    fontSize: 14,
    fontFamily: 'PressStart2P-Regular',
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginTop: 15,
  },
  closeButtonText: {
    fontSize: 12,
    fontFamily: 'PressStart2P-Regular',
    color: 'white',
  },
  topName: {
    color: "#000",
    fontSize: 30,
    marginBottom: -15,
    fontFamily: "Jersey15",
    textAlign: 'center',
    zIndex: 10,
    position: 'relative',
  },
});