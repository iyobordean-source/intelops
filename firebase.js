// firebase.js — CDN compat version (no npm needed)

const firebaseConfig = {
  apiKey: "AIzaSyBPE9fFoyu4srRSTb3wRLNGNRXhz3D34ls",
  authDomain: "intelops-d7aa8.firebaseapp.com",
  projectId: "intelops-d7aa8",
  storageBucket: "intelops-d7aa8.firebasestorage.app",
  messagingSenderId: "553576810441",
  appId: "1:553576810441:web:a2f1842bffc25211ed8a18"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ── SAVE PLAYER ──
async function savePlayer(playerID, data) {
  try {
    await db.collection("players").doc(playerID).set(data, { merge: true });
    console.log("Player saved:", playerID);
  } catch (error) {
    console.error("Error saving player:", error);
  }
}

// ── GET PLAYER BY ID ──
async function getPlayerByID(playerID) {
  try {
    const snapshot = await db.collection("players").doc(playerID).get();
    if (snapshot.exists) return snapshot.data();
    return null;
  } catch (error) {
    console.error("Error fetching player:", error);
    return null;
  }
}

// ── GET PLAYER BY USERNAME ──
async function getPlayerByUsername(username) {
  try {
    const cleanName = username.toLowerCase().trim();
    const lookup = await db.collection("usernameLookup").doc(cleanName).get();
    if (lookup.exists) {
      const playerID = lookup.data().playerID;
      return await getPlayerByID(playerID);
    }
    return null;
  } catch (error) {
    console.error("Error in username lookup:", error);
    return null;
  }
}

// ── SAVE USERNAME LOOKUP ──
async function saveUsernameLookup(username, playerID) {
  try {
    const cleanName = username.toLowerCase().trim();
    await db.collection("usernameLookup").doc(cleanName).set({
      playerID,
      addedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error("Error saving lookup:", error);
  }
}

// ── CHECK CACHE FRESHNESS ──
function isCacheFresh(lastUpdated) {
  if (!lastUpdated) return false;
  const oneHour = 60 * 60 * 1000;
  const now = Date.now();
  const updated = lastUpdated.toMillis ? lastUpdated.toMillis() : lastUpdated;
  return (now - updated) < oneHour;
}