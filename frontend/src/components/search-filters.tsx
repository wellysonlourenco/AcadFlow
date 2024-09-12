import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchProps {
  filter: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}


export function SearchFilter({ filter, handleInputChange }: SearchProps) {
  return (
    <div className="relative flex items-center">
      <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
      <Input
        value={filter}
        onChange={handleInputChange}
        type='search'
        placeholder='Pesquisar...'
        className='md:w-[200px] lg:w-[300px] pl-8 pr-2'
      />
    </div>
  )
}
