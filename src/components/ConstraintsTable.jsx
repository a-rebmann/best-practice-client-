import {
  AnalyticalTable,
  MultiComboBox,
  MultiComboBoxItem,
  Button,
} from '@ui5/webcomponents-react';
import "@ui5/webcomponents-icons/dist/delete.js"
import { CONSTRAINT_LEVELS, filterFn } from '../util';
import { without } from 'lodash';

const ConstraintsTable = ({
  markNavigatedInputRow,
  setSelectedInputRows,
  setConstraints,
  constraints,
  selectedInputRows,
  onRowSelect,
  deleteSelected,
}) => {
  return (
    <>
      <AnalyticalTable
        minRows={9}
        visibleRows={10}
        markNavigatedRow={markNavigatedInputRow}
        groupable
        scaleWidthMode="Smart"
        selectionMode="MultiSelect"
        onRowSelect={(e) => onRowSelect(e, setSelectedInputRows)}
        filterable
        columns={[
          {
            Header: () => <span>Level</span>,
            selectionMode: 'SingleSelect',
            filter: filterFn,
            accessor: 'level',
            headerTooltip: 'Level of the constraint',
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
                  accessibleName="level"
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
            accessor: 'arity',
            headerTooltip: 'Arity of the constraint',
          },
          {
            Header: 'Type',
            accessor: 'constraint_type',
            headerTooltip: 'Type of the constraint',
          },
          {
            Header: 'Object',
            accessor: 'object_type',
            headerTooltip: 'Type of the object',
          },
          {
            Header: 'First Operand',
            accessor: 'left_operand',
            headerTooltip: 'First operand of the constraint',
          },
          {
            Header: 'Second Operand',
            accessor: 'right_operand',
            headerTooltip: 'Second operand of the constraint',
          },
          {
            Header: 'Explanation',
            accessor: 'nat_lang_template',
            headerTooltip: 'nat_lang_template',
            width: 500,
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

                setConstraintData(without(constraintData, ...rows));
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
        data={constraints}
      />

      <Button
        icon="delete"
        onClick={() =>
          deleteSelected(constraintData, selectedInputRows, setConstraintData)
        }
      >
        Delete Selected
      </Button>
    </>
  );
};
export default ConstraintsTable;