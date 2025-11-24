export interface AvatarCategory {
  id: string;
  name: string;
  avatars: string[];
}

export interface Frame {
  id: string;
  name: string;
  class: string;
  previewClass?: string;
}

export const AVATAR_CATEGORIES: AvatarCategory[] = [
  {
    id: 'cute',
    name: 'Fofos',
    avatars: [
      'https://api.dicebear.com/7.x/icons/svg?seed=Cat',
      'https://api.dicebear.com/7.x/icons/svg?seed=Dog',
      'https://api.dicebear.com/7.x/icons/svg?seed=Rabbit',
      'https://api.dicebear.com/7.x/icons/svg?seed=Bear',
      'https://api.dicebear.com/7.x/icons/svg?seed=Fox',
      'https://api.dicebear.com/7.x/icons/svg?seed=Penguin',
      'https://api.dicebear.com/7.x/icons/svg?seed=Owl',
      'https://api.dicebear.com/7.x/icons/svg?seed=Reindeer',
      'https://api.dicebear.com/7.x/icons/svg?seed=GiftBox',
      'https://api.dicebear.com/7.x/icons/svg?seed=Snowman',
    ]
  },
  {
    id: 'people',
    name: 'Pessoas',
    avatars: [
      // Men
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=c0aede',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Christopher&backgroundColor=d1d4f9',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack&backgroundColor=ffdfbf',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Jude&backgroundColor=ffd5dc',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert&backgroundColor=c0aede',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Sawyer&backgroundColor=d1d4f9',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Easton&backgroundColor=b6e3f4',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Ryker&backgroundColor=ffdfbf',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Micah&backgroundColor=ffd5dc',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=James&backgroundColor=c0aede',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=George&backgroundColor=d1d4f9',
      
      // Women
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia&backgroundColor=ffdfbf',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Amelia&backgroundColor=ffd5dc',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella&backgroundColor=b6e3f4',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia&backgroundColor=c0aede',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlotte&backgroundColor=d1d4f9',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Ava&backgroundColor=ffdfbf',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Harper&backgroundColor=ffd5dc',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Evelyn&backgroundColor=b6e3f4',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Abigail&backgroundColor=c0aede',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily&backgroundColor=d1d4f9',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Elizabeth&backgroundColor=ffdfbf',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia&backgroundColor=ffd5dc',
    ]
  },
  {
    id: 'objects',
    name: 'Objetos',
    avatars: [
      'https://api.dicebear.com/7.x/icons/svg?seed=Sofa',
      'https://api.dicebear.com/7.x/icons/svg?seed=Chair',
      'https://api.dicebear.com/7.x/icons/svg?seed=Lamp',
      'https://api.dicebear.com/7.x/icons/svg?seed=Book',
      'https://api.dicebear.com/7.x/icons/svg?seed=Cup',
      'https://api.dicebear.com/7.x/icons/svg?seed=Clock',
      'https://api.dicebear.com/7.x/icons/svg?seed=Camera',
      'https://api.dicebear.com/7.x/icons/svg?seed=Headphones',
      'https://api.dicebear.com/7.x/icons/svg?seed=Glasses',
      'https://api.dicebear.com/7.x/icons/svg?seed=Watch',
    ]
  },
  {
    id: 'christmas',
    name: 'Clássico Natal',
    avatars: [
      'https://api.dicebear.com/7.x/icons/svg?seed=Tree',
      'https://api.dicebear.com/7.x/icons/svg?seed=Star',
      'https://api.dicebear.com/7.x/icons/svg?seed=Bell',
      'https://api.dicebear.com/7.x/icons/svg?seed=Snowflake',
      'https://api.dicebear.com/7.x/icons/svg?seed=CandyCane',
      'https://api.dicebear.com/7.x/icons/svg?seed=Stocking',
      'https://api.dicebear.com/7.x/icons/svg?seed=Sleigh',
      'https://api.dicebear.com/7.x/icons/svg?seed=Wreath',
      'https://api.dicebear.com/7.x/icons/svg?seed=Candle',
      'https://api.dicebear.com/7.x/icons/svg?seed=Ornament',
    ]
  },
  {
    id: 'fun',
    name: 'Divertidos',
    avatars: [
      'https://api.dicebear.com/7.x/avataaars/svg?seed=FunSanta&top=hat&accessories=sunglasses',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=FunElf&top=winterHat1&accessories=kurt',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=FunReindeer&top=winterHat2&accessories=prescription02',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=FunSnowman&top=winterHat3&accessories=wayfarers',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=FunGingerbread&top=hat&accessories=eyepatch',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=FunGrinch&top=winterHat1&accessories=round',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=FunPenguin&top=winterHat2&accessories=sunglasses',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=FunBear&top=winterHat3&accessories=kurt',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=FunFox&top=hat&accessories=prescription02',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=FunOwl&top=winterHat1&accessories=wayfarers',
    ]
  }
];

export const FRAMES: Frame[] = [
  { id: 'none', name: 'Sem moldura', class: '' },
  
  // Natal Clássico
  { id: 'wreath', name: 'Guirlanda', class: 'border-4 border-christmas-green ring-4 ring-christmas-red shadow-lg' },
  { id: 'santa', name: 'Papai Noel', class: 'border-4 border-red-600 ring-4 ring-white shadow-xl' },
  { id: 'gold', name: 'Luxo Dourado', class: 'border-4 border-christmas-gold ring-2 ring-yellow-200 shadow-xl shadow-yellow-500/20' },
  { id: 'snow', name: 'Neve', class: 'border-4 border-white ring-4 ring-blue-100 shadow-lg shadow-blue-200/50' },
  
  // Cores Sólidas Premium
  { id: 'wine', name: 'Vinho', class: 'border-4 border-christmas-wine ring-2 ring-christmas-wine-light' },
  { id: 'green', name: 'Verde', class: 'border-4 border-christmas-green ring-2 ring-green-300' },
  { id: 'blue', name: 'Azul Real', class: 'border-4 border-blue-800 ring-2 ring-blue-400' },
  { id: 'purple', name: 'Roxo Místico', class: 'border-4 border-purple-800 ring-2 ring-purple-400' },
  { id: 'black', name: 'Black', class: 'border-4 border-gray-900 ring-2 ring-gray-600' },
  
  // Temáticos
  { id: 'candy', name: 'Doce', class: 'border-4 border-pink-400 ring-4 ring-white border-dashed' },
  { id: 'elf', name: 'Elfo', class: 'border-4 border-green-500 ring-4 ring-red-500' },
  { id: 'frozen', name: 'Congelado', class: 'border-4 border-cyan-200 ring-4 ring-white bg-cyan-50' },
  { id: 'night', name: 'Noite Feliz', class: 'border-4 border-indigo-900 ring-2 ring-yellow-400' },
  
  // Especiais
  { id: 'glow', name: 'Neon', class: 'border-2 border-white ring-4 ring-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.7)]' },
  { id: 'rainbow', name: 'Arco-íris', class: 'border-4 border-transparent bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 p-[2px] ring-2 ring-white' },
  { id: 'vintage', name: 'Vintage', class: 'border-8 border-double border-amber-700 ring-1 ring-amber-900' },
  { id: 'minimal', name: 'Minimalista', class: 'border border-gray-200 ring-1 ring-gray-100 shadow-sm' },
  { id: 'easter', name: 'Páscoa', class: 'border-4 border-pink-300 ring-4 ring-yellow-200' },
  { id: 'love', name: 'Amor', class: 'border-4 border-red-400 ring-4 ring-pink-200' },
];
