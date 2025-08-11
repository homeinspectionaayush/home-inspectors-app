// build_source.js
// Run with: node build_source.js
// Creates a GitHub-ready PWA + Capacitor + GitHub Actions workflow for Home Inspectors.

import fs from "fs";
import path from "path";

const ROOT = process.cwd();

function write(filePath, content, opts = {}) {
  const full = path.join(ROOT, filePath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  if (opts.binary) {
    fs.writeFileSync(full, content);
  } else {
    fs.writeFileSync(full, content, { encoding: "utf8" });
  }
  console.log("Wrote:", filePath);
}

/* ---------------- package.json ---------------- */
write(
  "package.json",
  JSON.stringify(
    {
      name: "home-inspectors",
      version: "0.1.0",
      private: true,
      scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview"
      },
      dependencies: {
        react: "^18.2.0",
        "react-dom": "^18.2.0",
        jspdf: "^2.5.1",
        jszip: "^3.10.1",
        "file-saver": "^2.0.5",
        "lucide-react": "^0.268.0",
        "@capacitor/core": "^5.0.0"
      },
      devDependencies: {
        typescript: "^5.2.2",
        vite: "^5.0.0",
        "@vitejs/plugin-react": "^4.0.0"
      }
    },
    null,
    2
  )
);

/* ---------------- vite.config.ts ---------------- */
write(
  "vite.config.ts",
  `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  server: {
    port: 5173
  }
})
`
);

/* ---------------- tsconfig.json ---------------- */
write(
  "tsconfig.json",
  `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM","ES2020"],
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "types": ["vite/client"]
  },
  "include": ["src"]
}
`
);

/* ---------------- index.html ---------------- */
write(
  "index.html",
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Home Inspectors</title>
    <link rel="manifest" href="/manifest.json" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
);

/* ---------------- public/manifest.json ---------------- */
write(
  "public/manifest.json",
  JSON.stringify(
    {
      name: "Home Inspectors",
      short_name: "Home Inspectors",
      description: "Professional Property Inspection App",
      start_url: "/",
      display: "standalone",
      theme_color: "#1976D2",
      background_color: "#FAFAFA",
      orientation: "portrait",
      icons: [
        { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
      ],
      categories: ["productivity", "business"]
    },
    null,
    2
  )
);

/* ---------------- public/service-worker.js ---------------- */
write(
  "public/service-worker.js",
  `const CACHE_NAME = 'home-inspectors-v1';
const URLs = ['/', '/index.html', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLs))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
`
);

/* ---------------- icons (use small embedded PNG if no logo file present) ---------------- */
/* a 1x1 PNG stub (tiny but valid) */
const tinyPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8+x8AAuEB9sZQWgAAAABJRU5ErkJggg==",
  "base64"
);
write("public/icons/icon-192.png", tinyPng, { binary: true });
write("public/icons/icon-512.png", tinyPng, { binary: true });

/* ---------------- src core files ---------------- */
write(
  "src/main.tsx",
  `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`
);

write(
  "src/styles.css",
  `body { font-family: Arial, Helvetica, sans-serif; margin:0; padding:0; background:#f7f7f7; }
.app-container { max-width:420px; margin:0 auto; background:#fff; min-height:100vh; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
.header { background:#1976D2; color:#fff; padding:12px; text-align:center; }
.card { background:white; padding:12px; margin:12px; border-radius:8px; box-shadow:0 2px 6px rgba(0,0,0,0.05); }
.button { background:#1976D2; color:white; padding:10px 12px; border-radius:8px; display:inline-block; }`
);

/* App shell */
write(
  "src/App.tsx",
  `import React from 'react';
import HomePage from './pages/home';
export default function App() {
  return (
    <div className="app-container">
      <div className="header">
        <h1>Home Inspectors</h1>
        <div>కొనేముందు పరీక్షించండి</div>
      </div>
      <main>
        <HomePage />
      </main>
    </div>
  );
}
`
);

