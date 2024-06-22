import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const App = () => {
  const [pizzaTitle, setPizzaTitle] = useState('');
  const [pizzaData, setPizzaData] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de localização não concedida', 'Por favor, conceda permissão de localização para obter a localização.');
        return;
      }
      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
    })();
  }, []);

  const handleSearch = async () => {
    if (pizzaTitle.trim() === '') {
      Alert.alert('Aviso', 'Por favor, insira um sabor de pizza válido.');
      return;
    }
    try {
      const apiUrl = `http://192.168.0.103:3001/pizzas`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      const foundPizza = data.find(pizza => pizza.title.toLowerCase() === pizzaTitle.toLowerCase());
      if (foundPizza) {
        setPizzaData(foundPizza);
      } else {
        Alert.alert('Erro', 'Pizza não encontrada. Verifique o sabor e tente novamente.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Houve um problema na busca da pizza. Tente novamente mais tarde.');
    }
  };

  return (
    <ScrollView>
      <View>
        <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 20 }}>
          Busca de Pizzas
        </Text>
        <TextInput
          style={{ borderWidth: 1, margin: 10, padding: 8 }}
          placeholder="Digite o sabor da pizza"
          value={pizzaTitle}
          onChangeText={(text) => setPizzaTitle(text)}
        />
        <Button title="Buscar Pizza" onPress={handleSearch} />
        
        {location && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 40, textAlign: 'center', fontWeight: 'bold' }}>Sua Localização</Text>
            <Text style={{ textAlign: 'center'}}>Latitude: {location.coords.latitude}</Text>
            <Text style={{ textAlign: 'center', marginBottom: 20 }}>Longitude: {location.coords.longitude}</Text>
            <MapView
              style={{ width: '100%', height: 200 }}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Sua Localização"
              />
            </MapView>
          </View>
        )}

        {pizzaData && (
          <View style={{ marginTop: 70 }}>
            <Text style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center', marginTop: -50, marginBottom: 30 }}>{pizzaData.title}</Text>
            <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 10 }}>Sabor: {pizzaData.flavor}</Text>
            <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 10 }}>Ingredientes: {pizzaData.ingredients}</Text>
            <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 10 }}>Tamanhos: {pizzaData.sizes}</Text>
            <Text style={{ fontSize: 18, textAlign: 'center' }}>Preços: {pizzaData.prices}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default App;
