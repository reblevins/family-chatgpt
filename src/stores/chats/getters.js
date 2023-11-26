import { Marked } from 'marked'
import { markedHighlight } from "marked-highlight"
import hljs from 'highlight.js'
// import vue from 'highlight.js/lib/languages/vue'

// hljs.registerLanguage('vue', vue)

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      lang = (lang === 'vue') ? 'html' : lang
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return `<div class='language-label text-grey-lighten-3 bg-grey-darken-3'>${lang}</div>` + hljs.highlight(code, { language }).value;
    }
  })
)

function currentChatMessages() {

  if (!this.currentChat) {
    return []
  }
  const messages = this.currentChat.messages.map((message) => {
    const content = {}
    content.role = message.role
    if (message.content[0]?.type === 'image_url') {
      content.url = message.content[0].image_url.url
    } else if (message.role === 'user') {
      content.text = message.content[0]?.text
    } else if (message.role === 'system' && message.content[0].text) {
      content.text = marked.parse(message.content[0].text)
    }
    return content
  })
  messages.shift()
  return messages
}

export default {
  currentChatMessages,
}