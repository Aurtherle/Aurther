let handler = async (m, { conn, participants, usedPrefix, command, args }) => {
  let kickte = `*مــنشـن الـشـخص !*`

  // Check if the command format is ".kick <days> @user"
  if (!m.mentionedJid[0] && !m.quoted && args.length < 2) {
    return m.reply(kickte, m.chat, { mentions: conn.parseMention(kickte)})
  }

  let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
  let owr = m.chat.split`-`[0]

  // Extract the number of days from the command arguments
  let days = args[0]
  if (!days || isNaN(days) || days.length > 1) {
    return m.reply('*كم مدة زيارته ؟!*')
  }

  // Calculate the kick date by adding the specified number of days to the current date
  let kickTime = new Date()
  kickTime.setDate(kickTime.getDate() + parseInt(days)) // Kick after the specified number of days

  // Calculate the time 3 seconds before the kick time
  let notifyTime = new Date(kickTime.getTime() - 3000)

  // Schedule the notification 3 seconds before kicking
  setTimeout(() => {
    conn.sendMessage(user, `*أنتهت زيارتك سررنا بك معمسلامه*`, 'conversation')
      .catch(console.error)
  }, notifyTime - Date.now())

  // Schedule the kick action using setTimeout
  setTimeout(async () => {
    try {
      await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
      m.reply(`*انتهت زيارته*`)
    } catch (error) {
      console.error(error)
    }
  }, kickTime - Date.now()) // Calculate the delay in milliseconds

  // Update user properties for kick time and scheduled kick
  let userData = global.db.data.users[user];
  if (userData) {
    userData.kickTime = kickTime.getTime();
    userData.scheduledKick = true;
  }

  m.reply(`*سوف تنتهي زيارته بعد ${days} ايام*`)

}

handler.help = ['kick @user <days>']
handler.tags = ['group']
handler.command = ['زيارة', 'زياره'] 
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler
