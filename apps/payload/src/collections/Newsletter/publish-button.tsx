"use client"
import type { PublishButtonClientProps } from "payload"

import { Button, ConfirmationModal, useDocumentInfo, useForm, useModal } from "@payloadcms/ui"
import React, { useCallback } from "react"

import "./index.css"

export default function MyPublishButton(_: PublishButtonClientProps) {
	const {
		setHasPublishedDoc,
		setMostRecentVersionIsAutosaved,
		setUnpublishedVersionCount,
		uploadStatus,
	} = useDocumentInfo()

	const { submit } = useForm()
	const { isModalOpen, toggleModal } = useModal()
	const modalSlug = "publish-newsletter"

	const publish = useCallback(() => {
		if (uploadStatus === "uploading") {
			return
		}

		void submit({
			overrides: {
				_status: "published",
			},
		})

		setUnpublishedVersionCount(0)
		setMostRecentVersionIsAutosaved(false)
		setHasPublishedDoc(true)
	}, [
		setHasPublishedDoc,
		submit,
		setUnpublishedVersionCount,
		uploadStatus,
		setMostRecentVersionIsAutosaved,
	])

	return (
		<>
			<Button
				onClick={() => {
					toggleModal(modalSlug)
				}}
			>
				Publish Newsletter?
			</Button>
			{isModalOpen(modalSlug) && (
				<ConfirmationModal
					modalSlug={modalSlug}
					onConfirm={() => {
						publish()
						toggleModal(modalSlug)
					}}
					body="Publish this Newsletter?"
					heading="This will send the Newsletter to all opted-in users."
				/>
			)}
		</>
	)
}
