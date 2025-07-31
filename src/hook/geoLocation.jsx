import { useState, useEffect } from "react";

const useGeoLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("مرورگر از Geolocation پشتیبانی نمی‌کند.");
      return;
    }

    const onSuccess = (position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    };

    const onError = (error) => {
      setError("دریافت موقعیت مکانی با خطا مواجه شد.");
      console.error(error);
    };

    const watcherId = navigator.geolocation.watchPosition(onSuccess, onError);

    return () => {
      navigator.geolocation.clearWatch(watcherId);
    };
  }, []);

  return { location, error };
};

export default useGeoLocation;
