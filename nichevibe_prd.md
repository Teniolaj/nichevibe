# NicheVibe - Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** February 16, 2026  
**Project Type:** Personal Project  
**Status:** MVP Development Phase

---

## Executive Summary

NicheVibe is a vector-powered content discovery platform that eliminates mainstream popularity bias by focusing on semantic similarity and "vibe matching." Unlike traditional recommendation engines that prioritize trending content, NicheVibe uses AI embeddings to find hidden gems based on thematic resonance, emotional weight, and atmospheric qualities.

**Core Value Proposition:**  
"Stop watching what everyone else is watching. Find shows that match your actual taste, not what's trending."

---

## Table of Contents

1. [Product Vision & Goals](#1-product-vision--goals)
2. [Target Users](#2-target-users)
3. [Core Features (MVP Scope)](#3-core-features-mvp-scope)
4. [Technical Architecture](#4-technical-architecture)
5. [User Flows & Interface Design](#5-user-flows--interface-design)
6. [Data Model & Schema](#6-data-model--schema)
7. [API Specifications](#7-api-specifications)
8. [Security & Authentication](#8-security--authentication)
9. [Performance Requirements](#9-performance-requirements)
10. [Success Metrics](#10-success-metrics)
11. [Development Roadmap](#11-development-roadmap)
12. [Future Plans (DO NOT IMPLEMENT)](#12-future-plans-do-not-implement)

---

## 1. Product Vision & Goals

### Vision Statement
Build the world's first anti-mainstream discovery engine that uses mathematical "vibe matching" to surface content ignored by popularity-driven algorithms.

### Primary Goals (MVP)
1. **Niche Discovery:** Enable users to find anime with <50,000 popularity ranking that match their taste
2. **Semantic Search:** Implement vector-based similarity matching with 75%+ accuracy
3. **User Engagement:** Achieve 60%+ swipe-through rate on recommendations
4. **Library Management:** Provide intuitive tracking for watch status and progress

### Success Criteria
- 100+ anime titles with embeddings in database
- <2 second average query response time
- User saves 5+ shows to library per session
- 70%+ user return rate within 7 days

---

## 2. Target Users

### Primary Persona: "The Exhausted Explorer"
**Demographics:**
- Age: 18-35
- Anime experience: Intermediate to Advanced (>50 shows watched)
- Platform frustration: High (tired of Netflix/Crunchyroll recommendations)

**Pain Points:**
- "I've seen all the popular shows"
- "Algorithms keep recommending the same type of content"
- "I want something with the same vibe, not just the same genre"
- "Hidden gems are impossible to find"

**Behaviors:**
- Actively uses MAL/AniList for tracking
- Participates in Reddit anime communities
- Willing to try older/obscure shows
- Values quality over production budget

### Secondary Persona: "The Mood-Based Browser"
**Characteristics:**
- Doesn't know what to watch but knows the vibe they want
- Uses tags/moods more than specific titles
- Prefers curated exploration over search
- High engagement with visual discovery interfaces

---

## 3. Core Features (MVP Scope)

### 3.1 Seed-Based Discovery
**Description:** Users input a show they recently finished, system returns semantically similar hidden gems.

**User Story:**  
*"As a user who just finished Death Note, I want to find similar psychological thrillers that aren't mainstream, so I can continue my watch journey."*

**Acceptance Criteria:**
- [ ] User can search for anime by title with autocomplete
- [ ] System generates embedding for selected show
- [ ] Vector search returns 15-20 recommendations
- [ ] Results exclude shows with popularity >50,000
- [ ] Similarity score displayed as percentage (70-95% range)
- [ ] Results load in <3 seconds

**Technical Requirements:**
- Google AI Studio `text-embedding-004` (768 dimensions)
- Cosine similarity threshold: 0.70 minimum
- Supabase pgvector index for fast retrieval

---

### 3.2 Mood Cloud / Tag-Based Discovery
**Description:** New users select atmospheric tags to discover content without needing a seed show.

**User Story:**  
*"As a new user, I want to select mood tags like 'bittersweet' and 'cerebral' to find shows that match my current vibe."*

**Acceptance Criteria:**
- [ ] Display 20+ mood tags in interactive pill UI
- [ ] Users can select 1-5 tags
- [ ] System creates centroid embedding from tag combination
- [ ] Returns 15 shows matching tag semantics
- [ ] Tags are pre-curated (not user-generated)

**Tag Categories:**
- **Emotional:** Bittersweet, Uplifting, Melancholic, Cathartic
- **Pacing:** Slow-Burn, Fast-Paced, Meditative, Explosive
- **Themes:** Existential, Class Struggle, Coming-of-Age, Revenge
- **Atmosphere:** Cozy, Gritty, Ethereal, Claustrophobic

---

### 3.3 Swipeable Card Interface
**Description:** Tinder-style card stack where users swipe/click to add or reject recommendations.

**User Story:**  
*"As a user viewing recommendations, I want to quickly accept or reject shows with visual feedback, so I can efficiently curate my library."*

**Acceptance Criteria:**
- [ ] Modal/popup overlays search results
- [ ] Shows anime cover, title, synopsis, tags, similarity score
- [ ] Swipe right OR click ✅ button → Add to "Plan to Watch"
- [ ] Swipe left OR click ❌ button → Skip to next card
- [ ] Progress indicator (e.g., "Card 3/20")
- [ ] Toast notification confirms library addition
- [ ] Works on mobile touch and desktop click/drag

**Design Specs:**
- Card dimensions: 350px wide × 500px tall (desktop)
- Swipe threshold: 100px horizontal drag
- Animation: Framer Motion spring physics
- Maximum stack: 20 cards per query

---

### 3.4 Personal Library with Status Tracking
**Description:** Users manage discovered shows with progress tracking and status categorization.

**User Story:**  
*"As a user, I want to track which shows I'm currently watching, have completed, or plan to watch, so I can organize my viewing queue."*

**Acceptance Criteria:**
- [ ] Five status categories: Watching, Completed, Plan to Watch, On Hold, Dropped
- [ ] Tab navigation between categories
- [ ] Display current episode / total episodes for "Watching"
- [ ] Users can update status via dropdown menu
- [ ] Episode counter with increment buttons
- [ ] Optional personal rating (1-10 scale)
- [ ] Optional text notes field
- [ ] Auto-timestamp when status changes to "Watching" or "Completed"

**Library Card Layout:**
```
┌─────────────────────┐
│  [Cover Image]      │
│  Title              │
│  Episode 5/24       │
│  Status: Watching   │
│  Rating: ⭐ 8/10    │
│  [Edit] [Remove]    │
└─────────────────────┘
```

---

### 3.5 Niche Filter Logic
**Description:** Algorithmic exclusion of mainstream/popular content to enforce "hidden gem" discovery.

**Technical Implementation:**
- Popularity threshold: <50,000 (AniList popularity rank)
- Quality floor: Average score >7.0 (prevents low-quality spam)
- Recency balance: Mix of classic (pre-2010) and recent (<5 years)

**SQL Filter:**
```sql
WHERE 
  popularity_rank < 50000
  AND average_score > 7.0
  AND 1 - (embedding <=> query_embedding) > 0.70
```

---

### 3.6 Authentication System
**Description:** User account management with social login and email/password options.

**Providers:**
- Google OAuth (primary)
- Email + Password (fallback)

**Supabase Auth Features:**
- Magic link email verification
- Password reset flow
- Session management with JWT
- Row-level security (RLS) on user_library table

**Protected Routes:**
- `/discover` → Requires auth
- `/library` → Requires auth
- `/explore` → Public (guest mode with limited features)

---

## 4. Technical Architecture

### 4.1 System Overview

```
┌─────────────────────────────────────────────────────┐
│                   CLIENT LAYER                       │
│  Next.js 14 (App Router) + TypeScript + Tailwind   │
└──────────────────┬──────────────────────────────────┘
                   │
                   v
┌─────────────────────────────────────────────────────┐
│                  API LAYER                           │
│  Next.js API Routes (/app/api/*)                    │
│  - /api/discover (vector search)                    │
│  - /api/embed (Google AI embedding generation)      │
│  - /api/library/* (CRUD operations)                 │
│  - /api/explore (tag-based discovery)               │
└──────────────────┬──────────────────────────────────┘
                   │
                   v
┌─────────────────────────────────────────────────────┐
│                 DATA LAYER                           │
│  Supabase (PostgreSQL 15 + pgvector)                │
│  - anime_library (master content table)             │
│  - user_library (user watch tracking)               │
│  - auth.users (Supabase Auth)                       │
└──────────────────┬──────────────────────────────────┘
                   │
                   v
┌─────────────────────────────────────────────────────┐
│              INGESTION PIPELINE                      │
│  n8n Workflow (Automated ETL)                        │
│  - AniList API fetch                                 │
│  - Google AI embedding generation                    │
│  - Supabase batch insert                             │
└─────────────────────────────────────────────────────┘
```

### 4.2 Tech Stack

**Frontend:**
- **Framework:** Next.js 14.1+ (App Router, React Server Components)
- **Language:** TypeScript 5.3+
- **Styling:** Tailwind CSS 3.4+
- **UI Components:** Shadcn/ui
- **Animations:** Framer Motion 11+
- **State Management:** React Context + Zustand (for complex state)
- **Forms:** React Hook Form + Zod validation

**Backend:**
- **Runtime:** Next.js Edge Runtime (API routes)
- **Database:** Supabase (PostgreSQL 15.1)
- **Vector Search:** pgvector 0.5.1
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage (for user avatars - future)

**AI/ML:**
- **Embedding Model:** Google AI Studio `text-embedding-004` (768-dim)
- **API Client:** `@google/generative-ai` SDK
- **Fallback:** OpenAI `text-embedding-3-small` (1536-dim) if quota exceeded

**Data Pipeline:**
- **Automation:** n8n (self-hosted or cloud)
- **Data Source:** AniList GraphQL API
- **Schedule:** Daily batch updates (new shows)

**DevOps:**
- **Hosting:** Vercel (Next.js)
- **Database:** Supabase Cloud
- **CI/CD:** Vercel Git integration
- **Monitoring:** Vercel Analytics + Supabase Logs
- **Error Tracking:** Sentry (optional)

---

## 5. User Flows & Interface Design

### 5.1 New User Onboarding Flow

```
Landing Page (/)
    │
    ├─> [Get Started] → Auth (/auth/signup)
    │                      │
    │                      ├─> Google OAuth
    │                      └─> Email/Password
    │                             │
    └──────────────────────────────┘
                                   │
                                   v
                         Welcome Modal
                        "Pick your style:"
                    [I know what I like] [I want to explore]
                              │                    │
                              v                    v
                      /discover              /explore
```

### 5.2 Main Discovery Flow (Seed-Based)

```
/discover Page
    │
    v
┌──────────────────────────────────────┐
│ "What did you just finish?"          │
│ ┌────────────────────────────────┐   │
│ │ [Search: Death Note________] 🔍│   │
│ └────────────────────────────────┘   │
│                                      │
│ Recent Searches:                     │
│ • Steins;Gate                        │
│ • Monster                            │
└──────────────────────────────────────┘
    │
    v (User selects show)
    │
    v
┌──────────────────────────────────────┐
│  Loading...                          │
│  Analyzing semantic vibe...          │
│  Finding hidden gems...              │
└──────────────────────────────────────┘
    │
    v
┌──────────────────────────────────────┐
│  Swipeable Card Modal (Popup)        │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 📺 Monster (2004)             │  │
│  │ [Cover Image]                 │  │
│  │ A brilliant doctor saves...   │  │
│  │                               │  │
│  │ Tags: Psychological, Thriller │  │
│  │ Similarity: 89%               │  │
│  │ Rank: #12,450                 │  │
│  └────────────────────────────────┘  │
│                                      │
│  [❌ Skip]           [✅ Add]         │
│                                      │
│  Card 1/20                           │
└──────────────────────────────────────┘
    │
    ├─> Swipe Left → Next card
    │
    └─> Swipe Right → Add to Library
                         │
                         v
              ┌─────────────────────┐
              │ ✅ Added to Plan    │
              │    to Watch!        │
              └─────────────────────┘
```

### 5.3 Exploration Flow (Tag-Based)

```
/explore Page
    │
    v
┌──────────────────────────────────────┐
│  Pick Your Vibe                      │
│                                      │
│  Mood Starters:                      │
│  ┌──────┐ ┌──────┐ ┌──────┐         │
│  │ 🧠   │ │ ☕   │ │ 🌌   │         │
│  │Brain │ │Cozy  │ │Dark  │         │
│  │Food  │ │Vibes │ │Epic  │         │
│  └──────┘ └──────┘ └──────┘         │
│                                      │
│  OR Custom Tags:                     │
│  [Bittersweet] [Slow-Burn]          │
│  [Cerebral] [Atmospheric]           │
│                                      │
│  [Discover Shows]                    │
└──────────────────────────────────────┘
    │
    v (User selects tags)
    │
    v
  Same Swipeable Card Interface
```

### 5.4 Library Management Flow

```
/library Page
    │
    v
┌──────────────────────────────────────┐
│  My Library                          │
│  ┌──────┬──────┬──────┬──────┬────┐ │
│  │Watch │Compl │Plan  │Hold  │Drop│ │
│  │ing   │eted  │      │      │    │ │
│  └──────┴──────┴──────┴──────┴────┘ │
│                                      │
│  ┌─────────┐ ┌─────────┐            │
│  │[Cover]  │ │[Cover]  │            │
│  │Monster  │ │Lain     │            │
│  │Ep 8/74  │ │✅ Done  │            │
│  │⭐ --    │ │⭐ 9/10  │            │
│  └─────────┘ └─────────┘            │
└──────────────────────────────────────┘
    │
    v (Click on card)
    │
    v
┌──────────────────────────────────────┐
│  Detail Modal                        │
│  ┌────────────────────────────────┐  │
│  │ Monster                        │  │
│  │ [Full Synopsis]                │  │
│  │                                │  │
│  │ Status: [Watching ▼]           │  │
│  │ Progress: [8] / 74 episodes    │  │
│  │ Rating: ⭐⭐⭐⭐⭐⭐⭐⭐⚪⚪     │  │
│  │ Notes: [Really gripping...]    │  │
│  │                                │  │
│  │ [Update] [Remove from Library] │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

### 5.5 Page Structure

**Route Map:**
```
/                          → Landing page (public)
/auth/login                → Login page
/auth/signup               → Signup page
/auth/callback             → OAuth redirect handler
/discover                  → Main search (protected)
/explore                   → Tag-based discovery (public + limited)
/library                   → User's saved anime (protected)
/library?tab=watching      → Filtered view
/anime/[id]                → Detail page (future - not MVP)
/profile                   → User settings (future - not MVP)
```

---

## 6. Data Model & Schema

### 6.1 Database Schema (Supabase PostgreSQL)

#### **Table: anime_library**
Master content table storing all anime with embeddings.

```sql
CREATE TABLE anime_library (
  -- Primary key
  id SERIAL PRIMARY KEY,
  
  -- AniList metadata
  anilist_id INTEGER UNIQUE NOT NULL,
  title TEXT NOT NULL,
  title_english TEXT,
  title_romaji TEXT,
  
  -- Content data
  synopsis TEXT NOT NULL,
  cover_image TEXT, -- URL to cover art
  banner_image TEXT,
  
  -- Categorization
  genres TEXT[] DEFAULT '{}',
  mood_tags TEXT[] DEFAULT '{}', -- Custom curated tags
  format TEXT, -- TV, Movie, OVA, etc.
  
  -- Metrics
  popularity_rank INTEGER NOT NULL,
  average_score DECIMAL(4,2), -- 0.00 to 10.00
  total_episodes INTEGER,
  season_year INTEGER,
  
  -- Vector embedding
  embedding vector(768) NOT NULL, -- Google text-embedding-004
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CHECK (average_score >= 0 AND average_score <= 10),
  CHECK (popularity_rank > 0)
);

-- Indexes for performance
CREATE INDEX idx_anime_popularity ON anime_library(popularity_rank);
CREATE INDEX idx_anime_score ON anime_library(average_score);
CREATE INDEX idx_anime_genres ON anime_library USING GIN(genres);
CREATE INDEX idx_anime_tags ON anime_library USING GIN(mood_tags);

-- Vector similarity index (CRITICAL for performance)
CREATE INDEX ON anime_library 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

#### **Table: user_library**
User-specific watch tracking and library management.

```sql
CREATE TABLE user_library (
  -- Primary key
  id SERIAL PRIMARY KEY,
  
  -- Foreign keys
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  anime_id INTEGER REFERENCES anime_library(id) ON DELETE CASCADE NOT NULL,
  
  -- Watch status
  status TEXT NOT NULL 
    CHECK (status IN ('plan_to_watch', 'watching', 'completed', 'on_hold', 'dropped')),
  
  -- Progress tracking
  current_episode INTEGER DEFAULT 0,
  
  -- User metadata
  personal_rating INTEGER CHECK (personal_rating BETWEEN 1 AND 10),
  notes TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  added_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP, -- When status changed to "watching"
  completed_at TIMESTAMP, -- When status changed to "completed"
  last_updated TIMESTAMP DEFAULT NOW(),
  
  -- Prevent duplicate entries
  UNIQUE(user_id, anime_id)
);

-- Indexes
CREATE INDEX idx_user_library_user ON user_library(user_id);
CREATE INDEX idx_user_library_status ON user_library(user_id, status);
CREATE INDEX idx_user_library_updated ON user_library(last_updated DESC);
```

#### **Table: user_preferences** (Optional - for future personalization)
```sql
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Discovery preferences
  preferred_genres TEXT[] DEFAULT '{}',
  excluded_genres TEXT[] DEFAULT '{}',
  min_score_threshold DECIMAL(4,2) DEFAULT 7.0,
  max_popularity_rank INTEGER DEFAULT 50000,
  
  -- UI preferences
  cards_per_query INTEGER DEFAULT 20,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 6.2 Row-Level Security (RLS) Policies

```sql
-- Enable RLS on user_library
ALTER TABLE user_library ENABLE ROW LEVEL SECURITY;

-- Users can only read their own library
CREATE POLICY "Users can view own library"
  ON user_library FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert to their own library
CREATE POLICY "Users can add to own library"
  ON user_library FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own library
CREATE POLICY "Users can update own library"
  ON user_library FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete from their own library
CREATE POLICY "Users can delete from own library"
  ON user_library FOR DELETE
  USING (auth.uid() = user_id);

-- anime_library is public read (no RLS needed)
-- But prevent public writes
ALTER TABLE anime_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read anime"
  ON anime_library FOR SELECT
  TO authenticated, anon
  USING (true);

-- Only service role can write (via n8n)
CREATE POLICY "Only service can write anime"
  ON anime_library FOR ALL
  USING (false);
```

### 6.3 Database Functions

#### **Function: match_anime** (Vector Similarity Search)
```sql
CREATE OR REPLACE FUNCTION match_anime(
  query_embedding vector(768),
  match_threshold float DEFAULT 0.70,
  match_count int DEFAULT 20,
  max_popularity int DEFAULT 50000,
  min_score float DEFAULT 7.0
)
RETURNS TABLE (
  id int,
  anilist_id int,
  title text,
  title_english text,
  synopsis text,
  cover_image text,
  genres text[],
  mood_tags text[],
  popularity_rank int,
  average_score decimal,
  total_episodes int,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    anime_library.id,
    anime_library.anilist_id,
    anime_library.title,
    anime_library.title_english,
    anime_library.synopsis,
    anime_library.cover_image,
    anime_library.genres,
    anime_library.mood_tags,
    anime_library.popularity_rank,
    anime_library.average_score,
    anime_library.total_episodes,
    1 - (anime_library.embedding <=> query_embedding) as similarity
  FROM anime_library
  WHERE 
    anime_library.popularity_rank < max_popularity
    AND anime_library.average_score >= min_score
    AND 1 - (anime_library.embedding <=> query_embedding) > match_threshold
  ORDER BY anime_library.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

#### **Function: get_random_niche_shows** (For exploration)
```sql
CREATE OR REPLACE FUNCTION get_random_niche_shows(
  result_count int DEFAULT 10,
  max_popularity int DEFAULT 30000
)
RETURNS TABLE (
  id int,
  title text,
  cover_image text,
  genres text[],
  mood_tags text[],
  average_score decimal
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    anime_library.id,
    anime_library.title,
    anime_library.cover_image,
    anime_library.genres,
    anime_library.mood_tags,
    anime_library.average_score
  FROM anime_library
  WHERE 
    anime_library.popularity_rank < max_popularity
    AND anime_library.average_score >= 7.5
  ORDER BY RANDOM()
  LIMIT result_count;
END;
$$;
```

---

## 7. API Specifications

### 7.1 API Routes Overview

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/discover` | POST | Required | Seed-based vector search |
| `/api/explore` | POST | Optional | Tag-based discovery |
| `/api/embed` | POST | Required | Generate embedding for text |
| `/api/library/add` | POST | Required | Add anime to user library |
| `/api/library/update` | PATCH | Required | Update status/progress |
| `/api/library/remove` | DELETE | Required | Remove from library |
| `/api/library/list` | GET | Required | Get user's library |
| `/api/search/autocomplete` | GET | Optional | Anime title search |

### 7.2 Detailed Endpoint Specifications

#### **POST /api/discover**
Search for anime similar to a seed show.

**Request Body:**
```json
{
  "query": "Death Note",
  "anilist_id": 1535, // Optional: Direct ID lookup
  "match_count": 20,
  "max_popularity": 50000,
  "min_score": 7.0
}
```

**Response:**
```json
{
  "success": true,
  "query": "Death Note",
  "results": [
    {
      "id": 42,
      "anilist_id": 19,
      "title": "Monster",
      "title_english": "Monster",
      "synopsis": "Dr. Kenzo Tenma, a talented neurosurgeon...",
      "cover_image": "https://s4.anilist.co/file/...",
      "genres": ["Mystery", "Psychological", "Thriller"],
      "mood_tags": ["cerebral", "dark", "mature"],
      "popularity_rank": 12450,
      "average_score": 8.87,
      "total_episodes": 74,
      "similarity": 0.89
    }
    // ... 19 more results
  ],
  "metadata": {
    "total_results": 20,
    "avg_similarity": 0.82,
    "processing_time_ms": 1243
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Show not found in database",
  "code": "NOT_FOUND"
}
```

---

#### **POST /api/explore**
Tag-based or mood-based discovery.

**Request Body:**
```json
{
  "mode": "tags", // "tags" or "vibe_starter"
  "tags": ["bittersweet", "slow-burn", "cerebral"],
  "match_count": 15,
  "max_popularity": 30000
}
```

**Alternative (Vibe Starter):**
```json
{
  "mode": "vibe_starter",
  "vibe_id": "philosophical_mindbenders",
  "example_shows": ["Serial Experiments Lain", "Texhnolyze"],
  "match_count": 15
}
```

**Response:**
```json
{
  "success": true,
  "mode": "tags",
  "query_tags": ["bittersweet", "slow-burn", "cerebral"],
  "results": [
    {
      "id": 89,
      "title": "Haibane Renmei",
      "cover_image": "https://...",
      "genres": ["Drama", "Fantasy", "Slice of Life"],
      "mood_tags": ["bittersweet", "atmospheric", "philosophical"],
      "similarity": 0.85,
      "popularity_rank": 18230
    }
    // ... more results
  ]
}
```

---

#### **POST /api/library/add**
Add anime to user's library.

**Request Body:**
```json
{
  "anime_id": 42,
  "status": "plan_to_watch" // Default status
}
```

**Response:**
```json
{
  "success": true,
  "library_item": {
    "id": 123,
    "user_id": "uuid-here",
    "anime_id": 42,
    "status": "plan_to_watch",
    "added_at": "2026-02-16T10:30:00Z"
  }
}
```

**Error (Duplicate):**
```json
{
  "success": false,
  "error": "Anime already in library",
  "code": "DUPLICATE_ENTRY",
  "existing_status": "watching"
}
```

---

#### **PATCH /api/library/update**
Update watch progress or status.

**Request Body:**
```json
{
  "library_item_id": 123,
  "status": "watching", // Optional
  "current_episode": 8, // Optional
  "personal_rating": 9, // Optional
  "notes": "Really gripping so far" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "updated_item": {
    "id": 123,
    "status": "watching",
    "current_episode": 8,
    "personal_rating": 9,
    "last_updated": "2026-02-16T11:45:00Z",
    "started_at": "2026-02-16T11:45:00Z" // Auto-set when status → "watching"
  }
}
```

---

#### **GET /api/library/list**
Retrieve user's library with filters.

**Query Parameters:**
```
?status=watching              // Filter by status
&sort_by=last_updated         // Sort field
&order=desc                   // Sort direction
```

**Response:**
```json
{
  "success": true,
  "library": [
    {
      "id": 123,
      "status": "watching",
      "current_episode": 8,
      "personal_rating": null,
      "added_at": "2026-02-10T09:00:00Z",
      "last_updated": "2026-02-16T11:45:00Z",
      "anime": {
        "id": 42,
        "title": "Monster",
        "cover_image": "https://...",
        "total_episodes": 74,
        "genres": ["Mystery", "Thriller"]
      }
    }
    // ... more items
  ],
  "stats": {
    "total_items": 45,
    "watching": 3,
    "completed": 12,
    "plan_to_watch": 25,
    "on_hold": 3,
    "dropped": 2
  }
}
```

---

#### **GET /api/search/autocomplete**
Fast title search for autocomplete UI.

**Query Parameters:**
```
?q=death note
&limit=5
```

**Response:**
```json
{
  "results": [
    {
      "anilist_id": 1535,
      "title": "Death Note",
      "title_english": "Death Note",
      "cover_image": "https://..."
    },
    {
      "anilist_id": 2994,
      "title": "Death Note Rewrite",
      "title_english": "Death Note: Director's Cut",
      "cover_image": "https://..."
    }
  ]
}
```

---

## 8. Security & Authentication

### 8.1 Authentication Flow (Supabase Auth)

**Google OAuth:**
```typescript
// components/AuthButton.tsx
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

const handleGoogleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      }
    }
  });
};
```

**Email/Password Signup:**
```typescript
const handleSignup = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    }
  });
  
  if (error) throw error;
  
  // Show "Check your email for verification link"
};
```

**Session Management:**
```typescript
// middleware.ts (Next.js)
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  // Protected routes
  const protectedPaths = ['/discover', '/library'];
  const isProtected = protectedPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  );
  
  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  
  return res;
}

export const config = {
  matcher: ['/discover/:path*', '/library/:path*']
};
```

### 8.2 API Security

**Environment Variables:**
```env
# .env.local (NEVER commit to git)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # Server-side only
GOOGLE_AI_API_KEY=AIzaSy...
```

**Rate Limiting (API Routes):**
```typescript
// lib/ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
});

// Usage in API route
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return Response.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }
  
  // ... handle request
}
```

### 8.3 Data Validation

**Zod Schemas:**
```typescript
// lib/schemas.ts
import { z } from 'zod';

