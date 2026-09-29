// src/screens/MenuScreen.js
// Combines Question 4 (useState/useEffect data loading), Question 5
// (useRef for search/scroll/render-count), and Question 8 (useMemo
// replacing the filtering effect, useCallback for stable handlers,
// React.memo'd MenuItemCard).

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  ActivityIndicator, StyleSheet, Pressable,
} from 'react-native';
import { CATEGORIES } from '../data/menu';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useMenu } from '../context/MenuContext';
import { useDebounce } from '../hooks/useDebounce';
import MenuItemCard from '../components/MenuItemCard';

const SORT_OPTIONS = [
  { key: 'default', label: 'Featured' },
  { key: 'price_asc', label: 'Price: Low to High' },
  { key: 'price_desc', label: 'Price: High to Low' },
  { key: 'name_asc', label: 'Name: A to Z' },
];

export default function MenuScreen({ navigation }) {
  const { colors } = useTheme();
  const { dispatch: cartDispatch, state: cartState } = useCart();

  // --- Question 4: loading state (now backed by shared MenuContext so
  // Manager Dashboard edits reflect here immediately — Question 10) ---
  const { menuItems, isLoading, error, reload } = useMenu();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('default');
  const [favouriteIds, setFavouriteIds] = useState([]);

  // --- Question 5: refs ---
  const searchInputRef = useRef(null);
  const flatListRef = useRef(null);
  const debounceTimerRef = useRef(null); // legacy manual debounce (kept for comparison)
  const renderCountRef = useRef(0);
  const previousQueryRef = useRef('');
  renderCountRef.current += 1;

  const [searchText, setSearchText] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Question 9 replaces the manual ref-debounce with the reusable hook.
  const debouncedSearch = useDebounce(searchText, 400);

  // Track distinct, non-consecutive-duplicate search terms.
  useEffect(() => {
    if (!debouncedSearch) return;
    if (debouncedSearch === previousQueryRef.current) return;
    previousQueryRef.current = debouncedSearch;
    setRecentSearches((prev) => [debouncedSearch, ...prev.filter((t) => t !== debouncedSearch)].slice(0, 5));
  }, [debouncedSearch]);

  // Update the header title with the visible item count.
  useEffect(() => {
    navigation.setOptions({ title: `Menu (${filteredItems.length})` });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuItems, selectedCategory, debouncedSearch, sortOption]);

  // Question 8: single useMemo replaces the old filteredItems state +
  // effect from Question 4. Filtering/sorting is DERIVED data — storing
  // it in state would create a second source of truth that can drift
  // out of sync with menuItems/selectedCategory/search, and would force
  // an extra render every time it's recomputed. useMemo recomputes it
  // for free, only when its dependencies actually change.
  const filteredItems = useMemo(() => {
    let list = menuItems;
    if (selectedCategory !== 'All') {
      list = list.filter((i) => i.category === selectedCategory);
    }
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.trim().toLowerCase();
      list = list.filter(
        (i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
      );
    }
    if (sortOption === 'price_asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sortOption === 'price_desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sortOption === 'name_asc') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [menuItems, selectedCategory, debouncedSearch, sortOption]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    reload();
    setTimeout(() => setRefreshing(false), 1500);
  }, [reload]);

  const onScroll = useCallback((e) => {
    setShowBackToTop(e.nativeEvent.contentOffset.y > 300);
  }, []);

  const scrollToTop = useCallback(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  // Question 8: stable handler references via useCallback so
  // React.memo on MenuItemCard actually prevents unrelated re-renders.
  const handleAddToCart = useCallback(
    (menuItem) => cartDispatch({ type: 'ADD_ITEM', payload: { menuItem } }),
    [cartDispatch]
  );

  const handleToggleFavourite = useCallback((itemId) => {
    setFavouriteIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  }, []);

  const clearSearch = () => {
    setSearchText('');
    searchInputRef.current?.focus();
  };

  const styles = getStyles(colors);

  if (isLoading && menuItems.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.subtext, marginTop: 8 }}>Loading menu…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.danger, marginBottom: 12 }}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={reload}>
          <Text style={{ color: '#fff' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.searchRow}>
        <TextInput
          ref={searchInputRef}
          style={styles.searchInput}
          placeholder="Search the menu…"
          placeholderTextColor={colors.subtext}
          value={searchText}
          onChangeText={setSearchText}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={clearSearch}><Text style={styles.clearBtn}>✕</Text></TouchableOpacity>
        )}
        <Text style={styles.debugLabel}>renders: {renderCountRef.current}</Text>
      </View>

      {isSearchFocused && !searchText && recentSearches.length > 0 && (
        <View style={styles.suggestionsRow}>
          {recentSearches.map((term) => (
            <TouchableOpacity key={term} style={styles.suggestionChip} onPress={() => setSearchText(term)}>
              <Text style={{ color: colors.text, fontSize: 12 }}>{term}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.chipsRow}>
        {['All', ...CATEGORIES].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, selectedCategory === cat && styles.chipActive]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={{ color: selectedCategory === cat ? '#fff' : colors.text }}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.sortRow}>
        {SORT_OPTIONS.map((opt) => (
          <Pressable key={opt.key} onPress={() => setSortOption(opt.key)}>
            <Text style={[styles.sortText, sortOption === opt.key && { color: colors.primary, fontWeight: '700' }]}>
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        ref={flatListRef}
        data={filteredItems}
        keyExtractor={(item) => item.id}
        numColumns={1}
        contentContainerStyle={{ padding: 12, paddingBottom: 40 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onScroll={onScroll}
        scrollEventThrottle={16}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={{ color: colors.subtext }}>No dishes match your search 🍽️</Text>
          </View>
        }
        renderItem={({ item }) => (
          <MenuItemCard
            item={item}
            isFavourite={favouriteIds.includes(item.id)}
            onAdd={handleAddToCart}
            onToggleFavourite={handleToggleFavourite}
          />
        )}
      />

      {showBackToTop && (
        <TouchableOpacity style={styles.backToTop} onPress={scrollToTop}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>↑ Top</Text>
        </TouchableOpacity>
      )}

      {cartState.items.length > 0 && (
        <TouchableOpacity style={styles.cartFab} onPress={() => navigation.navigate('Cart')}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>
            Cart · {cartState.items.reduce((n, i) => n + i.quantity, 0)}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    retryBtn: { backgroundColor: colors.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
    searchRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingTop: 12 },
    searchInput: {
      flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 10,
      padding: 10, color: colors.text, backgroundColor: colors.surface,
    },
    clearBtn: { color: colors.subtext, paddingHorizontal: 8, fontSize: 16 },
    debugLabel: { color: colors.subtext, fontSize: 10, marginLeft: 6 },
    suggestionsRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, paddingTop: 8, gap: 6 },
    suggestionChip: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 4 },
    chipsRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, paddingTop: 10, gap: 8 },
    chip: { borderWidth: 1, borderColor: colors.border, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 6 },
    chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    sortRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 10 },
    sortText: { fontSize: 11, color: colors.subtext },
    backToTop: {
      position: 'absolute', right: 16, bottom: 90, backgroundColor: colors.primary,
      paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, elevation: 4,
    },
    cartFab: {
      position: 'absolute', left: 16, right: 16, bottom: 16, backgroundColor: colors.text,
      paddingVertical: 14, borderRadius: 12, alignItems: 'center', elevation: 4,
    },
  });
