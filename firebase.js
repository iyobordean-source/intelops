// firebase.js

// ── FIREBASE CONFIG ──
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "intelops-xxxx.firebaseapp.com",
  projectId: "intelops-xxxx",
  storageBucket: "intelops-xxxx.firebasestorage.app",
  messagingSenderId: "xxxxxxxxxxxx",
  appId: "your-app-id"
};

// ── INITIALIZE ──
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ── SAVE PLAYER TO FIREBASE ──
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
    const doc = await db.collection("players").doc(playerID).get();
    if (doc.exists) {
      return doc.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching player:", error);
    return null;
  }
}

// ── GET PLAYER BY USERNAME (lookup table) ──
async function getPlayerByUsername(username) {
  try {
    const cleanName = username.toLowerCase().trim();

    // Check lookup table first
    const lookup = await db.collection("usernameLookup")
      .doc(cleanName).get();

    if (lookup.exists) {
      const playerID = lookup.data().playerID;
      // Now get full player data using ID
      return await getPlayerByID(playerID);
    }

    // Not found in lookup
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
      playerID: playerID,
      addedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error("Error saving lookup:", error);
  }
}

// ── CHECK IF CACHE IS FRESH ──
function isCacheFresh(lastUpdated) {
  if (!lastUpdated) return false;
  const oneHour = 60 * 60 * 1000;
  const now = Date.now();
  const updated = lastUpdated.toMillis ? lastUpdated.toMillis() : lastUpdated;
  return (now - updated) < oneHour;
}