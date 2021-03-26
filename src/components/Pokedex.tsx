import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useRef }  from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Pressable, ActivityIndicator, Button, NativeScrollEvent, FlatList, Dimensions } from 'react-native';
import 'react-native-gesture-handler';
import { LoadingComponent } from './LoadingComponent';
import { getPokemon } from '../api/poke_api';
import { PokemonCard } from './PokemonCard'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
});

const Pokedex = ( props: any ) => {
    const { navigation } = props;
    const mainScrollViewRef = useRef<null | ScrollView>(null);
    const [ pokemons, setPokemons ] = useState<any[]>([]);
    const [ offset, setOffset ] = useState(0);
    const [ isPokemonsLoading, setIsPokemonsLoading ] = useState( true );
    const getPokemons = async (newOffset: number = 0, newLimit: number = 1 ) => {
      try{
        console.time("TIEMPO DE FETCH")
        setIsPokemonsLoading( true );
        const pokemonsUrl = `https://pokeapi.co/api/v2/pokemon?offset=${offset + newOffset}&limit=${newLimit}`
        const response = await fetch(pokemonsUrl);
        const data = await response.json(); 
        const allPromises = data.results.map( async (pokemon: any) => await getPokemon( pokemon.name ) );
        const results = await Promise.all( allPromises );
        //setPokemons( prevState => [...prevState, ...results] );
        //const accumulator = pokemons.push( [...results] );
        setPokemons( pokemons.concat( results ) );
        setOffset( offset + newOffset );
        setIsPokemonsLoading( false );
        console.timeEnd("TIEMPO DE FETCH")
      }catch( error ){
        console.log( "Error", error )
      }
    }
  
    useEffect(() => {
      setIsPokemonsLoading( true );
      getPokemons( 0, 5 );
    }, [])
  
    return (
      <View style={styles.container}>
        <Text style={{ padding: 10, color: "blue", fontSize: 14, alignItems: "center", justifyContent: "center" }} > Hola Bienvenidos a tu Pokedex by Alejandro Del Moral </Text>
        <ScrollView  style={{ height: "100%" }} contentContainerStyle={{ alignItems: "center", justifyContent: "center" }} ref={ mainScrollViewRef }  onContentSizeChange={() => mainScrollViewRef !== null && mainScrollViewRef.current && mainScrollViewRef.current.scrollToEnd({animated: true})}  >
            { isPokemonsLoading && <LoadingComponent style={{ height: "100%", alignItems: "center", justifyContent: "center"  }} /> || 
              <View style={{ width: 350 }}>
                {
                  pokemons !== null && pokemons !== undefined && pokemons.map( (poke, index) => <Pressable key={index } onPress={()=> navigation.navigate('Pokemon', poke) }>
                      <PokemonCard pokemon={ poke }  /> 
                    </Pressable>  )
                }
                <Button
                  onPress={() => getPokemons( 5, 5 )}
                  title="Cargar más pokemones"
                />
              </View>
            }
        </ScrollView>
      </View>
    )
  }

  export default Pokedex;