import { JobForm } from "./components/form";
import { fetchJobById, saveJob } from "@/app/server-actions/job";
import { Comments } from "./components/comments";
import { saveComment } from "@/app/server-actions/comment";
import { redirect } from "next/navigation";
import { Stack } from "@mui/material";

export default async function JobPage({ params }: { params: { id: string } }) {
  const id = params.id;

  const data = id === "new" ? null : await fetchJobById(+id);

  if (!data && id !== "new") {
    redirect("/not-found");
  }

  return (
    <Stack spacing={3}>
      <h1>{data ? `${data.position} @ ${data.company}` : "Add new job"}</h1>
      <JobForm data={data} onSubmit={saveJob} id={id} />
      {data && <Comments data={data} onSubmit={saveComment} />}
    </Stack>
  );
}
