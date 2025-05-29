
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface PlaygroundConfig {
  model: string;
  systemPrompt: string;
  userPrompt: string;
  temperature: number;
  maxTokens: number;
  presencePenalty: number;
  frequencyPenalty: number;
  stopSequences: string[];
  productName: string;
}

export interface PlaygroundResult {
  id: string;
  config: PlaygroundConfig;
  output: string;
  wordCount: number;
  generationTime: number;
  timestamp: Date;
}

interface PlaygroundContextType {
  config: PlaygroundConfig;
  updateConfig: (updates: Partial<PlaygroundConfig>) => void;
  results: PlaygroundResult[];
  setResults: (results: PlaygroundResult[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  runPlayground: () => Promise<void>;
}

const PlaygroundContext = createContext<PlaygroundContextType | undefined>(undefined);

export const usePlayground = () => {
  const context = useContext(PlaygroundContext);
  if (!context) {
    throw new Error('usePlayground must be used within a PlaygroundProvider');
  }
  return context;
};

export const PlaygroundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<PlaygroundConfig>({
    model: 'gemini-1.5-flash',
    systemPrompt: 'You are an expert product description writer. Create compelling, detailed descriptions that highlight key features and benefits.',
    userPrompt: 'Write a product description for: {product_name}',
    temperature: 0.7,
    maxTokens: 150,
    presencePenalty: 0,
    frequencyPenalty: 0,
    stopSequences: [],
    productName: 'iPhone 15 Pro'
  });

  const [results, setResults] = useState<PlaygroundResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateConfig = (updates: Partial<PlaygroundConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const runPlayground = async () => {
    setIsLoading(true);
    setResults([]);

    try {
      // Create multiple variations of parameters to test
      const variations = [
        { temperature: 0.3, presencePenalty: 0, frequencyPenalty: 0 },
        { temperature: 0.7, presencePenalty: 0, frequencyPenalty: 0 },
        { temperature: 1.1, presencePenalty: 0, frequencyPenalty: 0 },
        { temperature: 0.7, presencePenalty: 0.5, frequencyPenalty: 0 },
        { temperature: 0.7, presencePenalty: 0, frequencyPenalty: 0.5 },
        { temperature: 0.7, presencePenalty: 0.3, frequencyPenalty: 0.3 },
      ];

      const newResults: PlaygroundResult[] = [];

      for (const variation of variations) {
        const startTime = Date.now();
        const variationConfig = { ...config, ...variation };
        
        try {
          const output = await generateContent(variationConfig);
          const endTime = Date.now();

          newResults.push({
            id: `${Date.now()}-${Math.random()}`,
            config: variationConfig,
            output,
            wordCount: output.split(' ').length,
            generationTime: endTime - startTime,
            timestamp: new Date()
          });
        } catch (error) {
          console.error('Error generating content:', error);
          newResults.push({
            id: `${Date.now()}-${Math.random()}`,
            config: variationConfig,
            output: 'Error generating content. Please check your API key and try again.',
            wordCount: 0,
            generationTime: 0,
            timestamp: new Date()
          });
        }
      }

      setResults(newResults);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PlaygroundContext.Provider value={{
      config,
      updateConfig,
      results,
      setResults,
      isLoading,
      setIsLoading,
      runPlayground
    }}>
      {children}
    </PlaygroundContext.Provider>
  );
};

// Gemini API integration
const generateContent = async (config: PlaygroundConfig): Promise<string> => {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Gemini API key not found. Please set VITE_GEMINI_API_KEY in your environment variables.');
  }

  const prompt = config.userPrompt.replace('{product_name}', config.productName);
  const fullPrompt = `${config.systemPrompt}\n\n${prompt}`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: fullPrompt
        }]
      }],
      generationConfig: {
        temperature: config.temperature,
        maxOutputTokens: config.maxTokens,
        stopSequences: config.stopSequences
      }
    })
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No content generated';
};
