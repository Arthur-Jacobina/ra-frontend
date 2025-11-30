import React, { useState } from 'react'
import { InlineMath, BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import { FaIcon } from '@/atomic/atm.fa-icon/fa-icon.component'

interface LatexRendererProps {
  content: string
  className?: string
}

interface TextSegment {
  type: 'text' | 'inline-math' | 'block-math' | 'heading' | 'emphasis' | 'strong' | 'table'
  content: string
  level?: number
  rows?: string[][]
  sectionId?: string
}

interface Section {
  id: string
  heading: TextSegment
  content: TextSegment[]
  subsections: Section[]
}

function preprocessLatex(text: string): string {
  let processed = text
  
  // Remove LaTeX labels (they're just for cross-referencing)
  processed = processed.replace(/\\label\{[^}]*\}/g, '')
  
  // Helper function to extract balanced braces content
  function extractBalancedBraces(text: string, startPos: number): string {
    let depth = 0
    let start = -1
    let result = ''
    
    for (let i = startPos; i < text.length; i++) {
      if (text[i] === '{') {
        if (depth === 0) start = i + 1
        depth++
      } else if (text[i] === '}') {
        depth--
        if (depth === 0) {
          result = text.substring(start, i)
          break
        }
      }
    }
    
    return result
  }
  
  // Convert subsections to HTML-like markers - handle nested commands properly
  const sectionTypes = [
    { cmd: '\\\\section', level: '##' },
    { cmd: '\\\\subsection', level: '###' },
    { cmd: '\\\\subsubsection', level: '####' }
  ]
  
  for (const { cmd, level } of sectionTypes) {
    const regex = new RegExp(cmd + '\\{', 'g')
    let match: RegExpExecArray | null
    let lastIndex = 0
    let result = ''
    
    while ((match = regex.exec(processed)) !== null) {
      // Add text before this match
      result += processed.substring(lastIndex, match.index)
      
      // Extract the balanced braces content
      const content = extractBalancedBraces(processed, match.index + match[0].length - 1)
      
      // Process formatting within the heading
      let heading = content
        .replace(/\\textbf\{([^}]*)\}/g, '**$1**')
        .replace(/\\textit\{([^}]*)\}/g, '*$1*')
        .replace(/\\text\{([^}]*)\}/g, '$1')
        .replace(/\n/g, ' ') // Replace newlines with spaces in headings
        .trim()
      
      result += `\n${level} ${heading}\n`
      
      // Update lastIndex to skip past this section
      lastIndex = match.index + match[0].length + content.length + 1
    }
    
    // Add remaining text
    result += processed.substring(lastIndex)
    processed = result
  }
  
  // Handle text formatting commands in regular text (not in headings anymore)
  processed = processed.replace(/\\textit\{([^}]*)\}/g, '*$1*')
  processed = processed.replace(/\\textbf\{([^}]*)\}/g, '**$1**')
  processed = processed.replace(/\\text\{([^}]*)\}/g, ' $1 ')
  
  // Handle textcolor - strip color but keep text
  processed = processed.replace(/\\textcolor\{[^}]*\}\{([^}]*)\}/g, '$1')
  
  // Handle footnotes - convert to parenthetical
  processed = processed.replace(/\\footnote\{([^}]*)\}/g, ' ($1)')
  
  // Remove figure environments but keep captions
  processed = processed.replace(/\\begin\{figure\}(?:\[.*?\])?([\s\S]*?)\\end\{figure\}/g, (_match, content) => {
    // Extract caption if present
    const captionMatch = content.match(/\\caption\{([^}]*)\}/)
    if (captionMatch) {
      return `\n*Figure: ${captionMatch[1]}*\n`
    }
    return ''
  })
  
  // Remove TikZ pictures entirely (can't render in browser without complex setup)
  processed = processed.replace(/\\begin\{tikzpicture\}[\s\S]*?\\end\{tikzpicture\}/g, '[Diagram]')
  
  // Handle enumerate/itemize environments
  processed = processed.replace(/\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g, (_match, content) => {
    // Convert \item to numbered list
    const items = content.split(/\\item\s+/).filter((item: string) => item.trim())
    return '\n' + items.map((item: string, i: number) => `${i + 1}. ${item.trim()}`).join('\n') + '\n'
  })
  
  processed = processed.replace(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g, (_match, content) => {
    // Convert \item to bullet list
    const items = content.split(/\\item\s+/).filter((item: string) => item.trim())
    return '\n' + items.map((item: string) => `• ${item.trim()}`).join('\n') + '\n'
  })
  
  // Handle table* and table environments - extract caption and content
  processed = processed.replace(/\\begin\{table\*?\}(?:\[.*?\])?([\s\S]*?)\\end\{table\*?\}/g, (_match, content) => {
    // Extract caption if present
    const captionMatch = content.match(/\\caption\{([^}]*)\}/)
    const caption = captionMatch ? captionMatch[1] : ''
    
    // Extract tabular content
    const tabularMatch = content.match(/\\begin\{tabular\}(?:\{[^}]*\})?([\s\S]*?)\\end\{tabular\}/g)
    
    if (tabularMatch) {
      // Process the first tabular found
      let tableContent = tabularMatch[0]
        .replace(/\\begin\{tabular\}(?:\{[^}]*\})?/, '')
        .replace(/\\end\{tabular\}/, '')
        .replace(/\\hline/g, '')
        .replace(/\\resizebox\{[^}]*\}\{[^}]*\}\{/g, '')
        .replace(/\[.*?\]/g, '') // Remove options like [0.5ex]
        .trim()
      
      // Split into rows and format as table
      const rows = tableContent.split(/\\\\/).filter((r: string) => r.trim())
      let tableHtml = '\n\n**Table' + (caption ? `: ${caption}` : '') + '**\n\n'
      
      rows.forEach((row: string, i: number) => {
        const cells = row.split('&').map((c: string) => c.trim())
        if (cells.length > 1) {
          tableHtml += '| ' + cells.join(' | ') + ' |\n'
          if (i === 0) {
            // Add separator after header
            tableHtml += '| ' + cells.map(() => '---').join(' | ') + ' |\n'
          }
        }
      })
      
      return tableHtml + '\n'
    }
    
    return caption ? `\n**Table: ${caption}**\n` : ''
  })
  
  // Handle standalone tabular (not in table environment)
  processed = processed.replace(/\\begin\{tabular\}(?:\{[^}]*\})?([\s\S]*?)\\end\{tabular\}/g, (_match, content) => {
    const cleaned = content
      .replace(/\\hline/g, '')
      .replace(/\\\\/g, '\n')
      .replace(/&/g, ' | ')
    return `\n[Table]\n${cleaned}\n`
  })
  
  // Remove centering commands
  processed = processed.replace(/\\centering\s*/g, '')
  
  // Remove vspace, hspace
  processed = processed.replace(/\\[vh]space\{[^}]*\}/g, ' ')
  
  // Fix matrices - ensure they have proper line breaks
  // This needs to happen before general \\ replacement
  processed = processed.replace(/\\begin\{(pmatrix|bmatrix|vmatrix|matrix)\}([\s\S]*?)\\end\{\1\}/g, (_match, matrixType, content) => {
    // Check if content has \\ for line breaks, if not, add them
    let matrixContent = content.trim()
    
    // If there are no \\ but there are multiple lines, assume each line is a row
    if (!matrixContent.includes('\\\\') && matrixContent.includes('\n')) {
      const lines = matrixContent.split('\n').filter((l: string) => l.trim())
      matrixContent = lines.join(' \\\\\n')
    }
    
    // Ensure it's wrapped in $$ if not already
    return `\\begin{${matrixType}}\n${matrixContent}\n\\end{${matrixType}}`
  })
  
  // Handle newlines (but not within math environments which we already processed)
  processed = processed.replace(/\\\\\s*/g, '\n')
  
  // Clean up excessive newlines
  processed = processed.replace(/\n{3,}/g, '\n\n')
  
  return processed
}

