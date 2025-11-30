import { useState, useEffect } from "react"
import { H2, Body } from "@/atomic/atm.typography/typography.component.style"
import { FaIcon } from "@/atomic/atm.fa-icon/fa-icon.component"
import { Chat } from "@/atomic/obj.chat"
import { LatexRenderer } from "./latex-renderer"

interface Thread {
  id: string
  title: string
  content: string
  children?: Thread[]
  isExpanded?: boolean
}

interface PaperSection {
  id: string
  section_number: number
  title: string
  content: string
  images: string[]
}

interface GetPaperResponse {
  success: boolean
  paper_id: string
  database_id: string
  title: string
  url: string
  abstract: string
  total_sections: number
  sections: PaperSection[]
}

const API_BASE_URL = 'http://localhost:8080/api/v1'

const mockNestedThreads: Record<string, Thread[]> = {
  "1": [
    {
      id: "1-1",
      title: "Self-Similarity as the Defining Characteristic",
      content: "Self-similarity is the mathematical cornerstone that distinguishes fractals from all other geometric objects. This means that a fractal contains smaller copies of itself within its structure, and these copies are statistically or exactly identical to the whole—this property holds true regardless of the scale at which you examine it.",
    },
    {
      id: "1-2",
      title: "How Self-Similarity Functions as the Mathematical Definition",
      content: "Self-similarity is what operationally distinguishes fractals from Euclidean geometry—it's the property that allows fractals to maintain their characteristic patterns at every level of magnification. This recursive property enables fractals to encode infinite complexity within finite bounds.",
    },
  ],
  "2": [
    {
      id: "2-1",
      title: "Fractal Dimension and Non-Integer Geometry",
      content: "Fractal dimension provides a quantitative measure of how completely a fractal fills space. Unlike Euclidean objects that have integer dimensions (1D line, 2D plane, 3D volume), fractals possess non-integer dimensions that reflect their self-similar structure.",
    },
    {
      id: "2-2",
      title: "Applications in Nature and Science",
      content: "Fractals appear throughout nature in coastlines, clouds, trees, and blood vessels. Their self-similar properties make them invaluable for modeling natural phenomena that traditional Euclidean geometry fails to capture adequately.",
    },
  ],
  "1-1": [
    {
      id: "1-1-1",
      title: "Exact Self-Similarity",
      content: "In exact self-similarity, each smaller part is an identical copy of the whole structure. The Sierpiński triangle and Koch snowflake are classic examples where perfect replication occurs at every scale.",
    },
    {
      id: "1-1-2",
      title: "Quasi Self-Similarity",
      content: "Quasi self-similarity involves approximate repetition where smaller copies resemble but aren't identical to the whole. This type is more common in natural fractals like ferns and river networks.",
    },
  ],
  "1-2": [
    {
      id: "1-2-1",
      title: "Iterative Function Systems",
      content: "Iterative function systems (IFS) are mathematical frameworks that generate fractals through repeated application of transformation functions. Each iteration produces finer detail while preserving the overall self-similar structure.",
    },
  ],
}

interface BreadcrumbItem {
  id: string
  title: string
}