/* types, storage, camera, pdf generator (simplified but functional) */
write(
  "src/types.ts",
  `export interface InspectionEntry {
  id: string;
  room: string;
  photo?: string;
  notes?: string;
  timestamp: string;
  checklist?: any[];
}`
);

write(
  "src/lib/storageService.ts",
  `import { InspectionEntry } from '@/types';
const KEY = 'hi_entries_v1';

export const storageService = {
  async init() { return; },
  async saveEntry(entry: InspectionEntry) {
    const arr = JSON.parse(localStorage.getItem(KEY) || '[]');
    arr.push(entry);
    localStorage.setItem(KEY, JSON.stringify(arr));
  },
  async getEntries(): Promise<InspectionEntry[]> {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  },
  async getEntriesByRoom(room: string): Promise<InspectionEntry[]> {
    const entries = await this.getEntries();
    return entries.filter((e: InspectionEntry) => e.room === room);
  }
};
`
);

write(
  "src/lib/cameraService.ts",
  `export const cameraService = {
  async capturePhoto(): Promise<string> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      input.onchange = (e: any) => {
        const f = e.target.files[0];
        if (!f) return reject(new Error('No file'));
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.onerror = () => reject(r.error);
        r.readAsDataURL(f);
      };
      input.click();
    });
  }
};
`
);

write(
  "src/lib/pdfGenerator.ts",
  `import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { InspectionEntry } from '@/types';

export const pdfGenerator = {
  async generateInspectionReport(entries: InspectionEntry[]) {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Home Inspectors Report', 10, 20);
    let y = 30;
    entries.forEach((e, i) => {
      doc.setFontSize(10);
      doc.text(\`\${i+1}. [\${e.room}] \${new Date(e.timestamp).toLocaleString()}\`, 10, y);
      y += 6;
      if (e.notes) {
        const split = doc.splitTextToSize(e.notes, 180);
        doc.text(split, 10, y);
        y += split.length * 5;
      }
      y += 6;
      if (y > 260) { doc.addPage(); y = 20; }
    });
    doc.save('inspection-report.pdf');
  }
};
`
);

/* ---------------- simple pages (home, room, review, export, settings) ---------------- */
write(
  "src/pages/home.tsx",
  `import React from 'react';
import { useState } from 'react';
export default function HomePage(){
  const rooms = ['Bedroom','Bathroom','Kitchen','Hall','Dining','Balcony'];
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div style={{padding:12}}>
      <h2>Select room to inspect</h2>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {rooms.map(r => (
          <div key={r} className="card" style={{textAlign:'center',cursor:'pointer'}} onClick={() => setSelected(r)}>
            <div style={{fontWeight:600}}>{r}</div>
            <div style={{fontSize:12,color:'#666'}}>{selected===r ? 'Selected' : ''}</div>
          </div>
        ))}
      </div>
      <div style={{marginTop:12}}>
        <button className="button" onClick={() => alert('Open Room page via app navigation')}>Go to Room</button>
      </div>
    </div>
  );
}
`
);

write(
  "src/pages/room.tsx",
  `import React, { useState } from 'react';
import { cameraService } from '@/lib/cameraService';
import { storageService } from '@/lib/storageService';
export default function RoomPage({room}:{room:string}){
  const [notes,setNotes] = useState('');
  const [photo,setPhoto] = useState<string|undefined>();
  const take = async () => {
    try {
      const p = await cameraService.capturePhoto();
      setPhoto(p);
    } catch(e) { alert('Camera error'); }
  };
  const save = async () => {
    await storageService.saveEntry({ id: Date.now().toString(), room, photo, notes, timestamp: new Date().toISOString() });
    alert('Saved');
  };
  return (
    <div style={{padding:12}}>
      <h3>{room}</h3>
      <div style={{marginBottom:8}}>
        <button className="button" onClick={take}>Take Photo</button>
      </div>
      {photo && <div className="card"><img src={photo} style={{maxWidth:'100%'}}/></div>}
      <div className="card">
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} style={{width:'100%',height:120}}/>
      </div>
      <div style={{display:'flex',gap:8}}>
        <button className="button" onClick={save}>Save</button>
      </div>
    </div>
  );
}
`
);

