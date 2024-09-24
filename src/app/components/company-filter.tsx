"use client";

import React, { FormEvent } from "react";
import { TextField } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";

export const CompanyFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  function filterCompany(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    const company = new FormData(e.currentTarget).get("company")?.toString();
    if (!company) {
      newParams.delete("company");
    } else {
      newParams.set("company", company);
    }
    router.replace(`?${newParams.toString()}`);
  }

  return (
    <form noValidate onSubmit={filterCompany}>
      <TextField defaultValue="" name="company" />
    </form>
  );
};
