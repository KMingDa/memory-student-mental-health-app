// ChatPage.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from "expo-font";
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PixelDialog from '../../memory-modal/popout';

export default function ChatPage() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    'Jersey15': require('../../../assets/fonts/Jersey15-Regular.ttf'),
    'Jersey10': require('../../../assets/fonts/Jersey10-Regular.ttf'),
  });

  const [showDialog, setShowDialog] = useState(false);
  const [userName, setUserName] = useState('');
  const today = new Date();
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEPT','OCT','NOV','DEC'];
  const formattedDate = `${today.getDate().toString().padStart(2,'0')} ${months[today.getMonth()]} ${today.getFullYear()}`;

  const createAnim = () => ({ fade: new Animated.Value(0), scale: new Animated.Value(0.8) });
  const [msg1, msg2, msg3, msg4, msg5, msgQuest] = [createAnim(), createAnim(), createAnim(), createAnim(), createAnim(), createAnim()];

  useEffect(() => {
    const animateMessage = (anim: any, delay: number) => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(anim.fade, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.spring(anim.scale, { toValue: 1, tension: 100, friction: 8, useNativeDriver: true }),
        ]).start();
      }, delay);
    };
    animateMessage(msg1, 500);
    animateMessage(msg2, 1500);
    animateMessage(msg3, 2500);
    animateMessage(msg4, 3500);
    animateMessage(msg5, 4500);
    animateMessage(msgQuest, 5500);
  }, []);

    useEffect(() => {
    AsyncStorage.getItem("currentUserName").then((name) => {
      if (name) setUserName(name);
    });
  }, []);

  if (!fontsLoaded) return null;

  const messages = [
    `Good evening, ${userName}.`,
    "I'm 'Memory' and I'm here to be your companion!",
    "My duty here is to guide you through your good or bad times together!",
    "Come find me at 'home'!",
    "I'll be waiting for you!"
  ];

  const anims = [msg1, msg2, msg3, msg4, msg5];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4A90E2" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.dateText}>{formattedDate}</Text>
        <View style={styles.profileIcon}>
          <Image source={require('../../../assets/images/misahead.png')} style={{ width: 28, height: 28, borderRadius: 14 }} resizeMode="cover" />
        </View>
      </View>

      {/* Chat Container */}
      <View style={styles.chatContainer}>
        {/* Status Bar */}
        <View style={styles.statusBar}>
          <View style={styles.onlineIndicator}>
            <View style={styles.onlineDot} />
            <Text style={styles.statusText}>"Memory" is online!</Text>
          </View>
        </View>

        {/* Messages */}
        <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
          {messages.map((msg, i) => (
            <Animated.View key={i} style={[styles.messageWrapper, { opacity: anims[i].fade, transform: [{ scale: anims[i].scale }] }]}>
              <View style={styles.memoryMessage}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>?</Text>
                </View>
                <View style={styles.messageBubble}>
                  <Text style={styles.messageText}>{msg}</Text>
                </View>
              </View>
            </Animated.View>
          ))}
        </ScrollView>

        {/* Quest Button */}
        <Animated.View style={[styles.questButtonContainer, { opacity: msgQuest.fade, transform: [{ scale: msgQuest.scale }] }]}>
          <TouchableOpacity style={styles.questButton} onPress={() => router.push('../../furni-home/homesc')}>
            <Image source={require('../../../assets/images/quest.png')} style={styles.questImage} resizeMode="contain" />
          </TouchableOpacity>
        </Animated.View>
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

      <PixelDialog visible={showDialog} onClose={() => setShowDialog(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E6F3FF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFF5F5', marginTop: 0 },
  dateText: { color: '#000', fontSize: 16, fontWeight: '600', fontFamily: 'PressStart2P-Regular' },
  profileIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  chatContainer: { flex: 1, marginHorizontal: 20, marginTop: 20, marginBottom: 30, backgroundColor: '#87CEEB', borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4.65, elevation: 8 },
  statusBar: { backgroundColor: '#FFF5F5', padding: 15, borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  onlineIndicator: { flexDirection: 'row', alignItems: 'center' },
  onlineDot: { width: 8, height: 8, backgroundColor: '#10B981', borderRadius: 4, marginRight: 8 },
  statusText: { fontSize: 20, fontFamily: 'Jersey10', color: '#333' },
  messagesContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 5 },
  messageWrapper: { marginBottom: 15 },
  memoryMessage: { flexDirection: 'row', alignItems: 'flex-start' },
  avatarContainer: { width: 30, height: 30, backgroundColor: '#FF6B7A', borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  avatarText: { color: 'white', fontSize: 16, fontFamily: 'Jersey10' },
  messageBubble: { backgroundColor: 'white', borderRadius: 15, padding: 12, maxWidth: '80%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  messageText: { fontSize: 18, fontFamily: 'Jersey10', color: '#333', lineHeight: 16 },
  questButtonContainer: {  paddingVertical: 0, alignItems: 'center', marginTop: 0, marginBottom: -60  },
  questButton: { elevation: 6, backgroundColor: 'transparent' },
  questImage: { width: 379, height: 180 },
  bottomNav: { flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 15, paddingHorizontal: 20, justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: '#E0E0E0' , marginBottom: -30},
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navImage: { width: 48, height: 48 },
});
