import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useRef }  from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Pressable, ActivityIndicator, Button, NativeScrollEvent, FlatList, Dimensions } from 'react-native';
import 'react-native-gesture-handler';

interface Props {
    pokemon: any //Me falta aprender como decirle que no importa que propiedades tiene que tener el objeto
  }

export const PokemonCard: React.FunctionComponent<Props> = props => {
    const { pokemon } = props;
    return (
        <View style={{ borderWidth: 2, borderColor: "lightblue", padding: 5, flexDirection: "row" }} > 
            <View style={{ display: 'flex' }}  >
            <Image style={{ height: 70, width: 70 }} source={{ uri: pokemon !== undefined && pokemon.sprites.front_default ? pokemon.sprites.front_default : null,  }}  /> 
            </View>
            <View style={{ flex: 0.5, backgroundColor: "white" }} >
            <Text style={{ alignItems: 'center' }} > #{ pokemon !== undefined && pokemon.id } </Text>
            { pokemon !== undefined && pokemon.types.map( (type: any, index: number) => <Text key={ type.type.slot + "_" + index } > { type !== undefined && type.type.name } </Text>  ) }
            </View>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
            <Text style={{ alignItems: 'center', fontSize: 15, color: "blue" }} > { pokemon !== undefined && pokemon.name.toUpperCase() } </Text>
            </View>
        </View>
    )
}