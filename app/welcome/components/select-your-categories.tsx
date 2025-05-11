import {useState} from 'react'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {X} from 'lucide-react'

const initialCategories = [
  { id: 'food', name: 'Food' },
  { id: 'transport', name: 'Transport' },
  { id: 'health', name: 'Health' },
  { id: 'education', name: 'Education' },
]

export const SelectYourCategories = () => {
  const [newCategory, setNewCategory] = useState('')
  const [selectedCategories, setSelectedCategories] = useState(initialCategories)

  const handleSelectCategory = (category: string) => {
    setSelectedCategories(prev => prev.filter(c => c.id !== category))
  }

  const handleAddCategory = ({category}: {category: string}) => {
    if (!category.trim()) return
    setSelectedCategories(prev => [...prev, {id: category, name: category}])
    setNewCategory('')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 flex-wrap">
        {selectedCategories.map(category => (
          <Button
            size="sm"
            key={category.id}
            onClick={() => handleSelectCategory(category.id)}
          >
            <X />
            {category.name}
          </Button>
        ))}
      </div>
      <Input
        placeholder="Add Category"
        value={newCategory}
        onChange={e => setNewCategory(e.target.value)}
      />
      <Button onClick={() => handleAddCategory({category: newCategory})}>
        Add Category
      </Button>
    </div>
  )
}
