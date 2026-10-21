export const externalAvailable = (now, unavailableUntil) => now >= unavailableUntil;
export const externalCooldown = (now) => now + 60000;