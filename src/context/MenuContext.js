import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MENU_ITEMS as SEED_MENU_ITEMS } from '../data/menu';
const REAL_IMAGES = {
  'Chicken Burger': 'https://images.unsplash.com/photo-1568909344668-6f14a07b56a0?w=500&auto=format&fit=crop&q=60',
  'Chicken Seekh Kebab': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&auto=format&fit=crop&q=60',
};

const MenuContext = createContext(undefined);
const MENU_STORAGE_KEY = '@restaurant_app/menu_overrides';

// Auto-detect backend URL - works for web AND mobile
const API_URL = Platform.OS === 'web'
 ? 'http://localhost:5000/api/menu'
  : 'http://192.168.1.8:5000/api/menu'; // change 192.168.1.8 to your current IP when testing on phone

function normalizeMenuItem(item) {
  return {
    id: String(item._id || item.id || item.name),
    name: item.name,
    description: item.description || '',
    price: Number(item.price) || 0,
    category: item.category || 'General',
    image: REAL_IMAGES[item.name] || item.image || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60`,
    isSpecial: Boolean(item.isSpecial),
    isAvailable: item.isAvailable!== false,
  };
}

const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState(SEED_MENU_ITEMS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remoteItemIds, setRemoteItemIds] = useState([]);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let remoteItems = [];
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Server returned ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Invalid menu response');
        remoteItems = data.map(normalizeMenuItem);
        setRemoteItemIds(remoteItems.map((item) => item.id));
      } catch (networkError) {
        console.log('Backend offline, using local menu');
        setRemoteItemIds([]);
        // Don't set error - we have local menu to show
      }

      const remoteNames = new Set(remoteItems.map((item) => item.name.toLowerCase()));
      const localItems = SEED_MENU_ITEMS.filter(
        (item) =>!remoteNames.has(item.name.toLowerCase())
      );
      const combinedItems = [...localItems,...remoteItems];

      const raw = await AsyncStorage.getItem(MENU_STORAGE_KEY);
      const overrides = raw? JSON.parse(raw) : {};

      const mergedItems = combinedItems.map((item) => ({
       ...item,
       ...(overrides[item.id] || {}),
      }));

      setMenuItems([...mergedItems,...(overrides.__added || [])]);
    } catch (loadError) {
      console.log('Menu loading error:', loadError.message);
      setMenuItems(SEED_MENU_ITEMS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const persistOverrides = useCallback(
    async (nextItems) => {
      const overrides = {};
      const added = [];
      nextItems.forEach((item) => {
        const seed = SEED_MENU_ITEMS.find((s) => s.id === item.id);
        const isRemote = remoteItemIds.includes(item.id);
        if (seed) {
          if (seed.price!== item.price || seed.isAvailable!== item.isAvailable) {
            overrides[item.id] = { price: item.price, isAvailable: item.isAvailable };
          }
        } else if (isRemote) {
          overrides[item.id] = { price: item.price, isAvailable: item.isAvailable };
        } else {
          added.push(item);
        }
      });
      overrides.__added = added;
      await AsyncStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(overrides));
    },
    [remoteItemIds]
  );

  const updatePrice = useCallback((itemId, newPrice) => {
    setMenuItems((prev) => {
      const next = prev.map((item) => item.id === itemId? {...item, price: Number(newPrice) } : item);
      persistOverrides(next);
      return next;
    });
  }, [persistOverrides]);

  const toggleAvailability = useCallback((itemId) => {
    setMenuItems((prev) => {
      const next = prev.map((item) => item.id === itemId? {...item, isAvailable:!item.isAvailable } : item);
      persistOverrides(next);
      return next;
    });
  }, [persistOverrides]);

  const addItem = useCallback((newItem) => {
    setMenuItems((prev) => {
      const next = [...prev, newItem];
      persistOverrides(next);
      return next;
    });
  }, [persistOverrides]);

  const value = { menuItems, isLoading, error, reload: load, updatePrice, toggleAvailability, addItem };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

export { MenuProvider };
export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) throw new Error('useMenu must be used within a MenuProvider');
  return context;
}