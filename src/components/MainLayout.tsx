import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Screens
import ChatScreen from '../screens/ChatScreen';
import DataScreen from '../screens/DataScreen';
import WorkspacesScreen from '../screens/WorkspacesScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Components
import Navigation from './Navigation';

const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-background">
      <Navigation />
      <main className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<Navigate to="/chat" replace />} />
          <Route path="/chat" element={<ChatScreen />} />
          <Route path="/data" element={<DataScreen />} />
          <Route path="/workspaces" element={<WorkspacesScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
        </Routes>
      </main>
    </div>
  );
};

export default MainLayout;