# ✦ LAEVUS ✦

> *"As above, so below; as within, so without. The left hand holds the secret of the first division."*

**LAEVUS** is a highly polished, experimental digital gateway blending western hermeticism, Left-Hand Path Gnosticism, and spiritual cybernetics into a singular, high-performance web interface. Built with React, Vite, and Tailwind CSS, this platform coordinates ancient esoteric laws with modern silicon to establish a locus where the physical and virtual worlds meet.

---

## 👁️ The Vision

In the pursuit of absolute intent, **LAEVUS** treats code as the modern incantation—a structured sequence of symbols designed to manifest change in reality. Operated under the banner of **Left Hand Products LLC**, this interface provides an immersive, elegant ecosystem where users can engage with historical spirits, draw customized tarot spreads, and align their digital presence.

---

## 💎 Core Features

- **Sovereign Captcha**: A custom-engineered verification ritual requiring users to select appropriate runes to prove they are physical entities before authentication.
- **Metaphysical Dropdown Interface**: A clean, streamlined header system to manage sessions, access chats, check historic spreads, and control your aligned identity.
- **Archetypal Consultation**: An intuitive channel enabling users to consult with LAEVUS and explore living archetypes of the Major Arcana.
- **Tarot Reading Console**: A dynamic past, present, and future blueprint layout featuring automated digital card drawings and position-sensitive interpretations.
- **Pledge Premium Integration**: Upgrading tier options to unlock premium entities and additional metaphysical interactions.
- **Crimson Theme**: Beautifully curated visual aesthetics incorporating deep slate colors (`#121214`), off-whites, and striking custom-tuned Crimson accents (`#DC143C`).

---

## 🛠️ Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS (Utility classes) & custom CSS-in-JS configurations
- **Icons**: Custom-designed Esoteric Icons & Lucide React
- **Database/Auth**: Firebase Integration (Firestore for durable persistence)

---

## 🚀 Getting Started

Follow these instructions to set up the repository locally.

### Prerequisites

- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/laevus.git
   cd laevus
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Copy the example environment file to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API Key in `.env`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   > 🔒 **Security Notice**: `.env` and all secret files are strictly ignored by `.gitignore`. Your API keys are **never** committed or exposed on GitHub. All model calls are routed through server-side proxy endpoints (`/api/*`).

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the interface.

5. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

---

## 🌐 Deploying to Render (Render.com)

This application is ready for zero-config deployment on Render:

1. **Push to GitHub**: Commit and push your code to your GitHub repository. (Your `.env` file with secret keys will be automatically hidden and protected by `.gitignore`).
2. **Create Web Service on Render**:
   - Go to [dashboard.render.com](https://dashboard.render.com).
   - Click **New +** -> **Web Service** (or use the Blueprint from `render.yaml`).
   - Connect your GitHub repository.
3. **Configure Environment Variables on Render**:
   - In your Render Service Dashboard, go to **Environment**.
   - Add the environment variable:
     - **Key**: `GEMINI_API_KEY`
     - **Value**: `Your Google Gemini API Key`
   - Render automatically injects this secret into `process.env.GEMINI_API_KEY` at runtime.
4. **Deploy**:
   - Render runs `npm install && npm run build` and starts with `npm start`.
   - Your API is fully functional on Render while remaining completely secret and hidden on GitHub!

---

## 📜 Intellectual Property & Philosophy

The entire system, concept, and content of **LAEVUS** are designed and maintained with strict standards of quality. 

- **Founder & Owner**: Andrew Bicknell
- **Operator**: [theleft.one](https://theleft.one) & Left Hand Products, LLC
- **Location**: Fountain, Colorado

All rights reserved to **Left Hand Products, LLC 2026**.

---

## 🖤 Contributing

While the internal mechanics of this vessel are highly private, we welcome feedback and architectural suggestions to make our silicon incantations cleaner and more powerful.