function HighlightPlus({ isExpanded, isLoading, onClick }: { isExpanded: boolean, isLoading: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex hover:bg-neutral-soft items-center justify-center rounded-sm p-xs h-lg w-lg transition-transform ${isExpanded ? 'text-fixed-white' : ''}`}
      disabled={isLoading}
    >
      {isLoading ? (
        <FaIcon.LoaderSpinner className="text-neutral text-3xl animate-spin" />
      ) : (
        <FaIcon.Plus className={`text-neutral text-3xl transition-transform duration-300 ${isExpanded ? 'text-fixed-white' : 'text-neutral'}`} style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }} />
      )}
    </button>
  )
}

function TypingText({ text, speed = 20, onComplete }: { text: string, speed?: number, onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)
      return () => clearTimeout(timeout)
    } else if (currentIndex === text.length && onComplete) {
      onComplete()
    }
  }, [currentIndex, text, speed, onComplete])

  return <LatexRenderer content={displayedText} />
}

function HighlightBody({ title, content, isTyping = false }: { title: string, content: string, isTyping?: boolean }) {
  const [isTitleComplete, setIsTitleComplete] = useState(false)

  return (
    <div className="flex flex-col flex-1 min-w-0">
      <H2 className="mt-0 pt-0 break-words">
        {isTyping ? <TypingText text={title} speed={30} onComplete={() => setIsTitleComplete(true)} /> : title}
      </H2>
      <Body className="text-neutral text-md break-words whitespace-pre-wrap">
        {isTyping ? (
          isTitleComplete ? <TypingText text={content} speed={15} /> : null
        ) : (
          <LatexRenderer content={content} />
        )}
      </Body>
    </div>
  )
}

function HighlightItem({ 
  thread, 
  onExpand,
  level = 0,
  shouldAnimate = false
}: { 
  thread: Thread
  onExpand: (thread: Thread) => void
  level?: number
  shouldAnimate?: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadedChildren, setLoadedChildren] = useState<Thread[]>([])
  const hasChildren = mockNestedThreads[thread.id]?.length > 0

  const handleToggle = async () => {
    if (isExpanded) {
      // Collapsing
      setIsExpanded(false)
      setLoadedChildren([])
      return
    }

    if (!hasChildren) return

    // Expanding - simulate API call
    setIsLoading(true)
    onExpand(thread)
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsLoading(false)
    setIsExpanded(true)
    
    // Load children one by one with slight delay
    const children = mockNestedThreads[thread.id] || []
    for (let i = 0; i < children.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300))
      setLoadedChildren(prev => [...prev, children[i]])
    }
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row gap-x-md items-start w-full">
        <div className="flex-shrink-0">
          <HighlightPlus isExpanded={isExpanded} isLoading={isLoading} onClick={handleToggle} />
        </div>
        <div className="flex-1 min-w-0">
          <HighlightBody title={thread.title} content={thread.content} isTyping={shouldAnimate} />
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-md ml-xl flex flex-col gap-y-lg border-l-2 border-neutral-soft pl-md w-full">
          {loadedChildren.map((childThread, index) => (
            <HighlightItem
              key={childThread.id}
              thread={childThread}
              onExpand={onExpand}
              level={level + 1}
              shouldAnimate={index === loadedChildren.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

async function fetchPaperSections(arxivId: string): Promise<PaperSection[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/paper/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ arxiv_id: arxivId }),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data: GetPaperResponse = await response.json()
    return data.sections
  } catch (error) {
    console.error('Error fetching paper sections:', error)
    return []
  }
}

export const Highlights = ({ paperId }: { paperId: string }) => {
  const [_, setBreadcrumbPath] = useState<BreadcrumbItem[]>([
    { id: "root", title: "Highlights" }
  ])
  const [sections, setSections] = useState<PaperSection[]>([])
  const [isLoadingSections, setIsLoadingSections] = useState(true)

  useEffect(() => {
    const loadSections = async () => {
      setIsLoadingSections(true)
      const fetchedSections = await fetchPaperSections(paperId)
      setSections(fetchedSections)
      setIsLoadingSections(false)
    }

    if (paperId) {
      loadSections()
    }
  }, [paperId])

  const initialThreads: Thread[] = sections.map((section) => ({
    id: section.id,
    title: section.title,
    content: section.content,
  }))

  const handleExpand = (thread: Thread) => {
    setBreadcrumbPath(prev => [...prev, { id: thread.id, title: thread.title }])
  }

  if (isLoadingSections) {
    return (
      <div className="flex flex-col justify-center items-center gap-y-sm min-h-screen">
        <FaIcon.LoaderSpinner className="text-neutral text-4xl animate-spin" />
        <Body className="text-neutral">Loading paper sections...</Body>
      </div>
    )
  }

  if (sections.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center gap-y-sm min-h-screen">
        <Body className="text-neutral">No sections found for this paper.</Body>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-sm min-h-screen max-w-[40vw]">
      {/* <Breadcrumb path={breadcrumbPath} onNavigate={handleNavigate} /> */}
      
        <div className="flex flex-col gap-y-md h-[80vh] overflow-y-auto px-md w-full">
          <div className="h-xl min-w-[40vh] relative sticky top-0 bg-gradient-to-b from-background/95 via-background/40 to-background/20 z-10 pointer-events-none">&nbsp;</div>
          {initialThreads.map((thread) => (
          <HighlightItem
            key={thread.id}
            thread={thread}
            onExpand={handleExpand}
          />
        ))}
      </div>
      <Chat.Input
        placeholder="Explore more..."
        onSend={() => {}}
        disabled={false}
      />
    </div>
  )
}
