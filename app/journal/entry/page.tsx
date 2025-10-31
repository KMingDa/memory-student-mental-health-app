import { addEntryAPI } from "@/utils/api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from "expo-font";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert, Image,
  Keyboard,
  Modal, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback,
  View
} from 'react-native';
import PixelDialog from '../../memory-modal/popout';

export default function EntryPage() {
  const router = useRouter();
  const { mood } = useLocalSearchParams<{ mood: string }>();
  const [showDialog, setShowDialog] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [fontsLoaded] = useFonts({
    'Jersey15': require('../../../assets/fonts/Jersey15-Regular.ttf'),
    'Jersey10': require('../../../assets/fonts/Jersey10-Regular.ttf'),
    'PressStart2P-Regular': require('../../../assets/fonts/PressStart2P-Regular.ttf'), // Add missing font
  });

  // Format today's date as "DD MMM YYYY" in all caps
  const today = new Date();
  const months = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'
  ];
  const formattedDate = `${today.getDate().toString().padStart(2, '0')} ${months[today.getMonth()]} ${today.getFullYear()}`;

  // State for date picker and diary entries
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(formattedDate);
  const [diaryEntries, setDiaryEntries] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Multi-step date picker states
  const [pickerStep, setPickerStep] = useState<'year' | 'month' | 'day'>('year');
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  // Get current diary text for selected date
  const currentDiaryText = diaryEntries[selectedDate] || '';

  useEffect(() => {
  const loadUserEmail = async () => {
    const storedEmail = await AsyncStorage.getItem("currentUserEmail");
    setUserEmail(storedEmail);
  };
  loadUserEmail();
}, []);

  // Save diary entries whenever they change
  useEffect(() => {
    if (!isLoading) {
      saveDiaryEntries();
    }
  }, [diaryEntries, isLoading]);

  const loadDiaryEntries = async () => {
  try {
    if (!userEmail) return;
    const stored = await AsyncStorage.getItem(`diaryEntries_${userEmail}`);
    if (stored) {
      setDiaryEntries(JSON.parse(stored));
    }
  } catch (error) {
    console.error("Error loading diary entries:", error);
  } finally {
    setIsLoading(false);
  }
};

  const saveDiaryEntries = async () => {
  try {
    if (!userEmail) return;
    await AsyncStorage.setItem(`diaryEntries_${userEmail}`, JSON.stringify(diaryEntries));
  } catch (error) {
    console.error("Error saving diary entries:", error);
  }
};

  useEffect(() => {
    if (userEmail) {
      loadDiaryEntries();
    }
  }, [userEmail]);

  // Generate available years (from 2020 to current year)
  const generateYearOptions = () => {
    const years = [];
    const currentYear = today.getFullYear();
    for (let year = 2020; year <= currentYear; year++) {
      years.push(year);
    }
    return years.reverse(); // Show newest years first
  };

  // Generate month options with validation for current year
  const generateMonthOptions = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    return months.map((month, index) => {
      const isFutureMonth = selectedYear === currentYear && index > currentMonth;
      return { 
        name: month, 
        index, 
        disabled: isFutureMonth 
      };
    }).filter(month => !month.disabled);
  };

  // Generate day options based on selected year and month with date validation
  const generateDayOptions = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const days = [];
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      // Check if this date is in the future
      const isCurrentYearMonth = selectedYear === currentYear && selectedMonth === currentMonth;
      const isFutureDate = selectedYear > currentYear || 
                          (selectedYear === currentYear && selectedMonth > currentMonth) ||
                          (isCurrentYearMonth && day > currentDay);
      
      if (!isFutureDate) {
        days.push(day);
      }
    }
    return days;
  };

  // Handle year selection with validation
  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    
    // If selecting current year, check if selected month is valid
    const today = new Date();
    if (year === today.getFullYear() && selectedMonth > today.getMonth()) {
      setSelectedMonth(today.getMonth());
    }
    
    setPickerStep('month');
  };

  // Handle month selection with validation
  const handleMonthSelect = (monthIndex: number) => {
    setSelectedMonth(monthIndex);
    
    // If selecting current year/month, check if selected day is valid
    const today = new Date();
    if (selectedYear === today.getFullYear() && 
        monthIndex === today.getMonth() && 
        selectedDay > today.getDate()) {
      setSelectedDay(today.getDate());
    }
    
    setPickerStep('day');
  };

  // Handle day selection
  const handleDaySelect = (day: number) => {
    setSelectedDay(day);
    const newDate = `${day.toString().padStart(2, '0')} ${months[selectedMonth]} ${selectedYear}`;
    setSelectedDate(newDate);
    setShowDatePicker(false);
    setPickerStep('year'); // Reset for next time
  };

  // Handle back button in picker
  const handlePickerBack = () => {
    if (pickerStep === 'month') {
      setPickerStep('year');
    } else if (pickerStep === 'day') {
      setPickerStep('month');
    }
  };

  // Get picker title
  const getPickerTitle = () => {
    switch (pickerStep) {
      case 'year': return 'Select Year';
      case 'month': return `Select Month (${selectedYear})`;
      case 'day': return `Select Day (${months[selectedMonth]} ${selectedYear})`;
    }
  };

  // Handle diary text change
  const handleDiaryTextChange = (text: string) => {
    setDiaryEntries(prev => ({
      ...prev,
      [selectedDate]: text
    }));
  };

    // Handle save
  const handleSave = async () => {
    if (!currentDiaryText.trim()) {
      Alert.alert("Warning", "Please write something in your entry before saving!");
      return;
    }

    const entry = {
      date: selectedDate,
      diary: currentDiaryText,
      mood: mood,
    };

    try {
      const result = await addEntryAPI(entry);
      // Alert.alert("Entry Saved", `Tomorrow's predicted mood: ${result.predicted_next_mood}`);
      console.log('Saved entries:', diaryEntries);
      router.push("/journal/chat/page");
    } catch (err) {
      //Alert.alert("Error", "Failed to save entry to backend");
      router.push("/journal/chat/page");
    }
  };


  // Handle previous/next date navigation
  const handlePreviousDate = () => {
    const currentDateObj = new Date(selectedYear, selectedMonth, selectedDay);
    
    // Don't allow going before 2020
    const minDate = new Date(2020, 0, 1);
    if (currentDateObj <= minDate) {
      return;
    }
    
    currentDateObj.setDate(currentDateObj.getDate() - 1);
    
    const newDate = `${currentDateObj.getDate().toString().padStart(2, '0')} ${months[currentDateObj.getMonth()]} ${currentDateObj.getFullYear()}`;
    setSelectedDate(newDate);
    setSelectedYear(currentDateObj.getFullYear());
    setSelectedMonth(currentDateObj.getMonth());
    setSelectedDay(currentDateObj.getDate());
  };

  const handleNextDate = () => {
    const currentDateObj = new Date(selectedYear, selectedMonth, selectedDay);
    const today = new Date();
    
    // Don't allow going beyond today's date
    if (currentDateObj.toDateString() === today.toDateString()) {
      return;
    }
    
    currentDateObj.setDate(currentDateObj.getDate() + 1);
    
    const newDate = `${currentDateObj.getDate().toString().padStart(2, '0')} ${months[currentDateObj.getMonth()]} ${currentDateObj.getFullYear()}`;
    setSelectedDate(newDate);
    setSelectedYear(currentDateObj.getFullYear());
    setSelectedMonth(currentDateObj.getMonth());
    setSelectedDay(currentDateObj.getDate());
  };

  // Check if we can navigate to next date (can't go beyond today)
  const canGoNext = () => {
    const currentDateObj = new Date(selectedYear, selectedMonth, selectedDay);
    const today = new Date();
    return currentDateObj.toDateString() !== today.toDateString();
  };

  // Check if we can navigate to previous date
  const canGoPrevious = () => {
    const currentDateObj = new Date(selectedYear, selectedMonth, selectedDay);
    const minDate = new Date(2020, 0, 1);
    return currentDateObj > minDate;
  };

  if (!fontsLoaded) {
    return null;
  }


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4A90E2" barStyle="light-content" />

      {/* Header - Show today's date, not selected date */}
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
          <Text style={styles.topName}>My Thoughts</Text>
          
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
            {/* Previous Date Button */}
            <TouchableOpacity 
              style={[styles.navButton, !canGoPrevious() && styles.disabledButton]}
              onPress={handlePreviousDate}
              disabled={!canGoPrevious()}
            >
              <Text style={[styles.navButtonText, !canGoPrevious() && styles.disabledText]}>◀️</Text>
            </TouchableOpacity>

            {/* Next Date Button */}
            <TouchableOpacity 
              style={[styles.navButton, !canGoNext() && styles.disabledButton]}
              onPress={handleNextDate}
              disabled={!canGoNext()}
            >
              <Text style={[styles.navButtonText, !canGoNext() && styles.disabledText]}>▶️</Text>
            </TouchableOpacity>

            {/* Calendar Date Picker Button */}
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
              value={currentDiaryText}
              onChangeText={handleDiaryTextChange}
              textAlignVertical="top"
            />
            
            {/* Save Button positioned at bottom right of diary */}
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSave}
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

      {/* Enhanced Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.datePickerModal}>
            <View style={styles.modalHeader}>
              {pickerStep !== 'year' && (
                <TouchableOpacity style={styles.backButton} onPress={handlePickerBack}>
                  <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
              )}
              <Text style={styles.modalTitle}>{getPickerTitle()}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setShowDatePicker(false);
                  setPickerStep('year');
                }}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.dateOptions} showsVerticalScrollIndicator={false}>
              {/* Year Selection */}
              {pickerStep === 'year' && generateYearOptions().map((year) => (
                <TouchableOpacity
                  key={year}
                  style={[styles.dateOption, selectedYear === year && styles.selectedOption]}
                  onPress={() => handleYearSelect(year)}
                >
                  <Text style={[styles.dateOptionText, selectedYear === year && styles.selectedOptionText]}>
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}

              {/* Month Selection */}
              {pickerStep === 'month' && generateMonthOptions().map((month) => (
                <TouchableOpacity
                  key={month.index}
                  style={[
                    styles.dateOption, 
                    selectedMonth === month.index && styles.selectedOption
                  ]}
                  onPress={() => handleMonthSelect(month.index)}
                >
                  <Text style={[
                    styles.dateOptionText, 
                    selectedMonth === month.index && styles.selectedOptionText
                  ]}>
                    {month.name}
                  </Text>
                </TouchableOpacity>
              ))}

              {/* Day Selection */}
              {pickerStep === 'day' && generateDayOptions().map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dateOption, 
                    selectedDay === day && styles.selectedOption
                  ]}
                  onPress={() => handleDaySelect(day)}
                >
                  <Text style={[
                    styles.dateOptionText, 
                    selectedDay === day && styles.selectedOptionText
                  ]}>
                    {day.toString().padStart(2, '0')}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

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
    </TouchableWithoutFeedback>
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
    marginTop: 0,
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
    bottom: -35,
    right: 10,
    backgroundColor: 'transparent',
    padding: 5,
  },
  saveImage: {
    width: 50,
    height: 25,
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
    marginBottom: -30,
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
  navButton: {
    backgroundColor: '#E6F3FF',
    borderWidth: 1,
    borderColor: '#4A90E2',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 8,
    minWidth: 35,
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 12,
    color: '#4A90E2',
  },
  disabledButton: {
    backgroundColor: '#F0F0F0',
    borderColor: '#CCCCCC',
  },
  disabledText: {
    color: '#CCCCCC',
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
    lineHeight: 18,
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 12,
    fontFamily: 'PressStart2P-Regular',
    color: '#4A90E2',
  },
  modalTitle: {
    fontSize: 14,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },
  closeButton: {
    padding: 5,
    backgroundColor: '#FF6B7A',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'PressStart2P-Regular',
    color: 'white',
  },
  selectedOption: {
    backgroundColor: '#4A90E2',
  },
  selectedOptionText: {
    color: 'white',
  },
  dateOptions: {
    maxHeight: 200,
  },
  dateOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: 'white',
    marginBottom: 2,
    borderRadius: 5,
  },
  dateOptionText: {
    fontSize: 14,
    fontFamily: 'PressStart2P-Regular',
    color: '#333',
    textAlign: 'center',
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