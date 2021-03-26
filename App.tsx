import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useRef }  from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Pressable, ActivityIndicator, Button, NativeScrollEvent, FlatList, Dimensions } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Pokedex from './src/components/Pokedex';
import { LoadingComponent } from './src/components/LoadingComponent';
import { genericFetch, getPokemon } from './src/api/poke_api';

const Stack = createStackNavigator();

const processEvolutions = ( data : any ) => {
  const newArray : [] = [];
  return getDeepObjects( data, newArray );
}


function getDeepObjects( data : any, newArray : [] ) {
  if( data === undefined ) return;
  newArray.push( data );
  getDeepObjects( data.evolves_to[0], newArray )
  return newArray;
}

const Slide = ( data : any ) => {
  const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
  return (
    <View style={{  flexDirection: "row", width: windowWidth - 20, height: 150, justifyContent: "center", alignItems: "center", backgroundColor: "yelllow", borderColor: "black", borderWidth: 5    }}    >
      <Image source={{ uri:  data.data[0] }}  style={{ height: 150, width: 150   }}   />
    </View>
  )
}

const Pokemon = (props : any) => {
  const [ evolutions, setEvolutions ] = useState([])
  const [ isEvolutionsLoading, setIsEvolutionsLoading ] = useState( true )
  const { navigation, route } = props;
  let spritesArray : any = [];

  const getEvolutions = async () => {
    const species = await genericFetch(route.params.species.url); //Fetch species
    const evolutionChain = species.evolution_chain;
    const evolutionsChain = await genericFetch(evolutionChain.url); //Fetch evolutions
    const evolutions : any = processEvolutions( evolutionsChain.chain );
    //fetch pokemons names to getSprites
    const allPromises = evolutions.map( async (pokemon: any) => await getPokemon( pokemon.species.name ) );
    const results = await Promise.all( allPromises );
    setEvolutions( results );
    setIsEvolutionsLoading( false );
  }

  useEffect(() => {
    setIsEvolutionsLoading( true );
    getEvolutions();
  }, [route.params.id])
  
  spritesArray = Object.keys(route.params.sprites).filter( ( sprite : any ) =>  typeof route.params.sprites[sprite] === 'string'  ).map(sprite => [route.params.sprites[sprite]])

  return(
    <View style={{ flex: 1, padding: 10 }} >
      <Text style={{ fontSize: 40, color: "black", textAlign: "center", alignItems: "center", justifyContent: "center", display: "flex"  }} > { route.params.name.toUpperCase() }  </Text>
      <View style={{ }}>
        <Text style={{ fontSize: 20, color: "blue", alignItems: "center", justifyContent: "center"  }} > Habilidades  </Text>
        { route.params.abilities.map( (ability : any, index : number) => <Text key={ ability + "_" + index } > { ability.ability.name }  </Text> ) }
      </View>
      <View >
        <Text style={{ fontSize: 20, color: "blue", alignItems: "center", justifyContent: "center", marginTop: 15  }} > Evoluciones  </Text>
        { !isEvolutionsLoading ? <View style={{ flexDirection: "row", justifyContent: "center" }}>
          {evolutions.map( (evolution : any, index : number) => 
            <View  key={ evolution + "_" + index }   style={{ flex: 1, alignItems: "center" }} > 
              <Image style={{ height: 70, width: 70 }} source={{ uri: evolution.sprites.front_default  }}  /> 
              <Text > { evolution.species.name }  </Text> 
            </View>
          )}
        </View> : <LoadingComponent style={{ height: "100%", alignItems: "center", justifyContent: "center"  }} /> }
      </View>
      <View style={{   }}>
        <Text style={{ fontSize: 20, color: "blue", alignItems: "center", justifyContent: "center", marginTop: 10, textAlignVertical: "top"  }} > STATS </Text>
        <View  style={{  }}>
            { route.params.stats.map( (stat : any, index : number) => {
              return <View key={ stat.base_stat + '_' + index }  style={{ flexDirection: "row", alignItems: "center"  }} >
                <Text style={{ flex: 0.33 }}  > { stat.stat.name[0].toUpperCase() + stat.stat.name.substring(1) }  </Text>
                <View style={{ flex: stat.base_stat / 100 / 1.69, backgroundColor: "lightblue", borderRadius: 10, height: 5 }}  /> 
                <Text style={{ flex: 0.1 }}  > { stat.base_stat }  </Text>
              </View>
            }) }
        </View>
      </View>
      <View style={{  }}>
        <Text style={{ fontSize: 20, color: "blue", alignItems: "center", justifyContent: "center", marginTop: 10, textAlignVertical: "top"  }} > Imágenes </Text>
        <FlatList
          pagingEnabled
          horizontal
          data={spritesArray}
          renderItem={({ item }) => <Slide key={ new Date().getMilliseconds }  data={item} /> }
        />
      </View>
    </View>
  )
}


export default function App() { 
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Pokedex}
          options={{ title: 'Página principal' }}
        />
        <Stack.Screen name="Pokemon" component={Pokemon} options={{ title: 'Detalles de pokemon' }}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
