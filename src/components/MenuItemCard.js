import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

// EXACT dish name -> EXACT dish image
const DISH_IMAGES = {
  'Chicken Seekh Kebab': { uri: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=500' },
  
  // FIXED - NEW LINKS
  'Vegetable Spring Rolls': { uri: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500' },
  'Soup of the Day': { uri: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500' },
  'Chicken Handi': { uri: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500' },
  'Beef Karahi': { uri: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500' },
  'Grilled Salmon': { uri: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500' },
  'Margherita Pizza': { uri: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500' },
  'Chicken Alfredo Pasta': { uri: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500' },
  'Vegetable Biryani': { uri: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500' },
  'Chocolate Lava Cake': { uri: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500' },
  'New York Cheesecake': { uri: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=500' },
  'Gulab Jamun (2pc)': { uri: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=500' },
  'Fresh Lime Soda': { uri: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=500' },

  // FIXED - NEW LINK
  'Cappuccino': { uri: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=500' },
};

const MenuItemCard = React.memo(({ item, isFavourite, onAdd, onToggleFavourite }) => {
  const { colors } = useTheme();
  
  // This line picks image by EXACT dish name
  const imageSource = DISH_IMAGES[item.name] || { uri: item.image };

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Image source={imageSource} style={styles.image} />

      <View style={styles.info}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
          <TouchableOpacity onPress={() => onToggleFavourite(item.id)}>
            <Text style={{ fontSize: 18, color: isFavourite ? '#E11D48' : colors.subtext }}>
              {isFavourite ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.desc, { color: colors.subtext }]} numberOfLines={2}>{item.description}</Text>
        <Text style={[styles.price, { color: colors.primary }]}>Rs. {item.price}</Text>
        <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.primary }]} onPress={() => onAdd(item)}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: { flexDirection: 'row', borderRadius: 12, borderWidth: 1, marginBottom: 12, overflow: 'hidden', height: 115 },
  image: { width: 110, height: 115, backgroundColor: '#eee' },
  info: { flex: 1, padding: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 14, fontWeight: '700', flex: 1, marginRight: 6 },
  desc: { fontSize: 11, marginTop: 4 },
  price: { fontSize: 13, fontWeight: '700', marginTop: 6 },
  addBtn: { marginTop: 8, paddingVertical: 6, borderRadius: 8, alignItems: 'center' },
});

export default MenuItemCard;