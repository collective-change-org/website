import { Button, Text } from '@react-email/components'
import React from 'react'

export const EmailButton = (props: {
  href: string
  children: React.ReactNode
  color: 'green' | 'orange' | 'black'
  size: 'small' | 'large'
}) => {
  const color =
    props.color === 'green'
      ? 'bg-green-lighter hover:bg-green-dark text-white'
      : props.color === 'orange'
        ? 'bg-orange-light hover:bg-orange-dark text-black'
        : 'bg-green-black hover:bg-black text-white'

  const size =
    props.size === 'small' ? 'text-base px-[20px] py-[10px]' : 'text-2xl h-[56px] px-[24px]'

  return (
    <Button
      href={props.href}
      className={`inline-block min-w-fit cursor-pointer rounded-full border-2 border-white/10 uppercase no-underline ${color} ${size}`}
    >
      <Text className="m-auto">{props.children}</Text>
    </Button>
  )
}
