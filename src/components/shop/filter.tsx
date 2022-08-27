import Label from "@components/ui/label";
import Select from "@components/ui/select/select";
import cn from "classnames";
import { statusOptions } from "./shop-form";

type Props = {
	onStatusFilter: Function;
	className?: string;
};

export default function Filter({ onStatusFilter, className, }: Props) {

	return (
		<div
			className={cn(
				"flex flex-col md:flex-row md:space-x-5 md:items-end space-y-5 md:space-y-0 w-full",
				className
			)}
		>
			<div className="w-full">
				<Label>Filter by Status</Label>
				<Select
					options={statusOptions}
					getOptionLabel={(option: any) => option.name}
					getOptionValue={(option: any) => option.value}
					placeholder="Filter by Status"
					// isLoading={categoryLoading}
					onChange={onStatusFilter}
				/>
			</div>
		</div>
	);
}
