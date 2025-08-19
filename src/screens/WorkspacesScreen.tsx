import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Workspace } from '../types';

const WorkspacesScreen: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    isShared: false,
  });

  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#84CC16', // Lime
  ];

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    // Mock data for now
    const mockWorkspaces: Workspace[] = [
      {
        id: '1',
        name: 'Sales Analytics',
        description: 'Sales performance and customer insights',
        color: '#3B82F6',
        isShared: false,
        ownerId: 'user1',
        chatCount: 12,
        lastActivity: '2024-01-15T10:30:00Z',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
      {
        id: '2',
        name: 'Marketing Campaigns',
        description: 'Campaign performance and ROI analysis',
        color: '#10B981',
        isShared: true,
        ownerId: 'user1',
        chatCount: 8,
        lastActivity: '2024-01-14T15:45:00Z',
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-14T15:45:00Z',
      },
      {
        id: '3',
        name: 'Operations',
        description: 'Operational metrics and efficiency tracking',
        color: '#F59E0B',
        isShared: false,
        ownerId: 'user1',
        chatCount: 5,
        lastActivity: '2024-01-13T09:20:00Z',
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: '2024-01-13T09:20:00Z',
      },
    ];

    setWorkspaces(mockWorkspaces);
  };

  const filteredWorkspaces = workspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workspace.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateWorkspace = () => {
    if (!newWorkspace.name.trim()) {
      Alert.alert('Error', 'Workspace name is required');
      return;
    }

    const workspace: Workspace = {
      id: Date.now().toString(),
      ...newWorkspace,
      ownerId: 'user1',
      chatCount: 0,
      lastActivity: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setWorkspaces(prev => [workspace, ...prev]);
    setNewWorkspace({
      name: '',
      description: '',
      color: '#3B82F6',
      isShared: false,
    });
    setShowCreateModal(false);
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleWorkspacePress = (workspace: Workspace) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      workspace.name,
      `${workspace.description}\n\n${workspace.chatCount} chats • ${workspace.isShared ? 'Shared' : 'Private'}`
    );
  };

  const formatLastActivity = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString();
  };

  const renderWorkspaceCard = (workspace: Workspace) => (
    <TouchableOpacity
      key={workspace.id}
      style={styles.workspaceCard}
      onPress={() => handleWorkspacePress(workspace)}
    >
      <View style={styles.workspaceHeader}>
        <View style={styles.workspaceIconContainer}>
          <View
            style={[styles.workspaceIcon, { backgroundColor: workspace.color }]}
          >
            <Ionicons name="folder" size={20} color="#FFFFFF" />
          </View>
          <View style={styles.workspaceInfo}>
            <Text style={styles.workspaceName}>{workspace.name}</Text>
            <Text style={styles.workspaceDescription}>{workspace.description}</Text>
          </View>
        </View>
        
        <View style={styles.workspaceActions}>
          {workspace.isShared && (
            <View style={styles.sharedBadge}>
              <Ionicons name="people" size={12} color="#3B82F6" />
              <Text style={styles.sharedText}>Shared</Text>
            </View>
          )}
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={16} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.workspaceFooter}>
        <View style={styles.workspaceStats}>
          <View style={styles.statItem}>
            <Ionicons name="chatbubbles-outline" size={14} color="#64748B" />
            <Text style={styles.statText}>{workspace.chatCount} chats</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={14} color="#64748B" />
            <Text style={styles.statText}>{formatLastActivity(workspace.lastActivity)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCreateModal = () => (
    <Modal
      visible={showCreateModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowCreateModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={() => setShowCreateModal(false)}
            style={styles.modalCloseButton}
          >
            <Text style={styles.modalCloseText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>New Workspace</Text>
          <TouchableOpacity
            onPress={handleCreateWorkspace}
            style={styles.modalCreateButton}
          >
            <Text style={styles.modalCreateText}>Create</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Name</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter workspace name"
              placeholderTextColor="#94A3B8"
              value={newWorkspace.name}
              onChangeText={(text) => setNewWorkspace(prev => ({ ...prev, name: text }))}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Description</Text>
            <TextInput
              style={[styles.formInput, styles.formTextArea]}
              placeholder="Describe what this workspace is for"
              placeholderTextColor="#94A3B8"
              value={newWorkspace.description}
              onChangeText={(text) => setNewWorkspace(prev => ({ ...prev, description: text }))}
              multiline
              numberOfLines={3}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Color</Text>
            <View style={styles.colorPicker}>
              {colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    newWorkspace.color === color && styles.colorOptionSelected,
                  ]}
                  onPress={() => {
                    setNewWorkspace(prev => ({ ...prev, color }));
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                />
              ))}
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => {
                setNewWorkspace(prev => ({ ...prev, isShared: !prev.isShared }));
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <View style={[styles.checkbox, newWorkspace.isShared && styles.checkboxChecked]}>
                {newWorkspace.isShared && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Make this workspace shared</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="folder-open" size={24} color="#3B82F6" />
          <Text style={styles.headerTitle}>Workspaces</Text>
        </View>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#64748B" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search workspaces..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Workspaces List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredWorkspaces.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-outline" size={64} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No workspaces found' : 'No workspaces yet'}
            </Text>
            <Text style={styles.emptyText}>
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Create your first workspace to organize your conversations'
              }
            </Text>
            {!searchQuery && (
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => setShowCreateModal(true)}
              >
                <Text style={styles.emptyButtonText}>Create Workspace</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.workspacesList}>
            {filteredWorkspaces.map(renderWorkspaceCard)}
          </View>
        )}
      </ScrollView>

      {renderCreateModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 8,
  },
  createButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  workspacesList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  workspaceCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  workspaceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  workspaceIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  workspaceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  workspaceInfo: {
    flex: 1,
  },
  workspaceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  workspaceDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 18,
  },
  workspaceActions: {
    alignItems: 'flex-end',
  },
  sharedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF8FF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  sharedText: {
    fontSize: 12,
    color: '#3B82F6',
    marginLeft: 4,
    fontWeight: '500',
  },
  moreButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  workspaceFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
  },
  workspaceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalCloseButton: {
    paddingVertical: 8,
  },
  modalCloseText: {
    fontSize: 16,
    color: '#64748B',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  modalCreateButton: {
    paddingVertical: 8,
  },
  modalCreateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  formTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#1E293B',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#1E293B',
  },
});

export default WorkspacesScreen;