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
    <div className="tabs tabs-boxed bg-gray-50 p-2 rounded-sm">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`tab flex-1 text-base rounded-sm
            ${
              activeTab === tab.value
                ? 'tab-active !bg-primary !text-white shadow-md'
                : '!text-gray-500 font-medium hover:!bg-primary/10'
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
