export async function clearAllCookiesAndCache(): Promise<{ success: boolean; clearedItems: string[] }> {
  const clearedItems: string[] = [];

  // 1. Clear LocalStorage
  try {
    localStorage.clear();
    clearedItems.push("LocalStorage");
  } catch (e) {
    console.warn("Could not clear localStorage:", e);
  }

  // 2. Clear SessionStorage
  try {
    sessionStorage.clear();
    clearedItems.push("SessionStorage");
  } catch (e) {
    console.warn("Could not clear sessionStorage:", e);
  }

  // 3. Clear Cookies
  try {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
      if (name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      }
    }
    clearedItems.push("Browser Cookies");
  } catch (e) {
    console.warn("Could not clear cookies:", e);
  }

  // 4. Clear Cache Storage (Cache API)
  try {
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
      clearedItems.push(`Cache Storage (${cacheNames.length} items)`);
    }
  } catch (e) {
    console.warn("Could not clear CacheStorage:", e);
  }

  // 5. Clear IndexedDB
  try {
    if (window.indexedDB && typeof window.indexedDB.databases === "function") {
      const dbs = await window.indexedDB.databases();
      for (const db of dbs) {
        if (db.name) {
          window.indexedDB.deleteDatabase(db.name);
        }
      }
      clearedItems.push(`IndexedDB (${dbs.length} DBs)`);
    }
  } catch (e) {
    console.warn("Could not clear IndexedDB:", e);
  }

  // 6. Unregister Service Workers
  try {
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
      if (registrations.length > 0) {
        clearedItems.push(`Service Workers (${registrations.length})`);
      }
    }
  } catch (e) {
    console.warn("Could not unregister Service Workers:", e);
  }

  // 7. Call backend clear-cache API to send Clear-Site-Data header
  try {
    await fetch("/api/clear-cache", { method: "POST" });
    clearedItems.push("Server Clear-Site-Data Header");
  } catch (e) {
    console.warn("Could not call /api/clear-cache endpoint:", e);
  }

  return { success: true, clearedItems };
}
