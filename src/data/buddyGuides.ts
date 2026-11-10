/**
 * Everyday Home Fixes, Guides & YouTube Tutorials for AI Buddy
 */

export interface BuddyFixGuide {
  id: string;
  title: string;
  category: 'appliances' | 'plumbing' | 'plants' | 'home';
  icon: string;
  shortDesc: string;
  badge: string;
  symptoms: string[];
  steps: {
    number: number;
    title: string;
    description: string;
    tip?: string;
  }[];
  youtubeVideo?: {
    title: string;
    channelName: string;
    videoId: string; // YouTube embed ID
    duration: string;
    thumbnailUrl: string;
  };
}

export const BUDDY_FIX_GUIDES: BuddyFixGuide[] = [
  {
    id: 'broken-kettle',
    title: 'Electric Kettle Not Heating',
    category: 'appliances',
    icon: '🫖',
    badge: 'Quick 5-Min Fix',
    shortDesc: 'Won\'t turn on, trips switch, or light turns on but water stays cold.',
    symptoms: [
      'Power indicator stays unlit when switch is clicked',
      'Indicator glows but base element stays lukewarm',
      'Limescale mineral build-up crusting on bottom plate'
    ],
    steps: [
      {
        number: 1,
        title: 'Check the Safety Base Connector',
        description: 'Unplug the cord from the wall. Inspect the circular bronze connector rings on the base. If water or damp dust got in, dry it completely with a microfiber cloth.',
        tip: 'Look closely at the spring-loaded copper pins on the base; make sure neither pin is stuck down.'
      },
      {
        number: 2,
        title: 'Reset the Thermal Cut-off Switch',
        description: 'Most modern kettles (Philips, Prestige, Havells, Hamilton Beach) have a bi-metal safety trigger under the base plate. Leave the kettle unplugged for 10-15 minutes to let the thermo-fuse reset automatically.',
        tip: 'Never turn it on dry — boiling without water trips this safety switch every time.'
      },
      {
        number: 3,
        title: 'Perform White Vinegar Descaling',
        description: 'Hard water limescale insulates the element from the water. Pour 1 cup white vinegar + 1 cup water into the kettle, let sit 30 minutes, boil once, and rinse clean with fresh water.',
        tip: 'Your kettle will boil 40% faster and much quieter once the limescale is cleared!'
      }
    ],
    youtubeVideo: {
      title: 'How To Fix An Electric Kettle That Won’t Turn On Or Heat',
      channelName: 'DIY Home Repairs',
      videoId: 'K3o1N5nI0nI',
      duration: '4:18',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?auto=format&fit=crop&w=600&q=80'
    }
  },
  {
    id: 'leaking-water-pipe',
    title: 'Leaking Sink or PVC Water Pipe',
    category: 'plumbing',
    icon: '🚿',
    badge: 'Emergency Stop',
    shortDesc: 'Water dripping or spraying from a joint under the sink or bathroom pipe.',
    symptoms: [
      'Puddle forming under the sink basin',
      'Slow persistent drip from threaded PVC or brass connector',
      'Pin-hole hairline spray when pressure builds'
    ],
    steps: [
      {
        number: 1,
        title: 'Shut Off the Water Isolation Valve',
        description: 'Immediately find the small oval shut-off angle valve directly under your sink or next to the water meter. Turn it clockwise until hand-tight to stop the flow.',
        tip: 'If the valve is stiff, wrap a small dry hand towel around the handle for better grip.'
      },
      {
        number: 2,
        title: 'Dry and Inspect the Joint',
        description: 'Wipe the leaking section with an absorbent towel. Determine whether water is leaking through the threaded screw joint or a cracked pipe wall.',
        tip: 'If water is leaking around a nut, try hand-tightening it a quarter turn clockwise.'
      },
      {
        number: 3,
        title: 'Apply Teflon Tape or Silicone Rescue Tape',
        description: 'Unscrew the connection, wrap white PTFE Teflon tape clockwise 5-6 times around the male threads, and screw it back snugly.',
        tip: 'For emergency pipe punctures, self-fusing silicone tape stretched tightly over the leak will hold up to 100 PSI.'
      }
    ],
    youtubeVideo: {
      title: 'How to Fix a Leaking Sink Pipe Under 10 Minutes',
      channelName: 'Plumbing Mastery',
      videoId: 'gSj93P_0y_E',
      duration: '5:42',
      thumbnailUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80'
    }
  },
  {
    id: 'plant-care-revival',
    title: 'Flower & Houseplant Care',
    category: 'plants',
    icon: '🌸',
    badge: 'Plant Doctor',
    shortDesc: 'Diagnose yellowing leaves, drooping flowers, or wilting potted plants.',
    symptoms: [
      'Flowers drooping or petals falling prematurely',
      'Leaves turning pale yellow or crispy brown at tips',
      'Soil completely bone-dry or soggy with fungal gnats'
    ],
    steps: [
      {
        number: 1,
        title: 'Do the 2-Inch Soil Moisture Check',
        description: 'Push your index finger 2 inches into the soil. If it feels completely dry and dusty, give it a deep watering until water runs out the drainage holes.',
        tip: 'If soil is soggy and cold, your plant is overwatered! Hold off watering for 4-5 days.'
      },
      {
        number: 2,
        title: 'Check Sunlight Placement',
        description: 'Flowering plants (like red roses, yellow marigolds, or hibiscus) need at least 4-6 hours of gentle direct or bright indirect morning sunlight to produce blossoms.',
        tip: 'Keep pots away from direct AC vents or hot radiator drafts.'
      },
      {
        number: 3,
        title: 'Prune Spent Blossoms (Deadheading)',
        description: 'Snip off faded or dried flower heads with clean scissors just above the first five-leaflet leaf. This redirects energy to sprout fresh vibrant buds.',
        tip: 'Give your plant diluted seaweed or compost tea once a month during spring/summer!'
      }
    ],
    youtubeVideo: {
      title: 'How to Revive Dying Potted Flowers & Indoor Plants',
      channelName: 'Garden Answer',
      videoId: '1eB8l7XGjL0',
      duration: '7:15',
      thumbnailUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80'
    }
  },
  {
    id: 'tripped-circuit-breaker',
    title: 'Room Power Cut (Circuit Breaker)',
    category: 'home',
    icon: '⚡',
    badge: 'Home Electrical',
    shortDesc: 'One room lost power when turning on a microwave, iron, or geyser.',
    symptoms: [
      'Lights or sockets in one room suddenly went black',
      'Breaker box switch is sitting in the middle "tripped" position',
      'High-power appliance clicked off suddenly'
    ],
    steps: [
      {
        number: 1,
        title: 'Unplug the Heavy Appliance',
        description: 'Unplug whatever appliance was turned on right before the power cut (e.g., hair dryer, electric heater, iron). Overloading the circuit is the #1 cause.',
        tip: 'Check the appliance plug for any burnt plastic smell or scorched prongs.'
      },
      {
        number: 2,
        title: 'Locate Your Distribution Board (MCB)',
        description: 'Open your fuse box / MCB board. Look for the switch that has fallen down or is resting in the middle neutral position.',
        tip: 'Do not touch any exposed wires or work with wet hands.'
      },
      {
        number: 3,
        title: 'Reset with Firm Down-Then-Up Click',
        description: 'Push the tripped MCB lever firmly all the way DOWN to reset the spring mechanism, then push it all the way UP until it clicks firmly into the ON position.',
        tip: 'If it immediately snaps back down, you have a short circuit — call a certified electrician!'
      }
    ],
    youtubeVideo: {
      title: 'How to Safely Reset a Tripped Breaker in Your Home',
      channelName: 'Electro Basics',
      videoId: 'mC6rL54D2wU',
      duration: '3:30',
      thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80'
    }
  }
];

