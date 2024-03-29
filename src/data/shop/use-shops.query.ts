import Shop from "@repositories/shop";
import { QueryParamsType, ShopsQueryOptionsType } from "@ts-types/custom.types";
import { ShopPaginator } from "@ts-types/generated";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { mapPaginatorData, stringifySearchQuery } from "@utils/data-mappers";
import { useQuery } from "react-query";

const fetchShops = async ({
	queryKey,
}: QueryParamsType): Promise<{ shops: ShopPaginator }> => {
	const [_key, params] = queryKey;

	const {
		page,
		text,
		status,
		limit = 15,
		orderBy = "updated_at",
		sortedBy = "DESC",
	} = params as ShopsQueryOptionsType;
	const searchString = stringifySearchQuery({
		name: text,
		is_active: status,
	});
	const url = `${API_ENDPOINTS.SHOPS}?search=${searchString}&searchJoin=and&limit=${limit}&page=${page}&orderBy=${orderBy}&sortedBy=${sortedBy}`;
	const {
		data: { data, ...rest },
	} = await Shop.all(url);
	return {
		shops: {
			data,
			paginatorInfo: mapPaginatorData({ ...rest }),
		},
	};
};

const useShopsQuery = (options: ShopsQueryOptionsType) => {
	return useQuery<{ shops: ShopPaginator }, Error>(
		[API_ENDPOINTS.SHOPS, options],
		fetchShops,
		{
			keepPreviousData: true,
		}
	);
};

export { useShopsQuery, fetchShops };
