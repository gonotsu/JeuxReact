import ConnectPointsScreen from "@/screens/ConnectPointScreen";
import CouleurScreen from "@/screens/CouleurScreen";
import FanoronaSivyScreen from "@/screens/FanoronasivyScreen";
import FanoronaTeloScreen from "@/screens/FanoronateloScreen";
import FaritanyScreen from "@/screens/FaritanyScreen";
import JeuxImageScreen from "@/screens/JeuxImageScreen";
import MenuScreen from "@/screens/MenuScreen";
import NumberPuzzleScreen from "@/screens/PuzzleNumberScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { Stack } from "expo-router";
const Stack = createNativeStackNavigator();
export default function RootLayout() {
  return <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="Faritany" component={FaritanyScreen} />
      <Stack.Screen name="Fanorona" component={FanoronaTeloScreen} />
      <Stack.Screen name="FanoronaSivy" component={FanoronaSivyScreen}/>
      <Stack.Screen name="ConnectPoints" component={ConnectPointsScreen}/>
      <Stack.Screen name="Chiffre" component={NumberPuzzleScreen}/>
      <Stack.Screen name="couleur" component={CouleurScreen} />
      <Stack.Screen name="image" component={ JeuxImageScreen }/>
    </Stack.Navigator>;
}
