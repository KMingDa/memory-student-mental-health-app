from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import json
import os
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
import numpy as np

nltk.download('punkt')
nltk.download('stopwords')

app = FastAPI()

ENTRIES_FILE = "entries.json"

vectorizer = CountVectorizer()
model = MultinomialNB()
CLASSES = np.array(["happy","unsure","sad","sick","glad","neutral","cool","relaxed"])

class Entry(BaseModel):
    date: str
    diary: str
    mood: str

def preprocess(text: str) -> str:
    tokens = word_tokenize(text.lower())
    tokens = [t for t in tokens if t.isalpha()]
    tokens = [t for t in tokens if t not in stopwords.words('english')]
    return " ".join(tokens)

def load_entries() -> List[dict]:
    if not os.path.exists(ENTRIES_FILE):
        with open(ENTRIES_FILE, "w") as f:
            f.write("[]")
        return []

    with open(ENTRIES_FILE, "r") as f:
        content = f.read().strip()
        if not content:
            return []
        return json.loads(content)


def save_entries(entries: List[dict]):
    with open(ENTRIES_FILE, "w") as f:
        json.dump(entries, f, indent=2)

def train_incremental(entries: List[dict], window_size=7):
    if len(entries) < 2:
        first = entries[0]
        X_text = [preprocess(first["diary"]) + " " + first["mood"]]
        y = [first["mood"]]
        X = vectorizer.fit_transform(X_text)
        model.fit(X, y)
        return

    X_text = []
    y = []

    for i in range(1, len(entries)):
        yesterday = entries[i-1]
        today = entries[i]

        yesterday_diary = preprocess(yesterday["diary"])
        yesterday_pred_mood = yesterday.get("predicted_next_mood") or yesterday["mood"]

        features = yesterday_diary + " " + yesterday_pred_mood
        X_text.append(features)
        y.append(today["mood"])

    X_text = X_text[-window_size:]
    y = y[-window_size:]

    X = vectorizer.fit_transform(X_text)
    model.fit(X, y)


def predict_next_mood(diary: str, yesterday_pred_mood: str = None) -> str:
    features = preprocess(diary)
    if yesterday_pred_mood:
        features += " " + yesterday_pred_mood
    X = vectorizer.transform([features])
    return model.predict(X)[0]

@app.post("/add_entry")
def add_entry(entry: Entry):
    entries = load_entries()

    new_entry = {
        "date": entry.date,
        "diary": entry.diary,
        "mood": entry.mood,
        "predicted_next_mood": None
    }
    entries.append(new_entry)

    train_incremental(entries)

    yesterday_pred_mood = entries[-2]["predicted_next_mood"] if len(entries) > 1 else None
    predicted_next = predict_next_mood(entry.diary, yesterday_pred_mood)
    entries[-1]["predicted_next_mood"] = predicted_next

    save_entries(entries)
    return {"message": "Entry saved", "predicted_next_mood": predicted_next}

@app.get("/predict_next_mood")
def get_prediction(diary: str, yesterday_pred_mood: str = None):
    if not os.path.exists(ENTRIES_FILE):
        raise HTTPException(status_code=404, detail="No entries found")
    pred = predict_next_mood(diary, yesterday_pred_mood)
    return {"predicted_next_mood": pred}

@app.on_event("startup")
def startup_event():
    entries = load_entries()
    if entries:
        train_incremental(entries)

@app.get("/")
def read_root():
    return {"message": "Backend is running!"}
