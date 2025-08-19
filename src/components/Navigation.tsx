import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MessageSquare, 
  BarChart3, 
  FolderOpen, 
  User,
  Home
} from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/chat', icon: MessageSquare, label: 'Chat' },
    { path: '/data', icon: BarChart3, label: 'Data' },
    { path: '/workspaces', icon: FolderOpen, label: 'Workspaces' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="w-64 bg-surface border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">AIVA</span>
          </div>
          <div>
            <h1 className="font-semibold text-text">AIVA</h1>
            <p className="text-xs text-textSecondary">AI Assistant</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-6">
        <ul className="space-y-2 px-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-textSecondary hover:bg-border hover:text-text'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;