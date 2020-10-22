// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import React from 'react'

//3
// const useLocalStorageState = (storageKey, storageValue ="") => {
//   const [state, setState] = React.useState(()=> window.localStorage.getItem(storageKey) || storageValue)

//   React.useEffect(() => window.localStorage.setItem(storageKey, state), [state])

//   return [state, setState]
// }

//4
const useLocalStorageState = (
  storageKey, 
  initialValue="", 
  {
    serialize = JSON.stringify, 
    deserialize= JSON.parse
  } = {}) => {
  // React lazy initialization, useState sets the value in the initial render after component is mounted, afterwards the value is ignored but the function is still run. With lazy state initialization that function within the callback is ran only once. 
  const [state, setState] = React.useState(()=>{
    const valueInLocalStorage = window.localStorage.getItem(storageKey)
    if(valueInLocalStorage) {
      // wont work
      //return deserialize(valueInLocalStorage)
      // the try/catch is here in case the localStorage value was set before
      // we had the serialization in place (like we do in previous extra credits)
      try {
        return deserialize(valueInLocalStorage)
      } catch (error) {
        window.localStorage.removeItem(storageKey)
      }
    } 
    return typeof initialValue === 'function' ? initialValue() : initialValue
  })

  const prevKeyRef = React.useRef(storageKey)

  React.useEffect(()=> {

    const prevKey = prevKeyRef.current
    if (prevKey !== storageKey) {
      window.localStorage.removeItem(prevKey)
    } 
    prevKeyRef.current = storageKey
    window.localStorage.setItem(storageKey, serialize(state))
  }, [storageKey, serialize, state])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  // 🐨 initialize the state to the value from localStorage
  // 💰 window.localStorage.getItem('name') || initialName
  // const [name, setName] = React.useState(()=> window.localStorage.getItem('name') || initialName)

  // 🐨 Here's where you'll use `React.useEffect`.
  // The callback should set the `name` in localStorage.
  // 💰 window.localStorage.setItem('name', name)

  // Note: UseEffect Callback should not accept any arguments, name here as an argument will be undefined since it is not run in the same scope when the callback is called.
  // React.useEffect(() => window.localStorage.setItem('name', name), [name])
  // 2. Add name dependency to avoid rerunning when name is not changed. Otherwise it runs in every render.
  // dependency array does shallow comparison, so it can not differentiate between  objects and will run each render. Think of it as Object.is and === comparison
  // 3. CustomHook
  const [name, setName] = useLocalStorageState('name', initialName="");

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input onChange={handleChange} id="name" value={name}/>
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting initialName="Emil"/>
}

export default App
