# SmartReply Chat



**SmartReply Chat** is an innovative conversational AI web application that elevates your chat experience by generating smart, empathetic conversation suggestions tailored to specific relationships and emotional contexts. Whether you're chatting with a friend, family member, or colleague, SmartReply adapts its tone and advice to suit the moment.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

SmartReply Chat leverages the power of [Google Generative AI](https://ai.google/) (using the **gemini-1.5-flash** model) to create dynamic, context-aware conversation replies. With a finely tuned system prompt, SmartReply ensures every response is uniquely adapted to the specified relationship (like "friend," "partner," or "colleague") and emotional state (like "happy," "stressed," or "excited").

---

## Features

- **Contextual Adaptation:**  
  Tailor your conversation replies based on the relationship and mood provided, ensuring empathy and relevance in every message.

- **Dynamic AI Responses:**  
  Harness cutting-edge AI technology to generate smart conversation suggestions, advice, and follow-up questions.

- **Strict Scope Enforcement:**  
  Designed to only handle conversation suggestions. If queries stray beyond this scope, SmartReply gracefully declines to provide unrelated information.

- **Easy Integration:**  
  Built with Next.js and a robust API, integrating seamlessly into modern web projects.

- **User Authentication:**  
  Secure your chat interactions with token-based authentication.

---

## How It Works

1. **Chat Creation:**  
   A new chat session is created by specifying the target relationship and the current mood. The system then uses a customized initial prompt to generate a warm, context-aware introduction.

2. **Message Handling:**  
   Each message you send is appended to the conversation history. The system uses the latest context to generate intelligent, tailored responses.

3. **Scope Management:**  
   SmartReply is focused solely on generating conversation suggestions. If any unrelated topic is raised, it will respond with a friendly reminder of its purpose.

---


## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Node.js, Express (Next.js API routes)
- **AI Integration:** Google Generative AI (gemini-1.5-flash)
- **Database:** MongoDb

---

