import { useEffect, useState } from "react";
import { PieChart } from "@ui5/webcomponents-react-charts";
import {
  Card,
  AnalyticalCardHeader,
  FlexBox,
  FlexBoxDirection,
  FlexBoxJustifyContent,
  FlexBoxAlignItems,
  CardHeader,
} from "@ui5/webcomponents-react";

const Statistics = ({ config, constraints }) => {
  const [chartsLoaded, setChartsLoaded] = useState(false);

  const [arityStatistics, setArityStatistics] = useState([]);
  const [typeStatistics, setTypeStatistics] = useState([]);
  const [levelStatistics, setLevelStatistics] = useState([]);
  const [modelStatistics, setModelStatistics] = useState({
    total: 0,
  });

  useEffect(() => {
    let uniqueModelIDs = new Set();
    constraints.forEach((constraint) => {
      let cIDs = constraint.processmodel_id.split(" | ");
      cIDs.forEach((id) => {
        uniqueModelIDs.add(id);
      });
    });
    setModelStatistics({ total: uniqueModelIDs.size, constraints_total: constraints.length });

    let artityStats = constraints.reduce((acc, constraint) => {
      if (acc[constraint.arity]) {
        acc[constraint.arity] += 1;
      } else {
        acc[constraint.arity] = 1;
      }
      return acc;
    }, {});
    let arityList = Object.keys(artityStats).map((key) => {
      return {
        name: key,
        count: artityStats[key],
      };
    });
    setArityStatistics(arityList);

    let typeStats = constraints.reduce((acc, constraint) => {
      if (acc[constraint.constraint_type]) {
        acc[constraint.constraint_type] += 1;
      } else {
        acc[constraint.constraint_type] = 1;
      }
      return acc;
    }, {});
    let typeList = Object.keys(typeStats).map((key) => {
      return {
        name: key,
        count: typeStats[key],
      };
    });
    setTypeStatistics(typeList);

    let levelStats = constraints.reduce((acc, constraint) => {
      if (acc[constraint.level]) {
        acc[constraint.level] += 1;
      } else {
        acc[constraint.level] = 1;
      }
      return acc;
    }, {});
    let levelList = Object.keys(levelStats).map((key) => {
      return {
        name: key,
        count: levelStats[key],
      };
    });
    setLevelStatistics(levelList);
    setChartsLoaded(true);
  }, []);

  return (
    <div>
      <h2 style={{ color: "black" }}>Statistics</h2>
      <FlexBox
        direction={FlexBoxDirection.Row}
        justifyContent={FlexBoxJustifyContent.SpaceAround}
        alignItems={FlexBoxAlignItems.Start}
      >
        <div>
          <Card
            header={
              <AnalyticalCardHeader
                description="Number of Best Practices in Collection"
                state="Default"
                subtitleText="Count"
                titleText="Mined Best Practices in Collection"
                value={modelStatistics.constraints_total}
              ></AnalyticalCardHeader>
            }
          />
          <div style={{ height: "20px" }}></div>
          <Card
            header={
              <AnalyticalCardHeader
                description="Number of Process Models"
                state="Default"
                subtitleText="Count"
                titleText="Models in Collection"
                value={modelStatistics.total}
              ></AnalyticalCardHeader>
            }
          />
        </div>
        <div>
          <Card
            header={<CardHeader titleText="Arity of Best-Practice Constraints" />}
            style={{
              width: "300px",
            }}
          >
            <PieChart
              loading={!chartsLoaded}
              dataset={arityStatistics}
              dimension={{
                accessor: "name",
              }}
              measure={{
                accessor: "count",
              }}
              onClick={function _a() {}}
              onDataPointClick={function _a() {}}
              onLegendClick={function _a() {}}
            />
          </Card>
        </div>
        <div>
          <Card
            header={<CardHeader titleText="Types of Best-Practice Constraints" />}
            style={{
              width: "300px",
            }}
          >
            <PieChart
              loading={!chartsLoaded}
              dataset={typeStatistics}
              dimension={{
                accessor: "name",
              }}
              measure={{
                accessor: "count",
              }}
              onClick={function _a() {}}
              onDataPointClick={function _a() {}}
              onLegendClick={function _a() {}}
            />
          </Card>
        </div>
        <div>
          <Card
            header={<CardHeader titleText="Levels of Best-Practice Constraints" />}
            style={{
              width: "300px",
            }}
          >
            <PieChart
              loading={!chartsLoaded}
              dataset={levelStatistics}
              dimension={{
                accessor: "name",
              }}
              measure={{
                accessor: "count",
              }}
              onClick={function _a() {}}
              onDataPointClick={function _a() {}}
              onLegendClick={function _a() {}}
            />
          </Card>
        </div>
      </FlexBox>
    </div>
  );
};

export default Statistics;
