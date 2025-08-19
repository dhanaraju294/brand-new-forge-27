import React, { createContext, useContext, useState, useEffect } from 'react';
import { DataService } from '../services/DataService';
import { Dataset } from '../types';

interface DataContextType {
  datasets: Dataset[];
  selectedDataset: string | null;
  isDataModeEnabled: boolean;
  setSelectedDataset: (datasetId: string | null) => void;
  setDataModeEnabled: (enabled: boolean) => void;
  refreshDatasets: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [isDataModeEnabled, setDataModeEnabled] = useState(false);

  useEffect(() => {
    refreshDatasets();
  }, []);

  const refreshDatasets = async () => {
    try {
      const response = await DataService.getDatasets();
      if (response.success && response.data) {
        setDatasets(response.data);
        if (response.data.length > 0 && !selectedDataset) {
          setSelectedDataset(response.data[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to refresh datasets:', error);
    }
  };

  const value: DataContextType = {
    datasets,
    selectedDataset,
    isDataModeEnabled,
    setSelectedDataset,
    setDataModeEnabled,
    refreshDatasets,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};