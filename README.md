file:///Users/vivek/Downloads/bluebells_image_quality_report_embedded.html

# Gemini Image Analyst (Enterprise Edition)

**A professional-grade Image Quality Assurance (QA) tool powered by Google's Gemini 2.5 Multimodal Vision API.**

![Version](https://img.shields.io/badge/version-1.0.0_Stable-emerald)
![Tech](https://img.shields.io/badge/tech-React_|_TypeScript_|_Tailwind-blue)
![AI](https://img.shields.io/badge/AI-Gemini_2.5_Flash-orange)

## 🎯 Project Goal

The goal of this project is to automate the subjective and objective analysis of photography assets. In traditional workflows, comparing the quality of two images (e.g., a RAW file vs. a JPEG, or two different edit styles) requires a manual expert review. 

This tool bridges the gap between **Computer Vision (CV)** and **Large Language Model (LLM)** reasoning. It acts as an automated "Senior Image Analyst," providing detailed breakdown reports on sharpness, noise, composition, and emotional impact without human intervention.

## 🚀 Key Features

*   **Hybrid Scoring Engine**: Combines technical metrics (Sharpness, Dynamic Range, Noise) with aesthetic evaluation (Composition, Mood, Color Harmony).
*   **Strict Visualization**: Generates complex SVG Radar Charts directly from the LLM by enforcing strict vector geometry in the system prompt.
*   **Enterprise Design System**: Outputs a fully self-contained, offline-capable HTML report with a standardized "Dark Mode Dashboard" aesthetic.
*   **Zero-Dependency Reports**: The final output is a single HTML file with base64-embedded images, perfect for emailing to stakeholders or archiving.

## 🛠️ How It Works

1.  **Ingestion**: The app accepts two image files (Reference vs. Comparison) and converts them to optimized Base64 strings.
2.  **Context Injection**: We inject a strict **System Instruction** that acts as a "Design System." It contains hardcoded CSS variables, SVG vector coordinates, and layout rules.
3.  **Multimodal Analysis**: The `gemini-2.5-flash-image` model analyzes the visual pixel data against photography principles.
4.  **Structured Generation**: Instead of returning plain text, the model generates a complete DOM structure, rendering tables, lists, and SVG charts in real-time.
5.  **Sanitization & Export**: The system sanitizes the output, injects the high-res images back into the placeholders, and bundles it into a downloadable HTML file.

## 📸 Sample Report Output

The generated report includes:
*   **Side-by-Side View**: Comparison of source assets.
*   **Technical Radar Chart**: A 6-axis visualization of objective quality.
*   **Aesthetic Radar Chart**: A 5-axis visualization of artistic merit.
*   **Metric Tables**: 1-10 scoring with winner highlighting.
*   **Executive Summary**: Bulleted insights for quick decision-making.

*(Add a screenshot of your generated HTML report here)*

## 💻 Tech Stack

*   **Frontend**: React 19, TypeScript
*   **Styling**: Tailwind CSS, Lucide React (Icons)
*   **AI Integration**: Google Gen AI SDK (`@google/genai`)
*   **Model**: Gemini 2.5 Flash Image (`gemini-2.5-flash-image`)

## ⚡ Getting Started

1.  **Clone the repo**
    ```bash
    git clone https://github.com/yourusername/gemini-image-analyst.git
    ```
2.  **Install dependencies**
    ```bash
    npm install
    ```
3.  **Set API Key**
    Ensure you have a valid Google Gemini API Key.
    ```bash
    export API_KEY="your_google_api_key"
    ```
4.  **Run the app**
    ```bash
    npm run dev
    ```

## 📄 License

MIT License.
