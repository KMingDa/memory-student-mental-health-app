import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import {
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function AddExpensePage() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    'PressStart2P-Regular': require('../../assets/fonts/PressStart2P-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  const today = new Date();
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'];
  const formattedDate = `${today.getDate().toString().padStart(2, '0')} ${months[today.getMonth()]} ${today.getFullYear()}`;

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

      <View style={styles.mainContainer}>
        <Text style={styles.title}>ADD <Text style={styles.titleHighlight}>EXPENSE</Text></Text>
        <View style={styles.formCard}>
          <Text style={styles.formText}>Expense form coming soon...</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdddeeff' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#F8BBD9', marginTop: 40,
  },
  backButton: { fontSize: 12, fontFamily: 'PressStart2P-Regular', color: '#000' },
  dateText: { color: '#000', fontSize: 16, fontFamily: 'PressStart2P-Regular' },
  profileIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  mainContainer: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontFamily: 'PressStart2P-Regular', color: '#000', textAlign: 'center', marginBottom: 20 },
  titleHighlight: { color: '#ee6055ff' },
  formCard: { backgroundColor: '#E8A4C9', padding: 20, borderRadius: 15, alignItems: 'center' },
  formText: { fontSize: 12, fontFamily: 'PressStart2P-Regular', color: '#666' },
});
