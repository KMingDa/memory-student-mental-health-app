import { useFonts } from "expo-font";
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ChatPage() {
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

  // Animation states for messages
  const [fadeAnim1] = useState(new Animated.Value(0));
  const [fadeAnim2] = useState(new Animated.Value(0));
  const [fadeAnim3] = useState(new Animated.Value(0));
  const [fadeAnim4] = useState(new Animated.Value(0));
  const [fadeAnim5] = useState(new Animated.Value(0));
  const [fadeAnimQuest] = useState(new Animated.Value(0));

  // Scale animations for pop effect
  const [scaleAnim1] = useState(new Animated.Value(0.8));
  const [scaleAnim2] = useState(new Animated.Value(0.8));
  const [scaleAnim3] = useState(new Animated.Value(0.8));
  const [scaleAnim4] = useState(new Animated.Value(0.8));
  const [scaleAnim5] = useState(new Animated.Value(0.8));
  const [scaleAnimQuest] = useState(new Animated.Value(0.8));

  useEffect(() => {
    // Animate messages one by one with delays
    const animateMessage = (fadeAnim: Animated.Value, scaleAnim: Animated.Value, delay: number) => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start();
      }, delay);
    };

    animateMessage(fadeAnim1, scaleAnim1, 500);
    animateMessage(fadeAnim2, scaleAnim2, 1500);
    animateMessage(fadeAnim3, scaleAnim3, 2500);
    animateMessage(fadeAnim4, scaleAnim4, 3500);
    animateMessage(fadeAnim5, scaleAnim5, 4500);
    animateMessage(fadeAnimQuest, scaleAnimQuest, 5500); // 1 second after last message
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4A90E2" barStyle="light-content" />

      {/* Header */}
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

      {/* Chat Container */}
      <View style={styles.chatContainer}>
        {/* Memory Status */}
        <View style={styles.statusBar}>
          <View style={styles.onlineIndicator}>
            <View style={styles.onlineDot} />
            <Text style={styles.statusText}>"Memory" is online!</Text>
          </View>
        </View>

        {/* Chat Messages */}
        <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
          
          {/* Message 1 */}
          <Animated.View 
            style={[
              styles.messageWrapper,
              {
                opacity: fadeAnim1,
                transform: [{ scale: scaleAnim1 }]
              }
            ]}
          >
            <View style={styles.memoryMessage}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>?</Text>
              </View>
              <View style={styles.messageBubble}>
                <Text style={styles.messageText}>Good evening, Misa.</Text>
              </View>
            </View>
          </Animated.View>

          {/* Message 2 */}
          <Animated.View 
            style={[
              styles.messageWrapper,
              {
                opacity: fadeAnim2,
                transform: [{ scale: scaleAnim2 }]
              }
            ]}
          >
            <View style={styles.memoryMessage}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>?</Text>
              </View>
              <View style={styles.messageBubble}>
                <Text style={styles.messageText}>I'm "Memory" and I'm here to be your companion!</Text>
              </View>
            </View>
          </Animated.View>

          {/* Message 3 */}
          <Animated.View 
            style={[
              styles.messageWrapper,
              {
                opacity: fadeAnim3,
                transform: [{ scale: scaleAnim3 }]
              }
            ]}
          >
            <View style={styles.memoryMessage}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>?</Text>
              </View>
              <View style={styles.messageBubble}>
                <Text style={styles.messageText}>my duty here is to guide you through your good or bad times together!</Text>
              </View>
            </View>
          </Animated.View>

          {/* Message 4 */}
          <Animated.View 
            style={[
              styles.messageWrapper,
              {
                opacity: fadeAnim4,
                transform: [{ scale: scaleAnim4 }]
              }
            ]}
          >
            <View style={styles.memoryMessage}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>?</Text>
              </View>
              <View style={styles.messageBubble}>
                <Text style={styles.messageText}>come find me at "town"!</Text>
              </View>
            </View>
          </Animated.View>

          {/* Message 5 */}
          <Animated.View 
            style={[
              styles.messageWrapper,
              {
                opacity: fadeAnim5,
                transform: [{ scale: scaleAnim5 }]
              }
            ]}
          >
            <View style={styles.memoryMessage}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>?</Text>
              </View>
              <View style={styles.messageBubble}>
                <Text style={styles.messageText}>I'll be waiting for you!</Text>
              </View>
            </View>
          </Animated.View>

        </ScrollView>

        {/* Quest Button - appears after last message with 1 second delay */}
        <Animated.View 
          style={[
            styles.questButtonContainer,
            { 
              opacity: fadeAnimQuest,
              transform: [{ scale: scaleAnimQuest }]
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.questButton}
            onPress={() => router.push('/journal/entry/page')}
          >
            <Image
              source={require('../../../assets/images/quest.png')}
              style={styles.questImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Bottom Navigation */}
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
  chatContainer: {
    flex: 1,
    margin: 20,
    backgroundColor: '#87CEEB',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  statusBar: {
    backgroundColor: '#FFF5F5',
    padding: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: {
    width: 8,
    height: 8,
    backgroundColor: '#10B981',
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 32,
    fontFamily: 'Jersey10',
    color: '#333',
  },
  messagesContainer: {
    flex: 1,
    padding: 20,
  },
  messageWrapper: {
    marginBottom: 15,
  },
  memoryMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#FF6B7A',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: 'white',
    fontSize: 32,
    fontFamily: 'Jersey10',
  },
  messageBubble: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 12,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageText: {
    fontSize: 28,
    fontFamily: 'Jersey10',
    color: '#333',
    lineHeight: 32,
  },
  questButtonContainer: {
    padding: 20,
    alignItems: 'center',
  },
  questButton: {
    elevation: 6,
    backgroundColor: 'transparent',
  },
  questImage: {
    width: 600,
    height: 100,
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
});