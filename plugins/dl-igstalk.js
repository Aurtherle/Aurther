
import fg from 'api-dylux'
let handler= async (m, { conn, args, text, usedPrefix, command }) => {
	
    if (!args[0]) throw `جيب يوز انستا\n\nمثال : ${usedPrefix + command} أي يوزر تبيه` 
    let res = await fg.igStalk(args[0])
    let te = `
*❃ ──────⊰ ❀ ⊱────── ❃*
◍ *الأسم :* ${res.name} 
◍ *اليوزر :* ${res.username}
◍ *المتابعين :* ${res.followersH}
◍ *يتابع :* ${res.followingH}
◍ *البايو :* ${res.description}
◍ *البوستات:* ${res.postsH}

▢ *🔗 الرابط* : https://instagram.com/${res.username.replace(/^@/, '')}
*❃ ──────⊰ ❀ ⊱────── ❃*`

     await conn.sendFile(m.chat, res.profilePic, 'tt.png', te, m)
     
}
handler.help = ['igstalk']
handler.tags = ['downloader']
handler.command = ['انستجرام'] 

export default handler
