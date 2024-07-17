import CheckingWizard from './components/CheckingWizard';
import { Route, Routes, useNavigate } from 'react-router-dom'; 
import { useState } from 'react';

import {
  Dialog, 
  FlexBox, 
  AnalyticalTable,
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

  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [affectedViolations, setAffectedViolations] = useState([]);

  return (
    <>
     <Dialog
      open={dialogIsOpen}
      onAfterClose={() => setDialogIsOpen(false)}
    >
      <div>{selectedActivity}</div>
      <AnalyticalTable
        groupable
        filterable
        minRows={9}
        visibleRows={9}
        data={affectedViolations}
        columns={[
          {
            Header: 'Relevance',
            accessor: 'constraint.relevance',
            width: 100,
            headerTooltip: 'relevance_score',
          },
          {
          Header: 'Level',
          accessor: 'constraint.constraint.level',
          width: 120,
          headerTooltip: 'Level of the Constraint',
          },
            {
            Header: 'Object',
            accessor: 'constraint.constraint.object_type',
            width: 120,
            headerTooltip: 'Type of the object',
            },
            {
            Header: 'Explanation',
            accessor: 'nat_lang_template',
            headerTooltip: 'nat_lang_template',
            width: 500,
            },
            {
              Header: '# cases',
              accessor: 'frequency',
              headerTooltip: 'frequency',
              width: 100,
            },
        ]}
      />
      <div style={{ margin: 10 }} />
      <FlexBox justifyContent="SpaceBetween">
        <Button
          onClick={() => {
            setDialogIsOpen(false);
          }}
        >
          Close
        </Button>
      </FlexBox>
    </Dialog>
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
              <CheckingWizard 
              navigate={navigate} 
              setSelectedActivity={setSelectedActivity}
              setDialogIsOpen={setDialogIsOpen}
              setAffectedViolations={setAffectedViolations}
              />
            }
          />
        </Routes>
        </DynamicPage>
    </>
  )
}

export default App
