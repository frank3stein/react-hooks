// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {fetchPokemon, PokemonDataView, PokemonForm, PokemonInfoFallback} from '../pokemon'
import { ErrorBoundary }from 'react-error-boundary'
// class ErrorBoundary extends React.Component {
//   state= {error: null}

//   static getDerivedStateFromError(error) {
//     // Update state so the next render will show the fallback UI.
//     return { error };
//   }

//   // componentDidCatch(error, errorInfo) {
//   //   // You can also log the error to an error reporting service
//   //   console.dir(error, errorInfo)
//   // }

//   render() {
//     const { error } = this.state;
//     if (error) {
//       // You can render any custom fallback UI
//       return this.props.Fallback({ error })
//       // return <this.props.Fallback error={error}/>
//     }
//     return this.props.children; 
//   }
// }

function ErrorFallbackComponent({error, resetErrorBoundary}) {
  return <div role="alert">
      There was an error:{' '}
    <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
    <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
}

function PokemonInfo({ pokemonName }) {
  // if you want to use async await 
//   React.useEffect(() => {
//   async function effect() {
//     const result = await doSomeAsyncThing()
//     // do something with the result
//   }
//   effect()
// })
  // otherwise since await returns a promise automatically, it acts as if it is the cleaning function


  // 🐨 Have state for the pokemon (null)
  // const [pokemon, setPokemon] = React.useState(null)

  // to check if we have the pokemonname, otherwise since the component mounts, it will set to idle, before it changes to pending
  const [state, setState] = React.useState({status: pokemonName ? 'pending': 'idle', pokemon:null, error: null})
  // const [status, setStatus] = React.useState('idle')
  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  React.useEffect(() => {
    if (pokemonName) {
      setState({...state, status:'pending'})
      fetchPokemon(pokemonName).then(pokemonData => {
        setState({ ...state, status: 'resolved', pokemon: pokemonData})
      }).catch(err => {
        setState({...state, status: 'rejected', error: err})
      })
    }
  }, [pokemonName])
  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
  // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
  // 🐨 before calling `fetchPokemon`, make sure to update the loading state
  // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
  //   fetchPokemon('Pikachu').then(
  //     pokemonData => { /* update all the state here */},
  //   )
  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />

  // 💣 remove this
  // return 'TODO'
  // return pokemonName ? pokemon ? <PokemonDataView pokemon={pokemon} /> : <PokemonInfoFallback name={pokemonName} /> : "Submit a Pokemon"
  switch (state.status) {
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />;
    case 'resolved':
      return <PokemonDataView pokemon={state.pokemon} />;
    case 'rejected':
      // return <div role="alert">
      //   There was an error: <pre style={{ whiteSpace: 'normal' }}>{state.pokemon.message}</pre>
      // </div>;
      throw state.error
    default:
      return "Submit a Pokemon"
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')
  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }
  function handleReset() {
    setPokemonName('')
  }
  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        {/* When the key property changes, the component unmounts and remounts. But that means PokemonInfo is also mounting and remounting each time. So instead we want to only un/mount when there is error. So we reset inside the component and onReset we set the state manually. If the user clicks on a pokemon, we still can change the state and do the un/mount cycle by using the resetKeys prop with the change inside the array. */}
      <ErrorBoundary FallbackComponent={ErrorFallbackComponent} onReset={handleReset} resetKeys={[pokemonName]}>
        <PokemonInfo pokemonName={pokemonName}/>
      </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
