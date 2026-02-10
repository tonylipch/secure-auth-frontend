import { useEffect, useState } from "react";

export default function useTypewriter(profile) {
  const [typedProfile, setTypedProfile] = useState({
    email: "",
    firstName: "",
    lastName: "",
    roles: "",
    twoFactor: ""
  });

  useEffect(() => {
    if (!profile) return;

    const full = {
      email: profile.email || "",
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      roles: (profile.roles || []).join(", "),
      twoFactor: profile.twoFactorEnabled ? "Enabled" : "Disabled"
    };

    setTypedProfile({
      email: "",
      firstName: "",
      lastName: "",
      roles: "",
      twoFactor: ""
    });

    const keys = Object.keys(full);
    let keyIndex = 0;
    let charIndex = 0;
    const interval = setInterval(() => {
      const key = keys[keyIndex];
      const value = full[key];
      if (charIndex <= value.length) {
        setTypedProfile((prev) => ({
          ...prev,
          [key]: value.slice(0, charIndex)
        }));
        charIndex += 1;
      } else {
        keyIndex += 1;
        charIndex = 0;
        if (keyIndex >= keys.length) {
          clearInterval(interval);
        }
      }
    }, 18);

    return () => clearInterval(interval);
  }, [profile]);

  return typedProfile;
}
