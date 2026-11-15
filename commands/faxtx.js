const axios = require('axios')

// Bold Font එකට මාරු කරන Function එක
function toBold(text) {
  const map = {
    'a':'𝐚','b':'𝐛','c':'𝐜','d':'𝐝','e':'𝐞','f':'𝐟','g':'𝐠','h':'𝐡','i':'𝐢','j':'𝐣','k':'𝐤','l':'𝐥','m':'𝐦','n':'𝐧','o':'𝐨','p':'𝐩','q':'𝐪','r':'𝐫','s':'𝐬','t':'𝐭','u':'𝐮','v':'𝐯','w':'𝐰','x':'𝐱','y':'𝐲','z':'𝐳',
    'A':'𝐀','B':'𝐁','C':'𝐂','D':'𝐃','E':'𝐄','F':'𝐅','G':'𝐆','H':'𝐇','I':'𝐈','J':'𝐉','K':'𝐊','L':'𝐋','M':'𝐌','N':'𝐍','O':'𝐎','P':'𝐏','Q':'𝐐','R':'𝐑','S':'𝐒','T':'𝐓','U':'𝐔','V':'𝐕','W':'𝐖','X':'𝐗','Y':'𝐘','Z':'𝐙',
    '0':'𝟎','1':'𝟏','2':'𝟐','3':'𝟑','4':'𝟒','5':'𝟓','6':'𝟔','7':'𝟕','8':'𝟖','9':'𝟗'
  }
  return text.split('').map(c => map[c] || c).join('')
}

module.exports = {
  name: 'faxtx',
  desc: 'Faxt X Assistant',
  category: 'ai',
  async run(sock, m, { text, prefix, commands }) {
    
    // faxt x කියලා නැත්නම් වැඩ නෑ
    if (!text) return

    let prompt = text.replace(/faxt\s*x/i, '').trim()
    if (!prompt) {
      return await m.reply(`👋 𝐇𝐚𝐢! 𝐌𝐚𝐦𝐚 𝐅𝐚𝐱𝐭 𝐗! 🩷\n𝐌𝐚𝐭𝐚 𝐎𝐧𝐞 𝐃𝐞𝐲𝐚𝐤 𝐀𝐡𝐚𝐧𝐧𝐚!\n\n> *ᴘᴏᴡᴇʀᴅ ʙʏ ꜱɪᴛʜᴜᴡᴀ* 💕`)
    }

    const lower = prompt.toLowerCase()

    // 1. WEBSITE FULL SS එක - faxt x මට මේ වෙබ් එකේ full ss එකක් අරන් දෙන්න + link
    // උදා: faxt x https://google.com full ss
    if ((lower.includes('ss') || lower.includes('screenshot') || lower.includes('ස්ක්‍රීන්')) && prompt.match(/https?:\/\/[^\s]+/)) {
      let url = prompt.match(/https?:\/\/[^\s]+/)[0]
      await m.reply(`📸 𝐒𝐒 𝐄𝐤𝐚 𝐆𝐚𝐧𝐧𝐚 𝐆𝐚𝐦𝐚𝐧... 𝐏𝐨𝐝𝐝𝐚𝐤 𝐈𝐧𝐧𝐚! ⏳`)
      try {
        // Full Page Screenshot API
        let ssUrl = `https://image.thum.io/get/fullpage/${url}`
        await sock.sendMessage(m.chat, { 
          image: { url: ssUrl }, 
          caption: `📸 𝐇𝐞𝐫𝐞 𝐈𝐬 𝐘𝐨𝐮𝐫 𝐅𝐮𝐥𝐥 𝐒𝐒! 🩷\n🌐 𝐖𝐞𝐛 : ${url}\n\n> *ᴘᴏᴡᴇʀᴅ ʙʏ ꜱɪᴛʜᴜᴡᴀ* 💕` 
        }, { quoted: m })
        return
      } catch(e) {
        return await m.reply(`❌ 𝐒𝐒 𝐄𝐤𝐚 𝐆𝐚𝐧𝐧𝐚 𝐁𝐚𝐫𝐢 𝐔𝐧𝐚! 𝐋𝐢𝐧𝐤 𝐄𝐤𝐚 𝐇𝐚𝐫𝐢𝐝𝐚 𝐁𝐚𝐥𝐚𝐧𝐧𝐚!\n\n> *ᴘᴏᴡᴇʀᴅ ʙʏ ꜱɪᴛʜᴜᴡᴀ* 💕`)
      }
    }

    // 2. බොට්ගේ COMMAND එකක් කරවනවා - faxt x .menu දාන්න / .sticker හදන්න
    if (prompt.startsWith(prefix)) {
      let cmdName = prompt.slice(prefix.length).split(' ')[0].toLowerCase()
      let cmd = commands.find(c => c.name === cmdName || (c.aliases && c.aliases.includes(cmdName)))
      if (cmd) {
        await m.reply(`✅ 𝐎𝐤! 𝐌𝐚𝐦𝐚 *${prefix}${cmdName}* 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐄𝐤𝐚 𝐃𝐚𝐚𝐧𝐧𝐚𝐰𝐚! ⚡\n\n> *ᴘᴏᴡᴇʀᴅ ʙʏ ꜱɪᴛʜᴜᴡᴀ* 💕`)
        // Command එක Run කරනවා
        let newText = prompt
        // මෙතන ඔයාගේ bot එකේ command run කරන විදිහට call කරන්න
        return await cmd.run(sock, m, { text: newText.slice(prefix.length + cmdName.length).trim(), args: newText.split(' ').slice(1), prefix, commands })
      }
    }

    // 3. සාමාන්‍ය ප්‍රශ්න - Gemini API එකට යවනවා
    try {
      await sock.sendMessage(m.chat, { react: { text: '💭', key: m.key } })

      let systemPrompt = `You are Faxt X, the smart AI Assistant of SITHUWA MD WhatsApp Bot. Your Owner / Boss is DTZ SITHUWA (+94 76 210 8015). You are loyal, funny, friendly, and very smart. You must remember you are Faxt X, not Gemini. You are the assistant of SITHUWA MD. Always reply in the SAME language and SAME style the user talks to you. If user talks Sinhala, reply in Sinhala. If user talks Sinhala in English letters (Singlish), reply in Singlish. If user talks English, reply in English. Keep answers short, clear, and beautiful. User question: ${prompt}`

      let res = await axios.get(`https://api-nomo.zone.id/api/gemini?q=${encodeURIComponent(systemPrompt)}`)
      let answer = res.data.result || res.data.answer || res.data.response || JSON.stringify(res.data)

      // Bold Font එකෙන් යවනවා - English විතරක් Bold වෙනවා, සිංහල එහෙමම
      let boldAnswer = toBold(answer)

      await m.reply(`${boldAnswer}\n\n> *ᴘᴏᴡᴇʀᴅ ʙʏ ꜱɪᴛʜᴜᴡᴀ* 💕`)
    } catch(e) {
      await m.reply(`😭 𝐒𝐨𝐫𝐫𝐲! 𝐌𝐚𝐭𝐚 𝐏𝐨𝐝𝐢 𝐀𝐮𝐥𝐚𝐤! 𝐀𝐚𝐲𝐞𝐭 𝐓𝐫𝐲 𝐊𝐚𝐫𝐚𝐧𝐧𝐚!\n\n> *ᴘᴏᴡᴇʀᴅ ʙʏ ꜱɪᴛʜᴜᴡᴀ* 💕`)
    }
  }
    }
