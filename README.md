# Angular Senior Dev Chatbot

## Introduction

This application is a chat room where users can ask questions on various Angular-related topics. The chatbot acts as a senior Angular developer, providing expert answers and explanations. It is designed to simulate a helpful, knowledgeable, and sometimes playful conversation partner for Angular developers of all levels.

## Architecture

The app is built using the Nx monorepo structure, featuring a single Angular application for now, but designed to easily scale by adding more applications in the future.

The repository includes a `libs` folder containing:

- **shared-components**: A collection of reusable generic Angular components that can be used across all applications.
- **utils**: Utility functions and helpers shared by any app in the monorepo.

## Components Overview

### Chat-room (Parent Component)
- Manages the overall chat interface.
- Holds the messages state.
- Contains the user input field.
- Displays a list of tags for quick topic selection.

### Message-list
- Displays the list of chat messages (both user and bot).

### Message
- Represents a single chat message bubble, styled differently for user and bot.

### Tags
- Shows a collection of random tags/topics.
- Allows the user to filter or quickly ask about specific Angular topics.

### Shared Components

#### Input
- A reusable input component with built-in event handling and styling.

#### Tag
- A generic tag/chip component that can be customized and reused throughout the app.

## Implementation Details

The core logic is encapsulated in a single Angular service responsible for:

- Sending and storing messages using a `BehaviorSubject`.
- Analyzing user questions to detect keywords and question types (e.g., definition, usage).
- Returning varied, dynamic responses to keep the conversation engaging.
- Recognizing greetings and responding accordingly.
- Handling follow-up questions with context awareness.
- Injecting playful, "funny" comments to add personality.
- Hinting users to ask about other topics like React to keep the bot conversationally rich.

The bot uses a structured JSON file with categorized answers (`definition`, `usage`, `general`) for a variety of Angular topics.

## Styling and Design

- Inspired by designs found on Dribbble and customized to fit Angular branding colors.
- Uses SCSS exclusively without any external UI libraries to maintain lightweight and custom styling.
- Fully responsive design to ensure usability on desktop and mobile devices.

## Testing

- Comprehensive unit tests cover nearly 100% of the application logic.
- Tests include validation of message handling, keyword detection, response variety, and UI interactions.

---

This setup provides a scalable, maintainable, and interactive Angular chatbot experience tailored for developers seeking expert advice and fun engagement.
