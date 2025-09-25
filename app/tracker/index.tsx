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

export default function TrackerMainPage() {
  const router = useRouter();
  const { getCurrentMonthExpenses, getCurrentMonthIncome, state, dispatch } = useTracker();
  const [chartView, setChartView] = useState<'month' | 'year'>('month');
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetInput, setBudgetInput] = useState(state.monthlyBudgetLimit.toString());

  // Load the custom font
  const [fontsLoaded] = useFonts({
    'PressStart2P-Regular': require('../../assets/fonts/PressStart2P-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  // Format today's date
  const today = new Date();
  const months = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'
  ];
  const formattedDate = `${today.getDate().toString().padStart(2, '0')} ${months[today.getMonth()]} ${today.getFullYear()}`;

  // Get dynamic data
  const currentExpenses = getCurrentMonthExpenses();
  const currentIncome = getCurrentMonthIncome();
  const monthlyBudget = state.monthlyBudgetLimit;

  // Helper: compute 6 buckets for the current month (each bucket = 5 days: 1-5,6-10,...26-30)
  const getMonthly5DayBuckets = (forDate = new Date()) => {
    const buckets = [0, 0, 0, 0, 0, 0]; // 6 buckets of 5 days each (assume 30 days)
    const tx = state.transactions || [];
    const month = forDate.getMonth();
    const year = forDate.getFullYear();

    tx.forEach((t: any) => {
      if (!t || t.type !== 'expense' || !t.date) return;
      const d = new Date(t.date);
      if (d.getMonth() === month && d.getFullYear() === year) {
        const day = Math.min(Math.max(d.getDate(), 1), 30); // clamp to 1..30
        const bucketIndex = Math.floor((day - 1) / 5); // 0..5
        buckets[bucketIndex] += Number(t.amount) || 0;
      }
    });

    return buckets;
  };

  // Helper: compute yearly monthly totals (12 months)
  const getYearlyMonthlyTotals = (forDate = new Date()) => {
    const monthsTotals = new Array(12).fill(0);
    const tx = state.transactions || [];
    const year = forDate.getFullYear();
    tx.forEach((t: any) => {
      if (!t || t.type !== 'expense' || !t.date) return;
      const d = new Date(t.date);
      if (d.getFullYear() === year) {
        monthsTotals[d.getMonth()] += Number(t.amount) || 0;
      }
    });
    return monthsTotals;
  };

  // Get chart data based on view
  const getChartData = () => {
    if (chartView === 'month') {
      // Monthly view grouped into 6 buckets (each 5 days), showing total spent in that 5-day period
      const data = getMonthly5DayBuckets();
      return {
        data,
        labels: ['1-5', '6-10', '11-15', '16-20', '21-25', '26-30'],
        title: 'This Month (5-day groups)'
      };
    } else {
      // Yearly data: totals per month
      const data = getYearlyMonthlyTotals();
      return {
        data,
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        title: 'This Year'
      };
    }
  };

  const chartData = getChartData();

  // Navigation handlers
  const handleExpenses = () => {
    router.push('/tracker/expenses');
  };

  const handleIncome = () => {
    router.push('/tracker/income');
  };

  const handlePlanner = () => {
    router.push('/tracker/planner');
  };

  const handleAddExpense = () => {
    router.push('/tracker/add-expense');
  };

  const handleAddIncome = () => {
    router.push('/tracker/add-income');
  };

  const handleAddBudget = () => {
    router.push('/tracker/add-budget');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4A90E2" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.dateText}>{formattedDate}</Text>
        <View style={styles.profileIcon}>
          <Image
            source={require('../../assets/images/misahead.png')}
            style={{ width: 28, height: 28, borderRadius: 14 }}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Scrollable Main Content */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          {/* Title */}
          <Text style={styles.title}>LUCA's <Text style={styles.titleHighlight}>TRACKER</Text></Text>
          
          {/* Dynamic Dashboard Card */}
          <TouchableOpacity style={styles.dashboardCard} onPress={() => { setBudgetInput(state.monthlyBudgetLimit.toString()); setShowBudgetModal(true); }}>
            <Text style={styles.dashboardTitle}>September 2025 Summary</Text>
            <View style={styles.dashboardRow}>
              <View>
                <Text style={styles.currentExpenses}>Expenses</Text>
                <Text style={styles.amount}>RM {currentExpenses.toFixed(2)}</Text>
              </View>
            </View>
            
            {/* Budget Progress Bar */}
            <View style={styles.budgetSection}>
              <Text style={styles.budgetTitle}>Monthly Budget Progress</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${Math.min((currentExpenses / monthlyBudget) * 100, 100)}%` }]} />
                </View>
                <Text style={styles.progressText}>RM {currentExpenses.toFixed(2)} spent of RM {monthlyBudget.toFixed(2)} budget</Text>
              </View>
            </View>

            {/* Net Balance */}
            <View style={styles.netBalanceContainer}>
              <Text style={styles.netBalanceLabel}>Net Balance:</Text>
              <Text style={[styles.netBalanceAmount, (currentIncome - currentExpenses) >= 0 ? styles.positiveBalance : styles.negativeBalance]}>
                RM {(currentIncome - currentExpenses).toFixed(2)}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Budget / Summary Modal */}
          <Modal visible={showBudgetModal} transparent animationType="slide" onRequestClose={() => setShowBudgetModal(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Budget & Settings</Text>

                <View style={{ marginTop: 12 }}>
                  <Text style={styles.inputLabel}>Monthly Budget Limit (RM)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={budgetInput}
                    onChangeText={setBudgetInput}
                    keyboardType="numeric"
                    placeholder="e.g. 600.00"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                  <TouchableOpacity style={styles.presetButton} onPress={() => setBudgetInput('300')}>
                    <Text style={styles.presetButtonText}>RM 300</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.presetButton} onPress={() => setBudgetInput('600')}>
                    <Text style={styles.presetButtonText}>RM 600</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.presetButton} onPress={() => setBudgetInput('1000')}>
                    <Text style={styles.presetButtonText}>RM 1000</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.modalActionsRow}>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => setShowBudgetModal(false)}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveButton} onPress={() => {
                    const val = parseFloat(budgetInput);
                    if (isNaN(val) || val <= 0) { Alert.alert('Invalid value', 'Please enter a valid positive number'); return; }
                    dispatch({ type: 'SET_MONTHLY_BUDGET_LIMIT', payload: val });
                    setShowBudgetModal(false);
                  }}>
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Action Buttons Grid */}
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionButton} onPress={handleExpenses}>
                <Image source={require('../../assets/images/paper.png')} style={styles.actionImage} resizeMode='contain' />
                <Text style={styles.actionText}>Expenses</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleIncome}>
                <Image source={require('../../assets/images/money.png')} style={styles.actionImage} resizeMode='contain' />
                <Text style={styles.actionText}>Income</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handlePlanner}>
                <Image source={require('../../assets/images/planner.png')} style={styles.actionImage} resizeMode='contain' />
                <Text style={styles.actionText}>Planner</Text>
              </TouchableOpacity>
          
          </View>

          {/* Interactive Overview Chart */}
          <View style={styles.overviewContainer}>
            <View style={styles.overviewHeader}>
              <Text style={styles.overviewTitle}>{chartView === 'month' ? 'Overview - this month' : 'Overview - this year'}</Text>
              <View style={styles.chartToggle}>
                <TouchableOpacity
                  style={[styles.toggleBtn, styles.singleToggle, chartView === 'month' ? styles.activeToggle : undefined]}
                  onPress={() => setChartView(chartView === 'month' ? 'year' : 'month')}
                >
                  <Text style={[styles.toggleText, chartView === 'month' ? styles.activeToggleText : undefined]}>
                    {chartView === 'month' ? 'M' : 'Y'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.chartContainer}>
              <View style={styles.chartAreaRow}>
                <View style={styles.chartInner}>
                  {/* Dynamic chart bars */}
                  <View style={styles.chartBars}>
                    {(() => {
                      const data = chartData.data;
                      const maxValue = Math.max(...data);
                      const colors = ['#A78BFA', '#60A5FA', '#34D399', '#F472B6', '#FBBF24', '#F87171', '#A3A3A3'];
                      const barWidth = data.length > 8 ? 24 : 50; // wider for yearly (12) to show full amounts, larger for month

                      return data.map((value: number, index: number) => {
                        const height = maxValue > 0 ? (value / maxValue) * 80 : 0;
                        return (
                          <View key={index} style={{ alignItems: 'center', width: barWidth }}>
                            <Text style={[styles.barValue, styles.barValueRotated]} numberOfLines={1}>{Number(value || 0).toFixed(0)}</Text>
                            <View
                              style={[
                                styles.bar,
                                { width: Math.max(6, barWidth - 6), height: Math.max(height, 5), backgroundColor: colors[index % colors.length] },
                              ]}
                            />
                          </View>
                        );
                      });
                    })()}
                  </View>
                  <View style={[styles.chartLabels, { marginTop: 8 }] }>
                    {chartData.labels.map((label, index) => (
                      <Text key={index} style={[styles.chartLabelVertical, { width: chartData.data.length > 8 ? 24 : 50 }]} numberOfLines={1}>{label}</Text>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

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
    paddingBottom: 40, // Extra padding at bottom for better scrolling
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
    textShadowColor: '#FFFFFF',
    textShadowOffset: {width: -1, height: -1},
    textShadowRadius: 0,
  },
  dashboardCard: {
    backgroundColor: '#E8A4C9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  dashboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 0,
  },
  dashboardTitle: {
    fontSize: 14,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
    marginBottom: 12,
    textAlign: 'left',
  },
  currentExpenses: {
    fontSize: 12,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  amount: {
    fontSize: 16,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
  },
  totalAmountContainer: {
    alignItems: 'flex-end',
  },
  totalAmount: {
    fontSize: 16,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#D1C4E9',
    borderRadius: 3,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 8,
    fontFamily: 'PressStart2P-Regular',
    color: '#666',
    textAlign: 'center',
  },
  budgetSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  budgetTitle: {
    fontSize: 10,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  netBalanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  netBalanceLabel: {
    fontSize: 12,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
  },
  netBalanceAmount: {
    fontSize: 14,
    fontFamily: 'PressStart2P-Regular',
  },
  positiveBalance: {
    color: '#4CAF50',
  },
  negativeBalance: {
    color: '#F44336',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#E8A4C9',
    padding: 15,
    borderRadius: 10,
    width: '30%',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  actionImage: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 8,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
    textAlign: 'center',
  },
  overviewContainer: {
    backgroundColor: '#E8A4C9',
    padding: 20,
    borderRadius: 15,
    minHeight: 200, // Set minimum height instead of flex: 1
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  overviewTitle: {
    fontSize: 12,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
  },
  chartToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 8,
    padding: 2,
  },
  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginHorizontal: 1,
  },
  activeToggle: {
    backgroundColor: '#fff',
  },
  toggleText: {
    fontSize: 10,
    fontFamily: 'PressStart2P-Regular',
    color: '#666',
  },
  activeToggleText: {
    color: '#000',
  },
  singleToggle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  chartContainer: {
    flex: 1,
  },
  chartAreaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yAxisContainer: {
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 6,
  },
  yAxisTitle: {
    fontSize: 10,
    fontFamily: 'PressStart2P-Regular',
    color: '#666',
    transform: [{ rotate: '-90deg' }],
    writingDirection: 'ltr',
    textAlign: 'center',
  },
  chartInner: {
    flex: 1,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 100,
    marginBottom: 10,
  },
  bar: {
    width: 25,
    borderRadius: 5,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  chartLabel: {
    fontSize: 10,
    fontFamily: 'PressStart2P-Regular',
    color: '#666',
  },
  chartLabelVertical: {
    fontSize: 8,
    fontFamily: 'PressStart2P-Regular',
    color: '#666',
    transform: [{ rotate: '270deg' }],
    textAlign: 'center',
    lineHeight: 10,
  },
  barValue: {
    fontSize: 9,
    fontFamily: 'PressStart2P-Regular',
    color: '#222',
    marginBottom: 4,
  },
  barValueRotated: {
    transform: [{ rotate: '270deg' }],
    fontSize: 8,
    lineHeight: 10,
    marginBottom: 6,
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
  /* Modal & preset styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    width: '100%',
    maxWidth: 360,
  },
  modalTitle: {
    fontSize: 14,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
  },
  inputLabel: {
    fontSize: 10,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    fontSize: 12,
    backgroundColor: '#FAFAFA',
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
  },
  presetButton: {
    flex: 1,
    backgroundColor: '#E8A4C9',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  presetButtonText: {
    fontSize: 10,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
  },
  modalActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 10,
    fontFamily: 'PressStart2P-Regular',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 10,
    fontFamily: 'PressStart2P-Regular',
    color: '#fff',
  },
});
