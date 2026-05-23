# DevType Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string_here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## Getting Started

### 1. MongoDB Setup
- Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
- Create a new cluster
- Get your connection string and add it to `MONGODB_URI`

### 2. Google OAuth Setup
- Go to https://console.cloud.google.com/
- Create a new project or select an existing one
- Enable Google+ API
- Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
- Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
- Copy Client ID and Client Secret to your `.env.local`

### 3. NextAuth Secret
Generate a secret key:
```bash
openssl rand -base64 32
```
Add it to `NEXTAUTH_SECRET`

### 4. Install Dependencies
```bash
npm install
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
