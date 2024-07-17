import {
    AnalyticalTable,
    Timeline,
    TimelineItem,
    Card,
    Dialog,
    FlexBox,
    CardHeader,
    Button,
    ToolbarV2,
  } from '@ui5/webcomponents-react';

import { isNil } from 'lodash';
import { useState } from 'react';
  
  const findColor = (level) => {
    switch (level) {
      case 'faulty':
        return '#FF0000';
      case 'partlyFaulty':
        return '#FFBF00';
      case false:
        return '#008000';
      default:
        return 'yellow';
    }
  };
  
  const VariantsDisplay = ({
    constraintViolations,
    variantData,
    setVariantData,
    originalVariantData,
    setSelectedActivity,
    setDialogIsOpen,
    setAffectedViolations
  }) => {

    return !isNil(variantData) ?(
      <>
        <ToolbarV2
          alignContent={{
            End: 'End',
            Start: 'Start',
          }}
        >

        </ToolbarV2>
  
        <div
          style={{
            height: '100%',
            overflowY: 'auto',
            //   border: '1px solid #ccc',
            padding: '10px',
          }}
        >
          {variantData.sort((a, b) => b.variant.frequency - a.variant.frequency).map((variant, index) => (
            <div key={index}>
              <Card
                header={
                  <FlexBox justifyContent="SpaceBetween">
                    <CardHeader
                      style={{ color: 'black' }}
                      titleText={`Occurrence: ${variant.variant.frequency}, # of activities: ${variant.variant.activities.length}`}
                    />
                  </FlexBox>
                }
                style={{
                  width: '95%',
                  margin: '8px',
                  // minHeight: 100,
                }}
              >
                <FlexBox
                  key={index}
                  style={{
                    padding: 5,
                    overflowX: 'auto',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Timeline layout="Horizontal">
                    {variant.variant.activities.map((activity, aIndex) => (
                      <TimelineItem
                        nameClickable
                        onNameClick={() => {
                          setSelectedActivity(activity);
                          setAffectedViolations(
                            constraintViolations.filter(
                              (v) => variant.activities[activity].includes(v.constraint.id)
                            )
                          );
                          setDialogIsOpen(true);
                        }}
                        label={activity}
                        name={activity}
                        aria-label={activity}
                        title={activity}
                        key={aIndex}
                        style={{
                          width: 200,
                          height: 60,
                          background: findColor(variant.activities[activity].length!==0),
                        }}
                      />
                    ))}
                  </Timeline>
                </FlexBox>
              </Card>
            </div>
          ))}
        </div>
      </>
    ): null;
  };
  
  export default VariantsDisplay;
  