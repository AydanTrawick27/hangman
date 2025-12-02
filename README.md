# Hangman Game (React + Node + DynamoDB Local)

A simple, interactive Hangman game built with **React** and a small Node/Express API backed by **DynamoDB Local**.

Players can log in with a name, have their wins/losses stored, and then play Hangman in the browser.

---

## Features

- React front-end Hangman game
- Login screen that stores a player name
- Player stats (wins, losses, win %)
- Node/Express API (`api/server.js`) for reading/writing player data
- DynamoDB Local used as the backing data store (via Docker)

---

## Prerequisites

- **Node.js** and **npm** (for running tests or local dev without Docker)
- **Docker** and **Docker Compose** (for running the full stack)

---

## Project Structure 

- `src/` – React front end (Hangman UI, Login, etc.)
- `api/server.js` – Node/Express server that exposes:
  - `GET /api/player`
  - `POST /api/players`
  - `PUT /api/player`
- `api/dynamoClient.js` – DynamoDB DocumentClient configuration
- `docker-compose.yml` – Spins up:
  - DynamoDB Local
  - DynamoDB admin UI
  - API service
  - React UI

The **server file required** is `api/server.js`.  
When using Docker Compose you do **not** run this manually – Docker starts it for you.  


---

## Running the Project with Docker Compose (recommended)

This is the easiest way to run **the whole app**: UI + API + DynamoDB Local.

From the project root:

```bash
# Build and start all services (UI, API, DynamoDB Local, admin UI)
docker compose up --build
