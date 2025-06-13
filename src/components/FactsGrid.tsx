"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Info, TrendingUp, Award, Users, Clock, BookOpen } from 'lucide-react';

interface FactCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  color: 'blue' | 'green' | 'purple' | 'amber' | 'red';
}

const FactCard: React.FC<FactCardProps> = ({ icon, title, value, description, color }) => {
  // Define color classes based on the color prop
  const colorClasses = {
    blue: 'bg-blue-900/30 border-blue-700/50 text-blue-400',
    green: 'bg-green-900/30 border-green-700/50 text-green-400',
    purple: 'bg-purple-900/30 border-purple-700/50 text-purple-400',
    amber: 'bg-amber-900/30 border-amber-700/50 text-amber-400',
    red: 'bg-red-900/30 border-red-700/50 text-red-400'
  };

  const iconColorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    amber: 'text-amber-500',
    red: 'text-red-500'
  };

  return (
    <motion.div
      className={`rounded-lg p-6 border ${colorClasses[color]} shadow-lg`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start">
        <div className={`p-2 rounded-full ${iconColorClasses[color]} bg-opacity-20 mr-4`}>
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-medium text-white mb-1">{title}</h3>
          <div className="text-3xl font-bold mb-2">{value}</div>
          <p className="text-sm text-gray-300">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

interface FactsGridProps {
  facts: {
    icon: 'info' | 'trending' | 'award' | 'users' | 'clock' | 'book';
    title: string;
    value: string;
    description: string;
    color: 'blue' | 'green' | 'purple' | 'amber' | 'red';
  }[];
}

const FactsGrid: React.FC<FactsGridProps> = ({ facts }) => {
  // Map icon strings to actual icon components
  const getIcon = (iconName: string, size = 24) => {
    switch (iconName) {
      case 'info':
        return <Info size={size} />;
      case 'trending':
        return <TrendingUp size={size} />;
      case 'award':
        return <Award size={size} />;
      case 'users':
        return <Users size={size} />;
      case 'clock':
        return <Clock size={size} />;
      case 'book':
        return <BookOpen size={size} />;
      default:
        return <Info size={size} />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {facts.map((fact, index) => (
        <FactCard
          key={index}
          icon={getIcon(fact.icon)}
          title={fact.title}
          value={fact.value}
          description={fact.description}
          color={fact.color}
        />
      ))}
    </div>
  );
};

export default FactsGrid;
