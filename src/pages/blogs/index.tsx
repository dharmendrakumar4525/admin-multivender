import BlogList from "@components/blogs/blog-list";
import Card from "@components/common/card";
import Search from "@components/common/search";
import Layout from "@components/layouts/admin";
import ErrorMessage from "@components/ui/error-message";
import LinkButton from "@components/ui/link-button";
import Loader from "@components/ui/loader/loader";
import { SortOrder } from "@ts-types/generated";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import http from "@utils/api/http";
import { ROUTES } from "@utils/routes";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Fragment, useCallback, useEffect, useState } from "react";

export default function Customers() {
	// @ts-ignore
	const [searchTerm, setSearchTerm] = useState("");
	const [page, setPage] = useState(1);
	const [blogs, setBlogs] = useState([]);
	const [meta, setMeta] = useState({ total: 0, currentPage: 0, perPage: 0 });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { t } = useTranslation();
	// @ts-ignore
	const [orderBy, setOrder] = useState("created_at");
	// @ts-ignore
	const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);

	const fetchBlogs = useCallback((page: any, searchTerm: any) => {
		setLoading(true)
		setError(null)
		http.get(`api/${API_ENDPOINTS.BLOGS}?page=${page}&search=${searchTerm}`)
			.then(response => {
				setLoading(false)
				if (Array.isArray(response?.data?.data)) {
					setBlogs(response?.data)
					const { total, current_page, per_page } = response?.data?.meta
					setMeta({ total, currentPage: current_page, perPage: per_page })
				}
			}).catch(error => {
				setError(error)
				setLoading(false)
			})
	}, [])


	useEffect(() => {
		fetchBlogs(1, '')
	}, [])

	useEffect(() => {
		if (page > 1) {
			fetchBlogs(page, '')
		}
	}, [page])

	if (loading) return <Loader text={t("common:text-loading")} />;
	// @ts-ignore
	if (error) return <ErrorMessage message={error.message} />;

	function handleSearch({ searchText }: { searchText: string }) {
		setSearchTerm(searchText);
		setPage(1);
	}

	function handlePagination(current: any) {
		setPage(current);
	}
	return (
		<Fragment>
			<Card className="flex flex-col md:flex-row items-center mb-8">
				<div className="md:w-1/4 mb-4 md:mb-0">
					<h1 className="text-lg font-semibold text-heading">
						Blogs
					</h1>
				</div>

				<div className="w-full md:w-3/4 flex items-center ms-auto">
					<Search onSearch={handleSearch} />
					<LinkButton
						href={`${ROUTES.BLOGS}/create`}
						className="h-12 ms-4 md:ms-6"
					>
						<span>+ Create Blog</span>
					</LinkButton>
				</div>
			</Card>

			{loading ? null : (
				<BlogList
					blogs={blogs}
					meta={meta}
					onPagination={handlePagination}
					onOrder={setOrder}
					onSort={setColumn}
				/>
			)}
		</Fragment>
	);
}
Customers.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ["table", "common", "form"])),
	},
});
