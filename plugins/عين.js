let timeout = 60000
let poin = 500
let handler = async (m, { conn, command, usedPrefix }) => {
    conn.tokitoki = conn.tokitoki ? conn.tokitoki : {}
    let id = m.chat
    if (id in conn.tokitoki) {
        conn.reply(m.chat, '*صبر ما تشوف فيه سؤال ؟*', conn.tokitoki[id][0])
        throw false
    }
    let src = await (await fetch('https://raw.githubusercontent.com/Aurtherle/Games/main/.github/workflows/eyeanime.json')).json()
  let json = src[Math.floor(Math.random() * src.length)]
    let caption = `*❃ ──────⊰ ❀ ⊱────── ❃*\n*عين من ؟؟*\n
  *الوقت :* *${(timeout / 1000).toFixed(2)}* *ثانية*
   *الجائزة :* *${poin}* *بيلي*
*❃ ──────⊰ ❀ ⊱────── ❃*
     `.trim()
    conn.tokitoki[id] = [
        await conn.sendFile(m.chat, json.img, '', caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.tokitoki[id]) conn.reply(m.chat, `*❃ ──────⊰ ❀ ⊱────── ❃*\n*خلص الوقت*\n*الجواب :* *( ${json.name} )*\n*❃ ──────⊰ ❀ ⊱────── ❃*`, conn.tokitoki[id][0])
            delete conn.tokitoki[id]
        }, timeout)
    ]
}
handler.help = ['guesseye']
handler.tags = ['game']
handler.command = /^ع|عين/i

export default handler
