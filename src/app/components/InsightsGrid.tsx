"use client";

import React, { useState } from 'react';
import { Lightbulb, ChevronDown } from 'lucide-react';

const Button = ({ onClick, children }:any) => (
    <button
      onClick={onClick}
      className="flex items-center justify-center space-x-2 px-4 py-2 bg-accent-200 text-white rounded-md hover:bg-accent-200 transition-colors duration-300"
    >
      {children}
    </button>
  );
  

const InsightCard = ({ insight }:any) => (
  <div className="bg-white rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-start space-x-4">
    <Lightbulb className="text-yellow-400 flex-shrink-0" />
    <p className="text-gray-700">{insight}</p>
  </div>
);

const InsightsGrid = ({ insights, datasetLink }: any) => {
  const [visibleInsights, setVisibleInsights] = useState(6);

  const loadMore = () => {
    setVisibleInsights(prevVisible => Math.min(prevVisible + 6, insights.length));
  };

  return (
    <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
      <h2 className="text-2xl text-text-200 font-semibold mb-6">Key Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {insights.slice(0, visibleInsights).map((insight:any, index:number) => (
          <InsightCard key={index} insight={insight} />
        ))}
      </div>
      {visibleInsights < insights.length && (
        <div className="flex justify-center">
          <Button 
            onClick={loadMore}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <span>See More</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      )}
      <div className="mt-6 text-sm text-gray-500 italic">
        Disclaimer: These insights are derived from 
        <a 
          href={datasetLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline ml-1"
        >
          this dataset
        </a>.
      </div>
    </div>
  );
};

export default InsightsGrid;