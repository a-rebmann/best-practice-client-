import CheckingWizard from './components/CheckingWizard';
import Configuration from './components/Configuration';
import { Route, Routes, useNavigate } from 'react-router-dom'; 
import { useState, useEffect } from 'react';

import {
  Dialog, 
  FlexBox, 
  AnalyticalTable,
  Button,
  DynamicPage,
  DynamicPageTitle,
  Title,
  Label,
  ButtonDesign,
  Select,
  Option,
  Form,
  FormGroup,
  FormItem,
  Input,
  MessageView,
  MessageItem
} from '@ui5/webcomponents-react';
import "@ui5/webcomponents-icons/dist/action-settings.js"
import constraintService from './services/constraints';
import configService from './services/configuration'; 

import './App.css'

const App = () => {
  const navigate = useNavigate();

  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [newConstraint, setNewConstraint] = useState({
    id: '',
    arity: '',
    level: '',
    constraint_str: '',
    constraint_type: '',
    object_type: '',
    left_operand: '',
    processmodel_id: '',
    right_operand: '',
    support: 1,
  });
  const [constrainCreateDialogIsOpen, setConstrainCreateDialogIsOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [affectedViolations, setAffectedViolations] = useState([]);
  const [configActive, setConfigActive] = useState(false);
  const [config, setConfig] = useState(undefined);
  const [objectDisabled, setObjectDisabled] = useState(true);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [modelIDs, setModelIDs] = useState([]);

  const [messages, setMessages] = useState([]);


  const addMessage = (message) => {
    console.log(message);
    setMessages([...messages, message]);
  }

  const removeMessage = (message) => {
    setMessages(messages.filter((msg) => msg !== message));
  }



    useEffect(() => {
      setMediaDialogOpen(false);
      // fetch config
      configService.getConfig().then((response) => {
          console.log(response.data);
          setConfig(response.data);
      }).catch((error) => {
          console.log(error);
      })
  }, [])

  useEffect(() => {
    if (modelIDs.length>0) setMediaDialogOpen(true);
  }, [modelIDs])



 const  handleSelect = (constraint) => {
    // fetch constraints  
    constraintService.getModelIDsForConstraint(constraint).then((response) => {
      let fetchedModelIDs = JSON.parse(response.data);
      setModelIDs(fetchedModelIDs.models);
      console.log(fetchedModelIDs.models);
      
      })
    .catch((error) => {
      console.log(error);
    })
  }


  const handleCreateConstraint = () => {
    // check if relevant fields are filled
    console.log(JSON.stringify(newConstraint));
    constraintService.createConstraint(newConstraint).then((response) => {
      console.log(response.data);
      setNewConstraint({
        id: '',
        arity: '',
        level: '',
        constraint_str: '',
        constraint_type: '',
        object_type: '',
        left_operand: '',
        processmodel_id: '',
        right_operand: '',
        support: 1,
      });
    }).catch((error) => {
      console.log(error);
    })
  }

  


  return (
    <>
    <Dialog open={mediaDialogOpen}
      onAfterClose={() => setMediaDialogOpen(false)}
    ><div>
      {modelIDs.map((model, index) => 
       <>
          <a key={model} target="_blank" href={constraintService.baseUrl + "/" + model}><Button>Model {index +1}</Button></a>
        </>
      )
      }
      </div>
      <FlexBox justifyContent="End">
        <Button
          onClick={() => {
            setMediaDialogOpen(false);
          }}
        >
          Close
        </Button>
      </FlexBox>
    </Dialog>
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
            width: 850,
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

      <FlexBox justifyContent="End">
        <Button
          onClick={() => {
            setDialogIsOpen(false);
          }}
        >
          Close
        </Button>
      </FlexBox>
    </Dialog>
    {config &&
     <Dialog
      open={constrainCreateDialogIsOpen}
      onAfterClose={() => setConstrainCreateDialogIsOpen(false)}
    >
      <div>Create a New Constraint</div>

      <Form
            backgroundDesign="Transparent"
            columnsL={1}
            columnsM={1}
            columnsS={1}
            columnsXL={1}
            labelSpanL={4}
            labelSpanM={2}
            labelSpanS={12}
            labelSpanXL={4}
            style={{
                alignItems: 'center'
            }}
            >
                
            <FormGroup titleText="Constraint Details">
                <FormItem label="Support">
                    <Input 
                    onChange={(event) => {
                      console.log(event);
                      setNewConstraint({...newConstraint, support: event.target.typedInValue})}
                    }
                    type="Number" value={newConstraint.support}/>
                </FormItem>
                <FormItem label="Level">
                <Select
                  value={newConstraint.level}
                  onChange={(event) => {
                    setNewConstraint({...newConstraint, 
                      level: event.detail.selectedOption.innerText})
                      console.log(newConstraint.constraint_type, newConstraint.left_operand, newConstraint.right_operand, newConstraint.object_type, newConstraint.level);
                      if(event.detail.selectedOption.innerText === "Object"){
                        setObjectDisabled(false);
                        }
                      else{
                        setNewConstraint({...newConstraint, 
                          object_type: ''})
                        setObjectDisabled(true);
                      }  
                }}
                  onClose={function _a(){}}
                  onLiveChange={function _a(){}}
                  onOpen={function _a(){}}
                  valueState="None"
                  >
                 {
                    config.constraint_levels.map((level) =>
                    <Option key={level} selected={newConstraint.level === level}>{level}</Option>)
                 }
                 
                  </Select>
                </FormItem>
                <FormItem label="Type">
                <Select
                  onChange={(event) => {
                    setNewConstraint({...newConstraint, 
                      constraint_type: event.detail.selectedOption.innerText})
                }}
                  onClose={function _a(){}}
                  onLiveChange={function _a(){}}
                  onOpen={function _a(){}}
                  valueState="None"
                  >
                 {
                    config.constraint_types.map((const_type) =>
                    <Option key={const_type} selected={newConstraint.constraint_type === const_type}>{const_type}</Option>)
                 }
                 
                  </Select>
                </FormItem>
                <FormItem label="Left Operand">
                    <Input 
                    onChange={(event) => { 
                      console.log(event);
                      setNewConstraint({...newConstraint, left_operand: event.target.typedInValue})}} 
                    value={newConstraint.left_operand}/>
                </FormItem>
                <FormItem label="Right Operand">
                    <Input  
                    onChange={(event) => { 
                      console.log(event);
                      setNewConstraint({...newConstraint, right_operand: event.target.typedInValue})}} 
                    value={newConstraint.right_operand}/>
                </FormItem>
                <FormItem label="Object Type">
                    <Input 
                    onChange={(event) => { 
                      console.log(event);
                      setNewConstraint({...newConstraint, object_type: event.target.typedInValue})}} 
                    disabled={objectDisabled} 
                    value={newConstraint.object_type}/>
                </FormItem>
            </FormGroup>
            </Form>

      <FlexBox justifyContent="End">
        <Button
          onClick={() => {
            handleCreateConstraint();
            setConstrainCreateDialogIsOpen(false);
          }}
        >
          Create Constraint
        </Button>
      </FlexBox>
    </Dialog>
}
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

            actions={<>
            <Button 
            design={configActive?ButtonDesign.Emphasized:ButtonDesign.Default}
            icon="action-settings" onClick={() => {
              setConfigActive(!configActive);
              if (configActive) navigate('/');
              else navigate('/configuration');
              }}>
              Best-Practice Administration
            </Button></>} 
            header={<Title>Best-Practice Checker</Title>}
            subHeader={
              <>
                <Label>
                  Checking Best-Practice Violations in Event Logs
                </Label>
              </>
            }
          >
           
          </DynamicPageTitle>
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
              addMessage={addMessage}
              config={config}
              />
            }
          />
          <Route
            path="/configuration"
            element={
              <Configuration 
              config={config}
              handleSelect={handleSelect}
              setConstrainCreateDialogIsOpen={() => setConstrainCreateDialogIsOpen(true)}/>
            }
          />
        </Routes>
        {messages.length>0?
        <>
        <h4 style={{color:'black'}}>Messages (click to remove)</h4>
        <MessageView
          onItemSelect={function _a(){}}
          showDetailsPageHeader={false}
        >
          {messages.map((message, index) => {
            return <MessageItem
            key={index}
            subtitleText={message.subtitle}
            titleText={message.title}
            type={message.type}
            onClick={() => removeMessage(message)}
            >
              
          </MessageItem>})}
        </MessageView></>:null}
        </DynamicPage>
    </>
  )
}

export default App
