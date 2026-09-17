# Back 2 Owner Frontend

React and Vite frontend for the Back 2 Owner lost-property recovery platform.

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template and set the backend API URL:

   ```bash
   cp .env.example .env
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

The default API URL is `http://localhost:5000/api`.

## Production configuration

Set `VITE_API_URL` to the deployed backend API URL before building. The value must include the `/api` path and should not end with a slash.

```env
VITE_API_URL=https://api.example.com/api
```

Create and verify a production build with:

```bash
npm run lint
npm run build
```
