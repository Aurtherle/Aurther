let timeout = 60000
let poin = 500
let handler = async (m, { conn, command, usedPrefix }) => {
    conn.tebaklagu = conn.tebaklagu ? conn.tebaklagu : {}
    let id = m.chat
    if (id in conn.tebaklagu) {
        conn.reply(m.chat, '*صبر ما تشوف فيه سؤال ؟*', conn.tebaklagu[id][0])
        throw false
    }
    let src = await (await fetch('https://raw.githubusercontent.com/Aurtherle/Games/main/.github/workflows/Flags.json')).json()
  let json = src[Math.floor(Math.random() * src.length)]
    let caption = `*❃ ──────⊰ ❀ ⊱────── ❃*\n*ماهي الدولة ؟؟*\n
  *الوقت :* *${(timeout / 1000).toFixed(2)}* *ثانية*
   *الجائزة :* *${poin}* *بيلي*
*❃ ──────⊰ ❀ ⊱────── ❃*
     `.trim()
    conn.tebaklagu[id] = [
        await conn.sendFile(m.chat, json.img, '', caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.tebaklagu[id]) conn.reply(m.chat, `*❃ ──────⊰ ❀ ⊱────── ❃*\n*خلص الوقت*\n*الجواب :* *( ${json.name} )*\n*❃ ──────⊰ ❀ ⊱────── ❃*`, conn.tebaklagu[id][0])
            delete conn.tebaklagu[id]
        }, timeout)
    ]
}
handler.help = ['guessflag']
handler.tags = ['game']
handler.command = /^علم/i

export default handler
