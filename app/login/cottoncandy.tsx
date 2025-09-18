//second page
import { ImageBackground, StyleSheet } from 'react-native'

const mainBg = require('../../assets/images/cottoncandylogin.png')

export default function CottonCandyScreen() {
    return (
        <ImageBackground
            source={mainBg}
            style={styles.bg}
            resizeMode="contain"   // was "cover"
        >
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    bg: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#000', // optional: shows behind letterboxing areas
    },
    overlay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    text: { fontSize: 24, fontWeight: '600', color: '#fff' },
})