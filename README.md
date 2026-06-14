# NewLife

NewLife is a modular starter project demonstrating a clean, maintainable architecture for building modern applications. This README documents the architecture, responsibilities of each component, local setup, and contribution guidelines.

## Purpose
Provide a clear foundation for development: modular boundaries, simple deployment paths, and an easy onboarding experience for contributors.

## High-level architecture

  +-------------+     +----------------+     +------------------+
  |  Frontend   | <-- |  API / Backend | <-- |  Persistence     |
  | (UI clients) |     | (HTTP, auth)   |     | (DB, cache)      |
  +-------------+     +----------------+     +------------------+

- Frontend: Static or single-page application (web/mobile) that calls the API.
- API / Backend: Exposes HTTP endpoints, enforces business rules, and handles auth.
- Persistence: Database (Postgres/Mongo) and optional cache (Redis).

## Repository layout
- `docs/` - design and architecture docs.
- `src/` or `app/` - application source code (controllers, services, models).
- `scripts/` - helper scripts for development and deployment.
- `tests/` - unit and integration tests.

## Key design principles
- Separation of concerns: UI, API, and data layers are independent and communicate via well-defined interfaces.
- Configuration by environment: Use a `.env` or environment variables for secrets and environment-specific settings.
- Observability: Add logging and basic telemetry early.

## Recommended tech stack (choose per implementation)
- Backend: Node.js + Express / Python + FastAPI / Java + Spring Boot
- Frontend: React / Vue / Angular (or static site)
- Database: PostgreSQL / MongoDB
- Caching: Redis (if needed)

## Local setup (generic)
1. Copy environment sample: `cp .env.example .env` and fill values.
2. Install dependencies: `npm install` / `pip install -r requirements.txt`.
3. Run migrations (if any): `npm run migrate`.
4. Start services: `npm start` or `python -m app`.
5. Run tests: `npm test` or `pytest`.

## Development workflow
- Create a feature branch from `main`.
- Open a pull request with a clear description and linked issue.
- Include tests for new behavior.

## Deployment
- Build artifacts (or Docker images) in CI.
- Run database migrations during deployment.
- Prefer rolling updates behind a load balancer for zero-downtime deploys.

## Contributing
Contributions welcome. Open issues for bugs or features, then submit PRs. Keep changes small and document design decisions.

## License
Add a LICENSE file with your preferred license (MIT, Apache-2.0, etc.).

---

*This README was added to provide a clear, maintainable starting point for the NewLife project.*

## 1. High-Level Architecture Overview

Your application ("NewLife" / "SkinScan AI") is a hybrid mobile application with on-device machine learning. Instead of sending images to a cloud server to be processed, the app runs a custom-trained Artificial Intelligence model directly on the user's phone. This ensures privacy, offline capability, and faster results.

The architecture is split into three main pillars:

- **The Web Frontend:** The user interface built with modern web technologies.
- **The Native Bridge (Capacitor):** The layer that wraps the web app into a native Android app and connects web code to phone hardware.
- **The ML Training Pipeline (Backend):** The standalone Python system used to create and train the AI model before it is loaded onto the phone.

## 2. Frontend Architecture (The User Interface)

The UI is completely built using web technologies but designed to feel like a native app.

- **Framework:** React 18 running on Vite (a lightning-fast build tool). Vite compiles your code much faster than older tools like Webpack.
- **Styling:** Tailwind CSS v4 is used for utility-first styling, alongside a custom CSS theme (`default_shadcn_theme.css`).
- **UI Components:** Heavily utilizing Radix UI primitives. Radix provides unstyled, accessible components (dialogs, dropdowns, sliders, tabs) that you then style with Tailwind. This is the foundation of the popular shadcn/ui design system.
- **Animations:** Framer Motion (`motion` package) is used for smooth, dynamic micro-animations to give it a premium feel.
- **Routing:** React Router handles navigation between different screens within the Single Page Application (SPA).

How it works: The frontend is responsible for accessing the device camera, capturing the photo of the skin lesion, and sending it as a Base64 encoded string to the native layer for analysis.

## 3. The Web-to-Native Bridge (Capacitor)

You are using Capacitor (by Ionic) to turn your web application into a real Android app.

- **How it works:** Capacitor creates a native Android WebView (a borderless browser window) that loads your React compiled `index.html`.
- **The Magic:** Capacitor injects a JavaScript bridge. When your React code says "I want to run the ML model," it calls a Capacitor JavaScript function. Capacitor intercepts this, crosses the bridge, and executes the corresponding Java code on the Android system.

## 4. Native Android Layer & On-Device ML (The Brain)

