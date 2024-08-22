import { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Title,
  Label,
  FileUploader,
  Avatar,
  Badge,
  Wizard,
  WizardStep,
  ButtonDesign,
  WrappingType,
  FlexBox,
  Select,
  Option,
  BusyIndicator,
  Input,
  Form,
  FormGroup,
  FormItem,
  CheckBox,
} from '@ui5/webcomponents-react';
import {objectMap, addNatLangTemplateFittedConstraint, addNatLangTemplateViolation, LEVEL_DESCRIPTIONS } from '../util';
import constraintService from '../services/constraints'
import logService from '../services/logs'
import SuggestedConstraintsTable from './SuggestedConstraintsTable'
import ViolatedConstraintsTable from './ViolatedConstraintsTable'
import VariantsDisplay from './VariantsDisplay'
import "@ui5/webcomponents-icons/dist/delete.js"
import "@ui5/webcomponents-icons/dist/hint.js"
import "@ui5/webcomponents-icons/dist/reset.js"
import "@ui5/webcomponents-icons/dist/opportunity.js"
import "@ui5/webcomponents-icons/dist/upload.js"
import "@ui5/webcomponents-icons/dist/product.js"
import "@ui5/webcomponents-icons/dist/inspect-down.js"
import { without } from 'lodash';
import violationService from '../services/violations';

