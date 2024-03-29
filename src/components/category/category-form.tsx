import Card from "@components/common/card";
import * as categoriesIcon from "@components/icons/category";
import Button from "@components/ui/button";
import Description from "@components/ui/description";
import FileInput from "@components/ui/file-input";
import Input from "@components/ui/input";
import Label from "@components/ui/label";
import SelectInput from "@components/ui/select-input";
import TextArea from "@components/ui/text-area";
import { useCreateCategoryMutation } from "@data/category/use-category-create.mutation";
import { useUpdateCategoryMutation } from "@data/category/use-category-update.mutation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Category } from "@ts-types/generated";
import { getIcon } from "@utils/get-icon";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
	useForm
} from "react-hook-form";
import http from '../../utils/api/http';
import { categoryIcons } from "./category-icons";
import { categoryValidationSchema } from "./category-validation-schema";

export const updatedIcons = categoryIcons.map((item: any) => {
	item.label = (
		<div className="flex space-s-5 items-center">
			<span className="flex w-5 h-5 items-center justify-center">
				{getIcon({
					iconList: categoriesIcon,
					iconName: item.value,
					className: "max-h-full max-w-full",
				})}
			</span>
			<span>{item.label}</span>
		</div>
	);
	return item;
});



type FormValues = {
	name: string;
	details: string;
	parent: any;
	image: any;
	banner_image: any;
	icon: any;
};

const defaultValues = {
	image: [],
	banner_image: [],
	name: "",
	details: "",
	parent: "",
	icon: "",
};

type IProps = {
	initialValues?: Category | null;
};
export default function CreateOrUpdateCategoriesForm({
	initialValues,
}: IProps) {
	// console.log(initialValues?.parent?.id);

	const [categoryList, setCategoryList] = useState([])
	const router = useRouter();
	const { t } = useTranslation();
	const {
		register,
		handleSubmit,
		control,

		formState: { errors },
	} = useForm<FormValues>({
		// shouldUnregister: true,
		//@ts-ignore
		defaultValues: initialValues
			? {
				...initialValues,
				icon: initialValues?.icon
					? categoryIcons.find(
						(singleIcon) => singleIcon.value === initialValues?.icon!
					)
					: "",
				parent: { value: initialValues?.parent?.id, label: initialValues?.parent?.name }
			}
			: defaultValues,
		resolver: yupResolver(categoryValidationSchema),
	});

	const { mutate: createCategory, isLoading: creating } =
		useCreateCategoryMutation();
	const { mutate: updateCategory, isLoading: updating } =
		useUpdateCategoryMutation();

	useEffect(() => {
		http.get(`/categories?parent=null`).then((res) => {
			if (Array.isArray(res?.data?.data)) {
				setCategoryList(res?.data?.data);
			}
		});
	}, [])


	const updatedCageoryList = categoryList.map((item: any) => {
		return {
			label: item.name,
			value: item.id,
		}
	});

	const onSubmit = async (values: FormValues) => {
		const input = {
			name: values.name,
			details: values.details,
			image: {
				thumbnail: values?.image?.thumbnail,
				original: values?.image?.original,
				id: values?.image?.id,
			},
			banner_image: {
				thumbnail: values?.banner_image?.thumbnail,
				original: values?.banner_image?.original,
				id: values?.banner_image?.id,
			},
			icon: values.icon?.value || "",
			parent: values?.parent?.value ?? null
		};

		if (initialValues) {
			updateCategory({
				variables: {
					id: initialValues?.id,
					input: {
						...input,
					},
				},
			});
		} else {
			createCategory({
				variables: {
					input,
				},
			});
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
				<Description
					title={t("form:input-label-image")}
					details={t("form:category-image-helper-text")}
					className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
				/>

				<Card className="w-full sm:w-8/12 md:w-2/3">
					<FileInput name="image" control={control} multiple={false} />
				</Card>
			</div>

			<div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
				<Description
					title={t("form:input-label-banner-image")}
					details={t("form:category-banner-image-helper-text")}
					className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
				/>

				<Card className="w-full sm:w-8/12 md:w-2/3">
					<FileInput name="banner_image" control={control} multiple={false} />
				</Card>
			</div>

			<div className="flex flex-wrap my-5 sm:my-8">
				<Description
					title={t("form:input-label-description")}
					details={`${initialValues
						? t("form:item-description-edit")
						: t("form:item-description-add")
						} ${t("form:category-description-helper-text")}`}
					className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8 "
				/>

				<Card className="w-full sm:w-8/12 md:w-2/3">
					<div className="mb-5">
						<Label>Select Category</Label>
						<SelectInput
							name="parent"
							control={control}
							options={updatedCageoryList}
							isClearable={true}
						/>
					</div>

					<Input
						label={t("form:input-label-name")}
						{...register("name")}
						error={t(errors.name?.message!)}
						variant="outline"
						className="mb-5"
					/>

					<TextArea
						label={t("form:input-label-details")}
						{...register("details")}
						variant="outline"
						className="mb-5"
					/>

					<div className="mb-5">
						<Label>{t("form:input-label-select-icon")}</Label>
						<SelectInput
							name="icon"
							control={control}
							options={updatedIcons}
							isClearable={true}
						/>
					</div>
				</Card>
			</div>
			<div className="mb-4 text-end">
				{initialValues && (
					<Button
						variant="outline"
						onClick={router.back}
						className="me-4"
						type="button"
					>
						{t("form:button-label-back")}
					</Button>
				)}

				<Button loading={creating || updating}>
					{initialValues
						? t("form:button-label-update-category")
						: t("form:button-label-add-category")}
				</Button>
			</div>
		</form>
	);
}
