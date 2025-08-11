'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import debounce from 'debounce'

// 动态导入 MDEditor 以避免 SSR 问题
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
)

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  onSave?: (value: string) => void
  placeholder?: string
  height?: number
  autoSave?: boolean
  autoSaveDelay?: number
  className?: string
}

export function MarkdownEditor({
  value,
  onChange,
  onSave,
  placeholder = '开始写作...',
  height = 400,
  autoSave = false,
  autoSaveDelay = 2000,
  className = ''
}: MarkdownEditorProps) {
  const [localValue, setLocalValue] = useState(value)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // 防抖的自动保存函数
  const debouncedSave = debounce(async (content: string) => {
    if (onSave && autoSave && content.trim()) {
      setIsSaving(true)
      try {
        await onSave(content)
        setLastSaved(new Date())
      } catch (error) {
        console.error('自动保存失败:', error)
      } finally {
        setIsSaving(false)
      }
    }
  }, autoSaveDelay)

  // 处理内容变化
  const handleChange = (val: string = '') => {
    setLocalValue(val)
    onChange(val)
    
    // 触发自动保存
    if (autoSave) {
      debouncedSave(val)
    }
  }

  // 手动保存
  const handleSave = async () => {
    if (onSave) {
      setIsSaving(true)
      try {
        await onSave(localValue)
        setLastSaved(new Date())
      } catch (error) {
        console.error('保存失败:', error)
      } finally {
        setIsSaving(false)
      }
    }
  }

  // 快捷键支持 (Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [localValue])

  // 同步外部 value 变化
  useEffect(() => {
    if (value !== localValue) {
      setLocalValue(value)
    }
  }, [value])

  return (
    <div className={`markdown-editor ${className}`}>
      {/* 编辑器状态栏 */}
      {(autoSave || onSave) && (
        <div className="flex items-center justify-between p-2 bg-gray-50 border-b text-sm text-gray-600">
          <div className="flex items-center gap-4">
            {autoSave && (
              <div className="flex items-center gap-2">
                {isSaving ? (
                  <>
                    <div className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>保存中...</span>
                  </>
                ) : lastSaved ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>已保存 {lastSaved.toLocaleTimeString()}</span>
                  </>
                ) : (
                  <span>自动保存已开启</span>
                )}
              </div>
            )}
          </div>
          
          {onSave && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Ctrl+S 快速保存</span>
              {!autoSave && (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? '保存中...' : '保存'}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Markdown 编辑器 */}
      <div className="markdown-editor-container">
        <MDEditor
          value={localValue}
          onChange={handleChange}
          height={height}
          data-color-mode="light"
          visibleDragbar={false}
          textareaProps={{
            placeholder,
            style: {
              fontSize: 14,
              lineHeight: 1.6,
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
            }
          }}
          preview="edit"
          hideToolbar={false}
          toolbarHeight={44}
        />
      </div>

      {/* 样式覆盖 */}
      <style jsx global>{`
        .markdown-editor-container .w-md-editor {
          background-color: #ffffff;
        }
        
        .markdown-editor-container .w-md-editor-bar {
          border-bottom: 1px solid #e5e7eb;
          background-color: #f9fafb;
        }
        
        .markdown-editor-container .w-md-editor-bar svg {
          width: 16px;
          height: 16px;
        }
        
        .markdown-editor-container .w-md-editor-text-textarea {
          color: #374151 !important;
          font-size: 14px !important;
          line-height: 1.6 !important;
        }
        
        .markdown-editor-container .w-md-editor-text-container,
        .markdown-editor-container .w-md-editor-text-input {
          font-size: 14px !important;
        }
        
        .markdown-editor-container .w-md-editor-focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
      `}</style>
    </div>
  )
}