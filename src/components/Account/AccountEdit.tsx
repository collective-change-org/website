import {
	createForm,
	custom,
	email,
	getValue,
	minLength,
	required,
	setValues,
	type SubmitHandler,
} from "@modular-forms/solid"
import { TextInput } from "../TextInput"
import { Checkbox } from "../FormComponents/Checkbox"
import { FileInput } from "../FormComponents/FileInput"
import { actions } from "astro:actions"
import { createEffect, createSignal, onMount } from "solid-js"
import type { User } from "../../actions"
import { createImageUrl } from "../../lib/createImageUrl"
import { button } from "../button/button"

export type AccountEditType = {
	picture: File
	name: string
	email: string
	publicMail: boolean
}

export default function accountEdit() {
	const [user, setUser] = createSignal<User | null>(null)

	onMount(async () => {
		const { data, error } = await actions.verify()
		console.log(data)

		if (!error && data) {
			setUser(data)
		}
	})

	const [accountEdit, { Form, Field, FieldArray }] =
		createForm<AccountEditType>()

	// const handleLogin: SubmitHandler<AccountEditType> = async (values, event) => {
	// 		const { data, error } = await actions.ericsnewaction(values)

	// 		if (!error) {
	// 			// Logged In
	// 			navigate("/")
	// 		}
	// 	}

	createEffect(() => {
		setValues(
			accountEdit,
			{
				name: user()?.name,
				email: user()?.email,
			},
			{
				shouldTouched: false,
			},
		)
	})

	return (
		<div class="flex w-full flex-col items-start gap-8 text-green-black">
			{/* <Switch> */}
			{/* <Match when={!success()}> */}
			<Form
				// onSubmit={handleAccountSubmit}
				class="flex flex-col items-start gap-8">
				<div class="flex items-center">
					<img
						src={
							user()?.profileImage
								? createImageUrl(user()?.profileImage?.url!)
								: "/Profile.png"
						}
						class="h-40 w-40 rounded-full border-2 border-black"
					/>
					<Field name="picture" type="File">
						{(field, props) => (
							<FileInput
								{...props}
								value={field.value}
								error={field.error}
								label="Nur JPG, PNG & max. 2MB"
								class="pt-8"
							/>
						)}
					</Field>
				</div>

				<Field
					name="name"
					validate={[required("Du musst einen Namen angeben")]}>
					{(field, props) => (
						<TextInput
							{...props}
							value={field.value}
							error={field.error}
							type="text"
							label="Wie wir dich nennen"
							required
						/>
					)}
				</Field>
				<Field
					name="email"
					validate={[
						required("Du musst eine E-Mail angeben."),
						email(
							"Der eingegebene Text scheint keine E-Mail zu sein.",
						),
					]}>
					{(field, props) => (
						<TextInput
							{...props}
							value={field.value}
							error={field.error}
							type="email"
							label="E-Mail Adresse"
							required
						/>
					)}
				</Field>
				<Field name="publicMail" type="boolean">
					{(field, props) => (
						<Checkbox
							{...props}
							checked={field.value}
							error={field.error}
							label="E-Mail Adresse Mitgliedern anzeigen"
						/>
					)}
				</Field>
				{/* <button
							type="submit"
							class={button({
								intent: "green",
								size: "small",
							})}>
							Änderungen speichern
						</button> */}
			</Form>
			{/* </Match> */}
			{/* </Switch> */}
			<button
				id="save_account"
				type="button"
				style="display: none;"
				class={button({
					intent: "green",
					size: "small",
				})}>
				Änderungen speichern
			</button>
			<button
				id="delete_account"
				type="button"
				class={button({
					intent: "red",
					size: "small",
				})}>
				Account Löschen
			</button>
		</div>
	)
}
