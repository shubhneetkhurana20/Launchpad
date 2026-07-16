# LaunchPad

A premium, minimal company intranet homepage — login page + application launcher dashboard. Built with React, Vite, Tailwind CSS, and lucide-react icons.

## Open in VS Code

1. Unzip this folder anywhere on your computer.
2. Open the folder in VS Code: `File -> Open Folder...`
3. Open a terminal in VS Code: `Terminal -> New Terminal`

## Run it

You'll need Node.js installed first (LTS version, from nodejs.org). Then, in the VS Code terminal:

```bash
npm install
npm run dev
```

Open the link the terminal prints (usually http://localhost:5173).

**Try logging in with:** admin / admin123

## Log in as different people

Edit the USERS list near the top of `src/LaunchPad.jsx`:

```js
const USERS = [
  { username: "admin", password: "admin123", name: "Krishan" },
  { username: "john", password: "john123", name: "John" },
  { username: "priya", password: "priya123", name: "Priya" },
];
```

Add, remove, or edit lines here to manage who can log in.

## Company Applications are fully editable from the app itself

You no longer need to touch the code to change what's in "Company Applications":

- Click any app card to open its link in a new tab
- Hover over a card to reveal Edit (pencil) and Delete (trash) icons
- Click the dashed "+ Add Application" card to add a new one -- fill in Name, URL, an optional description, pick an icon and a color, and save
- Every change is saved automatically (in the browser's local storage) and takes effect immediately -- no code edits needed

The starting list still lives in the `APPS` array in `src/LaunchPad.jsx` if you ever want to change the defaults that show up the very first time the app runs.

## Build for deployment

```bash
npm run build
```

This creates a `dist/` folder containing plain HTML/CSS/JS -- upload it to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages) or serve it on your office network with:

```bash
npm install -g serve
serve -s dist
```

## Project structure

```
launchpad-app/
├── src/
│   ├── LaunchPad.jsx   <- the entire app (login page + dashboard)
│   ├── App.jsx         <- just renders <LaunchPad />
│   ├── main.jsx        <- React entry point (don't need to touch this)
│   └── index.css       <- Tailwind import (don't need to touch this)
├── index.html
├── package.json
└── vite.config.js
```

## Notes

- No backend or database -- this is a lightweight, front-end-only app.
- Each user's personal "My Links" are saved in the browser's localStorage, separately per username, and persist across refreshes on that same browser/device.
- Passwords in USERS are plain text in the source code -- fine for a trusted internal team, not for sensitive use.
