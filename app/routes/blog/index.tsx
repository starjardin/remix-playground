import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getNewBlogs } from "~/models/blog.server";

type LoaderData = {
  blogs: Awaited<ReturnType<typeof getNewBlogs>>;
};

export const loader: LoaderFunction = async () => {
  return json({ blogs: await getNewBlogs() });
};

export default function NewBlogIndexPage() {
  const { blogs } = useLoaderData() as LoaderData;
  
  return (
    <section>
      <div className="mx-auto max-w-4xl">
        <h1 className="my-6 mb-2 border-b-2 text-center text-3xl">
          Blog Admin
        </h1>
        <div className="grid grid-cols-4 gap-6">
          <nav className="col-span-4 md:col-span-1">
            <ul>
              {blogs.map((blog) => (
                <li key={blog.id}>
                  <Link to={blog.id} className="text-blue-600 underline">
                    {blog.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <main className="col-span-4 md:col-span-3">
            <Link to="new-blog" className="text-blue-500 underline">
              create a new blog.
            </Link>
          </main>
        </div>
      </div>
    </section>
  );
}
