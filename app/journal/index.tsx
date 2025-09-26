import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PixelDialog from '../memory-modal/popout'; // adjust path if needed

export default function JournalMainPage() {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false); // <-- popout state

  const [fontsLoaded] = useFonts({
    'PressStart2P-Regular': require('../../assets/fonts/PressStart2P-Regular.ttf'),
  });

  if (!fontsLoaded) return null;

  const today = new Date();
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEPT','OCT','NOV','DEC'];
  const formattedDate = `${today.getDate().toString().padStart(2,'0')} ${months[today.getMonth()]} ${today.getFullYear()}`;

  const handleWritePress = () => router.push('/journal/mood/page');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFF5F5" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.dateText}>{formattedDate}</Text>
        <View style={styles.profileIcon}>
          <Image
            source={require('../../assets/images/misahead.png')}
            style={{ width: 28, height: 28, borderRadius: 14 }}
          />
        </View>
      </View>

      {/* Journal Container */}
      <View style={styles.journalContainer}>
        <View style={styles.spiralBinding}>
          {Array.from({ length: 12 }, (_, i) => (
            <View key={i} style={styles.spiralRing} />
          ))}
        </View>

        <View style={styles.journalContent}>
          <Image 
            source={require('../../assets/images/omen gif.gif')}
            style={styles.smallGif}
          />

          <View style={styles.journalTitleMiddleBox}>
            <View style={styles.journalTitleMiddleRect} />
            <Text style={styles.journalTitleMiddle}>Misa's Journal</Text>
          </View>

          <View style={styles.pancakeSticker}>
            <Image
              source={require('../../assets/images/pancake.png')}
              style={{ width: 60, height: 60, transform: [{ rotate: '-15deg' }] }}
            />
          </View>

          <View style={[styles.sticker, { top: 30, right: 70 }]}>
            <Image
              source={require('../../assets/images/diary.png')}
              style={{ width: 40, height: 40, transform: [{ rotate: '8deg' }] }}
            />
            <View style={styles.diaryNoteBox}>
              <Text style={styles.diaryNote} numberOfLines={1}>DO NOT OPEN!</Text>
            </View>
          </View>

          <View style={[styles.sticker, { bottom: 30, left: 30 }]}>
            <Image
              source={require('../../assets/images/fireplace.png')}
              style={{ width: 60, height: 60, transform: [{ rotate: '-10deg' }] }}
            />
          </View>

          <View style={[styles.sticker, { left: '50%', bottom: 150, marginLeft: -20 }]}>
            <Image
              source={require('../../assets/images/crown.png')}
              style={{ width: 40, height: 40, transform: [{ rotate: '15deg' }] }}
            />
          </View>

          <TouchableOpacity style={styles.writeButton} onPress={handleWritePress}>
            <Text style={styles.writeIcon}>✏️</Text>
          </TouchableOpacity>

          {/* Teddy Bear Button */}
          <TouchableOpacity
            onPress={() => setShowDialog(true)}
            style={{ position: "absolute", bottom: 50, left: 20, zIndex: 4 }}
          >
            <Image
              source={require('../../assets/images/bear.png')}
              style={{ width: 150, height: 150 }}
            />
          </TouchableOpacity>

          {/* PixelDialog Popout */}
          <PixelDialog visible={showDialog} onClose={() => setShowDialog(false)} />
        </View>

        <View style={styles.bookmark} />
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('../furni-home/homesc')}>
          <Image source={require('../../assets/images/home.png')} style={styles.navImage} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setShowDialog(true)}>
          <Image source={require('../../assets/images/bear.png')} style={styles.navImage} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('../leaderboard/lead')}>
          <Image source={require('../../assets/images/trophy.png')} style={styles.navImage} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Image source={require('../../assets/images/settings.png')} style={styles.navImage} />
        </TouchableOpacity>
      </View>
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
  smallGif: { position: 'absolute', top: 60, left: 20, width: 120, height: 120, borderRadius: 8, transform: [{ rotate: '10deg' }] },
  pancakeSticker: { position: 'absolute', bottom: 80, right: 30, justifyContent: 'center', alignItems: 'center', width: 60, height: 60 },
  sticker: { position: 'absolute', justifyContent: 'center', alignItems: 'center', width: 40, height: 40 },
  diaryNoteBox: { marginTop: 4, minWidth: 165, minHeight: 28, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1.5, borderColor: '#C0392B', borderRadius: 6, backgroundColor: '#C0392B', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' },
  diaryNote: { fontSize: 10, color: '#FFF', fontFamily: 'PressStart2P-Regular', textAlign: 'center', letterSpacing: 0.5, includeFontPadding: false, padding: 0 },
  writeButton: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#4A90E2', borderRadius: 25, width: 50, height: 50, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 6 },
  writeIcon: { fontSize: 24, fontFamily: 'PressStart2P-Regular', textAlign: 'center' },
  bookmark: { position: 'absolute', right: 0, top: 0, width: 20, height: 60, backgroundColor: '#FF8B94', borderTopRightRadius: 10 },
  bottomNav: { flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 15, paddingHorizontal: 20, marginBottom: -30, justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navImage: { width: 48, height: 48 },
  journalTitleMiddleBox: { position: 'absolute', top: '48%', left: '50%', transform: [{ translateX: -110 }, { translateY: -22 }], backgroundColor: 'transparent', zIndex: 1, alignItems: 'center', justifyContent: 'center' },
  journalTitleMiddleRect: { position: 'absolute', top: 0, left: -10, width: 280, height: 90, backgroundColor: 'rgba(252, 190, 190, 1)', borderWidth: 2, borderColor: '#fff', borderRadius: 12, zIndex: 0 },
  journalTitleMiddle: { fontSize: 28, color: '#222', fontFamily: 'PressStart2P-Regular', textAlign: 'center', letterSpacing: 1, zIndex: 1, paddingHorizontal: 15, paddingVertical: 8, width: 260, lineHeight: 36 },
  
  // Popout styles
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 999 },
  modalContent: { width: 250, padding: 20, backgroundColor: '#fff', borderRadius: 12, alignItems: 'center' },
  closeBtn: { marginTop: 15, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#4A90E2', borderRadius: 6 },
});
