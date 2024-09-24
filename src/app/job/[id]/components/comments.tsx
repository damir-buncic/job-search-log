"use client";

import React from "react";
import { Box, Button, Card, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { Prisma } from "@prisma/client";
import { Form } from "@/app/components/form";
import dayjs from "dayjs";

type Props = {
  data: Prisma.JobGetPayload<{ include: { comments: true } }>;
  onSubmit: (status: string, data: Prisma.CommentUncheckedCreateInput) => void;
};

const STATUSES = ["Pending", "Rejected"];

export const Comments: React.FC<Props> = ({ data, onSubmit }) => {
  function submitHandler(formData: FormData) {
    const payload = Object.fromEntries(formData.entries()) as unknown as { comment: string; status: string };
    onSubmit(payload.status, { comment: payload.comment, createdAt: new Date(), jobId: data.id });
  }

  return (
    <Stack spacing={3} sx={{ marginTop: "30px" }}>
      <Form onSubmit={submitHandler}>
        <Stack spacing={2}>
          <TextField multiline required label="Comment" name="comment" />
          <Stack direction="row" spacing={2} justifyContent="end">
            <FormControl>
              <InputLabel>Status</InputLabel>
              <Select label="Status" name="status" defaultValue={data.status} required>
                {STATUSES.map((b) => (
                  <MenuItem key={b} value={b}>
                    {b}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" type="submit">
              Add
            </Button>
          </Stack>
        </Stack>
      </Form>
      <Stack spacing={3}>
        {data.comments?.map((comment) => (
          <Card sx={{ padding: "10px" }} key={comment.id}>
            <Box sx={{ textAlign: "right", color: "GrayText", fontStyle: "italic", fontSize: "12px" }}>
              {dayjs(comment.createdAt).format("DD.MM.YYYY. HH:mm")}
            </Box>
            <div>{comment.comment}</div>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
};
