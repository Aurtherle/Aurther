
import fs from 'fs';
import os from 'os';
import fetch from 'node-fetch';

let limit = 500;
let handler = async (m, { conn, args, isPrems, isOwner, usedPrefix, command }) => {
  let chat = global.db.data.chats[m.chat];
  if (!args || !args[0]) throw `رابط فيد اليوتيوب الي تبي تحمله`;
  if (!args[0].match(/youtu/gi)) throw `مب رابط يوتيوب ذا`;
  
  var gapi = `${gurubot}/v1/ytmp4?url=${encodeURIComponent(args)}`

  var ggapi = `${gurubot}/ytplay?url=${encodeURIComponent(args)}`

  const response = await fetch(ggapi);
  if (!response.ok) {
      console.log('فشل البحث:', response.statusText);
      throw 'فشل البحث';
  }
  const data = await response.json();

  const caption = `✼ ••๑⋯❀ يوتيوب ❀⋯⋅๑•• ✼
	  
  ❏ العنوان: ${data.result.title}
  ❏ القناة: ${data.result.channel}
  ❐ المدة: ${data.result.seconds} seconds
  ❑ المشاهدات: ${data.result.view}
  ❒ التحميل: ${data.result.publicDate}
  ❒ الرابط: ${args[0]}
  
  ⊱─━⊱༻●༺⊰━─⊰`


  let vid = await fetch(gapi)
  const vidBuffer = await vid.buffer();

  conn.sendFile(
    m.chat,
    vidBuffer,
    `error.mp4`,
    caption,
    m,
    false,
    { asDocument: chat.useDocument }
  );
     
};

handler.help = ['ytmp4 <yt-link>'];
handler.tags = ['downloader'];
handler.command = ['يوتيوب', 'video', 'ytv'];
handler.diamond = false;

export default handler;

