import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { AuthService } from '../services/AuthService';
import { User } from '../types';

const ProfileScreen: React.FC = () => {
  const [user] = useState<User>({
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    provider: 'local',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    preferences: {
      theme: 'auto',
      language: 'en',
      notifications: true,
      voiceEnabled: true,
      dataMode: false,
    },
  });

  const [preferences, setPreferences] = useState(user.preferences || {
    theme: 'auto',
    language: 'en',
    notifications: true,
    voiceEnabled: true,
    dataMode: false,
  });

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await AuthService.logout();
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              // Navigation will be handled by the auth context
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Save preferences to backend
  };

  const renderProfileSection = () => (
    <View style={styles.section}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
          <View style={styles.providerBadge}>
            <Ionicons
              name={user.provider === 'google' ? 'logo-google' : 
                   user.provider === 'microsoft' ? 'logo-microsoft' : 'mail'}
              size={12}
              color="#64748B"
            />
            <Text style={styles.providerText}>
              {user.provider === 'local' ? 'Email' : user.provider}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="pencil" size={16} color="#3B82F6" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPreferencesSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Preferences</Text>
      
      <View style={styles.preferenceItem}>
        <View style={styles.preferenceLeft}>
          <Ionicons name="moon-outline" size={20} color="#64748B" />
          <Text style={styles.preferenceLabel}>Dark Mode</Text>
        </View>
        <Switch
          value={preferences.theme === 'dark'}
          onValueChange={(value) => 
            handlePreferenceChange('theme', value ? 'dark' : 'light')
          }
          trackColor={{ false: '#E2E8F0', true: '#3B82F6' }}
          thumbColor="#FFFFFF"
        />
      </View>
      
      <View style={styles.preferenceItem}>
        <View style={styles.preferenceLeft}>
          <Ionicons name="notifications-outline" size={20} color="#64748B" />
          <Text style={styles.preferenceLabel}>Push Notifications</Text>
        </View>
        <Switch
          value={preferences.notifications}
          onValueChange={(value) => handlePreferenceChange('notifications', value)}
          trackColor={{ false: '#E2E8F0', true: '#3B82F6' }}
          thumbColor="#FFFFFF"
        />
      </View>
      
      <View style={styles.preferenceItem}>
        <View style={styles.preferenceLeft}>
          <Ionicons name="mic-outline" size={20} color="#64748B" />
          <Text style={styles.preferenceLabel}>Voice Messages</Text>
        </View>
        <Switch
          value={preferences.voiceEnabled}
          onValueChange={(value) => handlePreferenceChange('voiceEnabled', value)}
          trackColor={{ false: '#E2E8F0', true: '#3B82F6' }}
          thumbColor="#FFFFFF"
        />
      </View>
      
      <View style={styles.preferenceItem}>
        <View style={styles.preferenceLeft}>
          <Ionicons name="analytics-outline" size={20} color="#64748B" />
          <Text style={styles.preferenceLabel}>Data Mode by Default</Text>
        </View>
        <Switch
          value={preferences.dataMode}
          onValueChange={(value) => handlePreferenceChange('dataMode', value)}
          trackColor={{ false: '#E2E8F0', true: '#3B82F6' }}
          thumbColor="#FFFFFF"
        />
      </View>
    </View>
  );

  const renderMenuSection = () => (
    <View style={styles.section}>
      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuLeft}>
          <Ionicons name="help-circle-outline" size={20} color="#64748B" />
          <Text style={styles.menuLabel}>Help & Support</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuLeft}>
          <Ionicons name="document-text-outline" size={20} color="#64748B" />
          <Text style={styles.menuLabel}>Terms of Service</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuLeft}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#64748B" />
          <Text style={styles.menuLabel}>Privacy Policy</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuLeft}>
          <Ionicons name="information-circle-outline" size={20} color="#64748B" />
          <Text style={styles.menuLabel}>About AIVA</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
      </TouchableOpacity>
    </View>
  );

  const renderDangerSection = () => (
    <View style={styles.section}>
      <TouchableOpacity style={styles.dangerItem} onPress={handleLogout}>
        <View style={styles.menuLeft}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={[styles.menuLabel, styles.dangerText]}>Sign Out</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="settings-outline" size={24} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderProfileSection()}
        {renderPreferencesSection()}
        {renderMenuSection()}
        {renderDangerSection()}
        
        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>AIVA v1.0.0</Text>
          <Text style={styles.versionSubtext}>
            Built with ❤️ for enterprise productivity
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  providerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  providerText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EBF8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  preferenceLabel: {
    fontSize: 16,
    color: '#1E293B',
    marginLeft: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuLabel: {
    fontSize: 16,
    color: '#1E293B',
    marginLeft: 12,
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  dangerText: {
    color: '#EF4444',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  versionText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
});

export default ProfileScreen;