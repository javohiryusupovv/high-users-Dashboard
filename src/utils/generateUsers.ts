

import type { User } from "../types";

const FIRST_NAMES = [
  "Alexander", "Maria", "James", "Sofia", "Mohammed", "Emma", "Wei", "Olivia",
  "Carlos", "Fatima", "Dmitri", "Yuki", "Liam", "Amara", "Raj", "Isabella",
  "Omar", "Natasha", "Chen", "Aisha", "Viktor", "Lucia", "Hassan", "Elena",
  "Kofi", "Mei", "André", "Zara", "Nikolai", "Priya", "Mateo", "Ingrid",
  "Tariq", "Sakura", "Erik", "Leila", "João", "Freya", "Hiroshi", "Nadia",
  "Otabek", "Kamila", "Sardor", "Malika", "Bobur", "Nilufar", "Jasur",
  "Dildora", "Sherzod", "Gulnora",
];

const LAST_NAMES = [
  "Johnson", "Williams", "García", "Chen", "Müller", "Tanaka", "Patel",
  "Andersen", "Silva", "Ivanov", "Kim", "Okafor", "Dubois", "Svensson",
  "Ali", "Nakamura", "O'Brien", "Schmidt", "Fernandez", "Nguyen",
  "Kowalski", "Yamamoto", "Hassan", "Petrov", "Santos", "Johansson",
  "Karimov", "Toshmatov", "Rashidov", "Umarov", "Saidov", "Mirzayev",
  "Alimov", "Yusupov", "Khodjaev",
];

export const DEPARTMENTS = [
  "Engineering", "Marketing", "Sales", "HR", "Finance", "Operations",
  "Design", "Product", "Legal", "Support", "Data Science", "DevOps",
];

const CITIES = [
  "Tashkent", "New York", "London", "Tokyo", "Berlin", "Mumbai",
  "São Paulo", "Dubai", "Seoul", "Paris", "Singapore", "Sydney",
  "Toronto", "Moscow", "Lagos", "Istanbul", "Bangkok", "Cairo",
  "Mexico City", "Jakarta",
];

const COUNTRIES = [
  "Uzbekistan", "USA", "UK", "Japan", "Germany", "India", "Brazil",
  "UAE", "South Korea", "France", "Singapore", "Australia", "Canada",
  "Russia", "Nigeria", "Turkey", "Thailand", "Egypt", "Mexico", "Indonesia",
];


function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// generate users func
export function generateUsers(count: number): User[] {
  const rng = seededRandom(42);
  const users: User[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = FIRST_NAMES[Math.floor(rng() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(rng() * LAST_NAMES.length)];
    const cityIdx = Math.floor(rng() * CITIES.length);
    const deptIdx = Math.floor(rng() * DEPARTMENTS.length);

    users.push({
      id: `usr_${String(i + 1).padStart(5, "0")}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${i}@company.io`,
      age: 22 + Math.floor(rng() * 43),
      department: DEPARTMENTS[deptIdx],
      salary: 35000 + Math.floor(rng() * 165000),
      joinDate: new Date(
        2015 + Math.floor(rng() * 10),
        Math.floor(rng() * 12),
        1 + Math.floor(rng() * 28)
      )
        .toISOString()
        .split("T")[0],
      isActive: rng() > 0.15,
      phone: `+${Math.floor(rng() * 900 + 100)}-${Math.floor(rng() * 9000000 + 1000000)}`,
      city: CITIES[cityIdx],
      country: COUNTRIES[cityIdx],
      performanceScore: Math.floor(rng() * 101),
    });
  }

  return users;
}
