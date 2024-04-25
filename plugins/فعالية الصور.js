let timeout = 60000
let poin = 500
let handler = async (m, { conn, command, usedPrefix }) => {
    conn.tebakbendera = conn.tebakbendera ? conn.tebakbendera : {}
    let id = m.chat
    if (id in conn.tebakbendera) {
        conn.reply(m.chat, '*صبر ما تشوف فيه سؤال ؟*', conn.tebakbendera[id][0])
        throw false
    }
    let src = await (await fetch('https://raw.githubusercontent.com/Aurtherle/Games/main/.github/workflows/guessanime.json')).json()
  let json = src[Math.floor(Math.random() * src.length)]
    let caption = `*❃ ──────⊰ ❀ ⊱────── ❃*\n*من الشخصية ؟؟*\n
  *الوقت :* *${(timeout / 1000).toFixed(2)}* *ثانية*
   *الجائزة :* *${poin}* *بيلي*
   استخدم انسحب للإنسحاب
*❃ ──────⊰ ❀ ⊱────── ❃*
     `.trim()
    conn.tebakbendera[id] = [
        await conn.sendFile(m.chat, json.img, '', caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.tebakbendera[id]) conn.reply(m.chat, `*❃ ──────⊰ ❀ ⊱────── ❃*\n*خلص الوقت*\n*الجواب :* *(${json.name})*\n*❃ ──────⊰ ❀ ⊱────── ❃*`, conn.tebakbendera[id][0])
            delete conn.tebakbendera[id]
        }, timeout)
    ]
}
handler.help = ['guessanime']
handler.tags = ['game']
handler.command = /^شش/i

export default handler
