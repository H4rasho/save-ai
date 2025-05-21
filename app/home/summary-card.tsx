import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {ReactNode} from 'react'

interface Props {
  amount: number
  title: string
  icon: ReactNode
}

export default function SummaryCard({amount, title, icon}: Props) {
  return (
    <Card className="w-1/3">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="flex gap-2 items-center">
          {icon}
          <p className="text-2xl font-bold">
            {amount.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </p>
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
