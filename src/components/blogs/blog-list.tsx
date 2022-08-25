import ActionButtons from "@components/common/action-buttons";
import Pagination from "@components/ui/pagination";
import { Table } from "@components/ui/table";
import { siteSettings } from "@settings/site.settings";
import { SortOrder } from "@ts-types/generated";
import { useIsRTL } from "@utils/locals";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

type IProps = {
	blogs: any;
	meta: any;
	onPagination: (current: number) => void;
	onSort: (current: any) => void;
	onOrder: (current: string) => void;
};
const BlogList = ({ blogs, meta, onPagination, onSort, onOrder }: IProps) => {
	const { data } = blogs!;
	const router = useRouter()

	const { t } = useTranslation();
	const { alignLeft } = useIsRTL();

	const [sortingObj, setSortingObj] = useState<{
		sort: SortOrder;
		column: any | null;
	}>({
		sort: SortOrder.Desc,
		column: null,
	});
	// @ts-ignore
	const onHeaderClick = (column: any | null) => ({
		onClick: () => {
			onSort((currentSortDirection: SortOrder) =>
				currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
			);

			onOrder(column);

			setSortingObj({
				sort:
					sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
				column: column,
			});
		},
	});

	const columns = [
		{
			title: "Image",
			dataIndex: "image",
			key: "image",
			align: "center",
			width: 74,
			render: (image: any, record: any) => (
				<Image
					src={image?.thumbnail ?? siteSettings.avatar.placeholder}
					alt={record?.name}
					layout="fixed"
					width={100}
					height={100}
					className="rounded overflow-hidden"
				/>
			),
		},
		{
			title: "Title",
			dataIndex: "title",
			key: "title",
			align: alignLeft,
		},
		{
			title: "Category",
			dataIndex: "category",
			key: "category",
			align: alignLeft,
			render: (category: any) => category?.title,
		},
		{
			title: "Tag",
			dataIndex: "tag",
			key: "tag",
			width: 150
		},
		{
			title: t("table:table-item-actions"),
			dataIndex: "id",
			key: "actions",
			align: "center",
			render: (id: string) => {
				return (
					<ActionButtons
						id={id}
						editUrl={`${router.asPath}/edit/${id}`}
						deleteModalView="DELETE_BLOG"
					/>
				);
			},
		},
	];

	return (
		<>
			<div className="rounded overflow-hidden shadow mb-6">
				<Table
					// @ts-ignore
					columns={columns}
					emptyText={t("table:empty-table-data")}
					data={data}
					rowKey="id"
					scroll={{ x: 800 }}
				/>
			</div>

			{!!meta.total && (
				<div className="flex justify-end items-center">
					<Pagination
						total={meta.total}
						current={meta.currentPage}
						pageSize={meta.perPage}
						onChange={onPagination}
					/>
				</div>
			)}
		</>
	);
};

export default BlogList;
