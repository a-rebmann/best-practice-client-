import CheckingWizard from './components/CheckingWizard';
import { Route, Routes, useNavigate } from 'react-router-dom'; 

import {
  Button,
  DynamicPage,
  DynamicPageTitle,
  Title,
  Label,
  Badge,
  WrappingType,
} from '@ui5/webcomponents-react';

import './App.css'

const App = () => {
  const navigate = useNavigate();

  return (
    <>
          <DynamicPage
        alwaysShowContentHeader
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        showHideHeaderButton={false}
        headerContentPinnable={false}
        headerTitle={
          <DynamicPageTitle
            header={<Title>Best-Practice Checker</Title>}
            subHeader={
              <>
                <Label>
                  Checking Best-Practice Violations in Event Logs
                </Label>
              </>
            }
          ></DynamicPageTitle>
        }
      >
        <Routes>
          <Route
            path="/"
            element={
              <CheckingWizard navigate={navigate}/>
            }
          />
        </Routes>
        </DynamicPage>
    </>
  )
}

export default App
