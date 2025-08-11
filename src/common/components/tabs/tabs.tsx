'use client'

interface TabItem {
  label: string
  value: string
}

interface TabsProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (value: string) => void
}

export default function Tabs(props: TabsProps) {
  const { tabs, activeTab, onChange } = props
  return (
    <div className="flex bg-white rounded-sm border border-gray-200 p-1 w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-4 py-1 rounded-sm font-medium transition text-sm cursor-pointer ${
            activeTab === tab.value
              ? 'bg-[#1b6d71] text-white'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