export const DiscoverSchema = z.object({
  query: z.string().min(1).max(200),
  anilist_id: z.number().int().positive().optional(),
  match_count: z.number().int().min(5).max(50).default(20),
  max_popularity: z.number().int().positive().default(50000),
  min_score: z.number().min(0).max(10).default(7.0)
});

export const LibraryAddSchema = z.object({
  anime_id: z.number().int().positive(),
  status: z.enum(['plan_to_watch', 'watching', 'completed', 'on_hold', 'dropped'])
    .default('plan_to_watch')
});

export const LibraryUpdateSchema = z.object({
  library_item_id: z.number().int().positive(),
  status: z.enum(['plan_to_watch', 'watching', 'completed', 'on_hold', 'dropped']).optional(),
  current_episode: z.number().int().min(0).optional(),
  personal_rating: z.number().int().min(1).max(10).optional(),
  notes: z.string().max(1000).optional()
});
```

---

## 9. Performance Requirements

### 9.1 Response Time Targets

| Operation | Target | Maximum Acceptable |
|-----------|--------|-------------------|
| Page Load (First Contentful Paint) | <1.5s | 3s |
| Vector Search Query | <2s | 4s |
| Library CRUD Operations | <500ms | 1s |
| Autocomplete Search | <300ms | 800ms |

### 9.2 Optimization Strategies

**Database:**
- IVFFlat index on embedding column (100 lists)
- Partial indexes on frequently filtered columns
- Connection pooling via Supabase Pooler

**API Routes:**
- Edge Runtime for low latency
- Response caching for popular queries (SWR)
- Batch embedding generation (n8n pipeline)

**Frontend:**
- Image optimization with Next.js Image component
- Route prefetching for anticipated navigation
- Lazy loading for below-fold content
- Virtual scrolling for long lists

**CDN:**
- Static assets via Vercel Edge Network
- Anime cover images via Supabase CDN

### 9.3 Scalability Considerations

**Current Architecture Supports:**
- 10,000 anime titles with embeddings
- 1,000 concurrent users
- 50 requests/second to vector search

**Bottlenecks to Monitor:**
- pgvector query performance (add more lists to IVFFlat index if >10k items)
- Google AI API quota (1,500 requests/day free tier)
- Supabase connection limits (60 concurrent on free tier)

---

## 10. Success Metrics

### 10.1 Key Performance Indicators (KPIs)

**Product Metrics:**
- **Discovery Success Rate:** 60%+ of queries result in ≥1 library addition
- **Average Similarity Score:** 75%+ for returned results
- **Swipe-Through Rate:** 50%+ of cards viewed get swiped (not abandoned)
- **Library Addition Rate:** 5+ shows saved per user session

**Engagement Metrics:**
- **Daily Active Users (DAU):** Track baseline, target 20% growth week-over-week
- **Session Duration:** Average 8+ minutes per visit
- **Return Rate:** 60%+ of users return within 7 days
- **Library Update Frequency:** 40%+ of users update status at least once/week

**Technical Metrics:**
- **API Error Rate:** <1% of requests
- **P95 Response Time:** <3 seconds for vector search
- **Database Query Performance:** 95% of queries <500ms

### 10.2 Analytics Implementation

**Vercel Analytics (Built-in):**
- Page views
- Core Web Vitals
- Real User Monitoring (RUM)

**Custom Events (Posthog/Mixpanel):**
```typescript
// Track user actions
analytics.track('discovery_search', {
  query: animeName,
  results_count: recommendations.length,
  avg_similarity: avgScore
});

