// src/components/MenuItemCard.js  (Question 8)
// Wrapped in React.memo so it only re-renders when ITS OWN props change —
// verified by the console.log below plus the before/after screenshots
// described in the Question 8 deliverable note.

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

function MenuItemCardBase({ item, isFavourite, onAdd, onToggleFavourite }) {
  const { colors } = useTheme();
  console.log(`[render] MenuItemCard: ${item.name}`); // proves memo is working

  const styles = getStyles(colors);
  return (
    <View style={[styles.card, !item.isAvailable && styles.cardDisabled]}>
      <Image source={{ uri: item.image }} style={styles.image} />
      {item.isSpecial && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Daily Special</Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.favBtn}
        onPress={() => onToggleFavourite(item.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={{ fontSize: 18 }}>{isFavourite ? '❤️' : '🤍'}</Text>
      </TouchableOpacity>

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>Rs {item.price}</Text>
          <TouchableOpacity
            style={[styles.addBtn, !item.isAvailable && styles.addBtnDisabled]}
            disabled={!item.isAvailable}
            onPress={() => onAdd(item)}
          >
            <Text style={styles.addBtnText}>{item.isAvailable ? 'Add' : 'Unavailable'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Custom comparator: only re-render if this specific item, its favourite
// state, or the (stable, useCallback-wrapped) handlers actually changed.
function areEqual(prevProps, nextProps) {
  return (
    prevProps.item === nextProps.item &&
    prevProps.isFavourite === nextProps.isFavourite &&
    prevProps.onAdd === nextProps.onAdd &&
    prevProps.onToggleFavourite === nextProps.onToggleFavourite
  );
}

export default React.memo(MenuItemCardBase, areEqual);

const getStyles = (colors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface, borderRadius: 12, marginBottom: 14,
      overflow: 'hidden', borderWidth: 1, borderColor: colors.border,
    },
    cardDisabled: { opacity: 0.5 },
    image: { width: '100%', height: 120 },
    badge: {
      position: 'absolute', top: 8, left: 8, backgroundColor: colors.warning,
      paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
    },
    badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
    favBtn: { position: 'absolute', top: 8, right: 8 },
    body: { padding: 10 },
    name: { fontSize: 16, fontWeight: '600', color: colors.text },
    description: { fontSize: 12, color: colors.subtext, marginVertical: 4 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
    price: { fontSize: 15, fontWeight: '700', color: colors.primary },
    addBtn: { backgroundColor: colors.primary, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
    addBtnDisabled: { backgroundColor: colors.disabled },
    addBtnText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  });
