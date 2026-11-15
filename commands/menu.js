const fs = require('fs')
const path = require('path')
const os = require('os')
const config = require('../config')
const fn = require('../functions')
const { menuText, getTheme } = require('../style')
const categoryEmojis = {
  general: '✨',
  owner: '👑',
  group: '👥',
  download: '📥',
  convert: '🔄',
  media: '🎬',
  tools: '🛠️',
  fun: '😂',
  'global economy': '🌍',
  'local economy': '💰',
  ai: '🤖',
  developer: '👨‍💻',
  search: '🔍',
  info: 'ℹ️'
}
function groupByCategory(commands) {
  const groups = {}
  for (const cmd of commands) {
    const cat = (cmd.category || 'other').toLowerCase()
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(cmd)
  }
  return groups
}

function titleCase(value) {
  return String(value || '').replace(/\b\w/g, (c) => c.toUpperCase())
}

function getBotImage() {
    return { url: "https://res.cloudinary.com/p6lu5bpe/image/upload/v1794755001/hxvxutnifiohvlqiguac.jpg" }
    }

module.exports = {
  name: 'menu',
  aliases: ['help', 'list', 'gideon'],
  desc: 'Show bot sections, or .menu <section> for its commands (e.g. .menu economy)',
  category: 'general',
  async run(sock, m, { args, prefix, commands }) {
    const grouped = groupByCategory(commands)
  const stats = [
  '👑 𝐎𝐰𝐧𝐞𝐫 : 𝐃𝐓𝐙 𝐒𝐈𝐓𝐇𝐔𝐖𝐀 ❤️',
  '⚡ 𝐏𝐫𝐞𝐟𝐢𝐱 : ' + prefix,
  '⏳ 𝐔𝐩𝐭𝐢𝐦𝐞 : ' + fn.runtime(process.uptime()),
  '💾 𝐑𝐀𝐌 : ' + fn.formatSize(os.totalmem() - os.freemem()) + ' / ' + fn.formatSize(os.totalmem()),
  '📅 𝐓𝐢𝐦𝐞 : ' + fn.clockString(),
  '🤖 𝐕𝐞𝐫𝐬𝐢𝐨𝐧 : 𝐒𝐈𝐓𝐇𝐔𝐖𝐀 𝐕𝟏 🎀',
  '✨ 𝐌𝐚𝐝𝐞 𝐖𝐢𝐭𝐡 : 💖 𝐁𝐲 𝐃𝐓𝐙 𝐒𝐈𝐓𝐇𝐔𝐖𝐀'
]
    ]
    const order = ['general', 'owner', 'group', 'download', 'convert', 'media', 'tools', 'fun', 'global economy', 'local economy', 'ai', 'developer', 'search', 'other']
    const cats = [...new Set([...order, ...Object.keys(grouped)])].filter((cat) => grouped[cat]?.length)
    const query = (args[0] || '').toLowerCase()

    // .menu <section> : the full command list for just that one section
    if (query) {
      const cat = cats.find((c) => c === query) || cats.find((c) => c.startsWith(query))
      if (!cat) {
        return m.reply(`No section called "${args[0]}".\n\nSections: ${cats.map(titleCase).join(', ')}\nExample: ${prefix}menu ${cats.find((c) => c === 'local economy') || cats[0]}`)
      }
      const section = { name: titleCase(cat), cmds: grouped[cat].map((c) => c.name).sort((a, b) => a.localeCompare(b)) }
      const body = menuText({ title: `${String(config.botName || 'GIDEON').toUpperCase()} • ${titleCase(cat).toUpperCase()}`, stats, sections: [section], prefix })
      // mode: 'text' always, regardless of config.buttonMode - the menu is core navigation and
      // has to show up on every platform, so it never risks the native button trick (see
      // buttons.js: confirmed fine on Android, invisible on iOS).
      return sock.sendButtons(m.chat, body, { quoted: m._msg, image: getBotImage(), skipBox: true, mode: 'text' })
    }

    // .menu : just the section names, so the list isn't a long scroll
   const lines = [`╭─「 🌸 ${String(config.botName || 'SITHUWA').toUpperCase()} MD 🎀 」─`]
lines.push(`│ 👑 Owner : ${config.ownerName}`)
lines.push(`│ ⚡ Prefix : ${prefix}`)
lines.push(`│ 🕒 Uptime : ${fn.runtime(process.uptime())}`)
lines.push(`│ 💾 RAM : ${fn.formatSize(os.totalmem() - os.freemem())} / ${fn.formatSize(os.totalmem())}`)
lines.push(`│ 📅 Time : ${fn.clockString()}`)
lines.push(`╰───────────────`)
lines.push(``)
lines.push(`╭─「 📋 MAIN MENU 」─`)
for (const cat of cats) {
  let emoji = categoryEmojis[cat.toLowerCase()] || '📌'
  lines.push(`│ ${emoji} ${titleCase(cat)} (${grouped[cat].length})`)
}
lines.push(`╰───────────────`)
lines.push(``)
lines.push(`💡 Type ${prefix}menu <section> to see commands`)
lines.push(`📌 Example: ${prefix}menu fun`)
lines.push(`⚙️ Type ${prefix}settings for Settings!`) 
    await sock.sendButtons(m.chat, lines.join('\n'), { quoted: m._msg, image: getBotImage(), skipBox: true, mode: 'text' })
  }
}
