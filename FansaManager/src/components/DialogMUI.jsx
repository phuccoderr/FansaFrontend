import React from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from "@mui/material"

function DialogMUI({ title, contentText, open, setOpen, handleEvent }) {
  const handleSubmit = () => {
    setOpen(false);
    handleEvent();
  }
  return (
    <Dialog
      sx={{ opacity: "0.5! important" }}
      open={open}
      onClose={() => setOpen(false)}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {contentText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="info" onClick={handleSubmit}>Đồng ý</Button>
        <Button variant="error" onClick={() => setOpen(false)}>Huỷ</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogMUI;
