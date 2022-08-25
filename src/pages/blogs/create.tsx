import BlogForm from "@components/blogs/blog-form";
import Layout from "@components/layouts/admin";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Fragment } from "react";

export default function CreateUserPage() {
	return (
		<Fragment>
			<div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
				<h1 className="text-lg font-semibold text-heading">
					Create New Blog
				</h1>
			</div>
			<BlogForm initialValues={null} />
		</Fragment>
	);
}
CreateUserPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ["table", "form", "common"])),
	},
});
