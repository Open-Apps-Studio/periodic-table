import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ELEMENTS } from '@/data/elements';
import { CategoryColors, withAlpha } from '@/constants/theme';
import { usePalette } from '@/context/theme-context';
import { useThemedStyles } from '@/hooks/use-themed-styles';
import { formatCellField } from '@/lib/cell-fields';
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
  cellFieldId: string;
  /** When set (category mode), other categories are dimmed. */
  highlightCategory?: ElementCategory | null;
  onPressElement: (el: PeriodicElement) => void;
}

export function PeriodicTable({ mode, cellFieldId, highlightCategory, onPressElement }: PeriodicTableProps) {
  const styles = useThemedStyles((p) => ({
    cell: {
      position: 'absolute',
      width: CELL,
      height: CELL,
      borderRadius: 9,
      borderWidth: 1.2,
      paddingTop: 2,
      paddingHorizontal: 3,
      paddingBottom: 3,
      alignItems: 'center',
      overflow: 'hidden',
    },
    number: {
      position: 'absolute',
      top: 3,
      left: 4,
      fontSize: 9,
      fontWeight: '600',
      color: p.textSecondary,
    },
    symbol: {
      marginTop: 10,
      fontSize: 20,
      fontWeight: '800',
      color: p.text,
      lineHeight: 22,
    },
    detail: {
      width: '100%',
      fontSize: 7.5,
      fontWeight: '600',
      color: p.textSecondary,
      marginTop: 2,
      textAlign: 'center',
      paddingHorizontal: 1,
    },
    axisLabel: {
      position: 'absolute',
      fontSize: 10,
      fontWeight: '700',
      color: p.textTertiary,
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
  }));

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
      <FBlockMarker styles={styles} x={cellX(3)} y={cellY(6)} label="57–71" color={CategoryColors.lanthanide} />
      <FBlockMarker styles={styles} x={cellX(3)} y={cellY(7)} label="89–103" color={CategoryColors.actinide} />

      {ELEMENTS.map((el) => {
        const dimmed = !!highlightCategory && el.category !== highlightCategory;
        return (
          <ElementCell
            key={el.number}
            styles={styles}
            el={el}
            detail={formatCellField(cellFieldId, el)}
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

function FBlockMarker({
  styles,
  x,
  y,
  label,
  color,
}: {
  styles: { cell: object; fBlockMarker: object; fBlockText: object };
  x: number;
  y: number;
  label: string;
  color: string;
}) {
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
  styles,
  el,
  detail,
  heat,
  heatMode,
  dimmed,
  onPress,
}: {
  styles: {
    cell: object;
    number: object;
    symbol: object;
    detail: object;
  };
  el: PeriodicElement;
  detail: string;
  heat: number | null;
  heatMode: boolean;
  dimmed: boolean;
  onPress: (el: PeriodicElement) => void;
}) {
  const palette = usePalette();
  const categoryColor = CategoryColors[el.category];

  let background: string;
  let border: string;
  if (heatMode) {
    if (heat !== null) {
      background = withAlpha(palette.accent, 0.06 + heat * 0.72);
      border = withAlpha(palette.accent, 0.25 + heat * 0.5);
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
      <Text
        style={styles.detail}
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.65}>
        {detail}
      </Text>
    </Pressable>
  );
});
