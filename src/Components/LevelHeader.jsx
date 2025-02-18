import React from "react";
import { Box, Button } from "@mui/material";

const LevelHeader = ({ onCancel, onConfirm }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "7px 16px",
      backgroundColor: "#fff",
      color: "#000",
    }}
  >
    <Button
      onClick={onCancel}
      sx={{ color: "#000", textTransform: "none" }}
    >
      Cancel
    </Button>
    <Button
  onClick={onConfirm}
  variant="contained"
  sx={{
    color: "#fff",
    background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
    textTransform: "none",
    '&:hover': {
      background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)", // Keep the background color the same on hover
    },
  }}
>
  Confirm Level
</Button>

  </Box>
);

export default LevelHeader;