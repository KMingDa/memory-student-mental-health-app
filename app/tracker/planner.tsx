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
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTracker } from '../../contexts/TrackerContext';
import PixelDialog from '../memory-modal/popout';

export default function PlannerPage() {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const { state, dispatch } = useTracker();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDay, setNewDay] = useState('1');
  const [newCategory, setNewCategory] = useState('General');
  const [newActive, setNewActive] = useState(true);

  const [fontsLoaded] = useFonts({
    'PressStart2P-Regular': require('../../assets/fonts/PressStart2P-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  const today = new Date();
  const currentDay = today.getDate();
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'];
  const formattedDate = `${today.getDate().toString().padStart(2, '0')} ${months[today.getMonth()]} ${today.getFullYear()}`;

  // No upcoming payments summary; list all recurring payments and allow add/edit

  // Helper function to get day suffix (1st, 2nd, 3rd, etc.)
  const getDaySuffix = (day: number) => {
    if (day >= 11 && day <= 13) {
      return 'th';
    }
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4A90E2" barStyle="light-content" />
      
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

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.mainContainer}>
          <Text style={styles.title}>EXPENSE <Text style={styles.titleHighlight}>PLANNER</Text></Text>
          
          {/* All Recurring Payments (click to toggle active/inactive) */}

          {/* Add Recurring Payment Modal Trigger */}
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Text style={styles.addButtonText}>+ Add Recurring Payment</Text>
          </TouchableOpacity>

          {/* Add Recurring Payment Modal */}
          <Modal visible={showAddModal} transparent animationType="slide" onRequestClose={() => setShowAddModal(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeaderRow}>
                  <Text style={styles.modalTitle}>Add Recurring Payment</Text>
                  <TouchableOpacity onPress={() => setShowAddModal(false)}>
                    <Text style={styles.closeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Name</Text>
                  <TextInput style={styles.textInput} value={newName} onChangeText={setNewName} placeholder="e.g. Spotify" placeholderTextColor="#999" />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Amount (RM)</Text>
                  <TextInput style={styles.textInput} value={newAmount} onChangeText={setNewAmount} placeholder="0.00" keyboardType="numeric" placeholderTextColor="#999" />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Day of month</Text>
                  <TextInput style={styles.textInput} value={newDay} onChangeText={setNewDay} placeholder="1-28" keyboardType="numeric" placeholderTextColor="#999" />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Category</Text>
                  <TextInput style={styles.textInput} value={newCategory} onChangeText={setNewCategory} placeholder="e.g. Entertainment" placeholderTextColor="#999" />
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                  <Text style={{ fontFamily: 'PressStart2P-Regular', fontSize: 10, marginRight: 8 }}>Active</Text>
                  <Switch value={newActive} onValueChange={setNewActive} />
                </View>

                <View style={styles.modalActionsRow}>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddModal(false)}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.addButtonModal} onPress={() => {
                    // validate
                    if (newName.trim() === '' || newAmount.trim() === '') {
                      Alert.alert('Error', 'Please fill name and amount');
                      return;
                    }
                    const amt = parseFloat(newAmount);
                    const dayNum = parseInt(newDay, 10);
                    if (isNaN(amt) || amt <= 0) { Alert.alert('Error', 'Invalid amount'); return; }
                    if (isNaN(dayNum) || dayNum < 1 || dayNum > 28) { Alert.alert('Error', 'Day must be 1-28'); return; }

                    const newPayment = {
                      id: Date.now().toString(),
                      name: newName.trim(),
                      amount: amt,
                      dayOfMonth: dayNum,
                      category: newCategory.trim() || 'General',
                      isActive: newActive,
                    };
                    dispatch({ type: 'ADD_RECURRING_PAYMENT', payload: newPayment });
                    setNewName(''); setNewAmount(''); setNewDay('1'); setNewCategory('General'); setNewActive(true);
                    setShowAddModal(false);
                  }}>
                    <Text style={styles.addButtonTextModal}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* All Recurring Payments */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>All Recurring Payments</Text>
            {state.recurringPayments.map((payment, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.paymentItem, !payment.isActive && styles.inactivePayment]}
                onPress={() => {
                  // toggle active
                  dispatch({ type: 'UPDATE_RECURRING_PAYMENT', payload: { ...payment, isActive: !payment.isActive } });
                }}
              >
                <View style={styles.paymentInfo}>
                  <Text style={[styles.paymentName, !payment.isActive && styles.inactiveText]}>{payment.name}</Text>
                  <Text style={[styles.paymentCategory, !payment.isActive && styles.inactiveText]}>{payment.category}</Text>
                  <Text style={[styles.paymentSchedule, !payment.isActive && styles.inactiveText]}>Every {payment.dayOfMonth}{getDaySuffix(payment.dayOfMonth)} of the month</Text>
                </View>
                <View style={styles.paymentDetails}>
                  <Text style={[styles.paymentAmount, !payment.isActive && styles.inactiveText]}>RM {payment.amount.toFixed(2)}</Text>
                  <Text style={[styles.paymentStatus, payment.isActive ? styles.activeStatus : styles.inactiveStatus]}>{payment.isActive ? 'Active' : 'Inactive'}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
                                    <View style={styles.bottomNav}>
                                      <TouchableOpacity style={styles.navItem} onPress={() => router.push('../furni-home/homesc')}>
                                        <Image source={require('../../assets/images/home.png')} style={styles.navImage} />
                                      </TouchableOpacity>
                              
                                      <TouchableOpacity style={styles.navItem} onPress={() => setShowDialog(true)}>
                                        <Image source={require('../../assets/images/bear.png')} style={styles.navImage} />
                                      </TouchableOpacity>
                              
                                      <TouchableOpacity style={styles.navItem} onPress={() => router.push('../../leaderboard/lead')}>
                                        <Image source={require('../../assets/images/trophy.png')} style={styles.navImage} />
                                      </TouchableOpacity>
                              
                                      <TouchableOpacity style={styles.navItem}>
                                        <Image source={require('../../assets/images/settings.png')} style={styles.navImage} />
                                      </TouchableOpacity>
                                    </View>
                              
                                    {/* PixelDialog 弹窗 */}
                                    <PixelDialog visible={showDialog} onClose={() => setShowDialog(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fdddeeff' 
  },
  header: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 20, 
    paddingVertical: 15, 
    backgroundColor: '#F8BBD9', 
    marginTop: 0,
  },
  backButton: { 
    fontSize: 12, 
    fontFamily: 'PressStart2P-Regular', 
    color: '#000' 
  },
  dateText: { 
    color: '#000', 
    fontSize: 16, 
    fontFamily: 'PressStart2P-Regular' 
  },
  profileIcon: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#fff', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  scrollContainer: { 
    flex: 1 
  },
  mainContainer: { 
    padding: 20 
  },
  title: { 
    fontSize: 20, 
    fontFamily: 'PressStart2P-Regular', 
    color: '#000', 
    textAlign: 'center', 
    marginBottom: 20 
  },
  titleHighlight: { 
    color: '#ee6055ff' 
  },
  sectionCard: {
    backgroundColor: '#E8A4C9',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
    marginBottom: 15,
  },
  paymentItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inactivePayment: {
    opacity: 0.5,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 12,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
    marginBottom: 3,
  },
  paymentCategory: {
    fontSize: 10,
    fontFamily: 'PressStart2P-Regular',
    color: '#666',
    marginBottom: 3,
  },
  paymentSchedule: {
    fontSize: 8,
    fontFamily: 'PressStart2P-Regular',
    color: '#999',
  },
  paymentDetails: {
    alignItems: 'flex-end',
  },
  paymentAmount: {
    fontSize: 12,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
    marginBottom: 3,
  },
  daysLeft: {
    fontSize: 8,
    fontFamily: 'PressStart2P-Regular',
    color: '#4A90E2',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  paymentStatus: {
    fontSize: 8,
    fontFamily: 'PressStart2P-Regular',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activeStatus: {
    color: '#4CAF50',
    backgroundColor: '#E8F5E8',
  },
  inactiveStatus: {
    color: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  inactiveText: {
    opacity: 0.5,
  },
  noPaymentsText: {
    fontSize: 10,
    fontFamily: 'PressStart2P-Regular',
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  addButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    marginBottom: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 12,
    fontFamily: 'PressStart2P-Regular',
    color: '#fff',
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
  /* Modal and input styles added to support Add Recurring Payment modal */
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
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 14,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#999',
  },
  inputContainer: {
    marginBottom: 12,
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
  modalActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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
  addButtonModal: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
  },
  addButtonTextModal: {
    fontSize: 10,
    fontFamily: 'PressStart2P-Regular',
    color: '#FFFFFF',
  },
});
