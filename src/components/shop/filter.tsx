import Label from "@components/ui/label";
import Select from "@components/ui/select/select";
import cn from "classnames";

type Props = {
	onStatusFilter: Function;
	className?: string;
};

export default function Filter({ onStatusFilter, className, }: Props) {
	const statusList = [
		{ label: 'Active', value: '1' },
		{ label: 'Inactive', value: '0' },
	]

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
					options={statusList}
					getOptionLabel={(option: any) => option.label}
					getOptionValue={(option: any) => option.value}
					placeholder="Filter by Status"
					// isLoading={categoryLoading}
					onChange={onStatusFilter}
				/>
			</div>
		</div>
	);
}
