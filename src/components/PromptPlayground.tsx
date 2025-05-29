
import React, { useState } from 'react';
import { Header } from './playground/Header';
import { ConfigurationPanel } from './playground/ConfigurationPanel';
import { ResultsPanel } from './playground/ResultsPanel';
import { PlaygroundProvider } from './playground/PlaygroundContext';

export const PromptPlayground = () => {
  return (
    <PlaygroundProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Animated background particles */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-4000"></div>
        </div>

        <div className="relative z-10">
          <Header />
          
          <main className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-7xl mx-auto">
              <ConfigurationPanel />
              <ResultsPanel />
            </div>
          </main>
        </div>
      </div>
    </PlaygroundProvider>
  );
};
