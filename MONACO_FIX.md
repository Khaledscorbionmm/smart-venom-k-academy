# Monaco Editor Loading Fix

## Problem
Monaco Editor is stuck on "Loading..." state and never initializes properly.

## Root Causes
1. **Missing Monaco Worker Configuration**: Monaco needs workers to be loaded from CDN or bundled
2. **Service Worker Caching Issue**: Stale cached assets may prevent Monaco from loading
3. **Missing Loader Configuration**: No explicit loader setup in Vite config

## Solution

### 1. Update Vite Config to Include Monaco Plugin
Add the following to `vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// Add this import
import { loader } from "@monaco-editor/react";

const rawPort = process.env.PORT || "18540";
const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH || "/";
const isDev = process.env.NODE_ENV !== "production";
const isReplit = process.env.REPL_ID !== undefined;

// Configure Monaco loader
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.50.0/min/vs'
  }
});

export default defineConfig({
  // ... rest of config
});
```

### 2. Update LessonViewer.tsx to Handle Loading States

Add loading state and error handling:

```typescript
import Editor, { loader } from "@monaco-editor/react";

// Configure Monaco to use CDN
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.50.0/min/vs'
  }
});

// In component:
const [editorReady, setEditorReady] = useState(false);
const [editorError, setEditorError] = useState<string | null>(null);

const handleEditorMount = (editor: any, monaco: any) => {
  setEditorReady(true);
  setEditorError(null);
};

const handleEditorError = (error: any) => {
  console.error("Monaco Editor Error:", error);
  setEditorError(error?.message || "Failed to load editor");
};

// In JSX:
<Editor
  height="100%"
  defaultLanguage={lesson.language?.toLowerCase()}
  theme="vs-dark"
  value={code}
  onChange={(val: string | undefined) => setCode(val || "")}
  onMount={handleEditorMount}
  onError={handleEditorError}
  loading={
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
        <p className="text-sm text-muted-foreground">Loading editor...</p>
      </div>
    </div>
  }
  options={{
    minimap: { enabled: false },
    fontSize: 14,
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    lineHeight: 1.6,
    padding: { top: 16, bottom: 16 },
  }}
/>
```

### 3. Fix Service Worker Cache Issues

Update `public/sw.js` to exclude Monaco assets from cache:

```javascript
const CACHE_NAME = 'svk-academy-v1';
const MONACO_URLS = [
  'https://cdn.jsdelivr.net/npm/monaco-editor',
  'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor'
];

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip Monaco CDN URLs
  if (MONACO_URLS.some(monacoUrl => url.href.includes(monacoUrl))) {
    return event.respondWith(fetch(request));
  }

  // ... rest of service worker logic
});
```

### 4. Add Fallback Editor

If Monaco fails to load, use a simple textarea fallback:

```typescript
{editorError ? (
  <Card className="border-red-500/50">
    <CardHeader className="p-4 bg-red-500/10 border-b border-red-500/20">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-red-500" />
        <span className="text-sm text-red-400">{editorError}</span>
      </div>
    </CardHeader>
    <CardContent className="p-4">
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-[300px] p-4 bg-[#1e1e1e] text-green-400 font-mono text-sm border border-border rounded resize-none"
        placeholder="// Write your code here..."
      />
    </CardContent>
  </Card>
) : (
  <Editor {...editorProps} />
)}
```

## Testing Checklist

- [ ] Monaco Editor loads without "Loading..." state
- [ ] Code can be edited in the editor
- [ ] Run button executes code successfully
- [ ] All languages (Python, JavaScript, HTML, CSS, etc.) work
- [ ] Service worker doesn't cache Monaco assets
- [ ] Fallback textarea appears if Monaco fails
- [ ] No console errors related to Monaco

## Deployment

1. Update Vite config with Monaco loader configuration
2. Update LessonViewer.tsx with error handling
3. Update service worker to exclude Monaco URLs
4. Rebuild and deploy

```bash
pnpm --filter @workspace/academy run build
```

