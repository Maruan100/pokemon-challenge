import { useEffect, useState } from 'react';

interface GenerationDropdownProps {
  onGenerationChange: (generation: string) => void;
  initialValue?: string;
}

export default function GenerationDropdown({ 
  onGenerationChange, 
  initialValue = "all" 
}: GenerationDropdownProps) {
  const [selectedGeneration, setSelectedGeneration] = useState(initialValue);

  useEffect(() => {
    setSelectedGeneration(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedGeneration(value);
    onGenerationChange(value);
  };

  return (
    <select 
      className="generation-dropdown quarter"
      onChange={handleChange}
      value={selectedGeneration}
    >
      <option value="all">All gens</option>
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
  );
}