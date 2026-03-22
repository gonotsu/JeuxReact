import { useNavigation } from "@react-navigation/native";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { GameCard } from "../components/GameCard";

const games = [
  {
    id: "1",
    name: "Faritany",
    screen: "Faritany",
  },
  {
    id: "2",
    name: "Fanoron-Tsivy",
    screen: "FanoronaSivy",
  },
  {
    id: "3",
    name: "Fanorona Telo",
    screen: "Fanorona",
  },
  {
    id: "4",
    name: "Relier Emojies",
    screen: "ConnectPoints",
  },
  {
    id: "5",
    name: "Puzzle de Nombres",
    screen: "Chiffre",
  },
  {
    id: "6",
    name: "Couleur",
    screen: "couleur",
  },
  {
    id: "7",
    name: "Image",
    screen: "image",
  }
];

export default function MenuScreen() {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <GameCard
      title={item.name}
      onPress={() => navigation.navigate(item.screen)}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎮 Mes Jeux</Text>

      <FlatList
        data={games}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#06141d",
    padding: 20,
    paddingTop:40,
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
});