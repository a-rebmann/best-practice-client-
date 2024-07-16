import {
    Timeline,
    TimelineItem,
    FlexBox,
    Card,
    ToolbarSelect,
    ToolbarSelectOption,
    CardHeader,
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
    setVariantData,
    variantData,
    originalVariantData,
  }) => {
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [showOnlyNonConformant, setShowOnlyNonConformant] = useState(false);


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
          {variantData.map((variant, index) => (
            <div key={index}>
              <Card
                header={
                  <FlexBox justifyContent="SpaceBetween">
                    <CardHeader
                      style={{ color: 'black' }}
                      titleText={`Occurrence: ${variant.frequency}, # of activities: ${variant.activities.length}`}
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
                    {variant.variants.activities.map((activity, aIndex) => (
                      <TimelineItem
                        nameClickable
                        onNameClick={() => {
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
                          background: findColor(false),
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
  