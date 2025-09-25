import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
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

export default function AddBudgetPage() {
  const router = useRouter();
  const { dispatch, state } = useTracker();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [customCategory, setCustomCategory] = useState('');

  const [fontsLoaded] = useFonts({
    'PressStart2P-Regular': require('../../assets/fonts/PressStart2P-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other'];
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'];
  const formattedDate = `${today.getDate().toString().padStart(2, '0')} ${months[today.getMonth()]} ${today.getFullYear()}`;

  const handleSaveBudget = () => {
    const finalCategory = selectedCategory === 'Other' ? customCategory : selectedCategory;
    const amount = parseFloat(budgetAmount);

    if (!finalCategory || !amount || amount <= 0) {
      Alert.alert('Error', 'Please fill in all fields with valid values');
      return;
    }

    // Check if budget already exists for this category and month
    const existingBudget = state.budgets.find(b => 
      b.category === finalCategory && b.month === currentMonth && b.year === currentYear
    );

    if (existingBudget) {
      // Update existing budget
      dispatch({
        type: 'UPDATE_BUDGET',
        payload: {
          ...existingBudget,
          limit: amount
        }
      });
    } else {
      // Create new budget
      dispatch({
        type: 'ADD_BUDGET',
        payload: {
          id: Date.now().toString(),
          category: finalCategory,
          limit: amount,
          spent: 0,
          month: currentMonth,
          year: currentYear
        }
      });
    }

    Alert.alert('Success', 'Budget saved successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
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
          <Text style={styles.title}>SET <Text style={styles.titleHighlight}>BUDGET</Text></Text>
          
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Select Category</Text>
            <View style={styles.categoryGrid}>
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.selectedCategory
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.categoryText,
                    selectedCategory === category && styles.selectedCategoryText
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedCategory === 'Other' && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Custom Category</Text>
                <TextInput
                  style={styles.textInput}
                  value={customCategory}
                  onChangeText={setCustomCategory}
                  placeholder="Enter category name"
                  placeholderTextColor="#999"
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Budget Amount (RM)</Text>
              <TextInput
                style={styles.textInput}
                value={budgetAmount}
                onChangeText={setBudgetAmount}
                placeholder="0.00"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveBudget}
            >
              <Text style={styles.saveButtonText}>Save Budget</Text>
            </TouchableOpacity>
          </View>

          {/* Current Budgets */}
          <View style={styles.currentBudgetsCard}>
            <Text style={styles.sectionTitle}>Current Month Budgets</Text>
            {state.budgets
              .filter(b => b.month === currentMonth && b.year === currentYear)
              .map((budget, index) => (
                <View key={index} style={styles.budgetItem}>
                  <View>
                    <Text style={styles.budgetCategory}>{budget.category}</Text>
                    <Text style={styles.budgetProgress}>
                      RM {budget.spent.toFixed(2)} / RM {budget.limit.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.budgetBar}>
                    <View 
                      style={[
                        styles.budgetFill, 
                        { width: `${Math.min((budget.spent / budget.limit) * 100, 100)}%` }
                      ]} 
                    />
                  </View>
                </View>
              ))
            }
          </View>
        </View>
      </ScrollView>
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
    marginTop: 40,
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
    flex: 1,
  },
  mainContainer: { 
    flex: 1, 
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
  formCard: { 
    backgroundColor: '#E8A4C9', 
    padding: 20, 
    borderRadius: 15, 
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
    marginBottom: 15,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    width: '30%',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedCategory: {
    backgroundColor: '#4A90E2',
  },
  categoryText: {
    fontSize: 10,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  inputContainer: {
    marginBottom: 15,
    width: '100%',
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 12,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 12,
    fontFamily: 'PressStart2P-Regular',
    color: '#fff',
  },
  currentBudgetsCard: {
    backgroundColor: '#E8A4C9',
    padding: 20,
    borderRadius: 15,
  },
  budgetItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  budgetCategory: {
    fontSize: 12,
    fontFamily: 'PressStart2P-Regular',
    color: '#000',
    marginBottom: 5,
  },
  budgetProgress: {
    fontSize: 10,
    fontFamily: 'PressStart2P-Regular',
    color: '#666',
    marginBottom: 10,
  },
  budgetBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
  },
  budgetFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 3,
  },
});
