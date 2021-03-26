export const getPokemon = async (pokemonName: String) => {
    try{
      debugger
      const response = await fetch( `https://pokeapi.co/api/v2/pokemon/${pokemonName}` );
      const data = await response.json(); 
      return data
    }catch( error ){
      console.log( "Error", error )
    }
  }
  
  export const fetchPokemonEvolutions = async (pokemonId: number) => {
    try{
      const response = await fetch( `https://pokeapi.co/api/v2/evolution-chain/${pokemonId}` );
      const data = await response.json(); 
      return data
    }catch( error ){
      console.log( "Error", error )
    }
  }
  
  export const genericFetch = async (url: string) => {
    try{
      const response = await fetch( url );
      const data = await response.json(); 
      return data
    }catch( error ){
      console.log( "Error", error )
    }
  }