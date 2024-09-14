"use client"

import { useTransition } from 'react'
import { usePathname } from 'next/navigation'
import { deleteOrder } from '@/lib/actions/order.actions'
import { Button } from '../ui/button'

export function DeleteOrder({ orderId }: { orderId: string }) {
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await deleteOrder(orderId)
        })
      }}
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </Button>
  )
}