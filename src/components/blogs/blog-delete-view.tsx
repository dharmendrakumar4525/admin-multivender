import ConfirmationCard from "@components/common/confirmation-card";
import {
	useModalAction,
	useModalState
} from "@components/ui/modal/modal.context";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import http from "@utils/api/http";
import router from "next/router";
import { useState } from "react";

const BlogDeleteView = () => {
	const [loading, setLoading] = useState(false)
	const { data } = useModalState();
	const { closeModal } = useModalAction();

	async function handleDelete() {
		setLoading(true)
		http.delete(`api/${API_ENDPOINTS.BLOGS}/${data}`)
			.then(_ => {
				setLoading(false)
				closeModal();
				router.reload()
			}).catch(_ => {
				setLoading(false)
			})
		closeModal();
	}

	return (
		<ConfirmationCard
			onCancel={closeModal}
			onDelete={handleDelete}
			deleteBtnLoading={loading}
		/>
	);
};

export default BlogDeleteView;
