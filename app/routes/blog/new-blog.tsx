import { Form, useActionData, useTransition } from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";

const inputClassName = `flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose`;

type ActionData =
  | {
      title: null | string;
      slug: null | string;
      markdown: null | string;
    }
  | undefined;
export const action: ActionFunction = async ({ request }) => {
  await new Promise((res) => setTimeout(res, 1000));

  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  const errors: ActionData = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    markdown: markdown ? null : "Markdown is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json<ActionData>(errors);
  }

  return redirect("/blog");
};

export default function IBlog() {
  const errors = useActionData();

  const transition = useTransition();
  const isCreating = Boolean(transition.submission);km

  return (
      <Form
        method="post"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "100%",
        }}
      >
        <div>
          <label className="flex w-full flex-col gap-1">
            Post Title:{" "}
            {errors?.title ? (
              <em className="text-red-600">{errors.title}</em>
            ) : null}
            <input type="text" name="title" className={inputClassName} />
          </label>
        </div>
        <div>
          <label className="flex w-full flex-col gap-1">
            Owner:{" "}
            {errors?.owner ? (
              <em className="text-red-600">{errors.owner}</em>
            ) : null}
            <input type="text" name="owner" className={inputClassName} />
          </label>
        </div>
        <p className="text-right">
          <button
            type="submit"
            className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Create Post"}
          </button>
        </p>
      </Form>
  );
}
