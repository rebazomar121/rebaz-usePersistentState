# How to Fix the AsyncStorage Error

## The Issue

The error occurs because AsyncStorage isn't being properly imported when the package is used. This happens when the package is bundled.

## Solution 1: Quick Fix for Users

Users need to make sure they have AsyncStorage installed:

```bash
npm install @react-native-async-storage/async-storage
```

## Solution 2: Update Your Package

Update your package with the fixed code that handles AsyncStorage imports better:

### Step 1: Update the source code

Replace your `src/index.ts` with the fixed version above that:

- Uses dynamic imports for AsyncStorage
- Checks if AsyncStorage is available before using it
- Provides better error messages

### Step 2: Update version and publish

```bash
# Update to version 1.0.2
cd rebaz-use-persistent-state
npm version patch

# Build and publish
npm run build
npm publish
```

### Step 3: Update documentation

Update your README.md to include clear installation instructions:

````markdown
# Installation

Make sure you have the peer dependencies installed:

```bash
npm install rebaz-use-persistent-state @react-native-async-storage/async-storage
```
````

## Platform Support

This hook is designed for React Native applications and requires AsyncStorage to function.

## Error Handling

If you see the error "AsyncStorage.setItem is not a function", make sure you have installed the AsyncStorage package:

```bash
npm install @react-native-async-storage/async-storage
```

````

### Step 4: Add to package.json
Add a postinstall script to check for dependencies:

```json
{
  "scripts": {
    "postinstall": "node -e \"try { require('@react-native-async-storage/async-storage'); } catch (e) { console.warn('Warning: @react-native-async-storage/async-storage is required for rebaz-use-persistent-state to work properly'); }\""
  }
}
````

## Solution 3: Alternative Approach

If you want to make the package more universal, you can create a conditional wrapper:

```typescript
// src/index.ts
import { useState, useEffect, useCallback } from 'react';

// Platform detection
const isReactNative =
  typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

// Storage adapter
const storage = {
  getItem: async (key: string) => {
    if (isReactNative) {
      const AsyncStorage =
        require('@react-native-async-storage/async-storage').default;
      return AsyncStorage.getItem(key);
    }
    // Web fallback
    return localStorage.getItem(key);
  },
  setItem: async (key: string, value: string) => {
    if (isReactNative) {
      const AsyncStorage =
        require('@react-native-async-storage/async-storage').default;
      return AsyncStorage.setItem(key, value);
    }
    // Web fallback
    return localStorage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    if (isReactNative) {
      const AsyncStorage =
        require('@react-native-async-storage/async-storage').default;
      return AsyncStorage.removeItem(key);
    }
    // Web fallback
    return localStorage.removeItem(key);
  },
};

// ... rest of your hook code using the storage adapter
```

## Quick Fix for Current Users

If users are experiencing this issue now, they can:

1. Make sure AsyncStorage is installed
2. Import it globally in their app:

```typescript
// At the top of your app entry file (index.js or App.js)
import AsyncStorage from '@react-native-async-storage/async-storage';
global.AsyncStorage = AsyncStorage;
```

3. Or use with legacy peer deps:

```bash
npm install rebaz-use-persistent-state --legacy-peer-deps
```