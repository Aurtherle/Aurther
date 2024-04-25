import { createHash } from 'crypto';

let handler = async (m, { conn, text, args, groupMetadata, usedPrefix, command }) => {      
    let who = m.quoted ? m.quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;

    if (!(who in global.db.data.users)) throw `المستخدم غير موجود في قاعدة البيانات`;

    let user = global.db.data.users[who];

    if (user.registered === true) throw `*لقد تم تسجيله بالفعل*`;

    let name = '';

    if (m.mentionedJid && m.mentionedJid.length > 0 && text.trim().split(' ').length > 1) {
        // Get the name written after the mention
        name = text.trim().split(' ').slice(1).join(' '); // Extract the name after mention
    } else {
        let Reg = /^\s*([^]*)\s*$/;
        if (!Reg.test(text)) throw `*المثال الصحيح: ${usedPrefix}تسجيل اسمك*`;

        let [_, enteredName] = text.match(Reg);
        if (!enteredName) throw '*أكتب الاسم*';
        if (enteredName.length >= 30) throw '*الاسم طويل*';

        name = enteredName.trim();
    }

    const isNameTaken = Object.values(global.db.data.users).some(existingUser => {
        if (typeof existingUser.name === 'string') {
            return existingUser.name.toLowerCase() === name.toLowerCase();
        }
        return false;
    });

    if (isNameTaken) {
        throw '*الاسم مستخدم بالفعل*';
    }

    user.name = name;
    user.regTime = +new Date();
    user.registered = true;

    let sn = createHash('md5').update(who).digest('hex').slice(0, 21);

    m.reply(`*❃ ──────⊰ ❀ ⊱────── ❃*
◍ *تم تسجيلك في قاعدة البيانات*
*❃ ──────⊰ ❀ ⊱────── ❃*
◍ *الاسم:* *${name}*
◍ *الايدي:* *${sn}*
*❃ ──────⊰ ❀ ⊱────── ❃*
`.trim());
};

// ... rest of the code remains unchanged

handler.help = ['reg'].map(v => v + ' <الاسم>');
handler.tags = ['rg'];
handler.command = ['تسجيل', 'اشتراك', 'register', 'registrar']; 
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
handler.fail = null;

export default handler;