function parseLatex(text: string): TextSegment[] {
  const segments: TextSegment[] = []
  
  // Preprocess to fix common issues
  text = preprocessLatex(text)
  
  // Split by lines to handle headings
  const lines = text.split('\n')
  
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    
    // Check for markdown-style headings
    const headingMatch = line.match(/^(#{2,4})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const headingContent = headingMatch[2]
      
      segments.push({
        type: 'heading',
        content: headingContent,
        level: level,
      })
      i++
      continue
    }
    
    // Check for markdown-style tables (| ... | format)
    if (line.trim().startsWith('|')) {
      const tableRows: string[][] = []
      let j = i
      
      // Collect all consecutive table rows
      while (j < lines.length && lines[j].trim().startsWith('|')) {
        const row = lines[j]
          .trim()
          .split('|')
          .filter(cell => cell.trim())
          .map(cell => cell.trim())
        
        // Skip separator rows (--- format)
        if (row.length > 0 && !row[0].match(/^-+$/)) {
          tableRows.push(row)
        }
        j++
      }
      
      if (tableRows.length > 0) {
        segments.push({
          type: 'table',
          content: '',
          rows: tableRows
        })
      }
      
      i = j
      continue
    }
    
    // Process the line for math and text
    const lineSegments = parseLineForMath(line)
    segments.push(...lineSegments)
    
    // Add newline after each line
    if (line.trim()) {
      segments.push({ type: 'text', content: '\n' })
    }
    
    i++
  }
  
  return segments
}

