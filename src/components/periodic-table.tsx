import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ELEMENTS } from '@/data/elements';
import { CategoryColors, Palette, withAlpha } from '@/constants/theme';
import { DisplayMode, heatOf, heatRange } from '@/lib/display-modes';
import type { ElementCategory, PeriodicElement } from '@/types/element';

export const CELL = 76;
export const GAP = 5;
const STEP = CELL + GAP;
const LABEL = 22; // group/period label gutter
const F_BLOCK_GAP = 18; // visual gap above the lanthanide/actinide rows

export const TABLE_WIDTH = LABEL + 18 * STEP + GAP;
export const TABLE_HEIGHT = LABEL + 10 * STEP + F_BLOCK_GAP + GAP;

const cellX = (xpos: number) => LABEL + (xpos - 1) * STEP;
const cellY = (ypos: number) => LABEL + (ypos - 1) * STEP + (ypos >= 9 ? F_BLOCK_GAP : 0);

interface PeriodicTableProps {
  mode: DisplayMode;
  /** When set (category mode), other categories are dimmed. */
  highlightCategory?: ElementCategory | null;
  onPressElement: (el: PeriodicElement) => void;
}

export function PeriodicTable({ mode, highlightCategory, onPressElement }: PeriodicTableProps) {
  const range = heatRange(mode, ELEMENTS);
  const isHeat = !!mode.heatValue;

  return (
    <View style={{ width: TABLE_WIDTH, height: TABLE_HEIGHT }}>
      {/* Group numbers along the top, period numbers down the left */}
      {Array.from({ length: 18 }, (_, i) => (
        <Text key={`g${i}`} style={[styles.axisLabel, { left: cellX(i + 1), top: 0, width: CELL }]}>
          {i + 1}
        </Text>
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <Text key={`p${i}`} style={[styles.axisLabel, { left: 0, top: cellY(i + 1) + CELL / 2 - 8, width: LABEL - 6 }]}>
          {i + 1}
        </Text>
      ))}

      {/* 57-71 / 89-103 placeholders linking to the f-block rows */}
      <FBlockMarker x={cellX(3)} y={cellY(6)} label="57–71" color={CategoryColors.lanthanide} />
      <FBlockMarker x={cellX(3)} y={cellY(7)} label="89–103" color={CategoryColors.actinide} />

      {ELEMENTS.map((el) => {
        const dimmed = !!highlightCategory && el.category !== highlightCategory;
        return (
          <ElementCell
            key={el.number}
            el={el}
            value={mode.cellValue(el)}
            heat={isHeat ? heatOf(mode, el, range) : null}
            heatMode={isHeat}
            dimmed={dimmed}
            onPress={onPressElement}
          />
        );
      })}
    </View>
  );
}

function FBlockMarker({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return (
    <View
      style={[
        styles.cell,
        styles.fBlockMarker,
        { left: x, top: y, borderColor: withAlpha(color, 0.5) },
      ]}>
      <Text style={[styles.fBlockText, { color }]}>{label}</Text>
    </View>
  );
}

const ElementCell = memo(function ElementCell({
  el,
  value,
  heat,
  heatMode,
  dimmed,
  onPress,
}: {
  el: PeriodicElement;
  value: string | null;
  heat: number | null;
  heatMode: boolean;
  dimmed: boolean;
  onPress: (el: PeriodicElement) => void;
}) {
  const categoryColor = CategoryColors[el.category];

  let background: string;
  let border: string;
  if (heatMode) {
    if (heat !== null) {
      background = withAlpha(Palette.accent, 0.06 + heat * 0.72);
      border = withAlpha(Palette.accent, 0.25 + heat * 0.5);
    } else {
      background = withAlpha('#868E96', 0.08);
      border = withAlpha('#868E96', 0.25);
    }
  } else {
    background = withAlpha(categoryColor, 0.16);
    border = withAlpha(categoryColor, 0.55);
  }

  return (
    <Pressable
      onPress={() => onPress(el)}
      style={({ pressed }) => [
        styles.cell,
        {
          left: cellX(el.xpos),
          top: cellY(el.ypos),
          backgroundColor: background,
          borderColor: border,
          opacity: dimmed ? 0.18 : pressed ? 0.6 : 1,
        },
      ]}>
      <Text style={styles.number}>{el.number}</Text>
      <Text style={styles.symbol}>{el.symbol}</Text>
      <Text style={styles.name} numberOfLines={1}>
        {el.name}
      </Text>
      <Text style={styles.value} numberOfLines={1}>
        {value ?? '—'}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  cell: {
    position: 'absolute',
    width: CELL,
    height: CELL,
    borderRadius: 9,
    borderWidth: 1.2,
    paddingTop: 3,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  number: {
    position: 'absolute',
    top: 4,
    left: 5,
    fontSize: 10,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  symbol: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: '800',
    color: Palette.text,
  },
  name: {
    fontSize: 8.5,
    fontWeight: '600',
    color: Palette.textSecondary,
    marginTop: 1,
  },
  value: {
    fontSize: 8.5,
    color: Palette.textTertiary,
    marginTop: 1,
  },
  axisLabel: {
    position: 'absolute',
    fontSize: 10,
    fontWeight: '700',
    color: Palette.textTertiary,
    textAlign: 'center',
  },
  fBlockMarker: {
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fBlockText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
