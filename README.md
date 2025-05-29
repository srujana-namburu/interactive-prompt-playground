### Interactive Prompt Playground

## 🚀 How to Run the Playground

### 1. Clone the Repository
   
`git clone https://github.com/srujana-namburu/interactive-prompt-playground.git
   cd interactive-prompt-playground
`
### 2. Install Dependencies
Make sure you have Node.js and npm installed. Then run:

`npm install`

### 3. Set Up Environment Variables
Create a .env file in the root directory and add your OpenAI API key:

`OPENAI_API_KEY=your-api-key-here`

### 4. Start the App

`npm run dev`

## ✨ Description of Features

### 1. Prompt Input

Users enter a system prompt (e.g., "You are a helpful assistant.") and a user prompt (e.g., "Describe the iPhone 15 Pro Max").

This allows for precise customization and persona tuning.

### 2. Parameter Control

Temperature: Adjusts randomness (0.0 = predictable, 1.2 = highly creative).

Max Tokens: Limits response length (50, 150, 300 options).

Presence Penalty: Discourages new topics (0.0 = off, 1.5 = strong).

Frequency Penalty: Reduces repetition (0.0 = off, 1.5 = strong).

Stop Sequence: Stops output when a specified token or phrase is encountered.

### 3. Model Selection

Supports both gpt-3.5-turbo and gpt-4.

Allows flexible testing across different model capabilities.

### 4. Response Modes

Single Response Mode (Default):

Generates a single response.

Clicking Generate Again creates a new variation (shown below the previous one).

Batched Mode:

When checked, generates multiple variations based on diverse parameter combinations.

A Compare button lets users summarize or select the best version among all.

## Output Grid Example (for prompt: “Write a product description for the iPhone 15 Pro”)

| Temperature | Max Tokens | Presence Penalty | Frequency Penalty | Model         | Output Summary                              |
| ----------- | ---------- | ---------------- | ----------------- | ------------- | ------------------------------------------- |
| 0.0         | 50         | 0.0              | 0.0               | gpt-3.5-turbo | Short, direct specs-based description       |
| 0.7         | 150        | 0.0              | 1.5               | gpt-3.5-turbo | Balanced tone with some creativity          |
| 1.2         | 300        | 1.5              | 0.0               | gpt-4         | Long, rich, very imaginative description    |
| 0.7         | 150        | 1.5              | 1.5               | gpt-4         | Highly tuned, focused on key selling points |
| 1.2         | 300        | 0.0              | 0.0               | gpt-3.5-turbo | Creative but sometimes repetitive           |


## 🧠 Reflection on Parameter Impact
When comparing outputs, it was clear that temperature had the most noticeable effect on the tone and creativity. A low temperature (e.g., 0.0) yielded concise, fact-driven product descriptions — ideal for technical documentation. In contrast, higher temperatures (1.2) produced expressive, dynamic text that could be used for marketing or storytelling. This made it easier to experiment with voice and tone.

The penalty settings fine-tuned the output style. A high presence penalty encouraged sticking closely to the product theme, while a high frequency penalty reduced repetitive content, especially in longer outputs. Together, these controls gave users the flexibility to shape responses to be more structured or free-flowing, depending on the use case. The batched mode further helped in comparing how small changes could dramatically alter output quality.


