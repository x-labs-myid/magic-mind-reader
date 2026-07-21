# Magic Mind Reader 🔮

> **I can read your mind! Think of a number, and witness the magic.**

A modern, interactive, and colorful math-magic guessing game rebuilt from the ground up using the latest mobile technology stack.

---

## 📖 Short Description

**Magic Mind Reader** (formerly _Your Number_) is a gamified mobile application utilizing a classic binary card trick. Think of any number between **1 and 31**, answer five quick questions, and watch the app correctly reveal the number you have in mind with immersive animations and sound effects!

---

## 🌟 Key Features

- 🎨 **Vibrant UI & Aesthetics**: Built with custom Tailwind CSS palettes including glassmorphism layouts and dynamic dark mode themes.
- 🔮 **Interactive Canvas Animations**: Powered by `@nativescript/canvas` featuring floating numbers on the home screen, laser scanning lines on the game screen, and high-impact cascading confetti upon game completion.
- 🌐 **Multi-Language Support**: Fully localized in **English** and **Indonesian** with dynamic language selectors using `@nativescript/localize`.
- 🎵 **Audio Feedback**: High-quality sound effects for button taps (`tap-effect.mp3`) and game resolution (`complete-effect.mp3`) using `@nativescript-community/audio`.
- ⚡ **Modern Build Tooling**: Upgraded to **NativeScript v9** with **Vite** bundler for HMR (Hot Module Replacement) and optimized production bundles.
- ⚙️ **High Performance**: Built with **TypeScript 7.0.2** using optimized compilation configurations.

---

## 🛠️ Technology Stack

- **Framework**: [NativeScript v9](https://docs.nativescript.org)
- **Language**: [TypeScript 7.0.2](https://typescriptlang.org)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) via `@nativescript/tailwind`
- **Audio Engine**: `@nativescript-community/audio`
- **Localization**: `@nativescript/localize`
- **Interactive Graphics**: `@nativescript/canvas`
- **Bundler**: `@nativescript/vite` (Vite)

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the [NativeScript CLI](https://docs.nativescript.org/setup/) installed globally:

```bash
npm install -g nativescript
```

### Installation

Clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd guest-number
npm install
```

### Running the Application

Start HMR development server and run on your preferred emulator or connected device:

#### For Android:

```bash
npm run dev:android
```

#### For iOS:

```bash
npm run dev:ios
```

#### Clean Build Cache:

If you experience caching or native linking issues after updating plugins, clean the build directories:

```bash
npm run clean
```

---

## 📁 Project Structure

```text
├── app/
│   ├── assets/
│   │   └── audio/           # Sound effects (tap & complete)
│   ├── i18n/                # Localization JSON files (en, id)
│   ├── pages/               # Game & Result page layouts & controllers
│   ├── shared/              # Shared helper classes (audio-helper)
│   ├── app-root.xml         # Entry navigation point
│   ├── app.css              # Global styles (Tailwind imports)
│   ├── app.ts               # App entrypoint
│   └── fonts.css            # FontAwesome integration
├── nativescript.config.ts   # NativeScript App configuration
├── tailwind.config.js       # Tailwind theme colors & configurations
├── tsconfig.json            # TypeScript 7 compiler rules
└── vite.config.ts           # Vite HMR settings
```

---

## 👨‍💻 Developed by

- Original Game by: **Kang Cahya**
- Rebranded Version: **Magic Mind Reader**
- Icons by: **FontAwesome Free** (Classic Solid & Brands)
- _Note: This project is a modernized rework of the original repository: [your-number](https://github.com/dyazincahya-archive/your-number)_
