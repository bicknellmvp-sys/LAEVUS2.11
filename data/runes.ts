export interface RuneData {
  name: string;
  symbol: string;
  meaning: string;
  description: string;
}

export const RUNE_DATABASE: RuneData[] = [
  { name: "Fehu", symbol: "ᚠ", meaning: "Wealth, abundance, success", description: "Represents movable property and the potential for growth." },
  { name: "Uruz", symbol: "ᚢ", meaning: "Strength, health, endurance", description: "Symbolizes the untamed power of the wild ox." },
  { name: "Thurisaz", symbol: "ᚦ", meaning: "Defense, conflict, protection", description: "Represents the thorn or giant, a force of protection through resistance." },
  { name: "Ansuz", symbol: "ᚨ", meaning: "Communication, wisdom, divine insight", description: "Associated with Odin, the god of wisdom." },
  { name: "Raido", symbol: "ᚱ", meaning: "Travel, rhythm, journey", description: "Symbolizes the movement of life's path." },
  { name: "Kenaz", symbol: "ᚲ", meaning: "Knowledge, creativity, torch", description: "Represents the illuminating light of knowledge." },
  { name: "Gebo", symbol: "ᚷ", meaning: "Gift, exchange, partnership", description: "Symbolizes balance and the spirit of mutual giving." },
  { name: "Wunjo", symbol: "ᚹ", meaning: "Joy, harmony, fellowship", description: "Represents happiness and emotional well-being." },
  { name: "Hagalaz", symbol: "ᚺ", meaning: "Crisis, change, hail", description: "Symbolizes uncontrollable elemental forces." },
  { name: "Nauthiz", symbol: "ᚾ", meaning: "Necessity, restriction, need", description: "Represents the struggle for survival." }
];
