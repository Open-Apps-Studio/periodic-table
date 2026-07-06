import { ReactNode, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface ZoomableProps {
  contentWidth: number;
  contentHeight: number;
  /** Hard zoom bounds relative to the fit-to-width scale. */
  minScaleFactor?: number;
  maxScale?: number;
  children: ReactNode;
}

/**
 * Pinch-to-zoom + pan viewport. The content keeps a top-left transform origin,
 * so translation is in screen pixels and clamping stays simple.
 */
export function Zoomable({
  contentWidth,
  contentHeight,
  minScaleFactor = 1,
  maxScale = 2.5,
  children,
}: ZoomableProps) {
  const [viewport, setViewport] = useState<{ w: number; h: number } | null>(null);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setViewport((prev) => (prev && prev.w === width && prev.h === height ? prev : { w: width, h: height }));
  };

  return (
    <View style={styles.fill} onLayout={onLayout}>
      {viewport && (
        <ZoomableInner
          key={`${viewport.w}x${viewport.h}`}
          viewportWidth={viewport.w}
          viewportHeight={viewport.h}
          contentWidth={contentWidth}
          contentHeight={contentHeight}
          minScaleFactor={minScaleFactor}
          maxScale={maxScale}>
          {children}
        </ZoomableInner>
      )}
    </View>
  );
}

function ZoomableInner({
  viewportWidth,
  viewportHeight,
  contentWidth,
  contentHeight,
  minScaleFactor,
  maxScale,
  children,
}: ZoomableProps & { viewportWidth: number; viewportHeight: number; minScaleFactor: number }) {
  const fitScale = viewportWidth / contentWidth;
  const minScale = fitScale * minScaleFactor;

  const initialTy = Math.max(0, (viewportHeight - contentHeight * fitScale) / 2);
  const scale = useSharedValue(fitScale);
  const tx = useSharedValue(0);
  const ty = useSharedValue(initialTy);
  const savedScale = useSharedValue(fitScale);
  const savedTx = useSharedValue(0);
  const savedTy = useSharedValue(initialTy);

  const clampX = (x: number, s: number) => {
    'worklet';
    const overflow = contentWidth * s - viewportWidth;
    return overflow <= 0 ? (viewportWidth - contentWidth * s) / 2 : Math.min(0, Math.max(-overflow, x));
  };
  const clampY = (y: number, s: number) => {
    'worklet';
    const overflow = contentHeight * s - viewportHeight;
    return overflow <= 0 ? (viewportHeight - contentHeight * s) / 2 : Math.min(0, Math.max(-overflow, y));
  };

  const pan = Gesture.Pan()
    .maxPointers(2)
    .onStart(() => {
      savedTx.set(tx.get());
      savedTy.set(ty.get());
    })
    .onUpdate((e) => {
      tx.set(clampX(savedTx.get() + e.translationX, scale.get()));
      ty.set(clampY(savedTy.get() + e.translationY, scale.get()));
    });

  const pinch = Gesture.Pinch()
    .onStart(() => {
      savedScale.set(scale.get());
      savedTx.set(tx.get());
      savedTy.set(ty.get());
    })
    .onUpdate((e) => {
      const next = Math.min(maxScale!, Math.max(minScale, savedScale.get() * e.scale));
      const k = next / savedScale.get();
      scale.set(next);
      tx.set(clampX(e.focalX - k * (e.focalX - savedTx.get()), next));
      ty.set(clampY(e.focalY - k * (e.focalY - savedTy.get()), next));
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd((e) => {
      const zoomedIn = scale.get() > fitScale * 1.4;
      const next = zoomedIn ? fitScale : Math.min(maxScale!, fitScale * 2.2);
      const k = next / scale.get();
      scale.set(withTiming(next, { duration: 220 }));
      tx.set(withTiming(clampX(e.x - k * (e.x - tx.get()), next), { duration: 220 }));
      ty.set(withTiming(clampY(e.y - k * (e.y - ty.get()), next), { duration: 220 }));
    });

  const gesture = Gesture.Simultaneous(pan, pinch, doubleTap);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.get() }, { translateY: ty.get() }, { scale: scale.get() }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <View style={[styles.fill, styles.clip]}>
        <Animated.View
          style={[
            { width: contentWidth, height: contentHeight, transformOrigin: '0 0' },
            animatedStyle,
          ]}>
          {children}
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  clip: { overflow: 'hidden' },
});
