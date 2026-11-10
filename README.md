# 🌸 AI Buddy — Real-Time Companion & Everyday Problem Solver

> **A friendly AI best friend who sees through your camera in real time, talks out loud, and helps you fix everyday home problems.**

AI Buddy transforms everyday moments: point your camera at a flower to admire its colors, get instant troubleshooting when your electric kettle stops boiling or a water pipe leaks under your sink, or just have a supportive friend to talk to after a long day.

Built as a sleek mobile-first experience inspired by the modern SmartClaim chassis, complete with iOS frame, 3D companion avatar, dynamic speech waves, and real-time color detection.

---

## 🌟 Key Features

### 1. 👀 Live Camera Vision & Accurate Color Perception
- **Real-Time Color Sight**:
  - Point your camera at a flower pot:
    - **Red Rose 🔴**: Buddy detects the rich scarlet red petals and gives tailored morning-sunlight & watering tips!
    - **Yellow Marigold 🟡**: Buddy perceives the sunny golden blossom and cheerful balcony bloom!
  - Point your camera at a **broken electric kettle 🫖**: Buddy spots the base and checks for limescale, dry contacts, and reset switches.
  - Point your camera at a **leaking pipe 🚿**: Buddy spots the leak and warns you to turn off the isolation valve clockwise immediately.
- **Dual Vision Architecture**:
  - **On-Device Canvas Pixel Analysis**: Zero latency, 100% private RGB color grid sampling directly from video frames without needing any cloud API.
  - **Google Gemini Multimodal Vision**: Optional cloud AI reasoning for detailed visual object analysis with an optional Gemini API key.
- **Interactive Preset Scenes**: Includes quick-test scenes (Red Flower, Yellow Flower, Kettle, Water Pipe) so anyone can test vision instantly even without a webcam.

### 2. 🔊 Spoken Voice Speech (Web Speech API)
- Buddy doesn't just display text — she **speaks out loud** in a warm, caring, friendly voice.
- Animated sound waves and glowing mood aura on the 3D companion avatar.
- Quick mute / unmute button for silent environments.

### 3. 🫖 Everyday Home DIY Troubleshooting & YouTube Video Guides
- Step-by-step interactive checklists for household issues:
  1. **Electric Kettle Not Heating**: Base contact drying, thermal switch reset, and 50% white vinegar descaling.
  2. **Leaking Sink / PVC Water Pipe**: Immediate isolation valve cutoff, PTFE Teflon tape clockwise application.
  3. **Flower & Houseplant Care**: 2-inch soil moisture test, morning light positioning, and pruning spent blossoms.
  4. **Tripped Circuit Breaker (MCB)**: High-load appliance disconnect and spring-mechanism reset.
- Embedded YouTube repair tutorials for visual step-by-step guidance.

### 4. 💬 Friendly Companion Chat
- Talk about anything: vent about your day, celebrate wins, or ask for advice.
- Photo attachment support with instant visual inspection.
- Suggested conversational follow-ups and action tips.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide Icons, Glassmorphism UI
- **Audio & Vision**: Web Speech API (`SpeechSynthesis`), HTML5 MediaDevices / Canvas Pixel Grid Analysis
- **Optional Cloud AI**: Google Gemini 1.5 Flash Multimodal API

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Run

```bash
# 1. Clone repository
git clone https://github.com/goyalmayank142-pixel/ai-buddy.git
cd ai-buddy

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Open in browser
# http://127.0.0.1:5173
```

### Running Tests

```bash
npm test
```
Verifies on-device color detection (red and yellow flowers) and home troubleshooting logic.

---

## 📄 License
MIT License. Built with ❤️ for everyday problem solving.
