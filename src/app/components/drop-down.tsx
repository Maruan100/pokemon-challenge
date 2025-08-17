interface GenerationDropdownProps {
  onGenerationChange: (generation: string) => void
}

export default function GenerationDropdown({ onGenerationChange }: GenerationDropdownProps) {
  return (
    <select 
      className="generation-dropdown quarter"
      onChange={(e) => onGenerationChange(e.target.value)}
      defaultValue="all"
    >
      <option value="all">Todas las generaciones</option>
      <option value="i">Gen I</option>
      <option value="ii">Gen II</option>
      <option value="iii">Gen III</option>
      <option value="iv">Gen IV</option>
      <option value="v">Gen V</option>
      <option value="vi">Gen VI</option>
      <option value="vii">Gen VII</option>
      <option value="viii">Gen VIII</option>
      <option value="ix">Gen IX</option>
    </select>
  )
}