import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { DataService, DataQuestionRequest, DataQuestionResponse } from '../services/DataService';
import { Dataset } from '../types';

const DataScreen: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string>('');
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DataQuestionResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'question' | 'query'>('question');

  // Sample questions
  const sampleQuestions = [
    "What are the top 5 performing products this month?",
    "Show me sales trends over the last 6 months",
    "What is the total revenue for this quarter?",
    "Which customers have the highest order values?",
    "How many orders were placed last week?",
    "What is the average order value by region?",
  ];

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    try {
      const response = await DataService.getDatasets();
      if (response.success && response.data) {
        setDatasets(response.data);
        if (response.data.length > 0) {
          setSelectedDataset(response.data[0].id);
        }
      }
    } catch (error) {
      console.error('Load datasets error:', error);
    }
  };

  const handleQuestionSubmit = async () => {
    if (!question.trim()) {
      Alert.alert('Error', 'Please enter a question');
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const request: DataQuestionRequest = {
        question,
        datasetId: selectedDataset || undefined,
        includeVisualization: true,
      };

      const response = await DataService.askDataQuestion(request);

      if (response.success && response.data) {
        setResult(response.data);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Alert.alert('Error', response.error || 'Failed to process question');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (error) {
      console.error('Question submit error:', error);
      Alert.alert('Error', 'Network error occurred');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleQuestion = (sampleQuestion: string) => {
    setQuestion(sampleQuestion);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const renderDatasetSelector = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Dataset</Text>
      <View style={styles.datasetSelector}>
        <Ionicons name="database-outline" size={20} color="#64748B" />
        <Text style={styles.datasetText}>
          {datasets.find(d => d.id === selectedDataset)?.name || 'Select dataset'}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#64748B" />
      </View>
    </View>
  );

  const renderQuestionTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {renderDatasetSelector()}

      {/* Question Input */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Ask a Question</Text>
        <View style={styles.questionInputContainer}>
          <TextInput
            style={styles.questionInput}
            placeholder="e.g., What are our top performing products this month?"
            placeholderTextColor="#94A3B8"
            value={question}
            onChangeText={setQuestion}
            multiline
            numberOfLines={3}
          />
        </View>
      </View>

      {/* Sample Questions */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Sample Questions</Text>
        <View style={styles.sampleQuestionsContainer}>
          {sampleQuestions.map((sample, index) => (
            <TouchableOpacity
              key={index}
              style={styles.sampleQuestionButton}
              onPress={() => handleSampleQuestion(sample)}
            >
              <Ionicons name="help-circle-outline" size={16} color="#3B82F6" />
              <Text style={styles.sampleQuestionText}>{sample}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
        onPress={handleQuestionSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Ionicons name="send" size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>Ask Question</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );

  const renderQueryTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.comingSoonContainer}>
        <Ionicons name="code-slash-outline" size={64} color="#CBD5E1" />
        <Text style={styles.comingSoonTitle}>Direct Query</Text>
        <Text style={styles.comingSoonText}>
          Execute SQL and DAX queries directly against your datasets
        </Text>
        <Text style={styles.comingSoonSubtext}>Coming Soon</Text>
      </View>
    </ScrollView>
  );

  const renderResult = () => {
    if (!result) return null;

    return (
      <View style={styles.resultContainer}>
        <View style={styles.resultHeader}>
          <Ionicons name="analytics" size={20} color="#3B82F6" />
          <Text style={styles.resultTitle}>AI Analysis</Text>
        </View>
        
        <Text style={styles.resultText}>{result.answer}</Text>
        
        {result.data && (
          <View style={styles.dataResultContainer}>
            <Text style={styles.dataResultTitle}>Data Results</Text>
            <View style={styles.dataResultStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{result.data.rowCount}</Text>
                <Text style={styles.statLabel}>Rows</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{result.data.executionTime}ms</Text>
                <Text style={styles.statLabel}>Execution Time</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{result.data.queryType.toUpperCase()}</Text>
                <Text style={styles.statLabel}>Query Type</Text>
              </View>
            </View>
          </View>
        )}
        
        <View style={styles.resultFooter}>
          <Text style={styles.confidenceText}>
            Confidence: {Math.round(result.confidence * 100)}%
          </Text>
          <Text style={styles.tokensText}>
            Tokens: {result.tokens}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="analytics" size={24} color="#3B82F6" />
          <Text style={styles.headerTitle}>Data Insights</Text>
        </View>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="help-circle-outline" size={24} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'question' && styles.tabActive]}
          onPress={() => setActiveTab('question')}
        >
          <Text style={[styles.tabText, activeTab === 'question' && styles.tabTextActive]}>
            Ask Question
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'query' && styles.tabActive]}
          onPress={() => setActiveTab('query')}
        >
          <Text style={[styles.tabText, activeTab === 'query' && styles.tabTextActive]}>
            Direct Query
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'question' ? renderQuestionTab() : renderQueryTab()}
        {result && renderResult()}
      </View>
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
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#3B82F6',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionContainer: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  datasetSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  datasetText: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    marginLeft: 8,
  },
  questionInputContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  questionInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1E293B',
    textAlignVertical: 'top',
  },
  sampleQuestionsContainer: {
    gap: 8,
  },
  sampleQuestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sampleQuestionText: {
    flex: 1,
    fontSize: 14,
    color: '#475569',
    marginLeft: 8,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    marginVertical: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 8,
  },
  comingSoonSubtext: {
    fontSize: 14,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  resultContainer: {
    backgroundColor: '#F8FAFC',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 8,
  },
  resultText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 16,
  },
  dataResultContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  dataResultTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  dataResultStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  resultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confidenceText: {
    fontSize: 12,
    color: '#64748B',
  },
  tokensText: {
    fontSize: 12,
    color: '#64748B',
  },
});

export default DataScreen;