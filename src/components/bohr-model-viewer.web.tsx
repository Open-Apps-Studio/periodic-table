import { Image } from 'expo-image';
import { Linking, Pressable, Text, View } from 'react-native';
import { usePalette } from '@/context/theme-context';

type BohrModelViewerProps = {
  modelUrl: string;
  posterUrl: string | null;
  elementName: string;
  color: string;
};

export function BohrModelViewer({ modelUrl, posterUrl, elementName, color }: BohrModelViewerProps) {
  const palette = usePalette();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 18 }}>
      {posterUrl && (
        <Image
          source={{ uri: posterUrl }}
          accessibilityLabel={`Bohr model of ${elementName}`}
          style={{ width: 240, height: 240 }}
          contentFit="contain"
        />
      )}
      <Text style={{ color: palette.text, fontSize: 18, fontWeight: '800', textAlign: 'center' }}>
        Interactive 3D viewing is available in the iOS and Android app.
      </Text>
      <Pressable
        accessibilityRole="link"
        onPress={() => Linking.openURL(modelUrl)}
        style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 18, borderRadius: 12, backgroundColor: color }}>
        <Text style={{ color: '#0C1016', fontSize: 14, fontWeight: '800' }}>Download GLB model</Text>
      </Pressable>
    </View>
  );
}
