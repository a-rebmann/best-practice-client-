import {
    AnalyticalTable,
    MultiComboBox,
    MultiComboBoxItem,
    Button,
  } from '@ui5/webcomponents-react';
  import { CONSTRAINT_LEVELS, RELEVANCE_LEVELS, filterFn } from '../util';
  import { without, isNil } from 'lodash';
  import { useState } from 'react';

  
  const ViolatedConstraintsTable = ({
    onRowSelect,
    deleteSelected,
    markNavigatedOutputRow,
    setConstraintViolations,
    constraintViolations,
    selectedOutputRows,
    setSelectedOutputRows,
  }) => {
    const [relevanceScoreFilter, setRelevanceScoreFilter] = useState('0.5');
  
    return !isNil(constraintViolations) ? (
      <>
        <AnalyticalTable
          minRows={9}
          visibleRows={9}
          markNavigatedRow={markNavigatedOutputRow}
          groupable
          scaleWidthMode="Smart"
          filterable
          selectionMode="MultiSelect"
          onRowSelect={(e) => onRowSelect(e, setSelectedOutputRows)}
          columns={[
            {
              Header: () => <span>Level</span>,
              selectionMode: 'SingleSelect',
              filter: filterFn,
              accessor: 'constraint.constraint.level',
              width: 100,
              headerTooltip: 'Level of the Constraint',
              disableFilters: false,
              disableGroupBy: false,
              disableSortBy: false,
              Filter: ({ column, popoverRef }) => {
                const handleChange = (event) => {
                  column.setFilter(
                    event.detail.items.map((item) => item?.getAttribute('text'))
                  );
                  popoverRef.current.close();
                };
                return (
                  <MultiComboBox
                    accessibleName="Constraint Level"
                    label="Constraint Level"
                    onSelectionChange={handleChange}
                  >
                    {CONSTRAINT_LEVELS.map(({ text, value }) => {
                      const isSelected = column?.filterValue?.some((filterVal) =>
                        filterVal.includes(value)
                      );
                      return (
                        <MultiComboBoxItem
                          text={text}
                          key={value}
                          selected={isSelected}
                        />
                      );
                    })}
                  </MultiComboBox>
                );
              },
            },
            {
            Header: 'Arity',
            accessor: 'constraint.constraint.arity',
            headerTooltip: 'Arity of the constraint',
            },
            {
            Header: 'Type',
            accessor: 'constraint.constraint.constraint_type',
            headerTooltip: 'Type of the constraint',
            },
            {
            Header: 'Object',
            accessor: 'constraint.object_type',
            headerTooltip: 'Type of the object',
            },
            {
            Header: 'First Operand',
            accessor: 'constraint.left_operand',
            headerTooltip: 'First operand of the constraint',
            },
            {
            Header: 'Second Operand',
            accessor: 'constraint.right_operand',
            headerTooltip: 'Second operand of the constraint',
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
              width: 60,
            },
            {
              Cell: (instance) => {
                const { row, webComponentsReactProperties } = instance;
                // disable buttons if overlay is active to prevent focus
                const isOverlay = webComponentsReactProperties.showOverlay;
                const onDelete = () => {
                  const rows = row.original
                    ? [row.original]
                    : row.leafRows.map((x) => x.original);
  
                  setConstraintViolations(without(constraintViolations, ...rows));
                };
                return (
                  <Button icon="delete" disabled={isOverlay} onClick={onDelete} />
                );
              },
              width: 50,
              Header: '',
              accessor: '.',
              disableFilters: true,
              disableGroupBy: true,
              disableResizing: true,
              disableSortBy: true,
              id: 'actions',
            },
          ]}
          data={constraintViolations}
        />
        <Button
          icon="delete"
          onClick={() =>
            deleteSelected(constraintViolations, selectedOutputRows, setConstraintViolations)
          }
        >
          Delete Selected
        </Button>
      </>
    ) : null;
  };
  export default ViolatedConstraintsTable;
  