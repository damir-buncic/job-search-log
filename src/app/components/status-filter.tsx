"use client";

import React from "react";
import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useSearchParams,useRouter } from "next/navigation";

const STATUSES = ["All", "Pending", "Rejected"];

export const StatusFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  function filterStatus(e: SelectChangeEvent<string>) {
    const newParams = new URLSearchParams(searchParams);
    const newStatus = e.target.value;
    if (newStatus === "All") {
      newParams.delete("status");
    } else {
      newParams.set("status", newStatus);
    }
    router.replace(`?${newParams.toString()}`);
  }

  return (
    <FormControl sx={{ width: "100px" }}>
      <Select defaultValue="All" onChange={filterStatus}>
        {STATUSES.map((b) => (
          <MenuItem key={b} value={b}>
            {b}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
