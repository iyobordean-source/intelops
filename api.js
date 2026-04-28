// api.js — TrackerGG API handler

const TRACKER_API_KEY = "b2fc8a75-425e-4b67-a712-106c3cc3a2a0";

// ── FETCH PLAYER STATS ──
async function fetchPlayerStats(username) {
  const encodedUsername = encodeURIComponent(username);
  const url = `https://public-api.tracker.gg/v2/cod-mobile/standard/profile/atvi/${encodedUsername}`;

  try {
    const response = await fetch(url, {
      headers: {
        "TRN-Api-Key": TRACKER_API_KEY
      }
    });

    if (response.status === 404) {
      console.log("Player not found");
      return null;
    }

    if (!response.ok) {
      console.error("API error:", response.status);
      return null;
    }

    const data = await response.json();
    return parsePlayerData(data);

  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
}

// ── PARSE THE RESPONSE INTO CLEAN DATA ──
function parsePlayerData(raw) {
  const overview = raw?.data?.segments?.[0]?.stats;

  if (!overview) return null;

  return {
    username: raw.data.platformInfo.platformUserHandle,
    kd: overview.kdRatio?.displayValue || "N/A",
    kills: overview.kills?.displayValue || "N/A",
    deaths: overview.deaths?.displayValue || "N/A",
    wins: overview.wins?.displayValue || "N/A",
    winRate: overview.wlRatio?.displayValue || "N/A",
    matches: overview.matchesPlayed?.displayValue || "N/A",
    headshotRate: overview.headshotRatio?.displayValue || "N/A",
    damage: overview.damagePerMatch?.displayValue || "N/A",
    rank: overview.rankName?.displayValue || "UNKNOWN",
    lastUpdated: Date.now()
  };
}