export interface PresetCameraScene {
  id: string;
  name: string;
  category: string;
  dominantColor: 'red' | 'yellow' | 'green' | 'blue' | 'neutral';
  colorName: string;
  description: string;
  imageUrl: string;
  sampleQuestion: string;
  buddyAnswer: string;
  actionTip: string;
}

export const PRESET_CAMERA_SCENES: PresetCameraScene[] = [
  {
    id: 'flower-red',
    name: 'Red Rose Flower Pot',
    category: 'plants',
    dominantColor: 'red',
    colorName: 'Rich Scarlet Red',
    description: 'A potted crimson red rose blossom with lush green foliage.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    sampleQuestion: 'See this is my flower pot! How does it look?',
    buddyAnswer: 'Oh wow, look at that! That gorgeous red flower in your pot looks so alive and vibrant! You\'re doing such an amazing job caring for it! 🌹',
    actionTip: 'Make sure it gets 4-5 hours of morning sunlight and keep the topsoil lightly moist.'
  },
  {
    id: 'flower-yellow',
    name: 'Yellow Marigold Blossom',
    category: 'plants',
    dominantColor: 'yellow',
    colorName: 'Sunny Golden Yellow',
    description: 'A bright sunny yellow marigold flower in full golden bloom.',
    imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=600&q=80',
    sampleQuestion: 'Check out the flower on my balcony, buddy!',
    buddyAnswer: 'Aww, that bright sunny yellow blossom instantly made my day! Yellow marigolds bring such cheerful energy to your balcony! 🌻',
    actionTip: 'Pinch off any dried back leaves to encourage fresh golden buds to sprout.'
  },
  {
    id: 'broken-kettle-scene',
    name: 'Electric Kettle on Counter',
    category: 'appliances',
    dominantColor: 'neutral',
    colorName: 'Steel & Black Base',
    description: 'Electric kettle with base contacts on a kitchen counter.',
    imageUrl: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?auto=format&fit=crop&w=600&q=80',
    sampleQuestion: 'My kettle stopped boiling water, can you see what is wrong?',
    buddyAnswer: 'I see the kettle! Don\'t worry, let\'s fix this together. First check the bottom base connector contacts for any dampness or limescale. 90% of kettle issues are just the safety thermal switch or dirty pins!',
    actionTip: 'Unplug it, let it cool for 10 minutes, wipe the base contacts completely dry, and check the spring pins.'
  },
  {
    id: 'leaking-pipe-scene',
    name: 'Leaking Under-Sink Pipe',
    category: 'plumbing',
    dominantColor: 'blue',
    colorName: 'Water & PVC Pipe',
    description: 'Water trap pipe joint with water dripping under a sink.',
    imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80',
    sampleQuestion: 'Water pipe is leaking here! What should I do right now?',
    buddyAnswer: 'Oof, a leaking pipe! First thing, my friend: shut off the water valve under the sink clockwise right now so your floor stays dry! Then grab a dry rag and let\'s seal the joint with Teflon tape.',
    actionTip: 'Turn off the oval isolation valve clockwise, then wrap Teflon tape 5-6 times around the threading.'
  }
];
