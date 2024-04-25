
import fg from 'api-dylux'
let handler = async (m, { conn, text, args }) => {
	
  if (!text) throw `عطني يوز المستخدم الي بتبحث عليه`
  let res = await fg.ttStalk(args[0])
  let txt = `
*❃ ──────⊰ ❀ ⊱────── ❃*
◍ *الأسم :* ${res.name} 
◍ *اليوزر :* ${res.username}
◍ *المتابعين :* ${res.followers}
◍ *يتابع :* ${res.following}
◍ *الوصف :* ${res.desc}

▢ *🔗 الرابط* : https://tiktok.com/${res.username}
*❃ ──────⊰ ❀ ⊱────── ❃*`

  await conn.sendFile(m.chat, res.profile, 'tt.png', txt, m)
}
handler.help = ['tiktokstalk']
handler.tags = ['downloader']
handler.command = /^تيكتوك$/i

export default handler
