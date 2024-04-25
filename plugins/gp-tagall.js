let handler = async (m, { conn, participants }) => {
  // Check if the message is from the desired group
  if (m.chat.endsWith('120363237210868792@g.us')) {
    // Header text for the mention message
    let teks = "*❃ ──────⊰ ❀ ⊱────── ❃* \n\n *مـنشــــــن عـــــــــام لأعــــــضاء ومشرفـــين*\n *『♠️Ɲσʀтɦ ‹⛩️› Uƙʏō♠️』*\n *المنشن خاص للمشرفين نتأسف على الازعاج* \n\n";
    teks += "*❃ ──────⊰ ⚠️ ⊱────── ❃*\n\n"; // Add your custom text here

    // Sort participants based on names
    participants.sort((a, b) => {
      let userA = global.db.data.users[a.id] || { registered: false, name: "غير مسجل ⚠️" };
      let userB = global.db.data.users[b.id] || { registered: false, name: "غير مسجل ⚠️" };
      return userA.name.localeCompare(userB.name, 'ar', { sensitivity: 'base' });
    });

    let currentLetter = '';

    // Unregister users who are not in the participants list
    Object.keys(global.db.data.users).forEach(userId => {
      const user = global.db.data.users[userId];
      const isInParticipants = participants.some(mem => mem.id === userId);

      if (user.registered && !isInParticipants) {
        // Unregister the user
        user.registered = false;
        user.name = ''; // Clear the name
        user.regTime = 0; // Reset registration time
      }
    });

    // Loop through participants and create the mention message
    for (let mem of participants) {
      let user = global.db.data.users[mem.id] || { registered: false, name: "غير مسجل ⚠️" };
      let firstLetter = user.name.charAt(0);

      if (firstLetter !== currentLetter) {
        // Start a new section for the current letter
        teks += `*❃ ──────⊰ ${firstLetter} ⊱────── ❃*\n\n`;
        currentLetter = firstLetter;
      }

      // Add user information to the mention message
      teks += `◍ ${user.registered ? user.name : "غير مسجل ⚠️"} @${mem.id.split('@')[0]}\n\n`;
    }

    teks += "*❃ ──────⊰ ❀ ⊱────── ❃*";

    // Send the mention message to the group
    conn.sendMessage(m.chat, { text: teks, mentions: participants.map(a => a.id) });
  }
}

// Command properties
handler.help = ['mentionall'];
handler.tags = ['group'];
handler.command = /^منشن$/i;
handler.group = true;
handler.admin = true;

// Export the handler function
export default handler;
