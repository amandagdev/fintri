import React from 'react'

interface SectionWrapperProps {
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export default function SectionWrapper(props: SectionWrapperProps) {
  const { title, description, children, footer } = props
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>

      <div className="p-6">{children}</div>

      {footer && (
        <div className="p-6 bg-slate-50 rounded-b-lg border-t border-slate-200 flex justify-end">
          {footer}
        </div>
      )}
    </div>
  )
}
