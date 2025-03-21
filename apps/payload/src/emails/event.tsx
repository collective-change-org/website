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
import { Event, Newsletter } from '../payload-types'
import { EmailButton } from './Button'
import React from 'react'
import { blockTypeToComponent, lexicalToJSX } from './newsletter'

export const renderEvent = (event: Event) => render(<Email event={event} />)

export default function Email(props: { event: Event }) {
	const event = props.event || {
		id: 1,
		title: 'Launchparty',

		description: {
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
								text: 'Mit dieser Auftaktveranstaltung stellt sich das gerade neugegründete Netzwerk Collective Change vor. Erfahre warum es geht und lerne neue Denkansätze für den Designberuf kennen.',
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
					{
						type: 'paragraph',
						format: '',
						indent: 0,
						version: 1,

						children: [
							{
								mode: 'normal',
								text: 'Talks & Interaktionen',
								type: 'text',
								style: '',
								detail: 0,
								format: 1,
								version: 1,
							},
							{
								type: 'linebreak',
								version: 1,
							},
							{
								mode: 'normal',
								text: 'Vorstellung von Collective Change—Wer wir sind, was wir vor haben',
								type: 'text',
								style: '',
								detail: 0,
								format: 0,
								version: 1,
							},
							{
								type: 'linebreak',
								version: 1,
							},

							{
								mode: 'normal',
								text: 'AUFSIEMITGEBRÜLL—Designstudio »mit gesellschaftlichem Gespür«',
								type: 'text',
								style: '',
								detail: 0,
								format: 0,
								version: 1,
							},
						],
						direction: 'ltr',
						textStyle: '',
						textFormat: 1,
					},
					{
						type: 'paragraph',
						format: '',
						indent: 0,
						version: 1,

						children: [
							{
								mode: 'normal',
								text: 'Für die gute Laune',
								type: 'text',
								style: '',
								detail: 0,
								format: 1,
								version: 1,
							},
							{
								type: 'linebreak',
								version: 1,
							},
							{
								mode: 'normal',
								text: 'Küfa—Küche für Alle (kostenloses Essen)',
								type: 'text',
								style: '',
								detail: 0,
								format: 0,
								version: 1,
							},
							{
								type: 'linebreak',
								version: 1,
							},
							{
								mode: 'normal',
								text: 'Musik und Lounge',
								type: 'text',
								style: '',
								detail: 0,
								format: 0,
								version: 1,
							},
							{
								type: 'linebreak',
								version: 1,
							},

							{
								mode: 'normal',
								text: 'Siebdruck—Bring your own Textil',
								type: 'text',
								style: '',
								detail: 0,
								format: 0,
								version: 1,
							},
						],
						direction: 'ltr',
						textStyle: '',
						textFormat: 1,
					},
				],
				direction: 'ltr',
			},
		},
		beginDate: '2025-04-11T15:00:00.000Z',
		endDate: '2025-04-11T19:00:00.000Z',
		left: {
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
								text: 'FH Potsdam',
								type: 'text',
								style: '',
								detail: 0,
								format: 0,
								version: 1,
							},
							{
								type: 'linebreak',
								version: 1,
							},

							{
								mode: 'normal',
								text: 'Raum D.005',
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
					{
						type: 'paragraph',
						format: '',
						indent: 0,
						version: 1,

						children: [
							{
								mode: 'normal',
								text: 'Kiepenheuerallee 5',
								type: 'text',
								style: '',
								detail: 0,
								format: 0,
								version: 1,
							},
							{
								type: 'linebreak',
								version: 1,
							},

							{
								mode: 'normal',
								text: '14471 Potsdam',
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
		right: {
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
								text: 'Start',
								type: 'text',
								style: '',
								detail: 0,
								format: 0,
								version: 1,
							},
							{
								type: 'linebreak',
								version: 1,
							},

							{
								mode: 'normal',
								text: '17:00',
								type: 'text',
								style: '',
								detail: 0,
								format: 1,
								version: 1,
							},
						],
						direction: 'ltr',
						textStyle: '',
						textFormat: 0,
					},
					{
						type: 'paragraph',
						format: '',
						indent: 0,
						version: 1,

						children: [
							{
								mode: 'normal',
								text: 'Talks',
								type: 'text',
								style: '',
								detail: 0,
								format: 0,
								version: 1,
							},
							{
								type: 'linebreak',
								version: 1,
							},

							{
								mode: 'normal',
								text: '17:00–18:00',
								type: 'text',
								style: '',
								detail: 0,
								format: 1,
								version: 1,
							},
						],
						direction: 'ltr',
						textStyle: '',
						textFormat: 0,
					},
					{
						type: 'paragraph',
						format: '',
						indent: 0,
						version: 1,

						children: [
							{
								mode: 'normal',
								text: 'Siebdruck, Musik, Lounging, Küfa',
								type: 'text',
								style: '',
								detail: 0,
								format: 0,
								version: 1,
							},
							{
								type: 'linebreak',
								version: 1,
							},

							{
								mode: 'normal',
								text: '18:00−niemand mehr da ist :)',
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
		image: null,

		attendees: [],
		updatedAt: '2025-03-12T18:05:36.318Z',
		createdAt: '2025-03-09T12:05:30.578Z',
		_status: 'published',
	}

	const endsOnSameDay = new Date(event.beginDate).getDate() === new Date(event.endDate).getDate()

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
					<Heading
						as="h1"
						className="text-green-dark font-poppins font-[700] text-2xl uppercase leading-snug mb-6"
					>
						Du hast dich für »{event.title}« angemeldet
					</Heading>
					<Text>
						Sehr cool, wir freuen uns schon auf dich! Hier nochmal die wichtigsten
						Daten:
					</Text>
				</Section>
				<Section>
					<Text className="text-uncut">
						<strong>⏰ Wann:</strong>{' '}
						{new Date(event.beginDate).toLocaleString('de-DE', {
							day: 'numeric',
							month: 'numeric',
							year: 'numeric',
							hour: 'numeric',
							minute: 'numeric',
						})}
						—
						{endsOnSameDay
							? new Date(event.endDate).toLocaleTimeString('de-DE', {
									hour: 'numeric',
									minute: 'numeric',
								})
							: new Date(event.endDate).toLocaleString('de-DE', {
									day: 'numeric',
									month: 'numeric',
									year: 'numeric',
									hour: 'numeric',
									minute: 'numeric',
								})}
					</Text>
				</Section>
				{event.left && event.left?.root?.children.length > 0 && (
					<Section>
						{lexicalToJSX(event.left.root.children)} <hr />
					</Section>
				)}
				{event.right && event.right?.root?.children.length > 0 && (
					<Section>
						{lexicalToJSX(event.right.root.children)} <hr />
					</Section>
				)}
				<Section>{lexicalToJSX(event.description.root.children)}</Section>
			</Container>
			<Container>
				<Section className="mt-10 text-center">
					<Row className="my-4 table-cell">
						<Column>
							<Img
								alt="React Email logo"
								height="42"
								src="https://i.imgur.com/cpnC0tt.png"
							/>
						</Column>
					</Row>
					<Row className="my-4 table-cell h-[24px] align-bottom pb-[8px]">
						<Column className="pr-[8px]">
							<Link href="#">
								<Img
									alt="Mastodon"
									src="https://i.imgur.com/1ChFSKg.png"
									height="24"
									width="24"
								/>
							</Link>
						</Column>
						<Column>
							<Link href="#">
								<Img
									alt="Instagram"
									height="24"
									src="https://i.imgur.com/euRIiiR.png"
									width="24"
								/>
							</Link>
						</Column>
					</Row>
				</Section>
			</Container>
		</TailwindWrapper>
	)
}
