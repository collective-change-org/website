import {
	Img,
	Section,
	Container,
	Column,
	Row,
	Text,
	Heading,
	render,
} from "@react-email/components"
import { EmailButton } from "./Button"
import { TailwindWrapper } from "./TailwindWrapper"

export const renderSignup = (token: string) => render(<Email token={token} />)

export default function Email(props: { token: string }) {
	const url = `https://collective-change.de/login?token=${props.token}`

	return (
		<TailwindWrapper>
			<Container className="max-w-[1024px] rounded-[12px] bg-white p-[32px]">
				<Section>
					<Img
						src="https://i.imgur.com/cpnC0tt.png"
						alt="Collective Change"
						className="mx-auto w-[256px]"
					/>
				</Section>
				<Section>
					<Row>
						<Heading
							as="h1"
							className="text-green-dark font-[Poppins] text-2xl uppercase leading-snug">
							Wilkommen in der Crew! Bestätige deine E-Mail!
						</Heading>
					</Row>
					<Row>
						<Text>
							Cool, dass du dich angemeldet hast! Du musst nur
							noch diese E-Mail bestätigen, dann geht&lsquo;s los!
						</Text>
					</Row>
					<Row>
						<Column className="border-orange-dark bg-orange-light/50 text-green-black inline-block border-0 border-l-4 border-solid px-4 py-2">
							Wenn du dir einen Account erstellst, wirst du
							automatisch zur Newsletter-Liste hinzugefügt. Wenn
							du das nicht möchtest, bestätige bitte nicht deine
							E-Mail-Adresse.
						</Column>
					</Row>
					<Row className="mt-[16px]">
						<Column>
							<EmailButton href={url} color="green" size="small">
								Account bestätigen
							</EmailButton>
						</Column>
					</Row>
				</Section>
			</Container>
		</TailwindWrapper>
	)
}