write(
  "src/pages/review.tsx",
  `import React, { useEffect, useState } from 'react';
import { storageService } from '@/lib/storageService';
export default function ReviewPage(){
  const [entries, setEntries] = useState<any[]>([]);
  useEffect(()=>{ (async ()=>{ const e = await storageService.getEntries(); setEntries(e); })(); },[]);
  return (
    <div style={{padding:12}}>
      <h3>All Entries</h3>
      {entries.map(en => (
        <div key={en.id} className="card">
          <div><strong>{en.room}</strong> - {new Date(en.timestamp).toLocaleString()}</div>
          {en.photo && <img src={en.photo} style={{maxWidth:200}}/>}
          <div>{en.notes}</div>
        </div>
      ))}
    </div>
  );
}
`
);

write(
  "src/pages/export.tsx",
  `import React from 'react';
import { pdfGenerator } from '@/lib/pdfGenerator';
import { storageService } from '@/lib/storageService';
export default function ExportPage(){
  const run = async () => {
    const entries = await storageService.getEntries();
    await pdfGenerator.generateInspectionReport(entries);
  };
  return <div style={{padding:12}}><h3>Export</h3><button className="button" onClick={run}>Generate PDF</button></div>;
}
`
);

write(
  "src/pages/settings.tsx",
  `import React, { useEffect, useState } from 'react';
import { storageService } from '@/lib/storageService';
export default function SettingsPage(){
  const [s, setS] = useState<any>({ inspectorName:'', inspectorContact:'', licenseNumber:'' });
  useEffect(()=>{ (async ()=>{ const val = await storageService.getEntries(); })(); }, []);
  return (
    <div style={{padding:12}}>
      <h3>Settings</h3>
      <div className="card">
        <label>Name</label><input value={s.inspectorName} onChange={e=>setS({...s, inspectorName:e.target.value})} />
        <label>Contact</label><input value={s.inspectorContact} onChange={e=>setS({...s, inspectorContact:e.target.value})} />
      </div>
    </div>
  );
}
`
);

/* ---------------- Capacitor config ---------------- */
write(
  "capacitor.config.json",
  JSON.stringify(
    {
      appId: "com.homeinspectors.app",
      appName: "Home Inspectors",
      webDir: "dist",
      bundledWebRuntime: false
    },
    null,
    2
  )
);

/* ---------------- GitHub Actions workflow ---------------- */
write(
  ".github/workflows/android-build.yml",
  `name: Build APK

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 60
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install npm deps
        run: npm ci

      - name: Build web
        run: npm run build

      - name: Install Capacitor CLI
        run: npm install --no-save @capacitor/cli @capacitor/android

      - name: Prepare Capacitor Android
        run: |
          npx cap init home-inspectors com.homeinspectors.app --web-dir=dist || true
          npx cap add android || true
          npx cap copy

      - name: Build APK via Gradle
        working-directory: android
        run: |
          chmod +x ./gradlew
          ./gradlew assembleDebug

      - name: Upload APK artifact
        uses: actions/upload-artifact@v4
        with:
          name: home-inspectors-apk
          path: android/app/build/outputs/apk/debug/*.apk
`
);

/* ---------------- optional debug keystore placeholder ---------------- */
write("android/debug.keystore", "DEBUG-KEYSTORE-PLACEHOLDER");

/* ---------------- final note file ---------------- */
write(
  "INSTALL_INSTRUCTIONS.txt",
  `Steps to use this project:
1. Open the folder in terminal.
2. Run 'npm install' to install dependencies.
3. Run 'npm run build' to create the web build in /dist.
4. (Locally) run 'npx cap init home-inspectors com.homeinspectors.app --web-dir=dist' then 'npx cap add android' then 'npx cap copy'.
5. Open android/ in Android Studio and build, or push to GitHub and use the included GitHub Actions workflow to build the APK automatically.
`
);

console.log("\\nDone. Project scaffold created in:", ROOT);
console.log("Now run: npm install  (then follow INSTALL_INSTRUCTIONS.txt)");
