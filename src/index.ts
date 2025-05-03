// src/index.ts
import { useState, useEffect, useCallback } from 'react';

// Dynamic import for AsyncStorage to handle different environments
let AsyncStorage: any = null;

try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (error) {
  console.warn(
    'AsyncStorage not available - you need to install @react-native-async-storage/async-storage'
  );
}

interface ImageData {
  uri: string;
  temp_uri?: {
    md?: { signedUrl: string };
    signedUrl?: string;
  };
  _id?: string;
  width?: number;
  height?: number;
  fileSize?: number;
  fileName?: string;
  type?: string;
}

export function usePersistentState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(initialValue);

  // Check if AsyncStorage is available
  useEffect(() => {
    if (!AsyncStorage) {
      console.error(
        'AsyncStorage is not available. Please install @react-native-async-storage/async-storage'
      );
    }
  }, []);

  // Function to clear the stored data
  const clearData = useCallback(async () => {
    if (!AsyncStorage) {
      console.error('AsyncStorage is not available');
      return false;
    }

    try {
      // Clear AsyncStorage
      await AsyncStorage.removeItem(key);

      // Clear current state by setting it to initialValue
      if (typeof initialValue === 'object' && initialValue !== null) {
        setState({ ...initialValue });
      } else {
        setState(initialValue);
      }

      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }, [key, initialValue]);

  // Load data when component mounts
  useEffect(() => {
    const loadData = async () => {
      if (!AsyncStorage) {
        return;
      }

      try {
        const savedData = await AsyncStorage.getItem(key);
        if (savedData) {
          const parsedData = JSON.parse(savedData);

          // Handle image data restoration
          if (parsedData.pictures && Array.isArray(parsedData.pictures)) {
            parsedData.pictures = parsedData.pictures.map((pic: any) => {
              // If it's already a full image object with temp_uri, return it as is
              if (typeof pic === 'object' && pic.uri && pic.temp_uri) {
                return pic;
              }

              // If it's a string URI, create a basic image object
              if (typeof pic === 'string') {
                return {
                  uri: pic,
                  temp_uri: { md: { signedUrl: pic } },
                };
              }

              // If it's a partial object, ensure it has the required properties
              if (typeof pic === 'object' && pic.uri) {
                return {
                  ...pic,
                  temp_uri: pic.temp_uri || {
                    md: { signedUrl: pic.uri },
                    signedUrl: pic.uri,
                  },
                };
              }

              return pic;
            });
          }

          setState(parsedData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, [key]);

  // Save data whenever it changes
  useEffect(() => {
    const saveData = async () => {
      if (!AsyncStorage) {
        return;
      }

      try {
        // Create a copy of the state to modify
        const dataToSave = { ...state } as any;

        // Handle image data serialization
        if (dataToSave.pictures && Array.isArray(dataToSave.pictures)) {
          dataToSave.pictures = dataToSave.pictures.map((pic: any) => {
            if (typeof pic === 'object') {
              // Ensure we have all necessary image metadata
              const imageData: ImageData = {
                uri: pic.uri,
                temp_uri: pic.temp_uri || {
                  md: { signedUrl: pic.uri },
                  signedUrl: pic.uri,
                },
                _id: pic._id,
                width: pic.width,
                height: pic.height,
                fileSize: pic.fileSize,
                fileName: pic.fileName,
                type: pic.type,
              };

              // If we have a temp_uri structure, ensure it's properly formatted
              if (pic.temp_uri) {
                imageData.temp_uri = {
                  md: pic.temp_uri.md || { signedUrl: pic.uri },
                  signedUrl: pic.temp_uri.signedUrl || pic.uri,
                };
              }

              return imageData;
            }
            return pic;
          });
        }

        await AsyncStorage.setItem(key, JSON.stringify(dataToSave));
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };
    saveData();
  }, [key, state]);

  // Return state, setState, and clearData
  return [state, setState, clearData] as const;
}

export default usePersistentState;
