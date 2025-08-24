# bruh.ae (retro version)

A modern parody of early‑2000s personal/fan‑page aesthetics using static HTML/CSS/JS.

## Development helper

For a simple develop-and-preview workflow on Windows (PowerShell):

- Run the dev helper which builds, serves, opens the site, and watches `src/` for changes:

```powershell
cd D:\Code\GitHub\portfolio
.\dev.ps1
```

- The script will start a preview server on http://localhost:5173 (if the port is free), open the URL, and rebuild automatically when files in `src/` change.

- You can also build manually and serve:

```powershell
npm run build
npm run serve
Start-Process "http://localhost:5173"
```