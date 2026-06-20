import { Pressable, Share, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { withAlpha } from '@/constants/theme';
import { usePalette } from '@/context/theme-context';
import { useThemedStyles } from '@/hooks/use-themed-styles';

export default function QrScreen() {
  const palette = usePalette();
  const styles = useThemedStyles((p) => ({
    container: { flex: 1, backgroundColor: p.background, padding: 16, gap: 14 },
    title: { color: p.text, fontSize: 20, fontWeight: '900' },
    body: { color: p.textSecondary, fontSize: 13.5, lineHeight: 20 },
    qrCard: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: p.surface,
      borderWidth: 1,
      borderColor: p.border,
      borderRadius: 16,
      padding: 18,
      gap: 12,
    },
    qrImage: { width: '100%', maxWidth: 300, aspectRatio: 1, borderRadius: 12, backgroundColor: '#FFFFFF' },
    caption: { color: p.textTertiary, fontSize: 12, textAlign: 'center', lineHeight: 17 },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 13,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: withAlpha(p.accent, 0.42),
      backgroundColor: withAlpha(p.accent, 0.12),
    },
    actionText: { color: p.accent, fontSize: 14, fontWeight: '900' },
  }));

  const shareApp = async () => {
    await Share.share({
      title: 'Periodic Table',
      message: 'Free, open-source, ad-free periodic table app.',
    });
  };

  return (
    <>
      <Stack.Screen options={{ title: 'QR-Code' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Install QR</Text>
        <Text style={styles.body}>
          Scan this code from another device or use the share button to send the app link.
        </Text>
        <View style={styles.qrCard}>
          <Image source={require('../../assets/install-qr.png')} style={styles.qrImage} contentFit="contain" />
          <Text style={styles.caption}>Bundled install/share QR. Replace the asset when the public store URL changes.</Text>
        </View>
        <Pressable style={styles.actionButton} onPress={shareApp}>
          <Ionicons name="share-social-outline" size={18} color={palette.accent} />
          <Text style={styles.actionText}>Share the app</Text>
        </Pressable>
      </View>
    </>
  );
}
