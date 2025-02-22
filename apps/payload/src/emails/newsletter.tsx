import {
  Column,
  Container,
  Heading,
  Img,
  Link,
  render,
  Row,
  Section,
  Text,
} from '@react-email/components'
import { TailwindWrapper } from './TailwindWrapper'
import { Newsletter } from '../payload-types'
import { EmailButton } from './Button'
import React from 'react'

export const renderNewsletter = (body: Newsletter['body'], token: string) =>
  render(<Email body={body} token={token} />)

type BlockType = Newsletter['body'][0]
type RichTextChildren = {
  type: string
  version: number
  children?: {
    type: string
    text: string
    version: number
  }[]
  text?: string
}[]

function lexicalToJSX(children: RichTextChildren) {
  return children.map((child, i) => {
    if (typeof child !== 'object' || !child) {
      return
    }
    switch (child.type) {
      case 'paragraph':
        if (!child.children) {
          return null
        }
        return (
          <Text className="text-base my-3" key={i}>
            {lexicalToJSX(child.children)}
          </Text>
        )
      case 'text':
        return child.text
      default:
        return <Text>{JSON.stringify(child)}</Text>
    }
  })
}

function blockTypeToComponent(block: BlockType) {
  switch (block.blockType) {
    case 'h1Block':
      return (
        <Heading
          as="h2"
          className="text-green-lighter font-[Poppins] text-5xl uppercase leading-snug mb-2 mt-4"
        >
          {block.title}
        </Heading>
      )
    case 'h2Block':
      return (
        <Heading
          as="h1"
          className="text-green-dark font-[Poppins] font-[700] text-2xl uppercase leading-snug mb-6"
        >
          {block.title}
        </Heading>
      )
    case 'h3Block':
      return (
        <Heading
          as="h2"
          className="text-green-dark font-[Poppins] text-xl uppercase leading-snug m-0"
        >
          {block.title}
        </Heading>
      )
    case 'plainRichTextBlock':
      return lexicalToJSX(block.richText.root.children)
    default:
      return null
  }
}

export default function Email(props: { body: Newsletter['body']; token: string }) {
  const body = props.body ?? [
    {
      id: '67a09dd83322660f0d5540fc',
      title: 'We are all Crew!',
      blockName: null,
      blockType: 'h1Block',
    },
    {
      id: '67a09de73322660f0d5540fe',
      title: 'Aber sind wir das wirklich?',
      blockName: null,
      blockType: 'h2Block',
    },
    {
      id: '67a09de73322660f0d5540fe',
      title: 'Aber sind wir das wirklich?',
      blockName: null,
      blockType: 'h3Block',
    },
    {
      id: '67a0cd9ec1b5e0770a6806e0',
      richText: {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              children: [
                {
                  mode: 'normal',
                  text: 'Moining, ich schreib ma bissi was hier rein',
                  type: 'text',
                  style: '',
                  detail: 0,
                  format: 0,
                  version: 1,
                },
              ],
              direction: 'ltr',
              textStyle: '',
              textFormat: 0,
            },
          ],
          direction: 'ltr',
        },
      },
      blockName: null,
      blockType: 'plainRichTextBlock',
    },
  ]
  return (
    <TailwindWrapper>
      <Container className="max-w-[1024px] rounded-[12px] bg-offwhite p-[32px]">
        <Section>
          <Img
            src="https://i.imgur.com/cpnC0tt.png"
            alt="Collective Change"
            className="mx-auto w-[256px]"
          />
        </Section>
        <Section>
          {body.map((section, index) => {
            return <Row key={index}>{blockTypeToComponent(section)}</Row>
          })}
        </Section>
        <Section>
          <EmailButton href={''} color={'green'} size={'small'}>
            Newsletter abbestellen
          </EmailButton>
        </Section>
      </Container>
      <Container>
        <Section className="mt-10 text-center">
          <Row className="my-4 table-cell">
            <Column>
              <Img alt="React Email logo" height="42" src="https://i.imgur.com/cpnC0tt.png" />
            </Column>
          </Row>
          <Row className="my-4 table-cell h-[24px] align-bottom pb-[8px]">
            <Column className="pr-[8px]">
              <Link href="#">
                <Img alt="Mastodon" src="https://i.imgur.com/1ChFSKg.png" height="24" width="24" />
              </Link>
            </Column>
            <Column>
              <Link href="#">
                <Img alt="Instagram" height="24" src="https://i.imgur.com/euRIiiR.png" width="24" />
              </Link>
            </Column>
          </Row>
          <Row>
            <Column className="pt-[16px]">
              <Link
                className="text-green-black my-[8px] text-[14px] underline leading-[24px] text-gray-500"
                href={`https://collective-change.de/abbestellen/${props.token}`}
              >
                Newsletter abbestellen
              </Link>
            </Column>
          </Row>
        </Section>
      </Container>
    </TailwindWrapper>
  )
}
