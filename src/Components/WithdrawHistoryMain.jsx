import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Mobile from "./Mobile";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { domain } from "./config";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CalendarDrawer from "./CalendarDrawer";

const WithdrawHistoryMain = () => {
  const navigate = useNavigate();
  const [withdrawals, setWithdrawals] = useState([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [calendarDrawerOpen, setCalendarDrawerOpen] = useState(false);
  const [statusDrawerOpen, setStatusDrawerOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleDrawerClose = () => {
    setStatusDrawerOpen(false);
  };

  const handleOpenCalendarDrawer = () => {
    setCalendarDrawerOpen(true);
  };

  const handleCloseCalendarDrawer = () => {
    setCalendarDrawerOpen(false);
  };

  useEffect(() => {
    applyFilters();
  }, [withdrawals, selectedType, selectedStatus, startDate, endDate]);

  const fetchWithdrawals = async () => {
    console.log("Fetching withdrawal history...");

    try {
      const token = sessionStorage.getItem('token'); // Assuming the token is stored in localStorage
      const response = await axios.get(`${domain}/all-withdraw-history`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response received:", response);

      if (response.data.success) {
        console.log(
          "Withdrawal history fetch successful:",
          response.data.userWithdrawals
        );
        setWithdrawals(response.data.userWithdrawals);
        setFilteredWithdrawals(response.data.userWithdrawals);
      } else {
        console.warn(
          "Failed to fetch withdrawal history:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Error fetching withdrawal history:", error);
    }
  };

  const handleRedirect = () => {
    navigate(-1);
  };

  const applyFilters = () => {
    let filtered = withdrawals;

    if (selectedType !== "All") {
      filtered = filtered.filter((w) => w.withdrawMethod === selectedType);
    }

    if (selectedStatus !== "All") {
      filtered = filtered.filter((w) => w.status === selectedStatus);
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      filtered = filtered.filter((w) => {
        const createdAt = new Date(w.createdAt);
        return createdAt >= start && createdAt <= end;
      });
    }

    setFilteredWithdrawals(filtered);
  };

  const handleTypeChange = (type) => setSelectedType(type);

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setStatusDrawerOpen(false);
  };

  const handleDateRangeSelect = (range) => {
    setStartDate(range.start.toISOString().split("T")[0]);
    setEndDate(range.end.toISOString().split("T")[0]);
    setCalendarDrawerOpen(false);
    applyFilters();
  };

  const handleBackClick = () => navigate(-1);

  return (
    <Mobile>
      <Box sx={{ backgroundColor: "#F7F8FF", minHeight: "100vh" }}>
        {/* Top Bar */}
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            backgroundColor: "#FFFFFF",
            padding: "4px 8px",
            color: "black",
          }}
        >
          <Grid item container alignItems="center" justifyContent="center">
            <Grid item xs={2}>
              <IconButton
                sx={{ color: "black", ml: -5 }}
                onClick={handleRedirect}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
            </Grid>
            <Grid item xs={10}>
              <Typography
                variant="h6"
                sx={{
                  color: "black",
                  flexGrow: 1,
                  textAlign: "center",
                  mr: 8,
                }}
              >
                Withdrawal History
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        {/* Filter Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            padding: 0,
            marginBottom: 1,
            borderRadius: 2,
            marginTop: 2,
          }}
        >
          {[
            { label: "All", icon: "/assets/homet.png" },
            { label: "Bank Card", icon: "/assets/bankcard2.png" },
            { label: "USDT", icon: "/assets/usdt2.png" },
          ].map(({ label, icon }) => (
            <Button
              key={label}
              variant={selectedType === label ? "contained" : "outlined"}
              onClick={() => handleTypeChange(label)}
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: selectedType === label ? "#4A89FF" : "white",
                color: selectedType === label ? "black" : "#333",
                borderColor: selectedType === label ? "transparent" : "#E0E0E0",
                borderRadius: 2,
                boxShadow:
                  selectedType === label
                    ? "0px 4px 10px rgba(0, 0, 0, 0.1)"
                    : "none",
                padding: "6px 10px",
                minWidth: "100px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor:
                    selectedType === label ? "#FFFFFF" : "#FFFFFF",
                  borderColor:
                    selectedType === label ? "transparent" : "#E0E0E0",
                },
              }}
            >
              <Box
                component="img"
                src={icon}
                alt={label}
                sx={{
                  width: 24,
                  height: 24,
                  marginRight: 1,
                }}
              />
              {label}
            </Button>
          ))}
        </Box>

        {/* Filters */}
        <Grid
          container
          justifyContent="space-between"
          sx={{ marginTop: 2, paddingLeft: "3%", paddingRight: "3%" }}
        >
          <Button
            onClick={() => setStatusDrawerOpen(true)}
            sx={{
              width: "48%",
              height: "2.8rem",
              backgroundColor: "#ffffff",
              justifyContent: "space-between",
              textTransform: "none",
              color: "#80849c",
              padding: "0 16px",
              fontWeight: "bold",
              borderRadius: "5px",
            }}
          >
            {selectedStatus}
            <KeyboardArrowDownOutlinedIcon />
          </Button>
          <Button
            onClick={() => handleOpenCalendarDrawer(true)}
            sx={{
              width: "48%",
              height: "2.8rem",
              backgroundColor: "#ffffff",
              justifyContent: "space-between",
              textTransform: "none",
              color: "#80849c",
              padding: "0 16px",
              fontWeight: "bold",
              borderRadius: "5px",
            }}
          >
            {startDate && endDate
              ? `${startDate} - ${endDate}`
              : "Choose a date"}
            <KeyboardArrowDownOutlinedIcon />
          </Button>
        </Grid>

        {/* Withdrawal History */}
        <Box sx={{ padding: 2 }}>
          {filteredWithdrawals.map((withdrawal) => (
            <Card
              key={withdrawal._id}
              sx={{
                marginBottom: 2,
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                
              }}
            >
              <CardContent sx={{ padding: 0, mb: -2, backgroundColor: "#FFFFFF" }}>
                <Box sx={{ padding: 1, borderBottom: "1px solid #e0e0e0" , backgroundColor: "#4F99EB"}}>
                  <Grid container alignItems="center">
                    <Grid item xs={6} sx={{ textAlign: "left" }}>
                      <Chip
                        label="Withdraw"
                        sx={{
                          
                          color: "white",
                          fontWeight: "bold",
                          height: "24px", // Adjusting height to match the image
                          fontSize: "14px",
                          borderRadius: "4px",
                        }}
                      />
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: "right" }}>
                      <Typography
                        sx={{
                          color:
                            withdrawal.status === "Completed"
                              ? "#27ae60"
                              : withdrawal.status === "Pending"
                              ? "#f39c12"
                              : "#e74c3c",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {withdrawal.status}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ padding: 1.5 }}>
                  <Grid container spacing={1} sx={{ textAlign: "left", }}>
                    {[
                      {
                        label: "Balance",
                        value:
                          withdrawal.withdrawMethod === "USDT"
                            ? `$${withdrawal.balance}`
                            : `₹${withdrawal.balance}`,
                        color: "#27ae60",
                        fontSize: "14px",
                        fontWeight: "bold",
                      },
                      {
                        label: "Type",
                        value: withdrawal.withdrawMethod,
                        fontSize: "12px",
                      },
                      {
                        label: "Time",
                        value: new Date(withdrawal.createdAt).toLocaleString(),
                        fontSize: "12px",
                      },
                      {
                        label: "Order number",
                        value: withdrawal._id,
                        fontSize: "12px",
                      },
                      {
                        label: "Remark",
                        value: withdrawal.remark,
                        fontSize: "12px",
                      },
                    ].map(({ label, value, color, fontSize, fontWeight }) => (
                      <React.Fragment key={label}>
                        <Grid item xs={6}>
                          <Typography
                            sx={{
                              color: "black",
                              fontSize: "13px",
                              lineHeight: "20px",
                            }}
                          >
                            {label}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: "right" }}>
                          <Typography
                            sx={{
                              fontSize,
                              fontWeight: fontWeight || "medium",
                              color: color || "black",
                              lineHeight: "20px",
                            }}
                          >
                            {value}
                          </Typography>
                        </Grid>
                      </React.Fragment>
                    ))}
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Calendar Drawer */}
        {/* <Drawer
          anchor="bottom"
          open={calendarDrawerOpen}
          onClose={() => setCalendarDrawerOpen(false)}
          PaperProps={{
            sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16 },
          }}
        >
          <Box sx={{ padding: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Calendar
              </Typography>
              <IconButton onClick={() => setCalendarDrawerOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="End Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleDateRangeConfirm}
            >
              Confirm
            </Button>
          </Box>
        </Drawer> */}

        {/* <Drawer
  anchor="bottom"
  open={calendarDrawerOpen}
  onClose={() => setCalendarDrawerOpen(false)}
  PaperProps={{
    sx: { 
      borderTopLeftRadius: 16, 
      borderTopRightRadius: 16,
      maxWidth: isSmallScreen ? "425px" : "396px",
      margin: "0 auto",
      width: "100%",
    },
  }}
>
  <CalendarDrawer
    onDateSelect={(date) => {
      setStartDate(date.toISOString().split('T')[0]);
      setEndDate(date.toISOString().split('T')[0]);
    }}
    onConfirm={() => {
      setCalendarDrawerOpen(false);
      applyFilters();
    }}
  />
</Drawer> */}

        <CalendarDrawer
          isOpen={calendarDrawerOpen}
          onClose={handleCloseCalendarDrawer}
          onRangeSelect={handleDateRangeSelect}
        />

        {/* <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textAlign: "center",
                marginBottom: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center", }}>
                Select Status
              </Typography>
              <IconButton onClick={() => setStatusDrawerOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box> */}

        {/* Status Drawer */}
        <Drawer
          anchor="bottom"
          open={statusDrawerOpen}
          onClose={() => setStatusDrawerOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: "100%",
              height: "auto",
              margin: "0 auto",
              maxWidth: isSmallScreen ? "600px" : "396px",
              backgroundColor: "white",
              color: "black",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
            },
          }}
        >
          <Box sx={{ padding: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <Typography
                sx={{ color: "#888", cursor: "pointer", fontWeight: "bold" }}
                onClick={handleDrawerClose}
              >
                Cancel
              </Typography>
              <Typography
                sx={{ color: "#4782ff", fontWeight: "bold", cursor: "pointer" }}
              >
                Confirm
              </Typography>
            </Box>
            <List>
              {["All", "Pending", "Completed", "Rejected"].map((status) => (
                <ListItem
                  key={status}
                  label={status}
                  onClick={() => handleStatusChange(status)}
                  sx={{
                    color: "#000",
                    fontWeight: "normal",
                    borderBottom: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  <ListItemText primary={status} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Box>
    </Mobile>
  );
};

export default WithdrawHistoryMain;
