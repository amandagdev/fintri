'use client'

import { Search } from 'lucide-react'

interface SearchBarProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
}

export default function SearchBar(props: SearchBarProps) {
  const { placeholder, value, onChange } = props
  return (
    <label className="input input-bordered w-full sm:w-64">
      <Search className="w-4 h-4 text-gray-500 " />
      <input
        type="text"
        className="grow outline-none bg-transparent placeholder:text-gray-500"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}
