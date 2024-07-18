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
} from '@ui5/webcomponents-react';
import {nat_lang_templates, objectMap } from '../util';
import ButtonMenu from './ButtonMenu';
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
import "@ui5/webcomponents-icons/dist/lead.js"
import { set, without } from 'lodash';
import violationService from '../services/violations';

const CheckingWizard = ({navigate, setSelectedActivity, setAffectedViolations, setDialogIsOpen}) => {
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
            return constraint.id
        }
      )).then((response) => {
        let fetched_data = JSON.parse(response.data)
        setConstraintViolations(fetched_data.violations.map((violation) => {
            return {
                ...violation,
                nat_lang_template: nat_lang_templates[violation.constraint.constraint.constraint_type]
                .replace("{1}", "''" + violation.constraint.left_operand + "''")
                .replace("{2}", "''" + violation.constraint.right_operand + "''")
                .replace('{n}', violation.constraint.constraint_str?.split('[')[0]?.slice(-1)),
            }
        }))
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


  useEffect(() => {
    setLoading(true)
    constraintService.getForProcess(selectedFile).then((response) => {
      let fetched_data = JSON.parse(response.data)
      let fetched_constraints = fetched_data.constraints.map((constraint) => {
        return {
          ...constraint,
          nat_lang_template: nat_lang_templates[constraint.constraint.constraint_type]
          .replace("{1}", "''" + constraint.left_operand + "''")
          .replace("{2}", "''" + constraint.right_operand + "''")
          .replace('{n}', constraint.constraint.constraint_str?.split('[')[0]?.slice(-1)),
        }
      })
      console.log(fetched_constraints)
      setSuggestedConstraints(fetched_constraints)
    //   logService.getVariants(selectedFile).then((response) => {
    //     let fetched_data = JSON.parse(response.data)
    //     console.log(fetched_data)
    //     setVariantData(fetched_data.variants)
    //     setLoading(false)
    //   }).catch((error) => {
    //     console.log(error)
    //     setLoading(false)
    //   })
    setLoading(false)
    }).catch((error) => {
        console.log(error)
        setLoading(false)
    })
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
          <FileUploader hideInput style={{ margin: 20 }} disabled>
            <Avatar icon="upload" disabled />
          </FileUploader>
          <FileUploader hideInput disabled>
            <Badge disabled>{'Upload file'}</Badge>
          </FileUploader>
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
          <br />
          <>{loading && <><BusyIndicator active={loading}></BusyIndicator><p>Loading log</p></> }</>
          <div style={{ margin: 200 }} />
          <FlexBox justifyContent="SpaceBetween">
            <Button
             disabled={suggestedConstraints.length === 0}
              design={ButtonDesign.Emphasized}
              onClick={() =>
                setSelectedWizard({
                  ...objectMap(selectedWizard, (x) => ({
                    selected: false,
                    disabled: x.disabled,
                  })),
                  2: { selected: true, disabled: false },
                })
              }
            >
              Configure Suggested Constraints
            </Button>
          </FlexBox>
        </>
      </WizardStep>
      <WizardStep
        icon="hint"
        titleText="Configure Constraints"
        disabled={selectedWizard['2'].disabled}
        selected={selectedWizard['2'].selected}
        data-step={'2'}
      >
        <Title>2. Configure Constraints</Title>
        <Label wrappingType={WrappingType.Normal}>
          Select constraints that are interesting for your analysis.
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
            {checkingForViolations? "Checking...": "Check for Violated Constraints"}
          </Button>
          <>{checkingForViolations && <BusyIndicator active={checkingForViolations}/>}</>
        </FlexBox>
      </WizardStep>
      <WizardStep
        icon="lead"
        titleText="Violated Constraints"
        disabled={selectedWizard['3'].disabled}
        selected={selectedWizard['3'].selected}
        data-step={'3'}
      >
        <Title>3. Violated Constraints</Title>
        <Label wrappingType={WrappingType.Normal}>
          Below you find the constraints that are violated by the event log.
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
