import React, { useState, useEffect, useCallback } from 'react';
import ConstraintsTable from './ConstraintsTable';


import constraintService from '../services/constraints';
import { addNatLangTemplateConstraint } from '../util';

import {
    Form,
    FormGroup,
    FormItem,
    Input,
    Panel,
    Token,
    CheckBox,
    Button,
    FlexBox,
    BusyIndicator
  } from '@ui5/webcomponents-react';
import { set } from 'lodash';


const Configuration = ({setConstrainCreateDialogIsOpen, handleSelect}) => {

    const [constraints, setConstraints] = useState([]);
    const [selectedInputRows, setSelectedInputRows] = useState([]);
    const [deletedConstraints, setDeletedConstraints] = useState([]);
    const [loading, setLoading] = useState(true);

    /* 

    const handleApply = () => {
        console.log("Apply");
        configService.setConfig(config).then((response) => {
            console.log(response.data);
            setConfig(response.data);
        }).catch((error) => {
            console.log(error);
        }
        )
    } */

    const onRowSelect = (e, setSelectedRows) => {
        const rows = e.detail.selectedFlatRows.map((x) => x.original);
        setSelectedRows(rows);
    };

    const deleteSelected = () => {
        setDeletedConstraints([...deletedConstraints, ...selectedInputRows])
        setConstraints(without(constraints, ...selectedInputRows))
    }
   
    const markNavigatedInputRow = useCallback(
        (row) => {
            return selectedInputRows?.find((x) => x?.id === row?.id);
        },
        [selectedInputRows]
        );
    

    useEffect(() => {
        // fetch constraints
        constraintService.getAll().then((response) => {
            let fetched_data = JSON.parse(response.data)
            console.log(fetched_data);
            setConstraints(fetched_data.constraints.map(addNatLangTemplateConstraint));
            setLoading(false);
        }).catch((error) => {
            console.log(error);
            setLoading(false);
        })
    }
    , [])


    return (constraints.length>0?
        <>
       {/*  <Panel
        accessibleRole="Form"
        headerLevel="H2"
        headerText="Constraint Configuration"
        onToggle={function _a(){}}
        >
            <>
            <Form
            backgroundDesign="Transparent"
            columnsL={3}
            columnsM={3}
            columnsS={1}
            columnsXL={3}
            labelSpanL={4}
            labelSpanM={2}
            labelSpanS={12}
            labelSpanXL={4}
            style={{
                alignItems: 'center'
            }}
            >
                
                <FormGroup titleText="General Settings">
                    <FormItem label="Minimum Support">
                        <Input type="Number" value={config.min_support}/>
                    </FormItem>
                    <FormItem label="Unary">
                    <CheckBox checked={config.unary} />
                    </FormItem>
                    <FormItem label="Binary">
                    <CheckBox checked={config.binary} />
                    </FormItem>
                </FormGroup>
            <FormGroup titleText="Constraint Levels">
                
                {config.constraint_levels.map((level) => 
                    <FormItem label={level}>
                    <CheckBox checked={config.constraint_levels.includes(level)} />
                    </FormItem>)
                }
            </FormGroup>
            <FormGroup titleText="Constraint Types">
                
                {config.constraint_types.map((type) => 
                    <FormItem label={type}>
                    <CheckBox checked={config.constraint_types.includes(type)} />
                    </FormItem>)
                }
            </FormGroup>
            
            </Form>
            <FlexBox justifyContent="End">
            <Button icon="action-settings" onClick={handleApply()}>
              Apply
            </Button>
            </FlexBox>
            </>
            </Panel> */}
           
            <ConstraintsTable 
            constraints={constraints}
            setConstraints={setConstraints}
            selectedInputRows={selectedInputRows}
            setSelectedInputRows={setSelectedInputRows}
            markNavigatedInputRow={markNavigatedInputRow}
            deleteSelected={deleteSelected}
            onRowSelect={onRowSelect}
            setConstrainCreateDialogIsOpen={setConstrainCreateDialogIsOpen}
            handleSelect={handleSelect}
            />
        </>
    :<>{loading && <><BusyIndicator active={loading}></BusyIndicator></> }</>)
}

export default Configuration;