This is where the heavy lifting happens on the phone. Inside the `android/app/src/main/java/com/skinscan/ai/` directory, you have custom native code.

- **Technologies:** Java, Android SDK, and the TensorFlow Lite (TFLite) Android Library.
- **MainActivity.java:** The entry point of the Android app. It initializes Capacitor and registers your custom `TFLitePlugin`.
- **TFLitePlugin.java (The Custom Plugin):**
  - **Loading:** When the app starts, this plugin loads the pre-trained `model.tflite` file from the Android assets folder directly into device memory.
  - **Processing:** When React sends a Base64 image, this Java code intercepts it.
  - **Decoding & Resizing:** It decodes the Base64 string back into an Android `Bitmap` and scales it exactly to `224x224` pixels (which is what the AI model expects).
  - **Pixel Conversion:** It converts the image pixels into a raw `Float32` array buffer (normalizing RGB values), matching the exact mathematical format the AI requires.
  - **Inference:** It feeds this buffer into the TFLite interpreter. The AI runs locally on the phone's CPU/GPU and outputs an array of probabilities for 23 different skin conditions.
  - **Return:** The Java plugin packages these probabilities into a JSON array and sends them back across the bridge to React to be displayed to the user.

## 5. Machine Learning Training Pipeline (The Python Backend)

This code (`ml_server/train_cnn.py`) does not run on the phone. It is run on your computer (utilizing your RTX 3050 GPU) to teach the AI.

- **Technologies:** Python, TensorFlow/Keras, Scikit-learn.
- **The Model Architecture:** You are using EfficientNet-B0, a highly optimized convolutional neural network (CNN) developed by Google. It's powerful but lightweight enough for mobile phones.
- **Training Strategy (Transfer Learning):** The model starts with knowledge of millions of general images ("imagenet" weights). In Phase 1, you freeze the core brain and only train the final classification layers on your skin lesion data. In Phase 2, you unfreeze the top 50 layers and "fine-tune" the network specifically for dermatology.
- **Advanced Techniques:**
  - **Focal Loss:** A mathematical function you implemented to handle "class imbalance" (when you have 1000 pictures of acne but only 50 of melanoma). It forces the AI to focus harder on rare diseases.
  - **Data Augmentation:** The code randomly flips, rotates, and zooms training images so the AI learns to recognize lesions from any angle.
- **Exporting:** Once trained, the model is exported as `model.tflite`. During export, it undergoes INT8 Quantization. This shrinks the model's file size dramatically (e.g., from 20MB to 5MB) and makes it run significantly faster on mobile processors with minimal loss in accuracy.

## 6. The Build and Export Process (Step-by-Step to APK)

To package all of this technology into a single `.apk` file that can be installed on an Android phone, a multi-step build pipeline is executed:

### Step 1: Build the Web App (Vite)
- **Command:** `pnpm run build` (or `npm run build`)
- **What happens:** Vite takes all your React components, Tailwind CSS, and TypeScript, strips out developer tools, minifies the code, and bundles it into highly optimized, tiny static files (`index.html`, `.js`, `.css`) placed in the `dist/` directory.

### Step 2: Sync Web Code to Native App (Capacitor)
- **Command:** `npx cap sync android`
- **What happens:** Capacitor takes everything inside your `dist/` folder and physically copies it into the Android project's native web assets directory (`android/app/src/main/assets/public/`). It also updates native Android configuration files based on your `capacitor.config.json` and `package.json`.

### Step 3: Copy ML Model
- **Manual/Scripted Step:** The newly trained `model.tflite` from the Python backend must be copied into `android/app/src/main/assets/ml/model.tflite` so the Java plugin can find it.

### Step 4: Compile the Native Android App (Gradle)
- **Command:** `cd android && ./gradlew assembleDebug` (for testing) or `./gradlew assembleRelease` (for production). Note: This is often done by just opening the `android` folder in Android Studio and clicking "Build > Build Bundle(s) / APK(s)".
- **What happens:**
  - The Gradle build system kicks in. It downloads necessary Android libraries (like the TensorFlow Lite Android dependency).
  - It compiles your custom Java code (`MainActivity.java`, `TFLitePlugin.java`) into Android bytecode (.dex files).
  - It packages the compiled Java, the web assets (your React app), the `model.tflite` file, and Android manifests into a single compressed zip file.
  - It signs this file with a digital certificate.
- **Result:** A fully functional `app-debug.apk` is generated in `android/app/build/outputs/apk/debug/`.

When a user taps this APK, it installs the Android shell, which loads the embedded Vite/React website, and gives that website special superpowers to talk to the embedded TFLite AI model via Java.

