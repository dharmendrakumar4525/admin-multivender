import Select from "@components/ui/select/select";

import Label from "@components/ui/label";
import { useCategoriesQuery } from "@data/category/use-categories.query";
import { useTypesQuery } from "@data/type/use-types.query";
import cn from "classnames";
import { useTranslation } from "next-i18next";

type Props = {
	onCategoryFilter: Function;
	onTypeFilter: Function;
	onStockFilter: Function;
	onStatusFilter: Function;
	className?: string;
};

export default function CategoryTypeFilter({
	onTypeFilter,
	onCategoryFilter,
	onStockFilter,
	onStatusFilter,
	className,
}: Props) {
	const { t } = useTranslation();

	const { data, isLoading: loading } = useTypesQuery({
		limit: 999,
	});
	const { data: categoryData, isLoading: categoryLoading } = useCategoriesQuery(
		{
			limit: 999,
		}
	);
	const stockList = [
		{ label: 'In Stock', value: '1' },
		{ label: 'Out of Stock', value: '0' },
	]
	const statusList = [
		{ label: 'Publish', value: 'publish' },
		{ label: 'Draft', value: 'draft' }
	]

	return (
		<div
			className={cn(
				"flex flex-col md:flex-row md:space-x-5 md:items-end space-y-5 md:space-y-0 w-full",
				className
			)}
		>
			<div className="w-full">
				<Label>{t("common:filter-by-group")}</Label>
				<Select
					options={data?.types?.data}
					isLoading={loading}
					getOptionLabel={(option: any) => option.name}
					getOptionValue={(option: any) => option.slug}
					placeholder={t("common:filter-by-group-placeholder")}
					// @ts-ignore
					onChange={onTypeFilter}
				/>
			</div>
			<div className="w-full">
				<Label>{t("common:filter-by-category")}</Label>
				<Select
					options={categoryData?.categories?.data}
					getOptionLabel={(option: any) => option.name}
					getOptionValue={(option: any) => option.slug}
					placeholder={t("common:filter-by-category-placeholder")}
					isLoading={categoryLoading}
					// @ts-ignore
					onChange={onCategoryFilter}
				/>
			</div>
			<div className="w-full">
				<Label>Filter By Stock</Label>
				<Select
					options={stockList}
					getOptionLabel={(option: any) => option.label}
					getOptionValue={(option: any) => option.value}
					placeholder="Filter By Stock"
					// @ts-ignore
					onChange={onStockFilter}
				/>
			</div>
			<div className="w-full">
				<Label>Filter By Status</Label>
				<Select
					options={statusList}
					getOptionLabel={(option: any) => option.label}
					getOptionValue={(option: any) => option.value}
					placeholder="Filter By Status"
					// @ts-ignore
					onChange={onStatusFilter}
				/>
			</div>
		</div>
	);
}
