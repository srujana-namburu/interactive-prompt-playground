import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { usePlayground } from './PlaygroundContext';
import { Copy, Clock, Type, TrendingUp, BarChart3, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ResultsPanel = () => {
  const { results, isLoading, batched, compareResponses, runPlayground, responseHistory, setResults } = usePlayground();
  const previousResultsRef = useRef(null);
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  };

  const getParameterVariationColor = (value: number, type: 'temperature' | 'presence' | 'frequency') => {
    if (type === 'temperature') {
      if (value <= 0.4) return 'bg-blue-100 text-blue-700';
      if (value <= 0.8) return 'bg-green-100 text-green-700';
      return 'bg-orange-100 text-orange-700';
    }
    if (Math.abs(value) <= 0.2) return 'bg-gray-100 text-gray-700';
    if (Math.abs(value) <= 0.5) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  // Store previous results before showing summary
  const handleCompare = () => {
    previousResultsRef.current = [...results];
    compareResponses();
  };

  // Restore previous results/history
  const handleBack = () => {
    if (previousResultsRef.current) {
      setResults(previousResultsRef.current);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl shadow-blue-100/25">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-800">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              <span>Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-4 border border-gray-200 rounded-lg animate-pulse">
                  <div className="flex space-x-2 mb-3">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Grid */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl shadow-blue-100/25 hover:shadow-2xl hover:shadow-blue-100/40 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-800">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <span>Parameter Variations & Results</span>
            {results.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {results.length} {batched ? 'variations' : 'responses'}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Batched Mode: Compare Button */}
          {batched && results.length > 1 && results[0]?.id !== 'compare' && (
            <Button className="mb-4" onClick={handleCompare} disabled={isLoading} variant="outline">
              Compare
            </Button>
          )}
          {/* Single Mode: Generate Again Button */}
          {!batched && results[0]?.id !== 'compare' && (
            <Button className="mb-4" onClick={runPlayground} disabled={isLoading} variant="outline">
              Generate Again
            </Button>
          )}
          {results.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No results yet</p>
              <p className="text-gray-400">Click "Run Playground" to generate content variations</p>
            </div>
          ) : results[0]?.id === 'compare' ? (
            <div className="space-y-4">
              <div className="group relative p-6 border border-yellow-400 rounded-xl bg-gradient-to-br from-yellow-50 to-amber-50/50">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="text-xs bg-yellow-200 text-yellow-800">Summary</Badge>
                </div>
                <div className="mb-4 p-4 bg-white/60 rounded-lg border border-gray-100">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{results[0].output}</p>
                </div>
                <Button variant="outline" onClick={handleBack}>Back to Results</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => (
                <div
                  key={result.id}
                  className="group relative p-6 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50"
                >
                  {/* Parameter badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className={`text-xs ${getParameterVariationColor(result.config.temperature, 'temperature')}`}>T: {result.config.temperature.toFixed(1)}</Badge>
                    <Badge className={`text-xs ${getParameterVariationColor(result.config.presencePenalty, 'presence')}`}>PP: {result.config.presencePenalty.toFixed(1)}</Badge>
                    <Badge className={`text-xs ${getParameterVariationColor(result.config.frequencyPenalty, 'frequency')}`}>FP: {result.config.frequencyPenalty.toFixed(1)}</Badge>
                    <Badge variant="outline" className="text-xs">Variation {index + 1}</Badge>
                  </div>
                  {/* Generated content */}
                  <div className="mb-4 p-4 bg-white/60 rounded-lg border border-gray-100">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{result.output}</p>
                  </div>
                  {/* Metrics and actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Type className="w-4 h-4" />
                        <span>{result.tokenCount} tokens</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{result.generationTime}ms</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(result.output)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Single Mode: Response History */}
          {!batched && responseHistory.length > 1 && results[0]?.id !== 'compare' && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-700 mb-2">Response History</h4>
              <div className="space-y-2">
                {responseHistory.map((result, idx) => (
                  <div key={result.id} className="p-2 border border-gray-200 rounded bg-gray-50">
                    <div className="text-xs text-gray-500 mb-1">{result.timestamp.toLocaleString()}</div>
                    <div className="text-gray-800 whitespace-pre-wrap">{result.output}</div>
                  </div>
                ))}
              </div>
              {/* Compare Button for Single Mode */}
              <Button className="mt-4" onClick={handleCompare} variant="outline">
                Compare
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Section */}
      {/* Removed analysis cards, notes, and auto-generated insights as per user request */}
    </div>
  );
};
