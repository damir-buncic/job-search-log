"use client";

import { Box } from "@mui/material";
import React, { FormEvent, useState } from "react";

type Props = {
  onSubmit: (formData: FormData) => void;
  children: React.ReactNode;
};

const formStyle = {
  "&.validated input:invalid + fieldset, &.validated input:invalid + svg + fieldset": {
    borderColor: "red",
  },
};

export const Form: React.FC<Props> = ({ children, onSubmit }) => {
  const [validated, setValidated] = useState(false);

  function submitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setValidated(true);
    if (e.currentTarget.checkValidity()) {
      const formData = new FormData(e.currentTarget);
      onSubmit?.(formData);
    }
  }
  return (
    <Box component="form" onSubmit={submitHandler} noValidate sx={formStyle} className={validated ? "validated" : ""}>
      {children}
    </Box>
  );
};
