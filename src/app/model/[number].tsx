import { Stack, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { BohrModelViewer } from '@/components/bohr-model-viewer';
import { CategoryColors } from '@/constants/theme';
import { usePalette } from '@/context/theme-context';
import { getElement } from '@/data/elements';

export default function ModelScreen() {
  const palette = usePalette();
  const params = useLocalSearchParams<{ number: string }>();
  const element = getElement(Number(params.number));

  if (!element?.bohrModel3d) {
    return (
      <>
        <Stack.Screen options={{ title: '3D Model' }} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text style={{ color: palette.text, fontSize: 17, fontWeight: '700', textAlign: 'center' }}>
            No 3D model is available for this element.
          </Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: `${element.name} 3D Model` }} />
      <View style={{ flex: 1, backgroundColor: palette.background }}>
        <BohrModelViewer
          modelUrl={element.bohrModel3d}
          posterUrl={element.bohrModelImage}
          elementName={element.name}
          color={CategoryColors[element.category]}
        />
      </View>
    </>
  );
}
