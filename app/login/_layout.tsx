//first page a user sees when they open the app
//leave empty lol
import { Stack } from "expo-router";

export default function Layout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="cottoncandy" />
        </Stack>
    );
}