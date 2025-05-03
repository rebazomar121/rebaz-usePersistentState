  # use-persistent-state

  A React hook for persistent state management with AsyncStorage support, particularly useful for React Native applications.

  ## Installation

  ```bash
  npm install use-persistent-state
  # or
  yarn add use-persistent-state
  # or
  pnpm add use-persistent-state
  ```

  ## Usage

  ```typescript
  import { usePersistentState } from 'use-persistent-state';

  function MyComponent() {
    const [userData, setUserData, clearUserData] = usePersistentState(
      'user-data-key',
      {
        phoneNumber: '',
        whatsAppNumber: '',
        currency: 'iqd',
      }
    );

    // Use the state like normal React state
    const updatePhone = () => {
      setUserData(prev => ({
        ...prev,
        phoneNumber: '+123456789'
      }));
    };

    // Clear all stored data
    const clearData = async () => {
      const success = await clearUserData();
      if (success) {
        console.log('Data cleared successfully');
      }
    };

    return (
      <div>
        <p>Phone: {userData.phoneNumber}</p>
        <button onClick={updatePhone}>Update Phone</button>
        <button onClick={clearData}>Clear Data</button>
      </div>
    );
  }
  ```
  
  ## API
  
  ### `usePersistentState(key, initialValue)`
  
  #### Parameters
  
  - `key`: string - The key to store data in AsyncStorage
  - `initialValue`: T - The initial value for the state
  
  #### Returns
  
  Returns an array with three elements:
  1. `state`: T - The current state value
  2. `setState`: React.Dispatch<React.SetStateAction<T>> - Function to update the state
  3. `clearData`: () => Promise<boolean> - Function to clear the stored data
  
  ## Features
  
  - **Persistent Storage**: Automatically syncs state with AsyncStorage
  - **Image Handling**: Special handling for image data with URI objects
  - **Type Safe**: Full TypeScript support
  - **Simple API**: Works just like useState with persistence
  
  ## Requirements
  
  - React 16.8+ (for hooks support)
  - @react-native-async-storage/async-storage
  
  ## License
  
  MIT
  
  ## Contributing
  
  Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
  