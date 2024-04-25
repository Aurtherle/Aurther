let handler = async function (m, { conn, text, usedPrefix }) {
  // Check if the message has a mentioned user
  let targetUser = m.quoted ? m.quoted.sender : (m.mentionedJid && m.mentionedJid[0]);

  // If no mentioned user, extract the name to unregister
  if (!targetUser) {
    let name = text.trim();

    // Check if the user exists in the database
    targetUser = Object.keys(global.db.data.users).find(
      id => global.db.data.users[id].name &&
        typeof global.db.data.users[id].name === 'string' &&
        global.db.data.users[id].name.toLowerCase() === name.toLowerCase()
    );

    if (!targetUser) {
      throw `*أكتب اللقب الي تبيه ينحذف أو قم بعمل منشن للشخص*`;
    }
  }

  // Unregister the user
  global.db.data.users[targetUser].registered = false;
  global.db.data.users[targetUser].name = ''; // Clear the name
  global.db.data.users[targetUser].regTime = 0; // Reset registration time

  // Respond with a confirmation
  m.reply(`*تست اللقب صار متوفر*`);
};

// Rest of the handler definition (help, tags, command, etc.) remains the same

handler.help = ['unreg'].map(v => v + ' <الأسم>')
handler.tags = ['rg']
handler.command = ['ازاله', 'ازالة', 'unregister', 'unregistrar'] 
handler.group = true
handler.admin = true
handler.botAdmin = true
handler.fail = null

export default handler
