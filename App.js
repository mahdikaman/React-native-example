import * as React from "react";
import { useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  FlatList,
  ImageBackground,
  StyleSheet,
  Button,
  Text,
  Animated,
  View,
  Switch,
  useWindowDimensions,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useState, useEffect } from "react";

const images = new Array(3).fill(
  "https://res.cloudinary.com/dte9dk6cl/image/upload/v1667498448/nedladdning_o8rnsg.jpg"
);

function DetailsScreen() {
  const [brewery, setBreweries] = useState(null);
  useEffect(() => {
    fetch("https://api.openbrewerydb.org/breweries")
      .then((response) => response.json())
      .then((result) => {
        setBreweries(result);
      });
  }, []);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <FlatList
        data={brewery}
        renderItem={({ item }) => (
          <View
            style={{
              borderWidth: 1,
              borderTopRightRadius: 60,
              borderBottomRightRadius: 60,
              borderTopLefttRadius: 60,
              backgroundColor: `#fff8dc`,
            }}
          >
            <Text>Brewery Name: {item.name}</Text>
            <Text>Brewery City: {item.city}</Text>
            <Text>Brewery Country: {item.country}</Text>
          </View>
        )}
        keyExtractor={(city) => city.id}
      />
    </View>
  );
}

function HomeScreen({ navigation }) {
  const [brewery, setBreweries] = useState(null);
  useEffect(() => {
    fetch("https://api.openbrewerydb.org/breweries?per_page=50")
      .then((response) => response.json())
      .then((result) => {
        setBreweries(result);
      });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <FlatList
        data={brewery}
        renderItem={({ item }) => (
          <View
            style={{
              borderWidth: 1,
              backgroundColor: `#fff8dc`,
            }}
          >
            <Text>Brewery Name: {item.name}</Text>
          </View>
        )}
        keyExtractor={(city) => city.id}
      />
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate("Detaljer")}
      />
    </View>
  );
}

function SettingsScreen({ navigation }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    alert("sluta pilla på den !!!!!!");
  };
  const scrollX = useRef(new Animated.Value(0)).current;

  const { width: windowWidth } = useWindowDimensions();
  return (
    <View style={switchStyles.container}>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
      <View style={styles.container}>
        <SafeAreaView style={styles.container}>
          <View style={styles.scrollContainer}>
            <ScrollView
              horizontal={true}
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event([
                {
                  nativeEvent: {
                    contentOffset: {
                      x: scrollX,
                    },
                  },
                },
              ])}
              scrollEventThrottle={1}
            >
              {images.map((image, imageIndex) => {
                return (
                  <View
                    style={{ width: windowWidth, height: 250 }}
                    key={imageIndex}
                  >
                    <ImageBackground
                      source={{ uri: image }}
                      style={styles.card}
                    ></ImageBackground>
                  </View>
                );
              })}
            </ScrollView>
            <View style={styles.indicatorContainer}>
              {images.map((image, imageIndex) => {
                const width = scrollX.interpolate({
                  inputRange: [
                    windowWidth * (imageIndex - 1),
                    windowWidth * imageIndex,
                    windowWidth * (imageIndex + 1),
                  ],
                  outputRange: [8, 16, 8],
                  extrapolate: "clamp",
                });
                return (
                  <Animated.View
                    key={imageIndex}
                    style={[styles.normalDot, { width }]}
                  />
                );
              })}
            </View>
          </View>
        </SafeAreaView>
      </View>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate("Detaljer")}
      />
    </View>
  );
}

const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Hemma" component={HomeScreen} />
      <HomeStack.Screen name="Detaljer" component={DetailsScreen} />
    </HomeStack.Navigator>
  );
}

const SettingsStack = createNativeStackNavigator();

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Configuration" component={SettingsScreen} />
      <SettingsStack.Screen name="Detaljer" component={DetailsScreen} />
    </SettingsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    flex: 1,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 5,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    backgroundColor: "rgba(0,0,0, 0.7)",
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 5,
  },
  infoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  normalDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "silver",
    marginHorizontal: 4,
  },
  indicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 80,
    lineHeight: 82,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000c0",
  },
});
const switchStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Settings" component={SettingsStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
