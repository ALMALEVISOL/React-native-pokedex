import React from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import 'react-native-gesture-handler';

export const LoadingComponent = (props : any) => {
    const { style, navigation, route } = props;
    return(
      <View {...style} >
        <ActivityIndicator size="large" color="blue" /> 
        <Text>CARGANDO...</Text>
      </View>
    )
  
}