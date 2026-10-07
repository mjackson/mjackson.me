import type { Handle, RemixNode } from 'remix/component'

import { inlineLinkStyle } from './theme.ts'

/** Renders a string, turning Markdown-style `[text](url)` into links. */
export function InlineLinks(handle: Handle<{ text: string }>) {
  return () => {
    let nodes: RemixNode[] = []
    let pattern = /\[([^\]]+)\]\(([^)\s]+)\)/g
    let lastIndex = 0

    for (let match of handle.props.text.matchAll(pattern)) {
      nodes.push(handle.props.text.slice(lastIndex, match.index))
      nodes.push(
        <a key={match.index} href={match[2]} mix={inlineLinkStyle}>
          {match[1]}
        </a>,
      )
      lastIndex = match.index + match[0].length
    }

    nodes.push(handle.props.text.slice(lastIndex))
    return nodes
  }
}
