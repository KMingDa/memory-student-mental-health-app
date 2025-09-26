import { Slot } from 'expo-router';
import { View } from 'react-native';
import { TrackerProvider } from '../../contexts/TrackerContext';

export default function TrackerLayout() {
  return (
    <TrackerProvider>
      <View style={{ flex: 1, backgroundColor: '#fdddeeff' }}>
        <Slot />
      </View>
    </TrackerProvider>
  );
}
