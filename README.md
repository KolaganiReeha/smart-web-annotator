# Smart Web Annotator  
### A Chrome Extension for Structured Visual Feedback on Live Webpages

## Overview

Smart Web Annotator is a Chrome Extension built using **React, Canvas API, and Chrome Manifest V3** that allows users to capture, annotate, and export visual feedback directly from live webpages.

Instead of sending vague bug reports or scattered screenshots, this tool enables structured visual communication - making debugging and collaboration faster and clearer.

This project demonstrates practical frontend engineering skills including:
- React state-driven architecture
- Canvas rendering logic
- Chrome Extension API usage
- Undo/Redo stack implementation
- Annotation layering system
- Multi-format export (PNG + JSON)
- Manifest V3 service worker handling


# The Real-World Problem
In real development workflows:
- Designers send static screenshots in chat.
- QA teams describe UI issues without precise visual markers.
- Developers receive unclear feedback like: “The layout is broken.”
- Stakeholders struggle to communicate exact UI changes.

This causes:
- Miscommunication  
- Delayed debugging  
- Back-and-forth clarification  
- Reduced productivity  

There is often no structured connection between visual feedback and actual UI elements.

# How Smart Web Annotator Solves This
This extension enables users to:

### Capture the Current Webpage
Instantly take a screenshot of the active tab.

### Add Structured Visual Annotations
- Rectangle selection
- Arrow indicators
- Free drawing tool
- Highlight tool
- Blur tool (for sensitive data)
- Styled text (custom color, font, size, bold)

### Maintain an Annotation Layer System
Annotations are stored as structured objects which enables:
- Clean state-driven re-rendering
- Undo/Redo functionality


### Export & Save
Users can:
- Download as PNG


### Tech Stack
React (Create React App)
JavaScript (ES6+)
HTML5 Canvas API
Chrome Extension APIs
Manifest V3
CSS

### Installation & Setup
Clone the Repository
```bash
git clone https://github.com/KolaganiReeha/smart-web-annotator
cd smart-web-annotator
```

### Install Dependencies
```bash
npm install
```

### Build the Extension
```bash
npm run build
```
This generates the production-ready /build folder.

### Load Extension in Chrome

Open: chrome://extensions
Enable: Developer Mode
Click: Load Unpacked
Select: build/

### How to Use
Open any website.
Click the Smart Web Annotator extension icon.
Capture the current page.

### Use annotation tools:
Draw rectangles
Add arrows
Highlight UI sections
Blur sensitive information
Add styled text

### Export:
Download PNG
Save session

### What This Project Demonstrates
Real-world browser extension development
Advanced frontend state management
Canvas graphics handling
Structured problem-solving
UX-focused engineering
Clean architectural thinking
It is not just a drawing tool - it is a structured visual collaboration utility.

## Architecture
- The extension follows a state-driven rendering model:
- Screenshot is stored via chrome.storage.
- Annotations are stored as structured objects.
- Canvas is re-rendered from state on every update.
- Undo/Redo uses stack-based state history.
- Export generates image from canvas layer.

This ensures clean separation between state and rendering logic.

### Demo
<img width="1918" height="853" alt="image" src="https://github.com/user-attachments/assets/11da5883-3f14-4e8d-b203-fb7b41439d1b" />


### Future Improvements
AI-generated bug reports
Editable annotations (drag/resize)
Multi-page PDF export
Cloud session sync
Shareable review links
Team collaboration mode

### Author
Built as a practical frontend engineering project to demonstrate real-world browser extension development and structured UI feedback systems.

If You Found This Useful
Consider starring the repository and connecting with me on LinkedIn.
