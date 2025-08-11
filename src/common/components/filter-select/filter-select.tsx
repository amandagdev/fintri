'use client'

interface FilterOption {
  label: string
  value: string
}

interface FilterSelectProps {
  label?: string
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
}

export default function FilterSelect(props: FilterSelectProps) {
  const { label, options, value, onChange } = props
  return (
    <select
      className="select select-bordered h-10 rounded-md text-sm w-full sm:w-64"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {label && <option value="">{label}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
