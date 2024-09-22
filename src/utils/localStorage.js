// localStorage.js

export const saveStateToLocalStorage = (state) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('allTripsState', serializedState);
    } catch (err) {
      console.error("Could not save state:", err);
    }
  };
  
  export const loadStateFromLocalStorage = () => {
    try {
      const serializedState = localStorage.getItem('allTripsState');
      return serializedState ? JSON.parse(serializedState) : undefined;
    } catch (err) {
      console.error("Could not load state:", err);
      return undefined;
    }
  };
  