// src/data/menu.js
// Static menu catalogue "served" by a fake network call in MenuScreen
// (see the 1.5s Promise in Question 4). Acts as the source of truth
// that ManagerDashboard edits flow back into via shared Context state.

export const CATEGORIES = ['Starters', 'Mains', 'Desserts', 'Drinks'];

export const MENU_ITEMS = [
  // Starters
  { id: 'm1', name: 'Chicken Seekh Kebab', description: 'Char-grilled minced chicken skewers with mint chutney.', price: 650, category: 'Starters', image: 'https://picsum.photos/seed/kebab/300/200', isSpecial: true, isAvailable: true },
  { id: 'm2', name: 'Vegetable Spring Rolls', description: 'Crispy rolls stuffed with cabbage, carrot, and glass noodles.', price: 450, category: 'Starters', image: 'https://picsum.photos/seed/springroll/300/200', isSpecial: false, isAvailable: true },
  { id: 'm3', name: 'Chicken Wings (6pc)', description: 'Spicy buffalo wings served with ranch dip.', price: 700, category: 'Starters', image: 'https://picsum.photos/seed/wings/300/200', isSpecial: false, isAvailable: true },
  { id: 'm4', name: 'Soup of the Day', description: "Chef's daily selection of hot soup with garlic bread.", price: 400, category: 'Starters', image: 'https://picsum.photos/seed/soup/300/200', isSpecial: false, isAvailable: false },

  // Mains
  { id: 'm5', name: 'Chicken Handi', description: 'Slow-cooked chicken in a rich tomato-cream gravy.', price: 1100, category: 'Mains', image: 'https://picsum.photos/seed/handi/300/200', isSpecial: true, isAvailable: true },
  { id: 'm6', name: 'Beef Karahi', description: 'Classic wok-tossed beef karahi with ginger and green chilli.', price: 1350, category: 'Mains', image: 'https://picsum.photos/seed/karahi/300/200', isSpecial: false, isAvailable: true },
  { id: 'm7', name: 'Grilled Salmon', description: 'Pan-seared salmon fillet with lemon-butter sauce and veggies.', price: 1800, category: 'Mains', image: 'https://picsum.photos/seed/salmon/300/200', isSpecial: false, isAvailable: true },
  { id: 'm8', name: 'Margherita Pizza', description: 'Wood-fired pizza with fresh mozzarella, basil, and tomato.', price: 950, category: 'Mains', image: 'https://picsum.photos/seed/pizza/300/200', isSpecial: false, isAvailable: true },
  { id: 'm9', name: 'Chicken Alfredo Pasta', description: 'Creamy alfredo pasta tossed with grilled chicken strips.', price: 1050, category: 'Mains', image: 'https://picsum.photos/seed/alfredo/300/200', isSpecial: false, isAvailable: true },
  { id: 'm10', name: 'Vegetable Biryani', description: 'Fragrant basmati rice layered with mixed vegetables and spices.', price: 750, category: 'Mains', image: 'https://picsum.photos/seed/biryani/300/200', isSpecial: false, isAvailable: false },

  // Desserts
  { id: 'm11', name: 'Chocolate Lava Cake', description: 'Warm molten chocolate cake with vanilla ice cream.', price: 550, category: 'Desserts', image: 'https://picsum.photos/seed/lavacake/300/200', isSpecial: true, isAvailable: true },
  { id: 'm12', name: 'New York Cheesecake', description: 'Classic baked cheesecake with a berry compote.', price: 600, category: 'Desserts', image: 'https://picsum.photos/seed/cheesecake/300/200', isSpecial: false, isAvailable: true },
  { id: 'm13', name: 'Gulab Jamun (2pc)', description: 'Soft milk-solid dumplings soaked in rose-cardamom syrup.', price: 350, category: 'Desserts', image: 'https://picsum.photos/seed/gulab/300/200', isSpecial: false, isAvailable: true },

  // Drinks
  { id: 'm14', name: 'Fresh Lime Soda', description: 'Sweet, salty, or plain — chilled and refreshing.', price: 250, category: 'Drinks', image: 'https://picsum.photos/seed/lime/300/200', isSpecial: false, isAvailable: true },
  { id: 'm15', name: 'Mango Lassi', description: 'Thick yogurt shake blended with seasonal mango pulp.', price: 380, category: 'Drinks', image: 'https://picsum.photos/seed/lassi/300/200', isSpecial: true, isAvailable: true },
  { id: 'm16', name: 'Cappuccino', description: 'Double espresso shot topped with steamed milk foam.', price: 320, category: 'Drinks', image: 'https://picsum.photos/seed/cappuccino/300/200', isSpecial: false, isAvailable: true },
];
