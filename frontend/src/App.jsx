import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { Home } from './home'
import { Signin } from './components/signin'


function App() {
  

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/signin' element={<Signin/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
