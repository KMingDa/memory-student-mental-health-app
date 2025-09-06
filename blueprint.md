# App Name

App Name is designed specifically for students as a complement to existing support systems.  
It provides students with an **interactive mental health companion** and a **safe space** for self-expression and emotional reflection.  

It combines **journaling**, **AI-powered mood prediction**, **gamification**, and **self-care tools** to create a supportive daily experience.

---

## ✨ Key Features

### 🎭 Avatar Creation
- Students create their own avatar as a digital projection of themselves.  
- The avatar reacts to the user’s mood and activities, acting as a personal emotional projection.

### 📓 Mood Journaling & Prediction
- Students write daily diary entries and select their mood.  
- AI combines today’s mood, diary content, and yesterday’s prediction to forecast tomorrow’s mood.

### 🤖 LLM-based Companion
- An AI chatbot acts as a friendly companion (disguised as a doll or plush character).  
- Behaviors:
  - If mood is positive → avatar encourages sharing joy.  
  - If mood is sad → avatar offers comfort.  
- The **room environment also adapts** (lights dim, rain outside, etc.).

### 🏠 Interactive Room Environment
- The avatar’s room changes according to emotional state.  
- Example: clicking bed when tired → avatar says *“It’s okay to rest.”*

### 🌱 Self-Care Journey & Rewards
- Activities: meditation, breathing exercises, white noise listening.  
- Completing tasks → unlocks rewards to decorate the room.

### 🎮 Mini Games
- **Bookshelf Sorting Game** → focus and relaxation.  
- **Whack-a-Mole Game** → stress relief and fun.  
- Rewards can unlock **badges or cards**.

### 🏆 Positivity Leaderboard
- Encourages consistent engagement via healthy competition.  
- Example: leaderboard for self-care activities completed.

### 📰 Daily Mental Health News
- Bite-sized updates about **mental health awareness** and **coping strategies**.

---

## 🛠 Tech Stack

**Frontend**  
- React Native (cross-platform mobile app)  
- Unity / Phaser.js / Godot / React Native Canvas (for avatar, interactive room, mini-games)

**Backend**  
- FastAPI (API server, user management, activity tracking)  
- PostgreSQL / MongoDB (for storing user data, moods, rewards, news)

**AI & ML**  
- Python (ML core)  
- NLP: NLTK (English), Jieba (Chinese)  
- Models: Logistic Regression / Random Forest (via scikit-learn)  
- Optional: PyTorch / TensorFlow  
- LLM integration: OpenAI API or open-source LLM  

---

## 📌 System Blueprints

### Avatar Creation & Interactive Room
- Built with Unity/Phaser.js/Godot/React Native Canvas.  
- Room changes dynamically with mood prediction.  
- Object interactions trigger avatar dialogues.

### Mood Prediction & Journaling
- Daily diaries + mood tags processed with NLP.  
- Features used in ML model to predict tomorrow’s mood.  
- Continuous feedback loop improves accuracy.

### LLM-based Companion
- Conversational AI reacts to predicted mood + diary input.  
- Context-aware responses for empathy and engagement.

### Self-Care & Rewards
- Guided activities → reward system.  
- Rewards spent on avatar customization.

### Mini Games
- Relaxation-focused casual games.  
- Rewards tied to self-care system.

### Leaderboard
- Tracks positive habits and consistency.  
- Encourages healthy competition.

### Daily News
- Short updates on mental health topics.  
- Integrated into daily flow after journaling or activities.

---
