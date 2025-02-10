import {
	createForm,
	custom,
	email,
	getValue,
	minLength,
	required,
	type SubmitHandler,
} from "@modular-forms/solid"
import { TextInput } from "../TextInput"
import { Checkbox } from "../FormComponents/Checkbox";
import { FileInput } from "../FormComponents/FileInput";
import { actions } from "astro:actions";


export type AccountEditType = {
	file: {
		list: File[];
		item: File;
	  };
	picture: File
	name: string
	email: string
	publicMail: boolean
}



export default async function accountEdit() {
	const { data, error } = await actions.verify()

	const initialValues = {
		name: data?.name,
		email: data?.email,
	};
	
	const [accountEdit, { Form, Field, FieldArray }] =
		createForm<AccountEditType>({
			initialValues,
		});

		// const handleLogin: SubmitHandler<AccountEditType> = async (values, event) => {
		// 		const { data, error } = await actions.ericsnewaction(values)
		
		// 		if (!error) {
		// 			// Logged In
		// 			navigate("/")
		// 		}
		// 	}

	return (
		<div class="flex w-full flex-col gap-8 text-green-black">
			
			{/* <Switch> */}
				{/* <Match when={!success()}> */}
					<Form
						// onSubmit={handleAccountSubmit}
						class="flex flex-col items-start gap-8">
						<div class="flex items-center">
							<img
								src="/public/Profile.png"
								class="h-40 w-40 rounded-full border-2 border-black"
							/>
							<Field  name="file.item" type="File">
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
							validate={[
								required("Du musst einen Namen angeben"),
							]}>
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
		</div>
	)
}