analytics.track('library_add', {
  anime_id: animeId,
  status: 'plan_to_watch',
  source: 'swipe_right' // or 'detail_page'
});

analytics.track('card_swiped', {
  direction: 'left', // or 'right'
  card_position: 3, // Which card in stack
  anime_id: animeId,
  similarity_score: 0.87
});
```

---

## 11. Development Roadmap

### Phase 1: Foundation (Weeks 1-2) ✅ **MVP SCOPE**

**Week 1: Setup & Infrastructure**
- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Configure Supabase project (database + auth)
- [ ] Set up pgvector extension
- [ ] Create database schema (anime_library, user_library)
- [ ] Implement RLS policies
- [ ] Configure Google AI Studio API
- [ ] Set up environment variables

**Week 2: Data Pipeline**
- [ ] Build n8n workflow for AniList → Supabase
- [ ] Implement embedding generation logic
- [ ] Seed database with 100-200 anime titles
- [ ] Verify vector similarity queries work
- [ ] Create database functions (match_anime, etc.)

---

### Phase 2: Core Features (Weeks 3-5) ✅ **MVP SCOPE**

**Week 3: Discovery Engine**
- [ ] Build `/api/discover` endpoint
- [ ] Implement seed-based vector search
- [ ] Create `/api/embed` for runtime embedding generation
- [ ] Build search autocomplete API
- [ ] Test niche filter logic (popularity <50k)

**Week 4: User Interface**
- [ ] Design and implement landing page
- [ ] Build authentication UI (login/signup)
- [ ] Create `/discover` page with search bar
- [ ] Implement swipeable card modal component
- [ ] Add Framer Motion animations
- [ ] Build card stack logic (20 cards max)

**Week 5: Library Management**
- [ ] Create `/api/library/*` endpoints (add, update, delete, list)
- [ ] Build `/library` page with tab navigation
- [ ] Implement status filtering (Watching, Completed, etc.)
- [ ] Add progress tracking UI (episode counter)
- [ ] Create library card components

---

### Phase 3: Exploration & Polish (Weeks 6-7) ✅ **MVP SCOPE**

**Week 6: Tag-Based Discovery**
- [ ] Curate 20+ mood tags
- [ ] Create pre-defined "Vibe Starters"
- [ ] Build `/explore` page UI
- [ ] Implement `/api/explore` endpoint
- [ ] Add tag-based centroid embedding logic

**Week 7: Testing & Refinement**
- [ ] User acceptance testing (UAT) with 5-10 beta users
- [ ] Performance optimization (query times, image loading)
- [ ] Bug fixes and edge case handling
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Mobile responsiveness testing
- [ ] Final UI polish and animations

---

### Phase 4: Launch Preparation (Week 8) ✅ **MVP SCOPE**

- [ ] Seed database with 500+ anime titles
- [ ] Set up production environment variables
- [ ] Configure Vercel deployment
- [ ] Add error monitoring (Sentry)
- [ ] Create onboarding tour/tooltips
- [ ] Write user documentation
- [ ] Prepare social media launch assets
- [ ] Deploy to production
- [ ] Monitor for critical issues

---

## 12. Future Plans (DO NOT IMPLEMENT)

### ⚠️ CRITICAL NOTICE ⚠️
**THE FOLLOWING FEATURES ARE POST-MVP ENHANCEMENTS ONLY.**  
**DO NOT IMPLEMENT ANY OF THESE DURING THE CURRENT DEVELOPMENT CYCLE.**  
**THESE ARE DOCUMENTED FOR STRATEGIC PLANNING PURPOSES.**

---

### 12.1 Cross-Genre Expansion (Phase 5 - Q2 2026)

**DO NOT BUILD THIS NOW**

**Concept:** Integrate books, podcasts, and series into the same vector space.

**Proposed Data Sources:**
- **Books:** Google Books API + Open Library
- **Podcasts:** Spotify Podcasts API + Apple Podcasts
- **TV Series:** TMDB (The Movie Database)
- **Movies:** TMDB + Letterboxd data scraping

**Technical Requirements:**
- Unified embedding model for all media types
- Cross-media vector similarity (e.g., recommend book based on anime)
- Genre normalization across platforms
- New tables: `books_library`, `podcasts_library`, `series_library`

**Example Use Case:**
User finishes *Death Note* (anime) → System recommends:
- Book: *Crime and Punishment* (Dostoevsky)
- Podcast: *Criminal* (true crime)
- Series: *Mindhunter* (Netflix)

**Why Defer:** Requires 4x data pipeline complexity, multi-modal embedding strategy, and additional API integrations. MVP should validate core concept first.

---

### 12.2 Contextual/Mood Awareness (Phase 6 - Q3 2026)

**DO NOT BUILD THIS NOW**

**Concept:** Real-time mood detection and time-of-day recommendations.

**Proposed Features:**
- **Time-Based Suggestions:** Morning = uplifting shows, Late night = cerebral content
- **Weather Integration:** Rainy day = cozy slice-of-life recommendations
- **User Mood Input:** "I'm feeling nostalgic" → Adjust vector search weighting
- **Listening History Analysis:** Detect patterns in watch times/preferences

**Technical Implementation:**
- Sentiment analysis on user notes/ratings
- Bayesian inference for mood state
- Time-weighted recommendation scoring
- Integration with device sensors (optional, privacy-conscious)

**Why Defer:** Requires extensive ML experimentation, raises privacy concerns, and adds significant complexity to recommendation logic.

---

### 12.3 Automated Syncing (Recommendarr) (Phase 7 - Q4 2026)

**DO NOT BUILD THIS NOW**

**Concept:** Background agent that syncs watch history from Plex/Jellyfin/Trakt.

**Proposed Architecture:**
- **Plex Integration:** OAuth + Webhook for watch events
- **Jellyfin Integration:** API polling for recently watched
- **Trakt Integration:** Sync watched history via OAuth
- **n8n Workflow:** Automated sync every 24 hours

**Features:**
- Auto-add watched shows to "Completed" status
- Episode progress syncing
- Multi-platform aggregation (watch on Plex, track on NicheVibe)
- Duplicate detection and merging

**Why Defer:** Requires OAuth setup for 3+ platforms, complex conflict resolution, and may not be needed until user base demands it.

---

### 12.4 Multi-User "Vibe Matching" (Phase 8 - 2027)

**DO NOT BUILD THIS NOW**

**Concept:** Group recommendation system for finding shows that satisfy multiple users.

**Proposed Algorithm:**
1. Collect embeddings from each user's library
2. Calculate centroid (average) of all user vectors
3. Search for shows near centroid
4. Weight by minimum distance to ensure all users approve

**Use Cases:**
- Couples trying to find a show both enjoy
- Friend groups picking weekend binge content
- Family movie night selection

**Technical Challenges:**
- Real-time collaboration UI (WebSockets)
- Voting/veto mechanism
- Fairness algorithm (prevent one user dominating)
- Privacy controls (sharing library data)

**Why Defer:** Requires social features, real-time sync infrastructure, and UX design for group dynamics. Too complex for MVP.

---

### 12.5 Advanced Filtering & Customization (Post-MVP)

**DO NOT BUILD THIS NOW**

**Proposed Features:**
- **Year Range Filters:** "Only shows from 2000-2010"
- **Episode Count Filters:** "Only short series (≤12 episodes)"
- **Studio Filters:** "Show me Kyoto Animation works"
- **Exclude Genres:** "No mecha, no sports"
- **Custom Popularity Threshold:** User adjusts niche filter (slider: 10k - 100k)
- **Source Material Filter:** Manga vs. Light Novel vs. Original

**Why Defer:** Adds UI complexity, requires extensive testing to avoid "filter paralysis," and may fragment user experience.

---

### 12.6 Social Features (Post-MVP)

**DO NOT BUILD THIS NOW**

**Proposed Features:**
- Public/private library profiles
- Follow other users
- Shared recommendation lists
- Comments/reviews on anime pages
- "What are my friends watching?" feed
- Collaborative playlists

**Why Defer:** Requires moderation system, user privacy controls, and shifts focus from discovery to social networking.

---

### 12.7 AI-Generated Summaries & Insights (Post-MVP)

**DO NOT BUILD THIS NOW**

**Concept:** Use LLMs to generate:
- Personalized "Why you might like this" explanations
- Spoiler-free thematic comparisons
- "If you liked X, you'll love Y because..." narratives
- Season-by-season analysis for long series

**Technical Implementation:**
- OpenAI GPT-4 or Claude API
- Prompt templates with user preference injection
- Caching for popular shows
- Cost optimization (only generate for high-engagement shows)

**Why Defer:** Expensive (LLM API costs), requires extensive prompt engineering, and may not add value until user feedback confirms need.

---

### 12.8 Mobile App (Native iOS/Android) (Post-MVP)

**DO NOT BUILD THIS NOW**

**Proposed Features:**
- Offline library access
- Push notifications (new recommendations based on completed shows)
- Barcode scanning for physical media
- Integration with streaming app APIs (deep linking)

**Why Defer:** Requires dedicated mobile development resources, app store approval processes, and maintenance of 2+ additional codebases.

---

### 12.9 Monetization Strategy (Future Consideration)

**DO NOT IMPLEMENT ANY PAID FEATURES NOW**

**Potential Revenue Streams:**
- **Freemium Model:** 5 searches/day free, unlimited for $3/month
- **Affiliate Links:** Earn commission from Crunchyroll/Funimation referrals
- **Premium Features:** Advanced filters, unlimited library size, priority support
- **B2B Licensing:** Sell API access to streaming platforms

**Why Defer:** MVP should prove product-market fit before introducing paid tiers. Monetization can alienate early adopters.

---

### 12.10 Content Partnerships (Future)

**DO NOT PURSUE THIS NOW**

**Potential Partners:**
- Streaming platforms (Crunchyroll, HIDIVE) for direct content links
- MAL/AniList for official API partnerships
- Anime studios for exclusive early access to metadata
- Manga publishers for cross-promotion

**Why Defer:** Requires legal agreements, revenue-sharing negotiations, and established user base for leverage.

---

## END OF FUTURE PLANS SECTION

**REMINDER:** All features in Section 12 are **POST-MVP ONLY**. Focus exclusively on Phases 1-4 (Weeks 1-8) for hackathon submission and initial product launch.

---

## Appendix A: n8n Workflow Configuration

### AniList to Supabase Pipeline

**Workflow Structure:**
```
[Schedule Trigger: Daily 2AM UTC]
    ↓
[AniList GraphQL Request]
    ↓
[Filter: Popularity < 50k, Score > 7.0]
    ↓
[Loop Through Items]
    ↓
[Google AI Embedding Generation]
    ↓
[Supabase Insert/Update]
    ↓
[Error Handler: Log to Supabase errors table]
```

**Node Configurations:**

**1. Schedule Trigger:**
```json
{
  "rule": "0 2 * * *",
  "timezone": "UTC"
}
```

**2. HTTP Request (AniList API):**
```json
{
  "method": "POST",
  "url": "https://graphql.anilist.co",
  "body": {
    "query": "query ($page: Int, $perPage: Int) { Page(page: $page, perPage: $perPage) { media(type: ANIME, sort: POPULARITY_DESC) { id title { romaji english } description genres averageScore popularity episodes coverImage { large } bannerImage season seasonYear } } }",
    "variables": {
      "page": 1,
      "perPage": 50
    }
  }
}
```

**3. Filter Node (Code):**
```javascript
const items = [];

for (const item of $input.all()) {
  const media = item.json.data.Page.media;
  
  for (const show of media) {
    if (show.popularity < 50000 && show.averageScore >= 7.0) {
      items.push({
        json: {
          anilist_id: show.id,
          title: show.title.romaji,
          title_english: show.title.english,
          synopsis: show.description,
          genres: show.genres,
          average_score: show.averageScore / 10, // Convert to 0-10 scale
          popularity_rank: show.popularity,
          total_episodes: show.episodes,
          cover_image: show.coverImage?.large,
          banner_image: show.bannerImage,
          season_year: show.seasonYear,
          embedding_text: `${show.title.romaji} ${show.title.english} ${show.description} ${show.genres.join(' ')}`
        }
      });
    }
  }
}

return items;
```

**4. Google AI Embedding Node (HTTP Request):**
```json
{
  "method": "POST",
  "url": "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent",
  "headers": {
    "x-goog-api-key": "={{ $env.GOOGLE_AI_API_KEY }}"
  },
  "body": {
    "content": {
      "parts": [{
        "text": "={{ $json.embedding_text }}"
      }]
    }
  }
}
```

**5. Transform Embedding (Code):**
```javascript
return {
  json: {
    ...($input.first().json),
    embedding: $input.first().json.embedding.values
  }
};
```

**6. Supabase Insert (Postgres Node):**
```sql
INSERT INTO anime_library (
  anilist_id,
  title,
  title_english,
  synopsis,
  genres,
  average_score,
  popularity_rank,
  total_episodes,
  cover_image,
  banner_image,
  season_year,
  embedding
) VALUES (
  {{ $json.anilist_id }},
  {{ $json.title }},
  {{ $json.title_english }},
  {{ $json.synopsis }},
  {{ $json.genres }}::text[],
  {{ $json.average_score }},
  {{ $json.popularity_rank }},
  {{ $json.total_episodes }},
  {{ $json.cover_image }},
  {{ $json.banner_image }},
  {{ $json.season_year }},
  {{ $json.embedding }}::vector(768)
)
ON CONFLICT (anilist_id) 
DO UPDATE SET
  title = EXCLUDED.title,
  synopsis = EXCLUDED.synopsis,
  average_score = EXCLUDED.average_score,
  popularity_rank = EXCLUDED.popularity_rank,
  updated_at = NOW();
```

---

## Appendix B: Mood Tag Taxonomy

**Curated Tags for MVP:**

**Emotional Tones:**
- Bittersweet
- Uplifting
- Melancholic
- Cathartic
- Hopeful
- Dark
- Wholesome

**Pacing:**
- Slow-Burn
- Fast-Paced
- Meditative
- Explosive
- Methodical

**Themes:**
- Existential
- Philosophical
- Psychological
- Class Struggle
- Coming-of-Age
- Revenge
- Redemption
- Loss and Grief

**Atmosphere:**
- Cozy
- Gritty
- Ethereal
- Claustrophobic
- Vast
- Intimate
- Surreal

**Intellectual Weight:**
- Brain Food
- Cerebral
- Thought-Provoking
- Simple and Fun
- Emotionally Heavy

---

## Appendix C: Testing Checklist

### Manual Testing Scenarios

**Discovery Flow:**
- [ ] Search for popular show, verify results are niche (<50k popularity)
- [ ] Search for non-existent show, verify error handling
- [ ] Verify similarity scores are 70%+ for all results
- [ ] Test with 5 different seed shows, ensure variety

**Swipe Interface:**
- [ ] Swipe right adds to library with toast notification
- [ ] Swipe left advances to next card
- [ ] Click ✅/❌ buttons work identically to swipe
- [ ] Progress indicator updates correctly
- [ ] Modal closes after last card

**Library Management:**
- [ ] Add same anime twice, verify duplicate error
- [ ] Change status from "Plan to Watch" → "Watching", verify timestamp
- [ ] Complete anime, verify completed_at timestamp
- [ ] Update episode progress, verify persistence
- [ ] Delete from library, verify removal

**Authentication:**
- [ ] Google OAuth login redirects correctly
- [ ] Email signup sends verification email
- [ ] Protected routes redirect to login when unauthenticated
- [ ] Session persists across page reloads
- [ ] Logout clears session and redirects

**Performance:**
- [ ] Vector search completes in <3 seconds
- [ ] Page load FCP <1.5 seconds
- [ ] Images lazy load below fold
- [ ] No layout shift during load

---

## Document Control

**Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-16 | Personal Project | Initial PRD creation |

**Next Review Date:** 2026-03-16 (Post-MVP Launch)

---

**END OF DOCUMENT**
