"use client";

import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';

type HealthMetric = {
  condition: string;
  percentage: number;
};

const list = [
  "Child Anemia",
  "Women Anemia",
  "Child Stunting",
  "Child Wasting",
  "Child Underweight",
  "Women Underweight",
  "Women Overweight",
  "High Blood Sugar (W)",
  "High Blood Sugar (M)",
  "High BP (W)",
  "High BP (M)",
  "Tobacco Use (W)",
  "Tobacco Use (M)",
  "Alcohol Use (W)",
  "Alcohol Use (M)"
];

const NationalHealthAveragesChart: React.FC = () => {
  const [nationalAverages, setNationalAverages] = useState<HealthMetric[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [averagesResponse] = await Promise.all([
        fetch('/national_health_averages.json'),
      ]);

      const averageDataJson = await averagesResponse.json();
      const averageData: HealthMetric[] = [];
      Object.keys(averageDataJson).map((data: string) => {
        if (list.includes(data)) {
          averageData.push({ condition: data, percentage: averageDataJson[data] });
        }
      })
      setNationalAverages(averageData);
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-[600px]">
      <h2 className="text-xl font-bold mb-4">National Health Averages: Population Impacted (%)</h2>
      <ResponsiveBar
        data={nationalAverages}
        keys={['percentage']}
        indexBy="condition"
        margin={{ top: 50, right: 130, bottom: 50, left: 180 }}
        padding={0.3}
        layout="horizontal"
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'nivo' }}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Percentage of Population (%)',
          legendPosition: 'middle',
          legendOffset: 32
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Health Condition',
          legendPosition: 'middle',
          legendOffset: -140
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
            effects: [
              {
                on: 'hover',
                style: {
                  itemOpacity: 1
                }
              }
            ]
          }
        ]}
        role="application"
        ariaLabel="National health averages bar chart"
        barAriaLabel={e => `${e.indexValue}: ${e.value}% of population affected`}
        tooltip={({ indexValue, value }) => (
          <strong>
            {indexValue}: {value.toFixed(2)}% of population affected
          </strong>
        )}
      />
    </div>
  );
};

export default NationalHealthAveragesChart;