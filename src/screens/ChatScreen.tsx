import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { GiftedChat, IMessage, InputToolbar, Bubble, Send } from 'react-native-gifted-chat';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { ChatService } from '../services/ChatService';
import { DataService } from '../services/DataService';
import { FileService } from '../services/FileService';
import { Chat, Message, User } from '../types';

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isDataMode, setIsDataMode] = useState(false);
  const [user] = useState<User>({
    id: '1',
    firstName: 'User',
    lastName: '',
    email: 'user@example.com',
    provider: 'local',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    // Initialize with welcome message
    setMessages([
      {
        _id: 1,
        text: 'Hello! I\'m AIVA, your intelligent assistant. How can I help you today?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'AIVA',
          avatar: '🤖',
        },
        quickReplies: {
          type: 'radio',
          keepIt: true,
          values: [
            {
              title: '📊 Ask about data',
              value: 'data_question',
            },
            {
              title: '💬 General chat',
              value: 'general_chat',
            },
            {
              title: '🔧 Help & Settings',
              value: 'help',
            },
          ],
        },
      },
    ]);
  }, []);

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    const userMessage = newMessages[0];
    
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages)
    );

    setIsTyping(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const response = await ChatService.sendMessage(
        userMessage.text,
        currentChat?.id,
        {
          useDataAgent: isDataMode,
        }
      );

      if (response.success && response.data) {
        const { aiResponse, chatId, dataResult, queryInfo } = response.data;
        
        // Update current chat if new
        if (!currentChat && chatId) {
          // Fetch the new chat details
          // This would typically be done with a separate API call
        }

        // Create AI response message
        const aiMessage: IMessage = {
          _id: Math.random().toString(),
          text: aiResponse.content,
          createdAt: new Date(aiResponse.timestamp),
          user: {
            _id: 2,
            name: 'AIVA',
            avatar: '🤖',
          },
        };

        // Add data visualization if available
        if (dataResult && dataResult.preview.length > 0) {
          aiMessage.text += '\n\n📊 Data Results:\n';
          aiMessage.text += `Found ${dataResult.rowCount} rows in ${dataResult.executionTime}ms`;
          
          // Add quick actions for data
          aiMessage.quickReplies = {
            type: 'radio',
            keepIt: false,
            values: [
              {
                title: '📋 View full data',
                value: 'view_data',
              },
              {
                title: '📈 Create chart',
                value: 'create_chart',
              },
              {
                title: '💾 Export data',
                value: 'export_data',
              },
            ],
          };
        }

        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, [aiMessage])
        );

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Send message error:', error);
      
      const errorMessage: IMessage = {
        _id: Math.random().toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'AIVA',
          avatar: '🤖',
        },
      };

      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [errorMessage])
      );

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsTyping(false);
    }
  }, [currentChat, isDataMode]);

  const onQuickReply = useCallback((quickReply: any) => {
    const { value } = quickReply[0];
    
    switch (value) {
      case 'data_question':
        setIsDataMode(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Alert.alert(
          'Data Mode Enabled',
          'I can now help you with questions about your enterprise data. Ask me anything about your business metrics, reports, or analytics.'
        );
        break;
      case 'general_chat':
        setIsDataMode(false);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'help':
        const helpMessage: IMessage = {
          _id: Math.random().toString(),
          text: '🔧 Here are some things I can help you with:\n\n• Answer questions about your business data\n• Generate reports and insights\n• Help with general queries\n• Manage your workspaces\n• File management and sharing',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'AIVA',
            avatar: '🤖',
          },
        };
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, [helpMessage])
        );
        break;
      default:
        break;
    }
  }, []);

  const handleAttachment = async () => {
    try {
      const result = await FileService.pickDocument();
      
      if (result.type === 'success') {
        // Handle file upload
        const uploadResponse = await FileService.uploadFile({
          uri: result.uri,
          name: result.name,
          type: result.mimeType || 'application/octet-stream',
        });

        if (uploadResponse.success) {
          const fileMessage: IMessage = {
            _id: Math.random().toString(),
            text: `📎 Uploaded: ${result.name}`,
            createdAt: new Date(),
            user: {
              _id: user.id,
              name: `${user.firstName} ${user.lastName}`,
            },
          };

          setMessages(previousMessages =>
            GiftedChat.append(previousMessages, [fileMessage])
          );

          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch (error) {
      console.error('File attachment error:', error);
      Alert.alert('Error', 'Failed to attach file');
    }
  };

  const renderInputToolbar = (props: any) => (
    <InputToolbar
      {...props}
      containerStyle={styles.inputToolbar}
      primaryStyle={styles.inputPrimary}
      accessoryStyle={styles.inputAccessory}
    />
  );

  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: styles.bubbleRight,
        left: styles.bubbleLeft,
      }}
      textStyle={{
        right: styles.bubbleTextRight,
        left: styles.bubbleTextLeft,
      }}
    />
  );

  const renderSend = (props: any) => (
    <Send {...props}>
      <View style={styles.sendButton}>
        <Ionicons name="send" size={20} color="#FFFFFF" />
      </View>
    </Send>
  );

  const renderActions = () => (
    <TouchableOpacity style={styles.actionButton} onPress={handleAttachment}>
      <Ionicons name="attach" size={24} color="#3B82F6" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>🤖</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>AIVA</Text>
            <Text style={styles.headerSubtitle}>
              {isDataMode ? 'Data Mode • Ready for business questions' : 'General Chat'}
            </Text>
          </View>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.modeToggle, isDataMode && styles.modeToggleActive]}
            onPress={() => {
              setIsDataMode(!isDataMode);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
          >
            <Ionicons
              name="analytics"
              size={20}
              color={isDataMode ? '#FFFFFF' : '#64748B'}
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="ellipsis-vertical" size={20} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat */}
      <GiftedChat
        messages={messages}
        onSend={onSend}
        onQuickReply={onQuickReply}
        user={{
          _id: user.id,
          name: `${user.firstName} ${user.lastName}`,
        }}
        renderInputToolbar={renderInputToolbar}
        renderBubble={renderBubble}
        renderSend={renderSend}
        renderActions={renderActions}
        isTyping={isTyping}
        placeholder="Type a message..."
        alwaysShowSend
        scrollToBottom
        infiniteScroll
      />
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
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeToggle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  modeToggleActive: {
    backgroundColor: '#3B82F6',
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputToolbar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  inputPrimary: {
    alignItems: 'center',
  },
  inputAccessory: {
    height: 44,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    marginBottom: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  bubbleRight: {
    backgroundColor: '#3B82F6',
  },
  bubbleLeft: {
    backgroundColor: '#F1F5F9',
  },
  bubbleTextRight: {
    color: '#FFFFFF',
  },
  bubbleTextLeft: {
    color: '#1E293B',
  },
});

export default ChatScreen;