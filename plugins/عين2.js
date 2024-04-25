import similarity from 'similarity'
const threshold = 0.72
export async function before(m) {
    let id = m.chat
    if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !m.text || !/عين.*من/i.test(m.quoted.text) || /.*hhint/i.test(m.text))
        return !0
    this.tokitoki = this.tokitoki ? this.tokitoki : {}
    if (!(id in this.tokitoki))
        return this.reply(m.chat, '*خلصت*', m)
    if (m.quoted.id == this.tokitoki[id][0].id) {
        let isSurrender = /^(انسحب|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            clearTimeout(this.tokitoki[id][3])
            delete this.tokitoki[id]
            return this.reply(m.chat, '*ماااش مافي مستوى*', m)
        }
        let json = JSON.parse(JSON.stringify(this.tokitoki[id][1]))

        if (m.text.toLowerCase() == json.name.toLowerCase().trim()) {
            global.db.data.users[m.sender].exp += this.tokitoki[id][2]
            this.reply(m.chat, `*❃ ──────⊰ ❀ ⊱────── ❃*\n*❀ شوكولولو ❀*\n\n*◍ الجائزة :* *${this.tokitoki[id][2]}* *بيلي*\n*❃ ──────⊰ ❀ ⊱────── ❃*`, m)
            clearTimeout(this.tokitoki[id][3])
            delete this.tokitoki[id]
        } else if (similarity(m.text.toLowerCase(), json.name.toLowerCase().trim()) >= threshold)
            m.reply(`*اوخخ قربتت*`)
        else
            this.reply(m.chat, `*نااه*`, m)
    }
    return !0
}
export const exp = 0