import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HealthDashboard from './CardiovascularDashboard';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
) as jest.Mock;

// Mock the Nivo components
jest.mock('@nivo/bar', () => ({
  ResponsiveBar: () => <div data-testid="mock-responsive-bar" />,
}));
jest.mock('@nivo/line', () => ({
  ResponsiveLine: () => <div data-testid="mock-responsive-line" />,
}));
jest.mock('@nivo/heatmap', () => ({
  ResponsiveHeatMap: () => <div data-testid="mock-responsive-heatmap" />,
}));

describe('HealthDashboard', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders loading spinner initially', () => {
    render(<HealthDashboard />);
    expect(screen.getByTestId('square-of-dots-spinner')).toBeInTheDocument();
  });

  it('fetches data and renders charts', async () => {
    render(<HealthDashboard />);

    await waitFor(() => {
      expect(screen.queryByTestId('square-of-dots-spinner')).not.toBeInTheDocument();
      expect(screen.getByText('Health in India: Exploratory Data Analysis')).toBeInTheDocument();
      expect(screen.getByText('Health Indicators Correlation Heatmap')).toBeInTheDocument();
      expect(screen.getByText('Gender Comparison of Health Issues')).toBeInTheDocument();
      expect(screen.getByText('Top 5 States: Child Stunting')).toBeInTheDocument();
      expect(screen.getByText('State Comparison: Multiple Health Issues')).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledTimes(5);
  });

  // Add more tests here as needed
});