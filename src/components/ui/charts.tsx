// UI components for charts
import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Default chart options
const defaultBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const defaultLineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const defaultPieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
    },
  },
};

// Define chart data types
interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    tension?: number;
  }>;
}

interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: Record<string, any>;
  scales?: Record<string, any>;
  [key: string]: any;
}

// Bar Chart Component
export function BarChart({ data, options = {} }: { data: ChartData; options?: ChartOptions }) {
  const mergedOptions = { ...defaultBarOptions, ...options };
  return <Bar data={data} options={mergedOptions} />;
}

// Line Chart Component
export function LineChart({ data, options = {} }: { data: ChartData; options?: ChartOptions }) {
  const mergedOptions = { ...defaultLineOptions, ...options };
  return <Line data={data} options={mergedOptions} />;
}

// Pie Chart Component
export function PieChart({ data, options = {} }: { data: ChartData; options?: ChartOptions }) {
  const mergedOptions = { ...defaultPieOptions, ...options };
  return <Pie data={data} options={mergedOptions} />;
}
