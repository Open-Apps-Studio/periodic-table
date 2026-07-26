import { useState } from 'react';
import { ActivityIndicator, Linking, Pressable, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { usePalette } from '@/context/theme-context';

type BohrModelViewerProps = {
  modelUrl: string;
  posterUrl: string | null;
  elementName: string;
  color: string;
};

const MODEL_VIEWER_SCRIPT = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.3.1/model-viewer.min.js';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function buildViewerHtml({ modelUrl, posterUrl, elementName, color }: BohrModelViewerProps): string {
  const safeModelUrl = escapeHtml(modelUrl);
  const safePosterUrl = posterUrl ? escapeHtml(posterUrl) : '';
  const safeName = escapeHtml(elementName);
  const safeColor = escapeHtml(color);

  return `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <script type="module" src="${MODEL_VIEWER_SCRIPT}"></script>
    <style>
      * { box-sizing: border-box; }
      html, body { width: 100%; height: 100%; margin: 0; overflow: hidden; background: transparent; }
      model-viewer { width: 100%; height: 100%; background: radial-gradient(circle, ${safeColor}22 0%, transparent 58%); }
      .progress { position: absolute; left: 12%; right: 12%; bottom: 28px; height: 4px; overflow: hidden; border-radius: 999px; background: rgba(127,127,127,.2); }
      .bar { width: 0; height: 100%; border-radius: inherit; background: ${safeColor}; transition: width .2s ease; }
      .error { display: none; position: absolute; inset: 0; place-items: center; padding: 32px; color: #F1F5F9; background: #0C1016; font: 600 16px system-ui; text-align: center; }
    </style>
  </head>
  <body>
    <model-viewer
      src="${safeModelUrl}"
      ${safePosterUrl ? `poster="${safePosterUrl}"` : ''}
      alt="Interactive 3D Bohr model of ${safeName}"
      camera-controls
      auto-rotate
      auto-rotate-delay="1000"
      rotation-per-second="18deg"
      shadow-intensity="1"
      environment-image="neutral"
      interaction-prompt="auto"
      touch-action="pan-y">
      <div class="progress" slot="progress-bar"><div class="bar"></div></div>
    </model-viewer>
    <div class="error">The 3D model could not be loaded. Check your connection and try again.</div>
    <script>
      const viewer = document.querySelector('model-viewer');
      const progress = document.querySelector('.progress');
      const bar = document.querySelector('.bar');
      viewer.addEventListener('progress', (event) => {
        bar.style.width = (event.detail.totalProgress * 100) + '%';
        if (event.detail.totalProgress >= 1) progress.style.display = 'none';
      });
      viewer.addEventListener('error', () => {
        document.querySelector('.error').style.display = 'grid';
      });
    </script>
  </body>
</html>`;
}

export function BohrModelViewer(props: BohrModelViewerProps) {
  const palette = usePalette();
  const [failed, setFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  if (failed) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 14 }}>
        <Text style={{ color: palette.text, fontSize: 17, fontWeight: '700', textAlign: 'center' }}>
          The 3D viewer could not load.
        </Text>
        <Text style={{ color: palette.textSecondary, fontSize: 14, lineHeight: 20, textAlign: 'center' }}>
          Check your connection, then try again.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setFailed(false);
            setReloadKey((value) => value + 1);
          }}
          style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 18, borderRadius: 12, backgroundColor: palette.accent }}>
          <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '800' }}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <WebView
      key={reloadKey}
      source={{ html: buildViewerHtml(props), baseUrl: 'https://periodic-table.local' }}
      originWhitelist={['about:blank', 'https://*']}
      javaScriptEnabled
      allowsInlineMediaPlayback
      bounces={false}
      scrollEnabled={false}
      setSupportMultipleWindows={false}
      startInLoadingState
      renderLoading={() => (
        <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.background }}>
          <ActivityIndicator color={props.color} />
          <Text style={{ color: palette.textSecondary, fontSize: 13, marginTop: 10 }}>Loading 3D model…</Text>
        </View>
      )}
      onError={() => setFailed(true)}
      onHttpError={() => setFailed(true)}
      onShouldStartLoadWithRequest={(request) => {
        const isViewerResource =
          request.url === 'about:blank' ||
          request.url.startsWith('https://periodic-table.local') ||
          request.url.startsWith('https://ajax.googleapis.com/') ||
          request.url.startsWith('https://storage.googleapis.com/');

        if (!isViewerResource) {
          Linking.openURL(request.url);
        }
        return isViewerResource;
      }}
      style={{ flex: 1, backgroundColor: palette.background }}
    />
  );
}
