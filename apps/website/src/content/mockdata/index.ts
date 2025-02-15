const knowledgebase = [
	{
		id: '/',
		title: 'Home',
		template: 'splash',
		blocks: [
			{
				content: { text: '<p>Capslock … Antikapitalismus … Design bla bla</p>' },
				id: 'bfc5bcd3-83d8-40e7-a83d-a9bef0561da1',
				isHidden: false,
				type: 'text'
			},
			{
				content: {
					title: 'Incom Workspace',
					type: 'external',
					href: 'https://fhp.incom.org/workspace/10921',
					url: [],
					description: 'Hier gibt’s die wahren Informationen'
				},
				id: 'a1d50a0d-1df1-470f-9166-184997532254',
				isHidden: false,
				type: 'link-card'
			},
			{
				content: {
					title: 'Hier geht’s zur Knowledgebase!',
					type: 'internal',
					href: '',
					url: ['knowledgebase/introduction'],
					description: ''
				},
				id: '8d1e30c6-239f-4d46-9479-6e832969b87a',
				isHidden: false,
				type: 'link-card'
			}
		],
		tableOfContents: {
			items: [{ depth: 2, slug: '_top', text: 'Home', children: [] }]
		}
	},
	{
		id: 'knowledgebase/introduction',
		title: 'Introduction',
		template: 'doc',
		blocks: [
			{
				content: {
					text: '<p>Was ist Anticapitalismus? Was ist Capslock?</p><p></p><p>Sehr gute Fragen!</p>'
				},
				id: '4bf3e5a2-83dc-4744-8d07-cb440b324784',
				isHidden: false,
				type: 'text'
			}
		],
		tableOfContents: {
			items: [
				{ depth: 2, slug: '_top', text: 'Introduction', children: [] }
			]
		}
	},
	{
		id: 'knowledgebase/software/photoshop',
		title: 'Photoshop',
		template: 'doc',
		blocks: [
			{
				content: { level: 'h2', text: 'Tsdgfdg' },
				id: '4b01f140-9eb0-44c5-82cc-9ef9a2a680b0',
				isHidden: false,
				type: 'heading'
			},
			{
				content: {
					location: 'kirby',
					image: ['file://03pre7lPowF8JtjV'],
					src: '',
					alt: 'Woow',
					caption: '',
					link: '',
					ratio: '',
					crop: 'false'
				},
				id: '8915fb11-779a-4fa4-ab3b-0e955a2972b5',
				isHidden: false,
				type: 'image'
			},
			{
				content: { title: 'Testcard', content: 'Content', icon: 'svg-1.svg' },
				id: 'f3d1b26d-6983-4614-bc2a-eb9599f3e5c8',
				isHidden: false,
				type: 'card'
			},
			{
				content: {
					title: 'Hier gibts ein besseres Tool',
					href: 'https://affinity.serif.com/de/photo/',
					description: '(Spoiler: Affinity Photo)'
				},
				id: 'e9afacbc-6f4d-42b6-bbda-9c2bf53b351e',
				isHidden: false,
				type: 'link-card'
			},
			{
				content: {
					text: '<p>Ha<em>da</em>sfbdfhj</p><p></p><p></p><p>sdfgoidfsjgdfsg</p><p></p><p>dsafkadfjdagoidgkpodf</p><p>asdfkjadfd</p><p>dsafjkadf</p><p>dsafdaj</p>'
				},
				id: 'c7cc430f-9632-47d7-a6a1-12cc0eb41a0f',
				isHidden: false,
				type: 'text'
			}
		],
		tableOfContents: {
			items: [
				{ depth: 2, slug: '_top', text: 'Photoshop', children: [] },
				{ depth: 2, slug: 'tsdgfdg', text: 'Tsdgfdg', children: [] }
			]
		}
	},
	{
		id: 'knowledgebase/hardware/arduino/uno',
		title: 'Uno',
		template: 'doc',
		blocks: [],
		tableOfContents: {
			items: [{ depth: 2, slug: '_top', text: 'Uno', children: [] }]
		}
	},
	{
		id: 'error',
		title: 'Error',
		template: 'splash',
		blocks: [],
		tableOfContents: {
			items: [{ depth: 2, slug: '_top', text: 'Error', children: [] }]
		}
	}
]

const sidebar = [
	{
		id: 'knowledgebase/introduction',
		type: 'link',
		label: 'Introduction',
		href: '/knowledgebase/introduction',
		isCurrent: false,
		attrs: {}
	},
	{
		id: 'knowledgebase/software',
		type: 'group',
		label: 'Software',
		entries: [
			{
				id: 'knowledgebase/software/photoshop',
				type: 'link',
				label: 'Photoshop',
				href: '/knowledgebase/software/photoshop',
				isCurrent: false,
				attrs: {}
			}
		],
		collapsed: true
	},
	{
		id: 'knowledgebase/hardware',
		type: 'group',
		label: 'Hardware',
		entries: [
			{
				id: 'knowledgebase/hardware/arduino',
				type: 'group',
				label: 'Arduino',
				entries: [
					{
						id: 'knowledgebase/hardware/arduino/uno',
						type: 'link',
						label: 'Uno',
						href: '/knowledgebase/hardware/arduino/uno',
						isCurrent: false,
						attrs: {}
					}
				],
				collapsed: true
			}
		],
		collapsed: true
	}
]

export const mockdata = {
	knowledgebase,
	sidebar
}