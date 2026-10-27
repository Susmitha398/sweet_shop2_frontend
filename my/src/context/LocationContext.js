import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const AVAILABLE_LOCATIONS = [
  { name: 'T. Nagar, Chennai', lat: 13.0418, lng: 80.2341, state: 'Tamil Nadu' },
  { name: 'Mylapore, Chennai', lat: 13.0336, lng: 80.2678, state: 'Tamil Nadu' },
  { name: 'Anna Nagar, Chennai', lat: 13.0850, lng: 80.2101, state: 'Tamil Nadu' },
  { name: 'RS Puram, Coimbatore', lat: 11.0084, lng: 76.9525, state: 'Tamil Nadu' },
  { name: 'Meenakshi Amman Area, Madurai', lat: 9.9195, lng: 78.1194, state: 'Tamil Nadu' },
  { name: 'Town Depot, Tirunelveli', lat: 8.7139, lng: 77.7567, state: 'Tamil Nadu' },
  { name: 'Koramangala, Bangalore', lat: 12.9352, lng: 77.6245, state: 'Karnataka' },
  { name: 'Banjara Hills, Hyderabad', lat: 17.4156, lng: 78.4350, state: 'Telangana' }
];

export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 2.5;
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.max(0.8, Math.round(d * 10) / 10);
};

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(() => {
    const saved = localStorage.getItem('royal_user_location');
    return saved ? JSON.parse(saved) : AVAILABLE_LOCATIONS[0];
  });
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('royal_user_location', JSON.stringify(currentLocation));
  }, [currentLocation]);

  const selectLocation = (loc) => {
    setCurrentLocation(loc);
    setIsLocationModalOpen(false);
  };

  const detectLiveLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const liveLoc = {
          name: 'Your Current GPS Location',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          isGps: true
        };
        setCurrentLocation(liveLoc);
        setIsDetectingGps(false);
        setIsLocationModalOpen(false);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setIsDetectingGps(false);
        alert('Could not retrieve GPS. Using default location.');
      },
      { timeout: 8000 }
    );
  };

  const getDistanceToShop = (shopCoords, baseDistance = 2.5) => {
    if (!shopCoords || !shopCoords.lat || !shopCoords.lng) {
      return baseDistance;
    }
    return calculateDistanceKm(currentLocation.lat, currentLocation.lng, shopCoords.lat, shopCoords.lng);
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        selectLocation,
        detectLiveLocation,
        isDetectingGps,
        isLocationModalOpen,
        setIsLocationModalOpen,
        getDistanceToShop,
        availableLocations: AVAILABLE_LOCATIONS
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
