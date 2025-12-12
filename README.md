# PortionVision 🍎🔍

**A Competition-Winning Portion Size Visualizer with AR Technology**

PortionVision is a modern React application designed to help users accurately estimate food portion sizes using familiar reference objects (like a deck of cards or a tennis ball) and Augmented Reality (AR) overlays.

## 🚀 Key Features

*   **Food Library**: Browse 20+ common food items with standard serving sizes.
*   **Visual Comparisons**: Intuitive "mental model" comparisons (e.g., 3oz steak = Deck of Cards).
*   **AR Camera Overlay**:
    *   Uses the device camera to project a wireframe reference object onto the real world.
    *   Adjustable scale slider to match the reference object's distance.
    *   Capture functionality to log what you eat.
*   **Portion Log**: Track your daily estimated portions with timestamps.
*   **Accessibility First**: High Contrast Mode, large touch targets, and ARIA labels.
*   **Mobile-First Design**: Optimized for touch interaction, glassmorphism UI, and smooth animations.

## 🛠 Tech Stack

*   **Frontend**: React 18
*   **Build Tool**: Vite
*   **Styling**: Bootstrap 5 + Custom CSS (Glassmorphism, Gradients)
*   **Icons**: Bootstrap Icons
*   **State Management**: React Hooks + LocalStorage
*   **Camera/AR**: Native `navigator.mediaDevices.getUserMedia` + HTML5 Canvas

## 🏁 Competition Highlights

1.  **Zero-Backend Architecture**: The app runs entirely client-side using LocalStorage for persistence, ensuring privacy and offline capability.
2.  **Performance Optimized**:
    *   The Camera component is **lazy-loaded** to ensure the initial dashboard loads instantly.
    *   SVG paths are pre-defined in code to avoid network requests for assets.
3.  **Cross-Platform AR**: No heavy AR libraries (like AR.js) were used. The solution uses a lightweight, custom-built SVG overlay system that works on any modern browser with camera access.

## 📦 Local Setup Instructions

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run Development Server**
    ```bash
    npm run dev
    ```

3.  **Build for Production**
    ```bash
    npm run build
    ```
    To test the production build locally:
    ```bash
    npm run preview
    ```

## 📱 Usage Tips

*   **For Best AR Results**: Hold your phone approximately 12 inches away from your plate.
*   **Privacy**: Camera access is requested only when the AR feature is activated. No images are uploaded to any server.

---
*Built for the React App Competition 2023*
