"use client";

import { Job, Prisma } from "@prisma/client";
import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Form } from "@/app/components/form";
import { autoFill } from "@/app/server-actions/job";
import { toast } from "react-toastify";

const BOARDS = ["Linked In", "Linked In / External", "Cord", "Cord / External", "Remote OK", "Welcome to the Jungle"];

type Props = {
  data: Prisma.JobGetPayload<{ include: { comments: true } }> | null;
  id: string;
  onSubmit: (id: number | undefined, data: Prisma.JobCreateInput) => Promise<void>;
};

export const JobForm: React.FC<Props> = ({ data: _data, onSubmit, id }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Prisma.JobGetPayload<{ include: { comments: true } }> | Prisma.JobCreateInput>(
    _data ?? {
      appliedAt: dayjs().format("YYYY-MM-DD"),
      board: "",
      company: "",
      country: "",
      link: "",
      position: "",
      status: "",
    }
  );

  async function submitHandler(formData: FormData) {
    const payload = Object.fromEntries(formData.entries()) as unknown as Omit<Job, "id"> & { id?: number };
    try {
      await onSubmit(id === "new" ? undefined : +id, payload);
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  async function autofillFields() {
    setLoading(true);
    try {
      const res = await autoFill(data!.link);
      setData({
        ...data,
        company: res.company ?? "",
        position: res.position ?? "",
        country: res.country ?? "",
        board: res.board ?? "",
      });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const changeHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.currentTarget;
    setData({ ...data, [name]: value });
  };

  const selectChangeHandler = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  return (
    <Form onSubmit={submitHandler}>
      <Stack spacing={2}>
        <TextField
          label="Position"
          name="position"
          variant="outlined"
          onChange={changeHandler}
          value={data.position}
          required
        />
        <TextField
          label="Company"
          name="company"
          variant="outlined"
          onChange={changeHandler}
          value={data.company}
          required
        />
        <TextField
          label="Country"
          name="country"
          variant="outlined"
          onChange={changeHandler}
          value={data.country}
          required
        />
        <FormControl>
          <InputLabel>Board</InputLabel>
          <Select label="Board" name="board" onChange={selectChangeHandler} value={data.board} required>
            {BOARDS.map((b) => (
              <MenuItem key={b} value={b}>
                {b}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <DatePicker label="Applied at" defaultValue={dayjs(data?.appliedAt)} format="YYYY-MM-DD" name="appliedAt" />
        <FormGroup sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
          <TextField
            sx={{ flexGrow: 1 }}
            label="Link"
            name="link"
            variant="outlined"
            onChange={changeHandler}
            value={data.link}
            required
          />
          {id === "new" && (
            <Button disabled={!data?.link || loading} variant="outlined" onClick={autofillFields}>
              Autofill
            </Button>
          )}
        </FormGroup>
        <input type="hidden" name="status" value={data?.status || "Pending"} />
        <Button variant="contained" type="submit">
          Save
        </Button>
      </Stack>
    </Form>
  );
};
