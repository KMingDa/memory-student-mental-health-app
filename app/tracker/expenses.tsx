import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTracker } from '../../contexts/TrackerContext';

// Simple inline calendar component (no external deps)
// Calendar helpers (shared)
const getFirstDayOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1).getDay();
const getDaysInMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

const buildMonthMatrix = (d: Date) => {
  const firstDay = getFirstDayOfMonth(d);
  const daysInMonth = getDaysInMonth(d);
  const weeks: (number | null)[][] = [];
  let currentDay = 1;
  for (let week = 0; week < 6; week++) {
    const weekRow: (number | null)[] = [];
    for (let i = 0; i < 7; i++) {
      if (week === 0 && i < firstDay) {
        weekRow.push(null);
      } else if (currentDay > daysInMonth) {
        weekRow.push(null);
      } else {
        weekRow.push(currentDay);
        currentDay++;
      }
    }
    weeks.push(weekRow);
    if (currentDay > daysInMonth) break;
  }
  return weeks;
};

function CalendarView({ date, onChange }: { date: Date; onChange: (d: Date) => void }) {
  const [viewDate, setViewDate] = useState(new Date(date.getFullYear(), date.getMonth(), 1));

  const weeks = buildMonthMatrix(viewDate);
  const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <View>
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}>
          <Text style={styles.calendarNav}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.calendarTitle}>{monthLabels[viewDate.getMonth()]} {viewDate.getFullYear()}</Text>
        <TouchableOpacity onPress={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}>
          <Text style={styles.calendarNav}>›</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.weekDaysRow}>
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <Text key={`${d}-${i}`} style={styles.weekDay}>{d}</Text>
        ))}
      </View>
      {weeks.map((week, wi) => (
        <View key={wi} style={styles.weekRow}>
          {week.map((day, di) => {
            const isSelected = day === date.getDate() && viewDate.getMonth() === date.getMonth() && viewDate.getFullYear() === date.getFullYear();
            return (
              <TouchableOpacity
                key={di}
                style={[styles.dayCell, isSelected && styles.dayCellSelected]}
                disabled={day === null}
                onPress={() => {
                  if (day) {
                    onChange(new Date(viewDate.getFullYear(), viewDate.getMonth(), day));
                  }
                }}
              >
                <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>{day || ''}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

interface Expense {
  id: string;
  name: string;
  amount: number;
  date: string;
  day: string;
}

export default function ExpensesPage() {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'];
    return `${months[now.getMonth()]} ${now.getFullYear()}`;
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  // sortOrder is persisted in TrackerContext.sortPreferences.expenses

  const [fontsLoaded] = useFonts({
    'PressStart2P-Regular': require('../../assets/fonts/PressStart2P-Regular.ttf'),
  });

  // use shared tracker context for transactions (auto-persisted by context)
  const { state, dispatch, setSortPreference } = useTracker();

  const availableMonths = [
    'SEPT 2025', 'AUG 2025', 'JUL 2025', 'JUN 2025', 'MAY 2025', 'APR 2025'
  ];

  if (!fontsLoaded) {
    return null;
  }

  const handleDeleteExpense = (id: string, name: string) => {
    Alert.alert(
      'Delete Expense',
      `Are you sure you want to delete "${name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch({ type: 'DELETE_TRANSACTION', payload: id });
          },
        },
      ]
    );
  };

  const getTotalExpenses = () => {
    return state.transactions.filter(t => t.type === 'expense').reduce((total, t) => total + t.amount, 0);
  };

  // Return expenses that match the currently selected month (e.g. 'AUG' matches 'AUG 2025')
  const getFilteredExpenses = () => {
    const selectedMonthToken = selectedMonth.split(' ')[0].toUpperCase();
    // state.transactions have date as Date
    return state.transactions
      .filter(t => t.type === 'expense')
      .filter(t => {
        const m = t.date.getMonth();
        const monthsUpper = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEPT','OCT','NOV','DEC'];
        return monthsUpper[m] === selectedMonthToken;
      })
  .sort((a, b) => (state.sortPreferences?.expenses || 'newest') === 'newest' ? (b.date.getTime() - a.date.getTime()) : (a.date.getTime() - b.date.getTime()))
      .map(t => ({
        id: t.id,
        name: t.description,
        amount: t.amount,
        date: `${t.date.getDate().toString().padStart(2, '0')} ${['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEPT','OCT','NOV','DEC'][t.date.getMonth()]}`,
        day: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][t.date.getDay()],
      } as Expense));
  };

  const getFilteredTotal = () => {
    return getFilteredExpenses().reduce((total, expense) => total + expense.amount, 0);
  };

  const handleAddExpense = () => {
    if (newExpenseName.trim() === '' || newExpenseAmount.trim() === '') {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const amount = parseFloat(newExpenseAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    // Format date to match the selected month format
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'];
    
    const formattedDate = `${selectedDate.getDate().toString().padStart(2, '0')} ${months[selectedDate.getMonth()]}`;
    const dayName = days[selectedDate.getDay()];

    const newTransaction = {
      id: Date.now().toString(),
      type: 'expense' as const,
      amount: amount,
      description: newExpenseName.trim(),
      category: 'General',
      date: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()),
    };

    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
    setNewExpenseName('');
    setNewExpenseAmount('');
    setSelectedDate(new Date());
    setShowAddModal(false);
  };

  const formatDateDisplay = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const today = new Date();
  const months = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'
  ];
  const formattedDate = `${today.getDate().toString().padStart(2, '0')} ${months[today.getMonth()]} ${today.getFullYear()}`;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4A90E2" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>{formattedDate}</Text>
        <View style={styles.profileIcon}>
          <Image
            source={require('../../assets/images/misahead.png')}
            style={{ width: 28, height: 28, borderRadius: 14 }}
            resizeMode="cover"
          />
        </View>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          {/* Title */}
          <Text style={styles.title}>
            Monthly <Text style={styles.titleHighlight}>EXPENSES</Text>
          </Text>

          {/* Month Selector */}
          <View style={styles.monthSelector}>
            <Text style={styles.monthSelectorLabel}>Select Month:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthScrollContainer}>
              <View style={styles.monthButtonsContainer}>
                {availableMonths.map((month) => (
                  <TouchableOpacity
                    key={month}
                    style={[
                      styles.monthButton,
                      selectedMonth === month && styles.selectedMonthButton
                    ]}
                    onPress={() => setSelectedMonth(month)}
                  >
                    <Text style={[
                      styles.monthButtonText,
                      selectedMonth === month && styles.selectedMonthButtonText
                    ]}>
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
          
          {/* Total Overview */}
          <View style={styles.overviewCard}>
            <Text style={styles.overviewTitle}>Total for {selectedMonth}</Text>
            <Text style={styles.totalAmount}>RM {getFilteredTotal().toFixed(2)}</Text>
            <Text style={styles.overviewSubtext}>{getFilteredExpenses().length} transactions</Text>
          </View>

          {/* Expenses List */}
          <View style={styles.expensesSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Expense Details</Text>
                <View style={styles.sortToggleRow}>
                  <TouchableOpacity
                    style={[styles.sortToggleButton, styles.sortToggleButtonActive]}
                    onPress={() => {
                      const current = state.sortPreferences?.expenses || 'newest';
                      const next = current === 'newest' ? 'oldest' : 'newest';
                      setSortPreference('expenses', next);
                    }}
                  >
                    <Text style={[styles.sortToggleText, styles.sortToggleTextActive]}>
                      {(state.sortPreferences?.expenses || 'newest') === 'newest' ? 'Newest' : 'Oldest'}
                    </Text>
                  </TouchableOpacity>
                </View>
            </View>
            {getFilteredExpenses().map((expense) => (
              <View key={expense.id} style={styles.expenseCard}>
                <View style={styles.expenseInfo}>
                  <Text style={styles.expenseName}>{expense.name}</Text>
                  <Text style={styles.expenseDate}>{expense.date} - {expense.day}</Text>
                </View>
                <View style={styles.expenseActions}>
                  <Text style={styles.expenseAmount}>RM {expense.amount.toFixed(2)}</Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteExpense(expense.id, expense.name)}
                  >
                    <Text style={styles.deleteIcon}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            
            {getFilteredExpenses().length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No expenses for {selectedMonth}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity 
        style={styles.floatingAddButton}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Add Expense Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Expense</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Expense Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Activity/Title:</Text>
              <TextInput
                style={styles.textInput}
                value={newExpenseName}
                onChangeText={setNewExpenseName}
                placeholder="e.g. Lunch, Coffee, etc."
                placeholderTextColor="#999"
              />
            </View>

            {/* Amount Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Amount (RM):</Text>
              <TextInput
                style={styles.textInput}
                value={newExpenseAmount}
                onChangeText={setNewExpenseAmount}
                placeholder="0.00"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            {/* Date Selector */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Date:</Text>
              <TouchableOpacity style={styles.dateSelector} onPress={() => setShowCalendar(!showCalendar)}>
                <Text style={styles.modalDateText}>{formatDateDisplay(selectedDate)}</Text>
              </TouchableOpacity>
              {showCalendar && (
                <View style={styles.calendarContainer}>
                  <CalendarView
                    date={selectedDate}
                    onChange={(d: Date) => {
                      setSelectedDate(d);
                      setShowCalendar(false);
                    }}
                  />
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={handleAddExpense}
              >
                <Text style={styles.addButtonModalText}>Add Expense</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require('../../assets/images/home.png')}
            style={styles.navImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require('../../assets/images/bear.png')}
            style={styles.navImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require('../../assets/images/trophy.png')}
            style={styles.navImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require('../../assets/images/settings.png')}
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
    backgroundColor: '#fdddeeff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F8BBD9',
    marginTop: 40,
  },
  backButton: {
    fontSize: 12,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
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
  scrollContainer: {
    flex: 1,
  },
  mainContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#FFFFFF',
    textShadowOffset: {width: -1, height: -1},
    textShadowRadius: 0,
  },
  titleHighlight: {
    color: '#ee6055ff',
  },
  monthSelector: {
    marginBottom: 20,
  },
  monthSelectorLabel: {
    fontSize: 12,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
    marginBottom: 10,
  },
  monthScrollContainer: {
    maxHeight: 50,
  },
  monthButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  monthButton: {
    backgroundColor: '#E8A4C9',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  selectedMonthButton: {
    backgroundColor: '#D1477A',
  },
  monthButtonText: {
    fontSize: 10,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
  },
  selectedMonthButtonText: {
    color: '#FFFFFF',
  },
  overviewCard: {
    backgroundColor: '#E8A4C9',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  overviewTitle: {
    fontSize: 12,
    fontFamily: 'PressStart2P-Regular',
    color: '#666',
    marginBottom: 10,
  },
  totalAmount: {
    fontSize: 28,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
    marginBottom: 5,
  },
  overviewSubtext: {
    fontSize: 10,
    fontFamily: 'PressStart2P-Regular',
    color: '#666',
  },
  expensesSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
    marginBottom: 15,
  },
  expenseCard: {
    backgroundColor: '#E8A4C9',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseName: {
    fontSize: 12,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
    marginBottom: 3,
  },
  expenseDate: {
    fontSize: 8,
    fontFamily: 'PressStart2P-Regular',
    color: '#666',
  },
  expenseActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expenseAmount: {
    fontSize: 14,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
    marginRight: 10,
  },
  deleteButton: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  deleteIcon: {
    fontSize: 16,
  },
  emptyState: {
    backgroundColor: '#E8A4C9',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    fontFamily: 'PressStart2P-Regular',
    color: '#666',
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
  // Floating Add Button
  floatingAddButton: {
    position: 'absolute',
    bottom: 90, // Above bottom navigation
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#D1477A',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  addButtonText: {
    fontSize: 24,
    fontFamily: 'PressStart2P-Regular',
    color: '#FFFFFF',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxWidth: 350,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 14,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#999',
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 10,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 12,
    backgroundColor: '#FAFAFA',
    fontFamily: 'PressStart2P-Regular',
  },
  dateSelector: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FAFAFA',
  },
  modalDateText: {
    fontSize: 12,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
  },
  dateNote: {
    fontSize: 8,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 5,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 10,
    fontFamily: 'PressStart2P-Regular',
    color: '#666',
  },
  addButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#D1477A',
    alignItems: 'center',
  },
  addButtonModalText: {
    fontSize: 10,
    fontFamily: 'PressStart2P-Regular',
    color: '#FFFFFF',
  },
  calendarContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  calendarNav: {
    fontSize: 18,
    color: '#333',
    paddingHorizontal: 8,
  },
  calendarTitle: {
    fontSize: 12,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 6,
  },
  weekDay: {
    fontSize: 10,
    color: '#666',
    width: 28,
    textAlign: 'center',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 6,
  },
  dayCell: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCellSelected: {
    backgroundColor: '#D1477A',
  },
  dayText: {
    fontSize: 10,
    color: '#333',
  },
  dayTextSelected: {
    color: '#fff',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sortToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortToggleButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginLeft: 8,
  },
  sortToggleButtonActive: {
    backgroundColor: '#D1477A',
  },
  sortToggleText: {
    fontSize: 10,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
  },
  sortToggleTextActive: {
    color: '#FFFFFF',
  },
});
