import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { usePlayground } from './PlaygroundContext';
import { Play, Settings, Sparkles } from 'lucide-react';

export const ConfigurationPanel = () => {
  const { config, updateConfig, runPlayground, isLoading, batched, setBatched, sampleCount, setSampleCount } = usePlayground();

  const productPresets = [
    'iPhone 15 Pro',
    'Tesla Model S',
    'Nike Air Jordan',
    'MacBook Pro M3',
    'Sony WH-1000XM5',
    'Dyson V15 Detect'
  ];

  const handleStopSequenceChange = (value: string) => {
    const sequences = value.split(',').map(s => s.trim()).filter(s => s);
    updateConfig({ stopSequences: sequences });
  };

  return (
    <div className="space-y-6">
      {/* Model Selection */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl shadow-blue-100/25 hover:shadow-2xl hover:shadow-blue-100/40 transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-gray-800">
            <Settings className="w-5 h-5 text-blue-500" />
            <span>Model Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="model" className="text-sm font-medium text-gray-700 mb-2 block">
              AI Model
            </Label>
            <Select value={config.model} onValueChange={(value) => updateConfig({ model: value })}>
              <SelectTrigger className="w-full border-gray-200 focus:border-blue-400 focus:ring-blue-400/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Prompts Configuration */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl shadow-blue-100/25 hover:shadow-2xl hover:shadow-blue-100/40 transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-gray-800">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span>Prompt Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="systemPrompt" className="text-sm font-medium text-gray-700 mb-2 block">
              System Prompt
              <span className="text-xs text-gray-500 ml-2">({config.systemPrompt.length} characters)</span>
            </Label>
            <Textarea
              id="systemPrompt"
              value={config.systemPrompt}
              onChange={(e) => updateConfig({ systemPrompt: e.target.value })}
              className="min-h-[100px] border-gray-200 focus:border-purple-400 focus:ring-purple-400/20 resize-none"
              placeholder="Define the AI's role and behavior..."
            />
          </div>

          <div>
            <Label htmlFor="userPrompt" className="text-sm font-medium text-gray-700 mb-2 block">
              User Prompt Template
              <span className="text-xs text-gray-500 ml-2">({config.userPrompt.length} characters)</span>
            </Label>
            <Textarea
              id="userPrompt"
              value={config.userPrompt}
              onChange={(e) => updateConfig({ userPrompt: e.target.value })}
              className="min-h-[80px] border-gray-200 focus:border-purple-400 focus:ring-purple-400/20 resize-none"
              placeholder="Write your prompt template..."
            />
            <p className="text-xs text-gray-500 mt-1">Use {"{product_name}"} as a placeholder</p>
          </div>

          <div>
            <Label htmlFor="productName" className="text-sm font-medium text-gray-700 mb-2 block">
              Product Name
            </Label>
            <Input
              id="productName"
              value={config.productName}
              onChange={(e) => updateConfig({ productName: e.target.value })}
              className="border-gray-200 focus:border-purple-400 focus:ring-purple-400/20"
              placeholder="Enter product name..."
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {productPresets.map((preset) => (
                <Badge
                  key={preset}
                  variant="secondary"
                  className="cursor-pointer hover:bg-purple-100 hover:text-purple-700 transition-colors duration-200"
                  onClick={() => updateConfig({ productName: preset })}
                >
                  {preset}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parameters Configuration */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl shadow-blue-100/25 hover:shadow-2xl hover:shadow-blue-100/40 transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-gray-800">Generation Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-3">
              <Label className="text-sm font-medium text-gray-700">
                Temperature
              </Label>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
                {config.temperature.toFixed(1)}
              </span>
            </div>
            <Slider
              value={[config.temperature]}
              onValueChange={([value]) => updateConfig({ temperature: value })}
              min={0}
              max={2}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Focused</span>
              <span>Creative</span>
            </div>
          </div>

          <div>
            <Label htmlFor="maxTokens" className="text-sm font-medium text-gray-700 mb-2 block">
              Max Tokens
            </Label>
            <Input
              id="maxTokens"
              type="number"
              value={config.maxTokens}
              onChange={(e) => updateConfig({ maxTokens: parseInt(e.target.value) || 150 })}
              min={10}
              max={500}
              className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <Label className="text-sm font-medium text-gray-700">
                Presence Penalty
              </Label>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
                {config.presencePenalty.toFixed(1)}
              </span>
            </div>
            <Slider
              value={[config.presencePenalty]}
              onValueChange={([value]) => updateConfig({ presencePenalty: value })}
              min={0}
              max={1.5}
              step={0.1}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <Label className="text-sm font-medium text-gray-700">
                Frequency Penalty
              </Label>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
                {config.frequencyPenalty.toFixed(1)}
              </span>
            </div>
            <Slider
              value={[config.frequencyPenalty]}
              onValueChange={([value]) => updateConfig({ frequencyPenalty: value })}
              min={0}
              max={1.5}
              step={0.1}
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="stopSequences" className="text-sm font-medium text-gray-700 mb-2 block">
              Stop Sequences
            </Label>
            <Input
              id="stopSequences"
              value={config.stopSequences.join(', ')}
              onChange={(e) => handleStopSequenceChange(e.target.value)}
              className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
              placeholder="Enter comma-separated sequences..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Batched Mode Controls */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl shadow-blue-100/25 hover:shadow-2xl hover:shadow-blue-100/40 transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-gray-800">
            <span>Batched Mode</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="batched"
              checked={batched}
              onChange={e => setBatched(e.target.checked)}
              className="w-4 h-4 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="batched" className="text-sm text-gray-700">Enable Batched Mode</label>
          </div>
          {batched && (
            <div className="flex items-center gap-2">
              <label htmlFor="sampleCount" className="text-sm text-gray-700">Number of Samples:</label>
              <input
                id="sampleCount"
                type="number"
                min={2}
                max={12}
                value={sampleCount}
                onChange={e => setSampleCount(Number(e.target.value))}
                className="w-16 border-gray-200 rounded px-2 py-1 text-sm"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Run Button */}
      <Button
        onClick={runPlayground}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-6 text-lg shadow-xl shadow-blue-100/25 hover:shadow-2xl hover:shadow-blue-100/40 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Generating Variations...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Play className="w-5 h-5" />
            <span>Run Playground</span>
          </div>
        )}
      </Button>
    </div>
  );
};