const CheckingWizard = ({navigate, setSelectedActivity, setAffectedViolations, setDialogIsOpen, addMessage, config}) => {
  const [selectedWizard, setSelectedWizard] = useState({
    1: { selected: true, disabled: false },
    2: { selected: false, disabled: false }, // change to disabled: true
    3: { selected: false, disabled: false }, // change to disabled: true
    4: { selected: false, disabled: false }, // change to disabled: true
  });

  const [selectedFile, setSelectedFile] = useState("none");
  const [loading, setLoading] = useState(false);
  const [checkingForViolations, setCheckingForViolations] = useState(false);
  const [availableLogs, setAvailableLogs] = useState([]); 
  const [suggestedConstraints, setSuggestedConstraints] = useState([]);
  const [deletedConstraints, setDeletedConstraints] = useState([]);
  const [selectedInputRows, setSelectedInputRows] = useState([]);
  const [constraintViolations, setConstraintViolations] = useState([]);
  const [deletedViolations, setDeletedViolations] = useState([]);
  const [selectedOutputRows, setSelectedOutputRows] = useState([]);
  const [variantData, setVariantData] = useState([])
  const [min_relevance, setMinRelevance] = useState(0.9)
  const [min_support, setMinSupport] = useState(2)
  const [binary, setBinary] = useState(false)
  const [unary, setUnary] = useState(false)
  const [constraint_levels, setConstraintLevels] = useState([])
  const [uploading, setUploading] = useState(false)


  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes


  const onRowSelect = (e, setSelectedRows) => {
    const rows = e.detail.selectedFlatRows.map((x) => x.original);
    setSelectedRows(rows);
  };

    const markNavigatedInputRow = useCallback(
    (row) => {
        return selectedInputRows?.find((x) => x?.id === row?.id);
    },
    [selectedInputRows]
    );

    const markNavigatedOutputRow = useCallback(
        (row) => {
          return selectedOutputRows?.find((x) => x?.id === row?.id);
        },
        [selectedOutputRows]
      );

    const deleteSelectedConstraints = () => {
        setDeletedConstraints([...deletedConstraints, ...selectedInputRows])
        setConstraintData(without(suggestedConstraints, ...selectedInputRows))
    }

    const deleteSelectedViolations = () => {
        setDeletedViolations([...deletedViolations, ...selectedOutputRows])
        setConstraintViolations(without(constraintViolations, ...selectedOutputRows))
    }

    const handleGetVariants = () => {
        console.log("selectedRows", selectedOutputRows)
        violationService.getVariantsForSelection(selectedOutputRows.map((row) => {
            return row.id
        })).then((response) => {
            let fetched_data = JSON.parse(response.data)
            console.log(fetched_data)
            setVariantData(fetched_data.violated_variants)
            setSelectedWizard({
              ...objectMap(selectedWizard, (x) => ({
              selected: false,
              disabled: x.disabled,
              })),
              4: { selected: true, disabled: false },
          })
        }).catch((error) => {
            console.log(error)
        })
    }

    const handleConformanceCheck = () => {
        setCheckingForViolations(true)
        violationService.getViolations(selectedInputRows.map((constraint) => {
            console.log(constraint)
            return constraint?.id
        }
      )).then((response) => {
        let fetched_data = JSON.parse(response.data)
        setConstraintViolations(fetched_data.violations.map(addNatLangTemplateViolation))
        let ids = fetched_data.violations.map((violation) => {
          return violation.id
        })
        console.log(ids)
        setSelectedOutputRows(selectedInputRows.filter((row) => {
          ids.includes(row.id)
        }))
        setCheckingForViolations(false)
        setSelectedWizard({
            ...objectMap(selectedWizard, (x) => ({
            selected: false,
            disabled: x.disabled,
            })),
            3: { selected: true, disabled: false },
        })

      }).catch((error) => {
            console.log(error)
            setCheckingForViolations(false)
        })
    }

  useEffect(() => {
    logService.getAll().then((response) => {
        let fetched_logs = JSON.parse(response.data)
        let log_options = fetched_logs.logs.map((log) => {
            return {
                text: log,
                value: log
            }
        })
        console.log(log_options)
        setAvailableLogs([{
            text: 'Select here',
            value: 'none',
          }].concat(log_options))  
    }).catch((error) => {
        console.log(error)
    })
    }, [])

  const handleMatching = () => {
    setLoading(true)
    const data = {log: selectedFile, min_support: min_support, min_relevance: min_relevance, unary: unary, binary: binary, constraint_levels: constraint_levels}
    constraintService.getForProcess(data).then((response) => {
      let fetched_data = JSON.parse(response.data)
      let fetched_constraints = fetched_data.constraints.map(addNatLangTemplateFittedConstraint)
      console.log(fetched_constraints)
      setSuggestedConstraints(fetched_constraints)
    setLoading(false)
    }).catch((error) => {
        console.log(error)
        addMessage(
          {
            title:(error).response?.data.detail || error.message,
            subtitle: 'Please make sure the event log is in XES format and contains proper activity labels',
            type: 'Error'}
          )
        setLoading(false)
    })
  }


  const handleSubmit = (log) => {
   setUploading(true)
    console.log(log)
    if (log.size > MAX_FILE_SIZE) {
      console.log('File too large')
      addMessage(
        {
          title:'File too large',
          subtitle: 'File size exceeds ' + MAX_FILE_SIZE/(1024*1024) + ' MB',
          type: 'Error'});
      setUploading(false)
      return
    } 
    logService.uploadLog(log).then((response) => {
      console.log(response.data)
      let fetched_logs = JSON.parse(response.data)
      let log_options = fetched_logs.logs.map((log) => {
          return {
              text: log,
              value: log
          }
      })
      console.log(log_options)
      setAvailableLogs([{
          text: 'Select here',
          value: 'none',
        }].concat(log_options)) 
        setUploading(false)
    }
    ).catch((error) => {
      console.log(error)
      setUploading(false)
    })
  };

  useEffect(() => {
    setSuggestedConstraints([])
    setVariantData([])
    setConstraintViolations([])
  }, [selectedFile])

  const handleStepChange = (e) => {
    setSelectedWizard({
      ...objectMap(selectedWizard, (x) => ({
        selected: false,
        disabled: x.disabled,
      })),
      [e.detail.step.dataset.step]: { selected: true, disabled: false },
    });
  };
  const menuActions = {
    reset: () => {},
    unmapped: () => {},
    diff: () => {},
    deleteUnmapped: () => {},
  };

  const menuItems = [
    { icon: 'reset', text: 'Reset Violated Constraints', key: 'reset' },
    { icon: 'opportunity', text: 'Show Deleted Constraints', key: 'diff' },
    { icon: 'opportunity', text: 'Show Unmapped Constraints', key: 'unmapped' },
    {
      icon: 'delete',
      text: 'Delete Unmapped Constraints',
      key: 'deleteUnmapped',
    },
  ];

  return (
    <Wizard
      onStepChange={(all) => handleStepChange(all)}
      contentLayout="SingleStep"
      style={{ height: '100%', width: '100%' }}
    >
      <WizardStep
        icon="product"
        titleText="Event Log Selection"
        disabled={selectedWizard['1'].disabled}
        selected={selectedWizard['1'].selected}
        data-step={'1'}
      >
        <>
          <Title>1. Event Log Selection</Title>
          <Label wrappingType={WrappingType.Normal}>
            Select or upload an event log to check. 
          </Label>
          <br />
          <FileUploader 
          onChange={(e) => {
            handleSubmit(e.detail.files[0])
          }
          }
          hideInput multiple={false} accept='.xes' style={{ margin: 20 }}>
            <Avatar icon="upload" />
          </FileUploader>
          <FileUploader hideInput disabled>
            <Badge disabled>{'Uploads are currently limited to 100MB'}</Badge>
          </FileUploader>
          <>{uploading && <><BusyIndicator active={uploading}></BusyIndicator></> }</>
          <Title>Available event logs</Title>
          <Select
            onChange={(event) =>
              setSelectedFile(event.detail.selectedOption.innerText)
            }
            style={{ width: '100%' }}
          >
            {availableLogs.map(({ text, value }) => {
              return (
                <Option key={value} selected={value === selectedFile}>
                  {text}
                </Option>
              );
            })}
          </Select>
          <div style={{ margin: 20 }} />
          {config?
          <Form 
          columnsL={2}
          columnsM={2}
          columnsS={2}
          columnsXL={2}
          labelSpanL={6}
          labelSpanM={6}
          labelSpanS={6}
          labelSpanXL={6}
          style={{
            alignItems: 'left'
          }}
          titleText="Configuration">
          <FormGroup titleText="Best-Practice Constraint Parameters">
              <FormItem label="Minimum Relevance Score (semantic similarity between constraint operands and event log counterparts, e.g., event labels)">

                <Input 
                type="Number"
                text={min_relevance} 
                value={min_relevance}
                onChange={(event) => {
                    if (event.target.typedInValue < 0 || event.target.typedInValue > 1) setMinRelevance(0.9)
                    else setMinRelevance(event.target.typedInValue)
                  }
                }
                />
              </FormItem>
              <FormItem label="Minimum Support (number of process models from which a constraint has been mined)">
                  <Input type="Number" 
                  text={min_support} 
                  value={min_support}
                    onChange={(event) => {
                      if (event.target.typedInValue < 0) setMinSupport(2)
                      else setMinSupport(event.target.typedInValue)
                    }
                  }
                  />
              </FormItem>
              <FormItem label="Unary Constraints, which have a single operand, e.g., 'create invoice' in Existence[create invoice]">
              <CheckBox checked={unary} 
              onChange={
                (event) => {
                    console.log(event.target.checked)
                    setUnary(event.target.checked)
                }   
              }/>
              </FormItem>
              <FormItem label="Binary Constraints, which have two operands, e.g., 'approve order' and 'create invoice' in Precedence['approve order', 'create invoice']">
              <CheckBox checked={binary} 
              onChange={
                (event) => {
                    setBinary(event.target.checked)
                }   
              }
              />
              </FormItem>
          </FormGroup>
            <FormGroup titleText="Best-Practice Constraint Levels">
                {config.constraint_levels.map((level) => 
                <>  
                    <FormItem key={level} label={LEVEL_DESCRIPTIONS[level]}>
                    <CheckBox style= {{margin_right: 20}} checked={constraint_levels.includes(level)} 
                    onChange={
                        (event) => {
                            if (event.target.checked) {
                                setConstraintLevels([...constraint_levels, level])
                            } else {
                                setConstraintLevels(without(constraint_levels, level))
                            }
                        }
                    }/>
                    
                    </FormItem>
                    
                    </>
                  )
                }
                
            </FormGroup>
            
          </Form>
        :null}    
          <br />
          <div style={{ margin: 20 }} />
          <>{loading && <><BusyIndicator active={loading}></BusyIndicator></> }</>
            <Button
             disabled={selectedFile === "none" || loading || constraint_levels.length === 0 || (binary === false && unary === false)}
              design={ButtonDesign.Emphasized}
              onClick={() =>{
                if (suggestedConstraints.length > 0) {
                  setSelectedWizard({
                    ...objectMap(selectedWizard, (x) => ({
                      selected: false,
                      disabled: x.disabled,
                    })),
                    2: { selected: true, disabled: false },
                  })
                } else {
                  handleMatching()
                }
              }
            }
            >
              {loading? "Suggesting Best Practices...": suggestedConstraints.length>0? "Go to Suggested Best Practices": "Suggest Best Practices"}
            </Button>
        </>
      </WizardStep>
      <WizardStep
        icon="hint"
        titleText="Select Best-Practice Constraints"
        disabled={selectedWizard['2'].disabled}
        selected={selectedWizard['2'].selected}
        data-step={'2'}
      >
        <Title>2. Select Best-Practice Constraints</Title>
        <Label wrappingType={WrappingType.Normal}>
          Select best-practice constraints that are interesting for your analysis.
        </Label>
            <SuggestedConstraintsTable
            markNavigatedInputRow={markNavigatedInputRow}
            setSelectedInputRows={setSelectedInputRows}
            setSuggestedConstraints={setSuggestedConstraints}
            suggestedConstraints={suggestedConstraints}
            selectedInputRows={selectedInputRows}
            onRowSelect={onRowSelect}
            deleteSelected={deleteSelectedConstraints}
            />
        <div style={{ margin: 10 }} />
        <FlexBox justifyContent="SpaceBetween">
          <Button
            disabled={selectedInputRows.length === 0 || checkingForViolations}
            design={ButtonDesign.Emphasized}
            onClick={() => handleConformanceCheck()}
          >
            {checkingForViolations? "Checking...": "Check for Best-Practice Violations"}
          </Button>
          <>{checkingForViolations && <BusyIndicator active={checkingForViolations}/>}</>
        </FlexBox>
      </WizardStep>
      <WizardStep
        icon="inspect-down"
        titleText="Violated Best Practices"
        disabled={selectedWizard['3'].disabled}
        selected={selectedWizard['3'].selected}
        data-step={'3'}
      >
        <Title>3. Violated Best-Practice Constraints</Title>
        <Label wrappingType={WrappingType.Normal}>
          Below you find the best-practice constraints that are violated in the event log.
        </Label>
        {/* <ButtonMenu actions={menuActions} items={menuItems} /> */}
        <ViolatedConstraintsTable
        onRowSelect={onRowSelect}
        deleteSelected={deleteSelectedViolations}
        markNavigatedOutputRow={markNavigatedOutputRow}
        setSelectedOutputRows={setSelectedOutputRows}
        setConstraintViolations={setConstraintViolations}
        constraintViolations={constraintViolations}
        selectedOutputRows={selectedOutputRows}
        />
        <div style={{ margin: 10 }} />
            
          <Button  
          disabled={selectedOutputRows.length === 0}
          design={ButtonDesign.Emphasized}
          onClick={() => handleGetVariants()}>
            Inspect Affected Variants
          </Button>
      </WizardStep>
      <WizardStep
      icon="opportunity"
      titleText="Variants View"
      disabled={selectedWizard['4'].disabled}
      selected={selectedWizard['4'].selected}
      data-step={'4'}>
        <VariantsDisplay
        constraintViolations={constraintViolations}
        variantData={variantData}
        setVariantData={setVariantData}
        originalVariantData={variantData}
        setSelectedActivity={setSelectedActivity}
        setDialogIsOpen={setDialogIsOpen}
        setAffectedViolations={setAffectedViolations}
        />
      </WizardStep>
    </Wizard>
  );
};

export default CheckingWizard;
