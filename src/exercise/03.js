// Lifting state
// http://localhost:3000/isolated/exercise/03.js

import React from 'react'


// if the state is used only in the component, push the state down to it.
// if it is shared lift it up
function Name() {
  const [name, setName] = React.useState('')
  return (
    <div>
      <label htmlFor="name">Name: </label>
      <input id="name" value={name} onChange={event=> setName(event.target.value)} />
      <p>{name}</p>
    </div>
  )
}

function FavoriteAnimal({animal, onAnimalChange}) {

  return (
    <div>
      <label htmlFor="animal">Favorite Animal: </label>
      <input
        id="animal"
        value={animal}
        onChange={onAnimalChange}
      />
    </div>
  )
}

function Display({ animal}) {
  return <div>{`Your favorite animal is: ${animal}!`}</div>
}

function App() {
  const [animal, setAnimal] = React.useState('')
  return (
    <form>
      <Name/>
      <FavoriteAnimal animal={animal} onAnimalChange={event=> setAnimal(event.target.value)}/>
      <Display animal={animal} />
    </form>
  )
}

export default App
