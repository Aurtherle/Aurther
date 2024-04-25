import { canLevelUp, xpRange } from '../lib/levelling.js'

let handler = async (m, { conn }) => {
let { role } = global.db.data.users[m.sender]
let name = conn.getName(m.sender)
 let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let pp = await conn.profilePictureUrl(who, 'image').catch(_ => './Menu2.jpg')
let user = global.db.data.users[m.sender]
    if (!canLevelUp(user.level, user.exp, global.multiplier)) {
        let { min, xp, max } = xpRange(user.level, global.multiplier)
      let lvl = `*❃ ──────⊰ ❀ ⊱────── ❃*
◍ *الأسم :*  *${name}*
◍ *المستوى :*  *${user.level}*
◍ *الخبرة :* *${user.exp - min}/${xp}*
◍ *التصنيف :* *${user.role}*
*❃ ──────⊰ ❀ ⊱────── ❃*

*مرحبا* *${name}* *لايمكنك الترقي حاليا انت تحتاج الى* *${max - user.exp}* *للصعود للمستوى التالي*
`
conn.sendFile(m.chat, pp, 'levelup.jpg', lvl, m)
    }

    let before = user.level * 1
    while (canLevelUp(user.level, user.exp, global.multiplier)) user.level++
    if (before !== user.level) {
        let teks = `تست ${conn.getName(m.sender)} المستوى: ${user.level}`
        let str = `
*❃ ──────⊰ ❀ ⊱────── ❃*
◍ *المستوى السابق :* *${user.level - 1}*
◍ *المستوى الحالي :* *${user.level}*
◍ *التصنيف :* *${user.role}*
*❃ ──────⊰ ❀ ⊱────── ❃*
`
          .trim()
        try {
            const img = await levelup(teks, user.level)
            conn.sendFile(m.chat, pp, 'levelup.jpg', str, m)
        } catch (e) {
            m.reply(str)
        }
    }
await delay(5 * 5000)  
}
handler.help = ['levelup']
handler.tags = ['xp']

handler.command = ['nivel', 'lvl', 'لفل'] 

export default handler
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
