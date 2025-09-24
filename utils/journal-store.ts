import AsyncStorage from "@react-native-async-storage/async-storage";

const ENTRIES_KEY = "journal_entries";

export const saveEntryLocal = async (entry: any) => {
  const json = await AsyncStorage.getItem(ENTRIES_KEY);
  let entries = json ? JSON.parse(json) : [];
  entries.push(entry);
  console.log("Saving entries:", entries);
  await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
};


export const getEntriesLocal = async () => {
  const json = await AsyncStorage.getItem(ENTRIES_KEY);
  return json ? JSON.parse(json) : [];
};
