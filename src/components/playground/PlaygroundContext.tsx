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
  tokenCount: number;
  generationTime: number;
  timestamp: Date;
}

export interface PlaygroundContextType {
  config: PlaygroundConfig;
  updateConfig: (updates: Partial<PlaygroundConfig>) => void;
  results: PlaygroundResult[];
  setResults: (results: PlaygroundResult[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  runPlayground: () => Promise<void>;
  batched: boolean;
  setBatched: (b: boolean) => void;
  sampleCount: number;
  setSampleCount: (n: number) => void;
  responseHistory: PlaygroundResult[];
  setResponseHistory: (h: PlaygroundResult[]) => void;
  compareResponses: () => void;
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
  const [batched, setBatched] = useState(false);
  const [sampleCount, setSampleCount] = useState(6);
  const [responseHistory, setResponseHistory] = useState<PlaygroundResult[]>([]);

  const updateConfig = (updates: Partial<PlaygroundConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const runPlayground = async () => {
    setIsLoading(true);
    setResults([]);
    if (batched) {
      // Batched mode: generate multiple variations
      const newResults: PlaygroundResult[] = [];
      for (let i = 0; i < sampleCount; i++) {
        // Randomize parameters for each sample
        const variationConfig = {
          ...config,
          temperature: +(Math.random() * 2).toFixed(1),
          presencePenalty: +(Math.random() * 4 - 2).toFixed(1),
          frequencyPenalty: +(Math.random() * 4 - 2).toFixed(1),
        };
        const startTime = Date.now();
        try {
          const output = await generateContent(variationConfig);
          const endTime = Date.now();
          newResults.push({
            id: `${Date.now()}-${Math.random()}`,
            config: variationConfig,
            output,
            tokenCount: countTokens(output),
            generationTime: endTime - startTime,
            timestamp: new Date()
          });
        } catch (error) {
          newResults.push({
            id: `${Date.now()}-${Math.random()}`,
            config: variationConfig,
            output: 'Error generating content. Please check your API key and try again.',
            tokenCount: 0,
            generationTime: 0,
            timestamp: new Date()
          });
        }
      }
      setResults(newResults);
    } else {
      // Single response mode
      const startTime = Date.now();
      try {
        const output = await generateContent(config);
        const endTime = Date.now();
        const result: PlaygroundResult = {
          id: `${Date.now()}-${Math.random()}`,
          config: { ...config },
          output,
          tokenCount: countTokens(output),
          generationTime: endTime - startTime,
          timestamp: new Date()
        };
        setResults([result]);
        setResponseHistory((prev) => [...prev, result]);
      } catch (error) {
        const result: PlaygroundResult = {
          id: `${Date.now()}-${Math.random()}`,
          config: { ...config },
          output: 'Error generating content. Please check your API key and try again.',
          tokenCount: 0,
          generationTime: 0,
          timestamp: new Date()
        };
        setResults([result]);
        setResponseHistory((prev) => [...prev, result]);
      }
    }
    setIsLoading(false);
  };

  const compareResponses = async () => {
    let outputs: string[] = [];
    if (batched && results.length > 0) {
      outputs = results.map(r => r.output);
    } else if (!batched && responseHistory.length > 1) {
      outputs = responseHistory.map(r => r.output);
    }
    if (outputs.length < 2) return;
    setIsLoading(true);
    try {
      const summaryPrompt = `Summarize the following responses and provide the best, most comprehensive answer.\n\nResponses:\n${outputs.map((o, i) => `Response ${i + 1}:\n${o}`).join('\n\n')}\n\nSummary:`;
      const summaryConfig = {
        ...config,
        systemPrompt: '',
        userPrompt: summaryPrompt,
        temperature: 0.5,
        maxTokens: 200,
      };
      const output = await generateContent(summaryConfig);
      setResults([
        {
          id: 'compare',
          config: summaryConfig,
          output,
          tokenCount: countTokens(output),
          generationTime: 0,
          timestamp: new Date(),
        },
      ]);
    } catch (e) {
      setResults([
        {
          id: 'compare',
          config,
          output: 'Error generating summary.',
          tokenCount: 0,
          generationTime: 0,
          timestamp: new Date(),
        },
      ]);
    }
    setIsLoading(false);
  };

  return (
    <PlaygroundContext.Provider value={{
      config,
      updateConfig,
      results,
      setResults,
      isLoading,
      setIsLoading,
      runPlayground,
      batched,
      setBatched,
      sampleCount,
      setSampleCount,
      responseHistory,
      setResponseHistory,
      compareResponses
    }}>
      {children}
    </PlaygroundContext.Provider>
  );
};

// Gemini API integration
const generateContent = async (config: PlaygroundConfig): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  console.log("Gemini API Key:", apiKey);
  
  if (!apiKey) {
    throw new Error('Gemini API key not found. Please set VITE_GEMINI_API_KEY in your .env file.');
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
  let output = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No content generated';

  // Stop Sequence Post-Processing
  if (Array.isArray(config.stopSequences) && config.stopSequences.length > 0) {
    let minIdx = -1;
    let matchedSeq = '';
    for (const seq of config.stopSequences) {
      if (!seq) continue;
      const idx = output.indexOf(seq);
      if (idx !== -1 && (minIdx === -1 || idx < minIdx)) {
        minIdx = idx;
        matchedSeq = seq;
      }
    }
    if (minIdx !== -1) {
      output = output.substring(0, minIdx);
    }
  }

  return output;
};

// Helper to count tokens (approximate)
function countTokens(text: string): number {
  // Split on whitespace and punctuation
  return text.split(/\s+|(?=\W)|(?<=\W)/).filter(Boolean).length;
}
