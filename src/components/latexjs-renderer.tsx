import { useEffect, useRef, useState } from 'react'

interface LatexJsRendererProps {
  source: string
  className?: string
}

// Declare global latexjs object from CDN
declare global {
  interface Window {
    latexjs?: {
      parse: (source: string, options: { generator: any }) => any
      HtmlGenerator: new (options: { hyphenate: boolean }) => any
    }
  }
}

// Load latex.js from CDN
const loadLatexJS = (() => {
  let loading: Promise<void> | null = null
  
  return () => {
    if (window.latexjs) {
      return Promise.resolve()
    }
    
    if (loading) {
      return loading
    }
    
    loading = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/latex.js@0.12.6/dist/latex.js'
      script.onload = () => {
        resolve()
      }
      script.onerror = () => {
        loading = null
        reject(new Error('Failed to load latex.js'))
      }
      document.head.appendChild(script)
    })
    
    return loading
  }
})()

export function LatexJsRenderer({ source, className = '' }: LatexJsRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stylesRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isRendering, setIsRendering] = useState(true)

  useEffect(() => {
    if (!source || !containerRef.current || !stylesRef.current) return

    const renderLatex = async () => {
      try {
        setIsRendering(true)
        setError(null)

        // Clear previous content
        containerRef.current!.innerHTML = ''
        stylesRef.current!.innerHTML = ''

        // Load latex.js from CDN
        await loadLatexJS()

        if (!window.latexjs) {
          throw new Error('latex.js failed to load')
        }

        // Preprocess the LaTeX source to handle unsupported document classes
        let processedSource = source
        
        // Check if source has proper document structure
        const hasBeginDoc = /\\begin\{document\}/.test(processedSource)
        const hasEndDoc = /\\end\{document\}/.test(processedSource)
        const hasDocClass = /\\documentclass/.test(processedSource)
        
        console.log('Document structure check:', { hasDocClass, hasBeginDoc, hasEndDoc })
        
        // Only wrap if truly incomplete (missing both documentclass AND document environment)
        if (!hasDocClass && !hasBeginDoc) {
          console.log('Document missing structure, wrapping in minimal document')
          processedSource = `\\documentclass{article}
\\usepackage{amsmath}
\\usepackage{amssymb}

\\begin{document}

${processedSource}

\\end{document}`
        } else if (hasDocClass && !hasBeginDoc) {
          // Has documentclass but no document environment
          console.log('Document has class but missing document environment')
          processedSource = processedSource + '\n\\begin{document}\n\n\\end{document}'
        } else if (!hasDocClass && hasBeginDoc) {
          // Has document environment but no documentclass - add class at the beginning
          console.log('Document missing documentclass')
          processedSource = `\\documentclass{article}\n\\usepackage{amsmath}\n\\usepackage{amssymb}\n\n${processedSource}`
        } else if (!hasEndDoc && hasBeginDoc) {
          // Missing end document
          console.log('Document missing \\end{document}')
          processedSource = processedSource + '\n\\end{document}'
        } else {
          console.log('Document structure appears complete')
        }
        
        // Map unsupported document classes to supported ones
        const documentClassMap: Record<string, string> = {
          'IEEEtran': 'article',
          'acmart': 'article',
          'neurips': 'article',
          'sig-alternate': 'article',
          'llncs': 'article',
          'elsarticle': 'article',
          'revtex4': 'article',
          'revtex4-1': 'article',
          'amsart': 'article',
          'amsbook': 'book',
          'memoir': 'book',
          'scrartcl': 'article',
          'scrreprt': 'report',
          'scrbook': 'book'
        }
        
        // Replace unsupported document classes with article
        processedSource = processedSource.replace(
          /\\documentclass(?:\[[^\]]*\])?\{([^}]+)\}/,
          (match, className) => {
            const normalizedClass = className.trim()
            if (documentClassMap[normalizedClass]) {
              console.log(`Converting ${normalizedClass} to ${documentClassMap[normalizedClass]}`)
              return `\\documentclass{${documentClassMap[normalizedClass]}}`
            }
            return match
          }
        )
        
        // Remove or simplify problematic packages that latex.js doesn't support
        const unsupportedPackages = [
          'algorithm2e', 'algorithmic', 'algorithm', 'cite', 'natbib',
          'hyperref', 'cleveref', 'subcaption', 'subfigure', 'subfig',
          'booktabs', 'multirow', 'longtable', 'siunitx', 'listings',
          'minted', 'tikz', 'pgfplots', 'fontspec', 'biblatex', 'balance',
          'CJK', 'inputenc', 'fontenc', 'microtype'
        ]
        
        for (const pkg of unsupportedPackages) {
          // Remove \usepackage{pkg} or \usepackage[options]{pkg}
          const regex = new RegExp(`\\\\usepackage(?:\\[[^\\]]*\\])?\\{${pkg}\\}`, 'g')
          processedSource = processedSource.replace(regex, '')
        }
        
        // Remove \input and \include commands (they won't work without the files)
        processedSource = processedSource.replace(/\\input\{[^}]*\}/g, '')
        processedSource = processedSource.replace(/\\include\{[^}]*\}/g, '')
        
        // Remove bibliography commands that might cause issues
        processedSource = processedSource.replace(/\\bibliography\{[^}]*\}/g, '')
        processedSource = processedSource.replace(/\\bibliographystyle\{[^}]*\}/g, '')
        
        // Remove makeindex and other commands that need external files
        processedSource = processedSource.replace(/\\makeindex/g, '')
        processedSource = processedSource.replace(/\\printindex/g, '')

        // Create HTML generator with options
        const generator = new window.latexjs.HtmlGenerator({ 
          hyphenate: true
        })

        // Parse the LaTeX source with error handling
        let parsedDoc
        try {
          parsedDoc = window.latexjs.parse(processedSource, { generator })
        } catch (parseError) {
          console.error('First parse attempt failed:', parseError)
          
          // Try extracting just the document body and wrapping it in a clean minimal doc
          const beginMatch = processedSource.match(/\\begin\{document\}/)
          const endMatch = processedSource.match(/\\end\{document\}/)
          
          if (beginMatch && endMatch) {
            const start = beginMatch.index! + beginMatch[0].length
            const end = endMatch.index!
            const bodyContent = processedSource.substring(start, end).trim()
            
            console.log('Attempting to parse just the document body in clean minimal wrapper')
            const minimalDoc = `\\documentclass{article}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{graphicx}

\\begin{document}

${bodyContent}

\\end{document}`
            
            try {
              parsedDoc = window.latexjs.parse(minimalDoc, { generator })
            } catch (fallbackError) {
              console.error('Fallback parse also failed:', fallbackError)
              throw new Error(`Unable to parse LaTeX: ${fallbackError instanceof Error ? fallbackError.message : String(fallbackError)}`)
            }
          } else {
            throw new Error(`Unable to parse LaTeX: ${parseError instanceof Error ? parseError.message : String(parseError)}`)
          }
        }

        // Get the styles and scripts fragment
        const stylesFragment = parsedDoc.stylesAndScripts('https://cdn.jsdelivr.net/npm/latex.js@0.12.6/dist/')
        stylesRef.current!.appendChild(stylesFragment)

        // Get the DOM fragment with the content
        const contentFragment = parsedDoc.domFragment()
        containerRef.current!.appendChild(contentFragment)

        setIsRendering(false)
      } catch (err) {
        console.error('Error rendering LaTeX:', err)
        setError(err instanceof Error ? err.message : 'Failed to render LaTeX')
        setIsRendering(false)
      }
    }

    renderLatex()
  }, [source])

  if (error) {
    return (
      <div className="p-md bg-red-50 border border-red-200 rounded">
        <p className="text-red-600 font-semibold mb-2">LaTeX Compilation Error</p>
        <pre className="text-sm text-red-800 whitespace-pre-wrap">{error}</pre>
      </div>
    )
  }

  return (
    <>
      {/* Container for styles and scripts */}
      <div ref={stylesRef} style={{ display: 'none' }} />
      
      {/* Container for rendered content */}
      <div 
        ref={containerRef} 
        className={className}
        style={{
          opacity: isRendering ? 0.5 : 1,
          transition: 'opacity 0.3s ease'
        }}
      />
    </>
  )
}

