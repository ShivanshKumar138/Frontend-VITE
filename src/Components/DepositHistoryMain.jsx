import React, { useEffect, useReducer, useState } from "react";
import {
  Box,
  Grid,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Mobile from "./Mobile";
import CalendarDrawer from "./CalendarDrawer";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import noDataImage from "../assets/14-a397ff6b.png";
import { domain } from "./config";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

// Initial state
const initialState = {
  selectedFilter: "All",
  selectedMethod: "All",
  isOptionsDrawerOpen: false,
  selectedDate: [
    new Date(new Date().setDate(new Date().getDate() - 5)),
    new Date(),
  ],
  depositHistory: [],
  loading: false,
  error: null,
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, selectedFilter: action.payload };
    case "SET_METHOD":
      return { ...state, selectedMethod: action.payload };
    case "TOGGLE_OPTIONS_DRAWER":
      return { ...state, isOptionsDrawerOpen: action.payload };
    case "SET_DATE":
      return { ...state, selectedDate: action.payload };
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, depositHistory: action.payload, loading: false };
    case "FETCH_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

// Main component
const DepositHistoryMain = () => {
  const [calendarDrawerOpen, setCalendarDrawerOpen] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const theme = useTheme();
  const [calendarKey, setCalendarKey] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [selectedDateRange, setSelectedDateRange] = useState({
    start: null,
    end: null,
  });

  const toggleCalendarDrawer = (open) => {
    setCalendarDrawerOpen(open);
    if (open) {
      setCalendarKey((prev) => prev + 1); // Increment key when opening drawer
    }
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleDateRangeSelect = (dateRange) => {
    console.log("Date range selected:", dateRange);
    dispatch({ type: "SET_DATE", payload: [dateRange.start, dateRange.end] });
  };

  const formatDateDisplay = (date) => {
    return date
      ? date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      : "Choose a date";
  };
  // Fetch deposit history based on filters and date range
  useEffect(() => {
    if (
      state.selectedFilter !== "All" ||
      state.selectedMethod !== "All" ||
      state.selectedDate[0] ||
      state.selectedDate[1]
    ) {
      fetchDepositHistory();
    }
  }, [state.selectedFilter, state.selectedMethod, state.selectedDate]);

  const fetchDepositHistory = async () => {
    if (state.loading) return; // Prevent multiple simultaneous requests
    dispatch({ type: "FETCH_START" });
    try {
      const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
      const response = await axios.get(`${domain}/deposit-history`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          filter: state.selectedFilter,
          method: state.selectedMethod,
          startDate: state.selectedDate[0]
            ? formatDate(state.selectedDate[0])
            : null,
          endDate: state.selectedDate[1]
            ? formatDate(state.selectedDate[1])
            : null,
        },
      });
      if (
        JSON.stringify(response.data.depositHistory) !==
        JSON.stringify(state.depositHistory)
      ) {
        dispatch({
          type: "FETCH_SUCCESS",
          payload: response.data.depositHistory,
        });
      } else {
        dispatch({ type: "FETCH_SUCCESS", payload: state.depositHistory });
      }
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: error.message });
    }
  };

  const formatDate = (date) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1); // Add 1 day
    return newDate.toISOString().split("T")[0];
  };

  const handleFilterClick = (filter) => {
    dispatch({ type: "SET_FILTER", payload: filter });
    dispatch({ type: "TOGGLE_OPTIONS_DRAWER", payload: false });
  };

  const handleMethodClick = (method) => {
    dispatch({ type: "SET_METHOD", payload: method });
  };

  const toggleOptionsDrawer = (open) => () => {
    dispatch({ type: "TOGGLE_OPTIONS_DRAWER", payload: open });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "#4CAF50";
      case "pending":
        return "#FFC107";
      case "failed":
        return "#F44336";
      default:
        return "#757575";
    }
  };

  const filteredDeposits = state.depositHistory.filter((deposit) => {
    const statusMatch =
      state.selectedFilter === "All" ||
      deposit.depositStatus.toLowerCase() ===
        state.selectedFilter.toLowerCase();
    const methodMatch =
      state.selectedMethod === "All" ||
      deposit.depositMethod.toLowerCase() ===
        state.selectedMethod.toLowerCase();
    const depositDate = new Date(deposit.depositDate.split("T")[0]);
    const dateMatch =
      (!state.selectedDate[0] ||
        depositDate >= new Date(formatDate(state.selectedDate[0]))) &&
      (!state.selectedDate[1] ||
        depositDate <= new Date(formatDate(state.selectedDate[1])));
    return statusMatch && methodMatch && dateMatch;
  });

  return (
    <div>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          position="relative"
          color="#f2f2f1"
          sx={{ minHeight: "100vh", bgcolor: "#F5F5F5" }}
        >
          <Box flexGrow={1} backgroundColor= "#380003">
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                backgroundColor: "#a50000",
                padding: "4px 8px",
                color: "black",
              }}
            >
              <Grid item container alignItems="center" justifyContent="center">
                <Grid item xs={2}>
                  <IconButton
                    onClick={() => navigate(-1)}
                    sx={{ color: "#e4911d", ml: -5 }}
                  >
                    <ArrowBackIosNewIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={10}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#e4911d",
                      flexGrow: 1,
                      textAlign: "center",
                      mr: 8,
                    }}
                  >
                    Deposit History
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            {/* Filter and Method Buttons */}
            <Grid
              container
              justifyContent="space-between"
              sx={{ marginTop: 2, paddingLeft: "4%", paddingRight: "4%" }}
            >
              {[
                { name: "All", icon: "/assets/all.png" },
                {
                  name: "UPI x PAYTM",
                  icon: "/assets/payNameIcon_20240821191115oyo6.png",
                },
                {
                  name: "UPI x QR",
                  icon: "/assets/payNameIcon_202407171749296o26.png",
                },
              ].map((method) => (
                <Grid item xs={4} key={method.name} sx={{ paddingX: 0.5 }}>
                  <Button
                    onClick={() => handleMethodClick(method.name)}
                    sx={{
                      width: "100%",
                      height: "2.5rem",
                      backgroundColor:
                        state.selectedMethod === method.name
                          ? "#e4911d"
                          : "#720811",
                          
                      textTransform: "none",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "0 8px",
                      color:
                        state.selectedMethod === method.name
                          ? "#ffffff"
                          : "#666666",
                      borderRadius: "5px",
                      fontWeight: "normal",
                      fontSize: "0.75rem",
                      "&:hover": {
                        background: "#e4911d",
                        color: "#ffffff",
                      },
                    }}
                  >
                    <img
                      src={method.icon}
                      alt={method.name}
                      style={{
                        width: "16px",
                        height: "16px",
                        marginRight: "4px",
                        filter:
                          state.selectedMethod === method.name
                            ? "none"
                            : "grayscale(100%)",
                      }}
                    />
                    <span>{method.name}</span>
                  </Button>
                </Grid>
              ))}
            </Grid>

            {/* Filter and Date Range Buttons */}
            <Grid
              container
              justifyContent="space-between"
              sx={{ marginTop: 2, paddingLeft: "5%", paddingRight: "5%" }}
            >
              <Button
                onClick={toggleOptionsDrawer(true)}
                sx={{
                  width: "48%",
                  height: "2.8rem",
                  backgroundColor: "#ffffff",
                  textTransform: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0 16px",
                  color: "#80849c",
                  fontWeight: "bold",
                  borderRadius: "5px",
                }}
              >
                <span>{state.selectedFilter}</span>
                <KeyboardArrowDownOutlinedIcon />
              </Button>
              <Button
                onClick={() => toggleCalendarDrawer(true)}
                sx={{
                  width: "48%",
                  height: "2.8rem",
                  backgroundColor: "#ffffff",
                  textTransform: "none",
                  display: "flex",
                  fontSize: "0.68rem",
                  justifyContent: "space-between",
                  padding: "0 10px",
                  color: "#80849c",
                  fontWeight: "bold",
                  borderRadius: "5px",
                }}
              >
                <span>
                  {state.selectedDate[0] && state.selectedDate[1]
                    ? `${formatDateDisplay(
                        state.selectedDate[0]
                      )} - ${formatDateDisplay(state.selectedDate[1])}`
                    : "Choose a date"}
                </span>
                <KeyboardArrowDownOutlinedIcon />
              </Button>
            </Grid>
            {/* Deposit History List */}
            <Box
              sx={{
                padding: "4%",
                marginTop: "2rem",
                flexGrow: 1,
                overflowY: "auto",
                
              }}
            >
              {state.loading ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ height: "100%" }}
                >
                  <CircularProgress />
                </Box>
              ) : state.error ? (
                <Typography
                  variant="h6"
                  sx={{ color: "red", textAlign: "center" }}
                >
                  Error: {state.error}
                </Typography>
              ) : filteredDeposits.length > 0 ? (
                filteredDeposits.map((deposit) => (
                  <Card
                    key={deposit.depositId}
                    sx={{
                      marginBottom: "16px",
                      borderRadius: "8px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      backgroundColor: "#a50000",
                    }}
                  >
                    <CardContent sx={{ padding: "16px", position: "relative" }}>
                      <Grid
                        container
                        xs={12}
                        mt={-1}
                        mb={1}
                        sx={{ borderBottom: "1px solid #eee" }}
                      >
                        <Grid container xs={6}>
                          <Box
                            sx={{
                              backgroundColor: getStatusColor(
                                deposit.depositStatus
                              ),
                              color: "white",
                              fontWeight: "bold",
                              borderRadius: "5px",
                              padding: "4px 12px",
                              marginBottom: "2%",
                              fontSize: "14px",
                              textAlign: "center",
                            }}
                          >
                            Deposit
                          </Box>
                        </Grid>
                        <Grid xs={6}>
                          <Typography
                            variant="body2"
                            sx={{
                              position: "absolute",
                              right: "16px",
                              top: "13px",
                              fontSize: "14px",
                              color: getStatusColor(deposit.depositStatus),
                              fontWeight: "bold",
                              
                            }}
                          >
                            {deposit.depositStatus}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid container spacing={1}>
                        <Grid item xs={3} textAlign="left">
                          <Typography variant="body2" sx={{ color: "white" }}>
                            Balance
                          </Typography>
                        </Grid>
                        <Grid item xs={9} textAlign="end">
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "500", color: "orange" }}
                          >
                            ₹{deposit.depositAmount}
                          </Typography>
                        </Grid>
                        <Grid item xs={3} textAlign="left">
                          <Typography variant="body2" sx={{ color: "white" }}>
                            Type
                          </Typography>
                        </Grid>
                        <Grid item xs={9} textAlign="end">
                          <Typography variant="body2"
                          sx={{ fontWeight: "500", color: "white" }}>
                            {deposit.depositMethod}
                          </Typography>
                        </Grid>
                        <Grid item xs={3} textAlign="left">
                          <Typography variant="body2" sx={{ color: "white" }}>
                            Time
                          </Typography>
                        </Grid>
                        <Grid item xs={9} textAlign="end">
                          <Typography variant="body2"
                          sx={{ fontWeight: "500", color: "white" }}>
                            {new Date(deposit.depositDate).toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={4} textAlign="left">
                          <Typography variant="body2" sx={{ color: "white" }}>
                            Order number
                          </Typography>
                        </Grid>
                        <Grid item xs={8} textAlign="end">
                          <Typography variant="body2"
                          sx={{ fontWeight: "500", color: "white" }}>
                            {deposit.depositId}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ height: "100%" }}
                >
                  <img
                    src="../../games/assets/No data-rafiki.png"
                    alt="No Data"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                  <Typography variant="h6" sx={{ marginTop: "16px" }}>
                    No deposit history available.
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Options Drawer */}
          <Drawer
            anchor="bottom"
            open={state.isOptionsDrawerOpen}
            onClose={toggleOptionsDrawer(false)}
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "5px",
                marginTop: "10px",
              }}
            >
              <Button
                onClick={handleDrawerClose}
                sx={{ color: "#000", fontWeight: "normal" }}
              >
                Cancel
              </Button>
              <Button sx={{ color: "#4782ff", fontWeight: "bold" }}>
                Confirm
              </Button>
            </Box>
            <List>
              {["All", "Completed", "Pending", "Failed"].map((filter) => (
                <ListItem
                  button
                  key={filter}
                  onClick={() => handleFilterClick(filter)}
                  sx={{
                    color: "#000",
                    fontWeight: "normal",
                    borderBottom: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  <ListItemText primary={filter} />
                </ListItem>
              ))}
            </List>
          </Drawer>
          <CalendarDrawer
            key={calendarKey} // Add this line
            isOpen={calendarDrawerOpen}
            onClose={() => toggleCalendarDrawer(false)}
            onRangeSelect={handleDateRangeSelect}
          />

          {/* Date Picker Drawer */}
        </Box>
      </Mobile>
    </div>
  );
};

export default DepositHistoryMain;
