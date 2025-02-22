import { Font, Html, Tailwind } from '@react-email/components'
import config from './tailwind.config'
import React from 'react'

export const TailwindWrapper = (props: { children: React.ReactNode }) => {
  return (
    <Tailwind config={config}>
      <Html lang="de" className="bg-[#FFFBED]">
        <Font
          fontFamily="Poppins"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: 'https://cdn.jsdelivr.net/fontsource/fonts/poppins@latest/latin-800-normal.woff2',
            format: 'woff2',
          }}
          fontWeight={800}
          fontStyle="normal"
        />
        <Font
          fontFamily="Poppins"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: 'https://cdn.jsdelivr.net/fontsource/fonts/poppins@latest/latin-700-normal.woff2',
            format: 'woff2',
          }}
          fontWeight={700}
          fontStyle="normal"
        />
        <Font
          fontFamily="Uncut"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: 'https://github.com/kaspernordkvist/uncut_sans/raw/refs/heads/main/Webfonts/UncutSans-Regular.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        {props.children}
      </Html>
    </Tailwind>
  )
}
