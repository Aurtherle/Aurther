import similarity from 'similarity'
const threshold = 0.72
export async function before(m) {
    let id = m.chat
    if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !m.text || !/ماهي.*الدولة/i.test(m.quoted.text) || /.*hhint/i.test(m.text))
        return !0
    this.tebaklagu = this.tebaklagu ? this.tebaklagu : {}
    if (!(id in this.tebaklagu))
        return this.reply(m.chat, '*خلصت*', m)
    if (m.quoted.id == this.tebaklagu[id][0].id) {
        let isSurrender = /^(انسحب|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            clearTimeout(this.tebaklagu[id][3])
            delete this.tebaklagu[id]
            return this.reply(m.chat, '*ماااش مافي مستوى*', m)
        }
        let json = JSON.parse(JSON.stringify(this.tebaklagu[id][1]))

        if (m.text.toLowerCase() == json.name.toLowerCase().trim()) {
            global.db.data.users[m.sender].exp += this.tebaklagu[id][2]
            this.reply(m.chat, `*❃ ──────⊰ ❀ ⊱────── ❃*\n*❀ شوكولولو ❀*\n\n*◍ الجائزة :* *${this.tebaklagu[id][2]}* *بيلي*\n*❃ ──────⊰ ❀ ⊱────── ❃*`, m)
            clearTimeout(this.tebaklagu[id][3])
            delete this.tebaklagu[id]
        } else if (similarity(m.text.toLowerCase(), json.name.toLowerCase().trim()) >= threshold)
            m.reply(`*اوخخ قربتت*`)
        else
            this.reply(m.chat, `*نااه*`, m)
    }
    return !0
}
export const exp = 0