function parseLineForMath(text: string): TextSegment[] {
  const segments: TextSegment[] = []
  let currentPos = 0
  
  // First, handle escaped dollar signs by temporarily replacing them
  const ESCAPED_DOLLAR_PLACEHOLDER = '\u0000DOLLAR\u0000'
  let textWithPlaceholders = text.replace(/\\\$/g, ESCAPED_DOLLAR_PLACEHOLDER)
  
  // Pattern to match $$...$$ (block) or $...$ (inline)
  // Use non-greedy matching and ensure we don't match escaped dollars
  const mathSegments: { start: number; end: number; type: 'block' | 'inline'; content: string }[] = []
  
  // Find block math first ($$...$$)
  // More lenient - allow anything between $$...$$ including newlines
  const blockMathRegex = /\$\$([\s\S]*?)\$\$/g
  let match: RegExpExecArray | null
  
  while ((match = blockMathRegex.exec(textWithPlaceholders)) !== null) {
    const content = match[1].replace(new RegExp(ESCAPED_DOLLAR_PLACEHOLDER, 'g'), '$')
    
    // Skip if empty or only whitespace
    if (content.trim()) {
      mathSegments.push({
        start: match.index,
        end: match.index + match[0].length,
        type: 'block',
        content: content.trim()
      })
    }
  }
  
  // Find inline math ($...$) but not $$ or escaped \$
  // More conservative - must have actual content and not span multiple lines
  const inlineMathRegex = /\$([^\n\$]+?)\$/g
  
  while ((match = inlineMathRegex.exec(textWithPlaceholders)) !== null) {
    // Check if this position is already covered by a block math
    const isInBlockMath = mathSegments.some(
      seg => seg.type === 'block' && match!.index >= seg.start && match!.index < seg.end
    )
    
    if (!isInBlockMath) {
      const content = match[1].replace(new RegExp(ESCAPED_DOLLAR_PLACEHOLDER, 'g'), '$')
      
      // More strict validation:
      // 1. Must contain at least one letter or backslash (LaTeX command)
      // 2. If it contains underscore or caret, should have adjacent alphanumeric
      // 3. Not just numbers or special chars
      const hasLatexCommand = /\\[a-zA-Z]+/.test(content)
      const hasSubscriptSuperscript = /[a-zA-Z0-9]_[a-zA-Z0-9{]|[a-zA-Z0-9]\^[a-zA-Z0-9{]/.test(content)
      const hasGreekOrSymbol = /[α-ωΑ-Ω]/.test(content)
      const isSimpleVariable = /^[a-zA-Z]$/.test(content.trim())
      const isMathExpression = /^[a-zA-Z0-9_^{}\s+\-*/=()<>|]+$/.test(content) && /[a-zA-Z]/.test(content)
      
      // Only treat as math if it meets one of these criteria
      if (hasLatexCommand || hasSubscriptSuperscript || hasGreekOrSymbol || isSimpleVariable || 
          (isMathExpression && content.length <= 50)) {
        mathSegments.push({
          start: match.index,
          end: match.index + match[0].length,
          type: 'inline',
          content: content.trim()
        })
      }
    }
  }
  
  // Sort segments by start position
  mathSegments.sort((a, b) => a.start - b.start)
  
  // Build the segments array
  mathSegments.forEach(mathSeg => {
    // Add text before math
    if (currentPos < mathSeg.start) {
      const textContent = textWithPlaceholders.substring(currentPos, mathSeg.start)
      if (textContent) {
        // Restore escaped dollars in text
        const restoredText = textContent.replace(new RegExp(ESCAPED_DOLLAR_PLACEHOLDER, 'g'), '$')
        segments.push({ type: 'text', content: restoredText })
      }
    }
    
    // Add math segment
    segments.push({
      type: mathSeg.type === 'block' ? 'block-math' : 'inline-math',
      content: mathSeg.content
    })
    
    currentPos = mathSeg.end
  })
  
  // Add remaining text
  if (currentPos < textWithPlaceholders.length) {
    const textContent = textWithPlaceholders.substring(currentPos)
    if (textContent) {
      // Restore escaped dollars in text
      const restoredText = textContent.replace(new RegExp(ESCAPED_DOLLAR_PLACEHOLDER, 'g'), '$')
      segments.push({ type: 'text', content: restoredText })
    }
  }
  
  return segments
}

function SafeInlineMath({ math }: { math: string }) {
  try {
    return <InlineMath math={math} errorColor="#dc2626" />
  } catch (error) {
    console.warn('Failed to render inline math:', math, error)
    // Show as code-like text instead of red, to blend better
    return (
      <code 
        className="text-neutral-medium bg-neutral-xxsoft px-xs rounded text-sm" 
        title={`LaTeX parsing error: ${String(error)}`}
      >
        ${math}$
      </code>
    )
  }
}

function SafeBlockMath({ math }: { math: string }) {
  try {
    return (
      <div className="my-md">
        <BlockMath math={math} errorColor="#dc2626" />
      </div>
    )
  } catch (error) {
    console.warn('Failed to render block math:', math, error)
    return (
      <pre 
        className="my-md text-neutral-medium bg-neutral-xxsoft p-sm rounded text-sm overflow-x-auto" 
        title={`LaTeX parsing error: ${String(error)}`}
      >
        $${math}$$
      </pre>
    )
  }
}

function renderHeadingContent(content: string, index: number) {
  // Parse and render math and formatting within heading
  // Split by both math ($...$) and formatting (**...**  or *...*)
  // Process math first, then formatting
  const segments: Array<{ type: 'text' | 'math' | 'bold' | 'italic', content: string }> = []
  let remaining = content
  
  // Extract all math expressions first
  const mathRegex = /\$([^\n\$]+?)\$/g
  let match: RegExpExecArray | null
  let lastPos = 0
  
  while ((match = mathRegex.exec(remaining)) !== null) {
    // Add text before math
    if (match.index > lastPos) {
      segments.push({ type: 'text', content: remaining.substring(lastPos, match.index) })
    }
    
    // Add math
    segments.push({ type: 'math', content: match[1] })
    lastPos = match.index + match[0].length
  }
  
  // Add remaining text
  if (lastPos < remaining.length) {
    segments.push({ type: 'text', content: remaining.substring(lastPos) })
  }
  
  // Now process each text segment for bold/italic
  const processedSegments: Array<{ type: 'text' | 'math' | 'bold' | 'italic', content: string }> = []
  
  segments.forEach(seg => {
    if (seg.type === 'math') {
      processedSegments.push(seg)
    } else {
      // Process bold and italic in text
      const text = seg.content
      const formatRegex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g
      let textMatch: RegExpExecArray | null
      let textLastPos = 0
      
      while ((textMatch = formatRegex.exec(text)) !== null) {
        // Add text before formatted
        if (textMatch.index > textLastPos) {
          processedSegments.push({ type: 'text', content: text.substring(textLastPos, textMatch.index) })
        }
        
        // Add formatted
        if (textMatch[0].startsWith('**') && textMatch[0].endsWith('**')) {
          processedSegments.push({ type: 'bold', content: textMatch[0].slice(2, -2) })
        } else if (textMatch[0].startsWith('*') && textMatch[0].endsWith('*')) {
          processedSegments.push({ type: 'italic', content: textMatch[0].slice(1, -1) })
        }
        
        textLastPos = textMatch.index + textMatch[0].length
      }
      
      // Add remaining text
      if (textLastPos < text.length) {
        processedSegments.push({ type: 'text', content: text.substring(textLastPos) })
      }
    }
  })
  
  // Render all segments
  return processedSegments.map((seg, i) => {
    switch (seg.type) {
      case 'math':
        return <SafeInlineMath key={`${index}-${i}`} math={seg.content} />
      case 'bold':
        return <strong key={`${index}-${i}`}>{seg.content}</strong>
      case 'italic':
        return <em key={`${index}-${i}`}>{seg.content}</em>
      case 'text':
      default:
        return seg.content
    }
  })
}

function groupIntoSections(segments: TextSegment[]): Section[] {
  const sections: Section[] = []
  let currentSection: Section | null = null
  let currentContent: TextSegment[] = []
  let sectionCounter = 0
  
  for (const segment of segments) {
    if (segment.type === 'heading') {
      // Save previous section
      if (currentSection) {
        currentSection.content = currentContent
        sections.push(currentSection)
      }
      
      // Start new section
      sectionCounter++
      currentSection = {
        id: `section-${sectionCounter}`,
        heading: { ...segment, sectionId: `section-${sectionCounter}` },
        content: [],
        subsections: []
      }
      currentContent = []
    } else {
      // Add to current content
      currentContent.push(segment)
    }
  }
  
  // Add final section
  if (currentSection) {
    currentSection.content = currentContent
    sections.push(currentSection)
  } else if (currentContent.length > 0) {
    // Content before any heading
    sections.push({
      id: 'intro',
      heading: { type: 'heading', content: '', level: 3 },
      content: currentContent,
      subsections: []
    })
  }
  
  return sections
}

function CollapsibleSection({ 
  section, 
  renderSegment, 
  totalSections,
  showCollapseIcon 
}: { 
  section: Section, 
  renderSegment: (segment: TextSegment, index: number) => React.ReactNode,
  totalSections: number,
  showCollapseIcon?: boolean
}) {
  const [isContentVisible, setIsContentVisible] = useState(true)
  const [isGeneratingExplanation, setIsGeneratingExplanation] = useState(false)
  const [hasExplanation, setHasExplanation] = useState(false)
  const [explanation, setExplanation] = useState('')
  
  const level = section.heading.level || 3
  const hasHeadingContent = section.heading.content && section.heading.content.trim().length > 0
  
  // Only make subsections (level 3 and 4) collapsible
  const isCollapsible = level >= 3 && totalSections > 1 && hasHeadingContent && showCollapseIcon !== false
  
  if (!isCollapsible || !hasHeadingContent) {
    // Render non-collapsible sections normally
    return (
      <>
        {hasHeadingContent && renderSegment(section.heading, 0)}
        {section.content.map((segment, idx) => renderSegment(segment, idx + 1))}
      </>
    )
  }
  
  const handlePlusClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (hasExplanation) {
      // Toggle explanation visibility
      setHasExplanation(false)
      setExplanation('')
      return
    }
    
    // Simulate LLM generation
    setIsGeneratingExplanation(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock explanation (in production, this would call your LLM API)
    const mockExplanation = `This section provides a deeper explanation of ${section.heading.content}. It covers the key concepts, methodologies, and insights that are essential for understanding this topic in the context of the paper.`
    
    setExplanation(mockExplanation)
    setIsGeneratingExplanation(false)
    setHasExplanation(true)
  }
  
  const headingClass = level === 2 ? 'text-xl font-bold mt-0 mb-md' :
                      level === 3 ? 'text-lg font-semibold mt-0 mb-sm' :
                      'text-md font-medium mt-0 mb-xs'
  
  const headingContent = renderHeadingContent(section.heading.content, 0)
  
  return (
    <div className="collapsible-section mb-md">
      <div className="flex gap-x-md">
        {/* Plus button for LLM explanation */}
        <button
          onClick={handlePlusClick}
          className={`flex-shrink-0 flex hover:bg-neutral-soft items-center justify-center rounded-sm p-xs h-lg w-lg transition-all mt-0 ${
            hasExplanation ? 'bg-primary text-fixed-white' : 'bg-primary/20'
          }`}
          disabled={isGeneratingExplanation}
        >
          {isGeneratingExplanation ? (
            <FaIcon.LoaderSpinner className="text-neutral text-3xl animate-spin" />
          ) : (
            <FaIcon.Plus 
              className={`text-3xl transition-transform duration-300 ${
                hasExplanation ? 'text-fixed-white' : 'text-neutral'
              }`} 
              style={{ transform: hasExplanation ? 'rotate(deg)' : 'rotate(0deg)' }} 
            />
          )}
        </button>
        
        {/* Heading text - click to toggle original content */}
        <div className="flex-1 min-w-0">
          <div
            onClick={() => setIsContentVisible(!isContentVisible)}
            className={`${headingClass} cursor-pointer hover:text-primary transition-colors`}
          >
            {React.createElement(`h${level}`, { className: 'inline mt-0 pt-0' }, headingContent)}
          </div>
          
          {/* Original content */}
          {isContentVisible && (
            <div className="mt-sm">
              {section.content.map((segment, idx) => renderSegment(segment, idx + 1))}
            </div>
          )}
          
          {/* LLM-generated explanation */}
          {hasExplanation && (
            <div className="mt-md p-md bg-primary/5 border-l-4 border-primary rounded">
              <div className="text-sm font-semibold text-primary mb-xs">AI Explanation:</div>
              <div className="text-neutral-medium">{explanation}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function LatexRenderer({ content, className = '' }: LatexRendererProps) {
  const segments = parseLatex(content)
  const sections = groupIntoSections(segments)
  
  const renderSegment = (segment: TextSegment, index: number): React.ReactNode => {
    switch (segment.type) {
      case 'heading': {
        const level = segment.level || 3
        const headingClass = level === 2 ? 'text-xl font-bold mt-lg mb-md' :
                            level === 3 ? 'text-lg font-semibold mt-md mb-sm' :
                            'text-md font-medium mt-sm mb-xs'
        
        const headingContent = renderHeadingContent(segment.content, index)
        
        return React.createElement(
          `h${level}`,
          { key: index, className: headingClass },
          headingContent
        )
      }
      case 'table': {
        if (!segment.rows || segment.rows.length === 0) return null
        
        return (
          <div key={index} className="my-md overflow-x-auto">
            <table className="min-w-full border-collapse border border-neutral-soft">
              <thead>
                <tr className="bg-neutral-xxsoft">
                  {segment.rows[0].map((cell, cellIdx) => (
                    <th key={cellIdx} className="border border-neutral-soft px-sm py-xs text-left font-semibold">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {segment.rows.slice(1).map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-neutral-xxsoft">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="border border-neutral-soft px-sm py-xs">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
      case 'inline-math':
        return <SafeInlineMath key={index} math={segment.content} />
      case 'block-math':
        return <SafeBlockMath key={index} math={segment.content} />
      case 'text': {
        // Handle markdown-style emphasis and strong
        const processedText = segment.content
          .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/)
          .map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={`${index}-${i}`}>{part.slice(2, -2)}</strong>
            }
            if (part.startsWith('*') && part.endsWith('*')) {
              return <em key={`${index}-${i}`}>{part.slice(1, -1)}</em>
            }
            return part
          })
        return <span key={index}>{processedText}</span>
      }
      default:
        return null
    }
  }
  
  return (
    <div className={`${className} max-w-4xl`}>
      {sections.map((section) => (
        <CollapsibleSection
          key={section.id}
          section={section}
          renderSegment={renderSegment}
          totalSections={sections.length}
        />
      ))}
    </div>
  )
}

