export const CATEGORIES = [
  { id: 'all', label: 'All Catalog' },
  { id: 'ai-hardware', label: 'AI Hardware & Robotics' },
  { id: 'electronics', label: 'Next-Gen Electronics' },
  { id: 'apparel', label: 'Cyber Apparel & Wearables' },
  { id: 'smart-home', label: 'Smart Home Automation' }
];

export const PRODUCTS = [
  {
    id: 'oct-001',
    name: 'OctaCore AI Neural Workstation',
    category: 'ai-hardware',
    price: 3499,
    originalPrice: 3899,
    rating: 4.9,
    reviewsCount: 128,
    stock: 14,
    badge: 'Flagship',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-high throughput AI local workstation featuring 128GB Unified HBM memory and liquid cryogenic cooling system.',
    specs: {
      'Neural Engine': 'OCT Tensor Engine v4.2',
      'Memory': '128GB HBM3 High Bandwidth',
      'Cooling': 'Dual Cryo-Chamber Liquid Loop',
      'Power Draw': '650W Max Efficiency'
    },
    features: [
      'Zero-latency local LLM inference (up to 70B models)',
      'Quantum-ready encryption co-processor',
      'Whisper-quiet acoustic dampening enclosure',
      'Hot-swappable PCI-e Gen 5 storage bays'
    ]
  },
  {
    id: 'oct-002',
    name: 'AeroGlass AR Vision Goggles',
    category: 'electronics',
    price: 1299,
    originalPrice: 1499,
    rating: 4.8,
    reviewsCount: 86,
    stock: 22,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80',
    description: 'Spatial computing glasses with micro-OLED 4K dual displays, real-time eye tracking, and hand gesture recognition.',
    specs: {
      'Display': 'Dual 4K Micro-OLED 120Hz',
      'Weight': '145 grams Lightweight Titanium',
      'Battery Life': '6 Hours Continuous Spatial Processing',
      'FOV': '110° Ultra-Wide Field of View'
    },
    features: [
      'Dynamic spatial audio mapping',
      'Pass-through high precision real-time depth sensor',
      'Custom prescription magnetic lens inserts',
      'Seamless multi-monitor spatial desktop workspace'
    ]
  },
  {
    id: 'oct-003',
    name: 'Quantum-Shield Haptic Jacket',
    category: 'apparel',
    price: 649,
    originalPrice: 799,
    rating: 4.7,
    reviewsCount: 64,
    stock: 9,
    badge: 'Limited Edition',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    description: 'Weatherproof technical jacket embedded with 64 precision haptic feedback nodes and active thermal regulation.',
    specs: {
      'Material': 'Graphene-Infused Waterproof Weave',
      'Haptics': '64 Micro-Actuators',
      'Heating/Cooling': 'Active 15°C - 45°C Thermal Control',
      'Connectivity': 'Bluetooth 5.3 Low Energy'
    },
    features: [
      'Biometric health and posture tracking sensors',
      'Integrated solar micro-harvesting panels',
      'Ultra-durable ballistic carbon fiber reinforcements',
      'App-configurable RGB pulse optical stripes'
    ]
  },
  {
    id: 'oct-004',
    name: 'Orbital Ambient Core Station',
    category: 'smart-home',
    price: 399,
    originalPrice: 450,
    rating: 4.9,
    reviewsCount: 210,
    stock: 35,
    badge: 'Trending',
    image: 'https://images.unsplash.com/photo-1507646298591-24757e69796d?auto=format&fit=crop&w=800&q=80',
    description: 'Floating magnetic levitation home hub with spatial atmospheric lighting, HEPA air plasma purification, and AI voice control.',
    specs: {
      'Levitation': 'Magnetic Superconductor Base',
      'Audio': '360° Spatial Acoustic Chamber',
      'Purification': 'Plasma HEPA Air Filter + UV-C',
      'Smart Standards': 'Matter, Zigbee 3.0, Thread Native'
    },
    features: [
      'Levitating floating core orb with ambient aura lights',
      'Smart home scene automation with localized processing',
      'Circadian rhythm synchronization lighting modes',
      'Built-in bio-metric environmental air quality monitor'
    ]
  },
  {
    id: 'oct-005',
    name: 'PulseRing Bio-Metric Tracker',
    category: 'apparel',
    price: 299,
    originalPrice: 349,
    rating: 4.6,
    reviewsCount: 142,
    stock: 40,
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    description: 'Sleek aerospace-grade titanium smart ring for continuous VO2 max, sleep architecture, and stress recovery analytics.',
    specs: {
      'Shell': 'Grade 5 Aerospace Titanium',
      'Water Resistance': '100m Submersible (10 ATM)',
      'Sensors': 'Optical PPG, Skin Temp, EDA Stress',
      'Battery': '7 Days Single Charge'
    },
    features: [
      'Zero-subscription full biometric suite app',
      'Wireless fast-charging sleek dock',
      'Real-time cardiac arrhythmia detection alerts',
      'Automatic activity and sleep stage breakdown'
    ]
  },
  {
    id: 'oct-006',
    name: 'CyberDrone Stealth Pro 4K',
    category: 'electronics',
    price: 1899,
    originalPrice: 2199,
    rating: 4.9,
    reviewsCount: 95,
    stock: 7,
    badge: 'Pro Choice',
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
    description: 'Autonomous obstacle-avoidance folding drone equipped with 1-inch CMOS 4K 120fps thermal hybrid camera.',
    specs: {
      'Camera': '4K 120fps 1" CMOS + FLIR Thermal',
      'Flight Time': '45 Minutes Per Battery',
      'Range': '15 km HD Video Transmission',
      'Wind Resistance': 'Level 7 High Altitude'
    },
    features: [
      '360° Omnidirectional LiDAR collision avoidance',
      'AI subject tracking with trajectory prediction',
      'Failsafe return-to-home with GPS/GLONASS/Galileo',
      'Ultra-compact folding carbon fiber frame'
    ]
  }
];

export const CATALOG_STATS = {
  totalProducts: PRODUCTS.length,
  inStockCount: PRODUCTS.reduce((acc, curr) => acc + curr.stock, 0),
  avgRating: (PRODUCTS.reduce((acc, curr) => acc + curr.rating, 0) / PRODUCTS.length).toFixed(1),
  topCategory: 'AI Hardware'
};
