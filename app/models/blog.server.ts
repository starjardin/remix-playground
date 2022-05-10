import type { Blog } from "@prisma/client";
import { prisma } from "~/db.server";
export type { Blog } from "@prisma/client";

export async function getNewBlogs() {
  return prisma.blog.findMany();
}

export async function getNewBlog(id: string) {
  return prisma.blog.findUnique({ where: { id } });
}

export async function createNewBlog(post: any) {
  return prisma.blog.create({ data: post });
}

export function deleteBlog({
  id,
  userId,
}: Pick<Blog, "id"> & { userId: string }) {
  return prisma.note.deleteMany({
    where: { id, userId },
  });
}
