import { Collapse } from "@mui/material";
import React from "react";

function CollapseProduct({ open, id }) {
  return <Collapse in={open} id={id}></Collapse>;
}

export default CollapseProduct;
