import Editor from '@components/blogs/Editor';
import Card from "@components/common/card";
import Button from "@components/ui/button";
import Description from "@components/ui/description";
import FileInput from '@components/ui/file-input';
import Input from "@components/ui/input";
import Label from "@components/ui/label";
import SelectInput from "@components/ui/select-input";
import { fetchMe } from "@data/user/use-me.query";
import { yupResolver } from "@hookform/resolvers/yup";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import http from "@utils/api/http";
import { useTranslation } from "next-i18next";
import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const validation = yup.object().shape({
	title: yup.string().required('Title is required'),
	// body: yup.string().required('Body is required'),
	// category_id: yup.required('Category is required'),
	tag: yup.string().required('Tag is required'),
	keyword: yup.string().required('Keyword is required'),
});
type IProps = {
	initialValues?: any;
};
const BlogForm = ({ initialValues }: IProps) => {
	const { t } = useTranslation();
	const [loading, setLoading] = useState(false)
	const [author, setAuthor] = useState(null)
	const [categories, setCategories] = useState([])
	const [editorBody, setEditorBody] = useState('')
	const { query } = useRouter()
	const id = query.id

	useEffect(() => {
		if (id) {
			http.get(`api/${API_ENDPOINTS.BLOGS}/${id}`)
				.then(response => {
					if (response?.data) {
						const blog = response?.data?.data
						const values = { ...blog, category_id: { label: blog?.category?.title, value: blog?.category_id } }
						setEditorBody(blog?.body)
						reset(values)
					}
				})
		}
	}, [id])



	const defaultValues = {
		title: initialValues?.title || "",
		tag: initialValues?.tag || "",
		body: initialValues?.body || editorBody,
		category_id: initialValues?.category_id ? { label: initialValues?.category?.title, value: initialValues?.category_id } : "",
		keyword: initialValues?.keyword || "",
	};

	useEffect(() => {
		fetchMe().then(response => {
			setAuthor(response)
		})
	}, [])

	useEffect(() => {
		http.get(`api/${API_ENDPOINTS.CATEGORIES}`)
			.then(response => {
				if (Array.isArray(response?.data?.data)) {
					const list = response.data.data.map((item: any) => {
						return {
							value: item.id,
							label: item.title,
						}
					})
					setCategories(list)
				}
			})
	}, [])

	const {
		register,
		handleSubmit,
		setError,
		control,
		formState: { errors },
		reset
	} = useForm<any>({
		defaultValues,
		resolver: yupResolver(validation),
	});

	async function onSubmit(values: any) {
		const payload = {
			...values,
			category_id: values?.category_id?.value,
			// @ts-ignore
			author_id: author?.id,
			body: editorBody,
		}
		setLoading(true)
		const action = id ? `api/${API_ENDPOINTS.BLOGS}/${id}` : `api/${API_ENDPOINTS.BLOGS}`
		http.post(action, payload).then(response => {
			setLoading(false)
			if (response?.data?.success) {
				router.push('/blogs')
			}
			if (response?.data?.errors) {
				Object.keys(response?.data?.errors).forEach((field: any) => {
					setError(field, {
						type: "manual",
						message: response?.data?.errors[field][0],
					});
				});
			}
		}).catch(error => {
			setLoading(false)
			if (error?.response) {
				Object.keys(error?.response?.data).forEach((field: any) => {
					setError(field, {
						type: "manual",
						message: error?.response?.data[field][0],
					});
				});
			}
		})
	}

	useEffect(() => {
		reset(initialValues)
	}, [reset])

	return (
		<form onSubmit={handleSubmit(onSubmit)} noValidate>
			<div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
				<Description
					title="Cover Image"
					className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
				/>

				<Card className="w-full sm:w-8/12 md:w-2/3">
					<FileInput name="image" control={control} multiple={false} />
				</Card>
			</div>
			<div className="flex flex-wrap my-5 sm:my-8">
				<Description
					title={t("form:form-title-information")}
					className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
				/>

				<Card className="w-full sm:w-8/12 md:w-2/3">
					<Input
						label="Title"
						{...register("title")}
						type="text"
						variant="outline"
						className="mb-4"
						error={t(errors.title?.message!)}
					/>
					<div className='mb-5'>
						<Label>Body</Label>
						<Editor
							name="body"
							control={control}
							state={[editorBody, setEditorBody]}
							error={t(errors.body?.message!)}
						/>
					</div>
					<div className="mb-5">
						<Label>Select Category</Label>
						<SelectInput
							name="category_id"
							control={control}
							options={categories}
							isClearable={true}
							error={t(errors.category_id?.message!)}
						/>
					</div>
					<Input
						label="Tag"
						{...register("tag")}
						type="text"
						variant="outline"
						className="mb-4"
						error={t(errors.tag?.message!)}
					/>
					<Input
						label="Keyword"
						{...register("keyword")}
						type="text"
						variant="outline"
						className="mb-4"
						error={t(errors.keyword?.message!)}
					/>
				</Card>
			</div>

			<div className="mb-4 text-end">
				<Button loading={loading} disabled={loading}>
					Save
				</Button>
			</div>
		</form>
	);
};

export default BlogForm;
