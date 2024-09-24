"use server";

import { Prisma } from "@prisma/client";
import prisma from "../../../prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveComment(status: string, comment: Prisma.CommentUncheckedCreateInput) {
  try {
    await prisma.comment.create({ data: comment });
    await prisma.job.update({ where: { id: comment.jobId }, data: { status } });

    revalidatePath("");
    redirect("");
  } catch {
    console.log("ERR");
  }
}
