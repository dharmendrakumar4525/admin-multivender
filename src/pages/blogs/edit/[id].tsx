import BlogForm from "@components/blogs/blog-form";
import Layout from "@components/layouts/admin";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Fragment } from "react";

export default function EditUserPage() {



    return (
        <Fragment>
            <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
                <h1 className="text-lg font-semibold text-heading">
                    Edit New Blog
                </h1>
            </div>
            <BlogForm initialValues={null} />
        </Fragment>
    );
}
EditUserPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ["form", "common"])),
    },
});


