import CheckingWizard from './components/CheckingWizard';
import { Route, Routes, useNavigate } from 'react-router-dom'; 

import './App.css'

const App = () => {
  const navigate = useNavigate();

  return (
    <>
        <Routes>
          <Route
            path="/"
            element={
              <CheckingWizard navigate={navigate}/>
            }
          />
        </Routes>
    </>
  )
}

export default App
