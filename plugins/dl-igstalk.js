import fg from 'api-dylux'

// Handler function to fetch and display Instagram profile details
let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  // Check if a username is provided
  if (!args[0])
    throw `✳️ Enter the Instagram Username\n\n📌Example: ${usedPrefix + command} asli_guru69`

  // Fetch Instagram profile details
  let res;
  try {
    res = await fg.igStalk(args[0])
  } catch (error) {
    throw `❌ Failed to fetch Instagram profile: ${error.message}`
  }

  // Ensure the response contains the necessary data
  if (!res || !res.username) {
    throw `❌ No data found for the username: ${args[0]}`
  }

  // Format the details into a message
  let te = `
┌──「 *STALKING* 
▢ *🔖Name:* ${res.name || 'N/A'} 
▢ *🔖Username:* ${res.username || 'N/A'}
▢ *👥 Followers:* ${res.followersH || 'N/A'}
▢ *🫂 Following:* ${res.followingH || 'N/A'}
▢ *📌 Bio:* ${res.description || 'N/A'}
▢ *🏝️ Posts:* ${res.postsH || 'N/A'}

▢ *🔗 Link* : https://instagram.com/${res.username.replace(/^@/, '')}
└────────────`

  // Send the profile picture and formatted details to the chat
  await conn.sendFile(m.chat, res.profilePic, 'tt.png', te, m)
}

// Command help and tags
handler.help = ['igstalk']
handler.tags = ['downloader']
handler.command = ['igstalk']

export default handler
