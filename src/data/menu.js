// src/data/menu.js

export const CATEGORIES = ['Starters', 'Mains', 'Desserts', 'Drinks'];

export const MENU_ITEMS = [
  // Starters
  { id: 'm1', name: 'Chicken Seekh Kebab', description: 'Char-grilled minced chicken skewers with mint chutney.', price: 650, category: 'Starters', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&auto=format&fit=crop&q=60', isSpecial: true, isAvailable: true },
  { id: 'm2', name: 'Vegetable Spring Rolls', description: 'Crispy rolls stuffed with cabbage, carrot, and glass noodles.', price: 450, category: 'Starters', image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=500&auto=format&fit=crop&q=60', isSpecial: false, isAvailable: true },
  { id: 'm3', name: 'Soup of the Day', description: "Chef's daily selection of hot soup with garlic bread.", price: 400, category: 'Starters', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&auto=format&fit=crop&q=60', isSpecial: false, isAvailable: false },

  // Mains
  { id: 'm4', name: 'Chicken Handi', description: 'Slow-cooked chicken in a rich tomato-cream gravy.', price: 1100, category: 'Mains', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=60', isSpecial: true, isAvailable: true },
  { id: 'm5', name: 'Beef Karahi', description: 'Classic wok-tossed beef karahi with ginger and green chilli.', price: 1350, category: 'Mains', image: 'https://images.unsplash.com/photo-1585937421612-70a008356cfbe?w=500&auto=format&fit=crop&q=60', isSpecial: false, isAvailable: true },
  { id: 'm6', name: 'Grilled Salmon', description: 'Pan-seared salmon fillet with lemon-butter sauce and veggies.', price: 1800, category: 'Mains', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&auto=format&fit=crop&q=60', isSpecial: false, isAvailable: true },
  { id: 'm7', name: 'Margherita Pizza', description: 'Wood-fired pizza with fresh mozzarella, basil, and tomato.', price: 950, category: 'Mains', image: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?w=500&auto=format&fit=crop&q=60', isSpecial: false, isAvailable: true },
  { id: 'm8', name: 'Chicken Alfredo Pasta', description: 'Creamy alfredo pasta tossed with grilled chicken strips.', price: 1050, category: 'Mains', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&auto=format&fit=crop&q=60', isSpecial: false, isAvailable: true },
  { id: 'm9', name: 'Vegetable Biryani', description: 'Fragrant basmati rice layered with mixed vegetables and spices.', price: 750, category: 'Mains', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60', isSpecial: false, isAvailable: false },

 

  // Desserts
  { id: 'm10', name: 'Chocolate Lava Cake', description: 'Warm molten chocolate cake with vanilla ice cream.', price: 550, category: 'Desserts', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60', isSpecial: true, isAvailable: true },
  { id: 'm11', name: 'New York Cheesecake', description: 'Classic baked cheesecake with a berry compote.', price: 600, category: 'Desserts', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop&q=60', isSpecial: false, isAvailable: true },
  { id: 'm12', name: 'Gulab Jamun (2pc)', description: 'Soft milk-solid dumplings soaked in rose-cardamom syrup.', price: 350, category: 'Desserts', image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=500&auto=format&fit=crop&q=60', isSpecial: false, isAvailable: true },

  // Drinks
  { id: 'm13', name: 'Fresh Lime Soda', description: 'Sweet, salty, or plain — chilled and refreshing.', price: 250, category: 'Drinks', image: 'https://images.unsplash.com/photo-1624557033140-8b1e1a2b7a3b?w=500&auto=format&fit=crop&q=60', isSpecial: false, isAvailable: true },
  { id: 'm14', name: 'Cappuccino', description: 'Double espresso shot topped with steamed milk foam.', price: 320, category: 'Drinks', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=60', isSpecial: false, isAvailable: true },
  { id: 'm15', name: 'Melon Juice', description: 'Fresh Juice.', price: 250, category: 'Juice', image: 'https://images.unsplash.com/photo-1568909344668-6f14a07b56a0?w=500&auto=format&fit=crop&q=60', isSpecial: false, isAvailable: true }, 
];