"use client";

import React, { useState, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';

import InsightsGrid from '@/src/app/components/InsightsGrid';
import NationalHealthAveragesChart from '@/src/app/components/NationalHealthAveragesChart';

const SquareOfDotsSpinner = () => (
  <div className="square-of-dots w-20 h-20 relative"></div>
);

type HealthData = {
  [key: string]: number;
};

type TopBottomStates = {
  [indicator: string]: {
    top_5: { [state: string]: number };
    bottom_5: { [state: string]: number };
  };
};

type StateData = {
  [state: string]: HealthData;
};

const HealthDashboard: React.FC = () => {
  const [nationalAverages, setNationalAverages] = useState<HealthData | null>(null);
  const [topBottomStates, setTopBottomStates] = useState<TopBottomStates | null>(null);
  const [stateData, setStateData] = useState<StateData | null>(null);
  const [insights, setInsights] = useState<string[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [averagesResponse, topBottomResponse, stateResponse, insightsResponse] = await Promise.all([
        fetch('/national_health_averages.json'),
        fetch('/top_bottom_states.json'),
        fetch('/state_health_averages.json'),
        fetch('/health_insights.json')
      ]);

      setNationalAverages(await averagesResponse.json());
      setTopBottomStates(await topBottomResponse.json());
      setStateData(await stateResponse.json());
      setInsights(await insightsResponse.json());
    };

    fetchData();
  }, []);

  if (!nationalAverages || !topBottomStates || !stateData || !insights) {
    // return <div className="flex justify-center items-center h-screen">Loading...</div>;
    return (
      <div className="flex justify-center items-center h-screen">
        <SquareOfDotsSpinner />
      </div>
    )
  }

  const genderComparisonData = [
    { id: 'High Blood Sugar', Men: nationalAverages['High Blood Sugar (M)'], Women: nationalAverages['High Blood Sugar (W)'] },
    { id: 'High Blood Pressure', Men: nationalAverages['High BP (M)'], Women: nationalAverages['High BP (W)'] },
    { id: 'Tobacco Use', Men: nationalAverages['Tobacco Use (M)'], Women: nationalAverages['Tobacco Use (W)'] },
    { id: 'Alcohol Use', Men: nationalAverages['Alcohol Use (M)'], Women: nationalAverages['Alcohol Use (W)'] },
  ];

  const childHealthData = Object.entries(topBottomStates['Child Stunting'].top_5)
    .map(([state, value]) => ({ id: state, value }));

  const stateComparisonData = Object.entries(stateData)
    .map(([state, data]) => ({
      state,
      'Child Stunting': data['Child Stunting'],
      'Women Anemia': data['Women Anemia'],
      'High BP (M)': data['High BP (M)'],
    }))
    .sort((a, b) => b['Child Stunting'] - a['Child Stunting'])
    .slice(0, 10);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl text-accent-200 font-bold mb-8 text-center">Health in India: Exploratory Data Analysis</h1>

      <InsightsGrid
        insights={insights}
        datasetLink="https://www.kaggle.com/datasets/bhanupratapbiswas/national-family-health-survey-nfhs-2019-21"
      />

      <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <NationalHealthAveragesChart />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl text-primary-300 font-semibold mb-4">Gender Comparison of Health Issues</h2>
          <div className="h-80 md:h-96">
            <ResponsiveBar
              data={genderComparisonData}
              keys={['Men', 'Women']}
              indexBy="id"
              groupMode="grouped"
              margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
              padding={0.3}
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={{ scheme: 'paired' }}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: 'Health Issue',
                legendPosition: 'middle',
                legendOffset: 32
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Percentage',
                legendPosition: 'middle',
                legendOffset: -40
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              legends={[
                {
                  dataFrom: 'keys',
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 120,
                  translateY: 0,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: 'left-to-right',
                  itemOpacity: 0.85,
                  symbolSize: 20,
                  effects: [{ on: 'hover', style: { itemOpacity: 1 } }]
                }
              ]}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl text-primary-300 font-semibold mb-4">Top 5 States: Child Stunting</h2>
          <div className="h-80 md:h-96">
            <ResponsiveBar
              data={childHealthData}
              keys={['value']}
              indexBy="id"
              margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
              padding={0.3}
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={{ scheme: 'nivo' }}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: 'State',
                legendPosition: 'middle',
                legendOffset: 32
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Percentage of Children Stunted',
                legendPosition: 'middle',
                legendOffset: -40
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl text-primary-300 font-semibold mb-4">State Comparison: Multiple Health Issues</h2>
          <div className="h-80 md:h-96">
            <ResponsiveLine
              data={[
                {
                  id: 'Child Stunting',
                  data: stateComparisonData.map(d => ({ x: d.state, y: d['Child Stunting'] }))
                },
                {
                  id: 'Women Anemia',
                  data: stateComparisonData.map(d => ({ x: d.state, y: d['Women Anemia'] }))
                },
                {
                  id: 'High BP (Men)',
                  data: stateComparisonData.map(d => ({ x: d.state, y: d['High BP (M)'] }))
                }
              ]}
              margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: 'State',
                legendOffset: 36,
                legendPosition: 'middle'
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Percentage',
                legendOffset: -40,
                legendPosition: 'middle'
              }}
              pointSize={10}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              pointLabelYOffset={-12}
              useMesh={true}
              legends={[
                {
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 100,
                  translateY: 0,
                  itemsSpacing: 0,
                  itemDirection: 'left-to-right',
                  itemWidth: 80,
                  itemHeight: 20,
                  itemOpacity: 0.75,
                  symbolSize: 12,
                  symbolShape: 'circle',
                  symbolBorderColor: 'rgba(0, 0, 0, .5)',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemBackground: 'rgba(0, 0, 0, .03)',
                        itemOpacity: 1
                      }
                    }
                  ]
                }
              ]}
            />
          </div>
        </div>
      </div>


    </div>
  );
};

export default HealthDashboard;