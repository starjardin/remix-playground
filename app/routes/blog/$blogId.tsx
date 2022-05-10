import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import type { Blog } from "~/models/blog.server";
import { deleteNote } from "~/models/note.server";
import { getNewBlog } from "~/models/blog.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  blog: Blog;
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.blogId, "noteId not found");

  const blog = await getNewBlog(params.blogId);
  if (!blog) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ blog: blog });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  await deleteNote({ userId, id: params.noteId });

  return redirect("/notes");
};

export default function NoteDetailsPage() {
  const {blog} = useLoaderData() as LoaderData;

  return (
    <div>
      <h3 className="text-2xl font-bold">{blog.title}</h3>
      <p className="py-6">{blog.owner}</p>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Note not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
