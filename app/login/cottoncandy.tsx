import { useRouter } from 'expo-router'
import { Button, ImageBackground, StyleSheet, View } from 'react-native'

const mainBg = require('../../assets/images/cottoncandylogin.png')

export default function CottonCandyScreen() {
  const router = useRouter()

  return (
    <ImageBackground
      source={mainBg}
      style={styles.bg}
      resizeMode="contain"
    >
      <View style={styles.overlay}>
        {/* Simple button to go to homesc.tsx */}
        <Button
          title="Go to Home"
          onPress={() => router.push('/furni-home/homesc')}
        />
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
})