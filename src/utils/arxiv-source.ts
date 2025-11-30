import * as fflate from 'fflate'

interface ArxivSourceFile {
  name: string
  content: string
}

interface ExtractedSource {
  files: ArxivSourceFile[]
  mainTexFile: string | null
  mainTexContent: string | null
}

/**
 * Download and extract LaTeX source from arXiv
 */
export async function downloadArxivSource(paperId: string): Promise<ExtractedSource> {
  try {
    // Download the source tar.gz from arXiv
    const response = await fetch(`https://arxiv.org/src/${paperId}`)
    
    if (!response.ok) {
      throw new Error(`Failed to download source: ${response.status}`)
    }
    
    const arrayBuffer = await response.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    
    // Decompress gzip
    const decompressed = fflate.gunzipSync(uint8Array)
    
    // Parse tar archive
    const files = parseTar(decompressed)
    
    // Find the main .tex file
    const mainTexFile = findMainTexFile(files)
    const mainTexContent = mainTexFile ? files.find(f => f.name === mainTexFile)?.content || null : null
    
    return {
      files,
      mainTexFile,
      mainTexContent
    }
  } catch (error) {
    console.error('Error downloading arXiv source:', error)
    throw error
  }
}

/**
 * Parse a tar archive
 */
function parseTar(data: Uint8Array): ArxivSourceFile[] {
  const files: ArxivSourceFile[] = []
  let offset = 0
  
  while (offset < data.length) {
    // Check if we've reached the end (empty block)
    if (data[offset] === 0) {
      break
    }
    
    // Parse tar header (512 bytes)
    const header = data.slice(offset, offset + 512)
    
    // Extract filename (first 100 bytes, null-terminated)
    let nameEnd = 0
    while (nameEnd < 100 && header[nameEnd] !== 0) {
      nameEnd++
    }
    const name = new TextDecoder().decode(header.slice(0, nameEnd))
    
    // Extract file size (12 bytes starting at offset 124, octal)
    const sizeStr = new TextDecoder().decode(header.slice(124, 136)).trim()
    const size = parseInt(sizeStr, 8) || 0
    
    // Extract file type (1 byte at offset 156)
    const fileType = String.fromCharCode(header[156])
    
    // Move to file content
    offset += 512
    
    // Only process regular files (type '0' or '\0')
    if ((fileType === '0' || fileType === '\0') && size > 0 && name.endsWith('.tex')) {
      const content = new TextDecoder().decode(data.slice(offset, offset + size))
      files.push({ name, content })
    }
    
    // Move to next file (tar blocks are 512-byte aligned)
    offset += Math.ceil(size / 512) * 512
  }
  
  return files
}

/**
 * Find the main .tex file from a list of files
 * Heuristics:
 * 1. Look for files with \documentclass
 * 2. Prefer files named main.tex, paper.tex, or similar
 * 3. Choose the largest file if multiple candidates
 */
function findMainTexFile(files: ArxivSourceFile[]): string | null {
  // Filter for .tex files that have \documentclass (indicates main file)
  const candidateFiles = files.filter(f => 
    f.name.endsWith('.tex') && f.content.includes('\\documentclass')
  )
  
  if (candidateFiles.length === 0) {
    // If no file with \documentclass, just return the first .tex file
    const texFiles = files.filter(f => f.name.endsWith('.tex'))
    return texFiles.length > 0 ? texFiles[0].name : null
  }
  
  if (candidateFiles.length === 1) {
    return candidateFiles[0].name
  }
  
  // Multiple candidates - use heuristics
  
  // Prefer common main file names
  const commonNames = ['main.tex', 'paper.tex', 'manuscript.tex', 'article.tex']
  for (const commonName of commonNames) {
    const match = candidateFiles.find(f => 
      f.name.toLowerCase().endsWith(commonName.toLowerCase())
    )
    if (match) {
      return match.name
    }
  }
  
  // Return the largest file
  candidateFiles.sort((a, b) => b.content.length - a.content.length)
  return candidateFiles[0].name
}

/**
 * Extract the main content from a LaTeX file
 * Removes preamble and focuses on document body
 */
export function extractLatexContent(latexSource: string): string {
  // Find \begin{document}...\end{document}
  const beginMatch = latexSource.match(/\\begin\{document\}/i)
  const endMatch = latexSource.match(/\\end\{document\}/i)
  
  if (beginMatch && endMatch) {
    const start = beginMatch.index! + beginMatch[0].length
    const end = endMatch.index!
    return latexSource.substring(start, end).trim()
  }
  
  // If no document environment found, return the whole thing
  return latexSource
}

/**
 * Create a minimal valid LaTeX document from content
 */
export function wrapInMinimalDocument(content: string): string {
  return `\\documentclass{article}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{graphicx}

\\begin{document}

${content}

\\end{document}`
}

