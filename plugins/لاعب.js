let timeout = 60000
let poin = 500
let handler = async (m, { conn, command, usedPrefix }) => {
    conn.lokaibo = conn.lokaibo ? conn.lokaibo : {}
    let id = m.chat
    if (id in conn.lokaibo) {
        conn.reply(m.chat, '*صبر ما تشوف فيه سؤال ؟*', conn.lokaibo[id][0])
        throw false
    }
    let src = await (await fetch('https://raw.githubusercontent.com/Aurtherle/Games/main/.github/workflows/Footballguess.json')).json()
  let json = src[Math.floor(Math.random() * src.length)]
    let caption = `*❃ ──────⊰ ❀ ⊱────── ❃*\n*من اللاعب ؟؟*\n
  *الوقت :* *${(timeout / 1000).toFixed(2)}* *ثانية*
   *الجائزة :* *${poin}* *بيلي*
*❃ ──────⊰ ❀ ⊱────── ❃*
     `.trim()
    conn.lokaibo[id] = [
        await conn.sendFile(m.chat, json.img, '', caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.lokaibo[id]) conn.reply(m.chat, `*❃ ──────⊰ ❀ ⊱────── ❃*\n*خلص الوقت*\n*الجواب :* *( ${json.name} )*\n*❃ ──────⊰ ❀ ⊱────── ❃*`, conn.lokaibo[id][0])
            delete conn.lokaibo[id]
        }, timeout)
    ]
}
handler.help = ['guessflag']
handler.tags = ['game']
handler.command = /^لاعب/i

export default handler
