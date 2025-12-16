export interface WordPuzzle {
  id: string;
  word: string;
  hint: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  blanks: number[]; // Vị trí các chữ cái cần điền (index trong word)
}

export const wordPuzzles: WordPuzzle[] = [
  // Beginner level
  {
    id: "puzzle-1",
    word: "hello",
    hint: "Lời chào thân thiện",
    category: "Giao tiếp",
    level: "beginner",
    blanks: [2, 3], // He__o
  },
  {
    id: "puzzle-2",
    word: "world",
    hint: "Hành tinh chúng ta đang sống",
    category: "Địa lý",
    level: "beginner",
    blanks: [1, 2, 3], // W__d
  },
  {
    id: "puzzle-3",
    word: "apple",
    hint: "Loại quả màu đỏ hoặc xanh",
    category: "Thực phẩm",
    level: "beginner",
    blanks: [1, 2, 3], // A__e
  },
  {
    id: "puzzle-4",
    word: "water",
    hint: "Chất lỏng cần thiết cho sự sống",
    category: "Thực phẩm",
    level: "beginner",
    blanks: [1, 2, 3], // W__r
  },
  {
    id: "puzzle-5",
    word: "house",
    hint: "Nơi bạn sống",
    category: "Nhà cửa",
    level: "beginner",
    blanks: [1, 2, 3], // H__e
  },
  {
    id: "puzzle-6",
    word: "school",
    hint: "Nơi học tập",
    category: "Giáo dục",
    level: "beginner",
    blanks: [2, 3, 4], // Sc__l
  },
  {
    id: "puzzle-7",
    word: "friend",
    hint: "Người bạn thân",
    category: "Giao tiếp",
    level: "beginner",
    blanks: [2, 3, 4], // Fr__d
  },
  {
    id: "puzzle-8",
    word: "happy",
    hint: "Cảm giác vui vẻ",
    category: "Cảm xúc",
    level: "beginner",
    blanks: [1, 2, 3], // H__y
  },
  {
    id: "puzzle-9",
    word: "music",
    hint: "Âm thanh có giai điệu",
    category: "Giải trí",
    level: "beginner",
    blanks: [1, 2, 3], // M__c
  },
  {
    id: "puzzle-10",
    word: "beautiful",
    hint: "Rất đẹp",
    category: "Tính từ",
    level: "beginner",
    blanks: [2, 3, 4, 5, 6], // Be__ful
  },
  // Intermediate level
  {
    id: "puzzle-11",
    word: "computer",
    hint: "Máy tính",
    category: "Công nghệ",
    level: "intermediate",
    blanks: [1, 2, 3, 4, 5], // C__er
  },
  {
    id: "puzzle-12",
    word: "education",
    hint: "Giáo dục, học tập",
    category: "Giáo dục",
    level: "intermediate",
    blanks: [1, 2, 3, 4, 5], // E__on
  },
  {
    id: "puzzle-13",
    word: "restaurant",
    hint: "Nhà hàng",
    category: "Ẩm thực",
    level: "intermediate",
    blanks: [1, 2, 3, 4, 5, 6], // R__nt
  },
  {
    id: "puzzle-14",
    word: "adventure",
    hint: "Cuộc phiêu lưu",
    category: "Du lịch",
    level: "intermediate",
    blanks: [2, 3, 4, 5, 6], // Ad__re
  },
  {
    id: "puzzle-15",
    word: "knowledge",
    hint: "Kiến thức",
    category: "Giáo dục",
    level: "intermediate",
    blanks: [1, 2, 3, 4, 5], // K__ge
  },
  {
    id: "puzzle-16",
    word: "challenge",
    hint: "Thử thách",
    category: "Từ vựng",
    level: "intermediate",
    blanks: [2, 3, 4, 5, 6], // Ch__ge
  },
  {
    id: "puzzle-17",
    word: "opportunity",
    hint: "Cơ hội",
    category: "Từ vựng",
    level: "intermediate",
    blanks: [1, 2, 3, 4, 5, 6], // O__ity
  },
  {
    id: "puzzle-18",
    word: "confidence",
    hint: "Sự tự tin",
    category: "Từ vựng",
    level: "intermediate",
    blanks: [2, 3, 4, 5, 6], // Co__ce
  },
  {
    id: "puzzle-19",
    word: "brilliant",
    hint: "Xuất sắc, thông minh",
    category: "Tính từ",
    level: "intermediate",
    blanks: [2, 3, 4, 5, 6], // Br__nt
  },
  {
    id: "puzzle-20",
    word: "magnificent",
    hint: "Tráng lệ, lộng lẫy",
    category: "Tính từ",
    level: "intermediate",
    blanks: [2, 3, 4, 5, 6, 7], // Ma__ent
  },
  // Advanced level
  {
    id: "puzzle-21",
    word: "extraordinary",
    hint: "Phi thường, đặc biệt",
    category: "Tính từ",
    level: "advanced",
    blanks: [4, 5, 6, 7, 8, 9], // Ext__ary
  },
  {
    id: "puzzle-22",
    word: "sophisticated",
    hint: "Tinh tế, phức tạp",
    category: "Tính từ",
    level: "advanced",
    blanks: [2, 3, 4, 5, 6, 7], // So__ed
  },
  {
    id: "puzzle-23",
    word: "accomplishment",
    hint: "Thành tựu",
    category: "Từ vựng",
    level: "advanced",
    blanks: [2, 3, 4, 5, 6, 7, 8], // Ac__ment
  },
  {
    id: "puzzle-24",
    word: "perseverance",
    hint: "Sự kiên trì",
    category: "Từ vựng",
    level: "advanced",
    blanks: [3, 4, 5, 6, 7, 8], // Per__nce
  },
  {
    id: "puzzle-25",
    word: "enthusiastic",
    hint: "Nhiệt tình, hăng hái",
    category: "Tính từ",
    level: "advanced",
    blanks: [2, 3, 4, 5, 6, 7, 8], // En__tic
  },
];

// Helper functions
export function getPuzzleById(id: string): WordPuzzle | undefined {
  return wordPuzzles.find((puzzle) => puzzle.id === id);
}

export function getPuzzlesByLevel(level: "beginner" | "intermediate" | "advanced"): WordPuzzle[] {
  return wordPuzzles.filter((puzzle) => puzzle.level === level);
}

export function getAllPuzzles(): WordPuzzle[] {
  return wordPuzzles;
}

// Generate puzzle display string
export function generatePuzzleDisplay(word: string, blanks: number[]): string {
  return word
    .split("")
    .map((char, index) => (blanks.includes(index) ? "_" : char))
    .join("");
}

