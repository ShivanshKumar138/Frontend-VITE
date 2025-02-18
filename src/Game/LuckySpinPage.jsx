import {
    Box,
    Grid,
    Typography,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
  } from "@mui/material";
  import { useNavigate } from "react-router-dom";
  import React, { useEffect, useState,useCallback  } from "react";
  import axios from "axios";
  import LuckySpin from "./LuckySpin";
  import Mobile from "../Components/Mobile";
  import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
  import { domain } from "../Components/config";
  
  const LuckySpinPage = () => {
    const navigate = useNavigate();
  
    const handleBackClick = () => {
      navigate("/activity");
    };
    const [spinInfo, setSpinInfo] = useState({
      depositMadeToday: 0,
      SpinHave: 0,
      numberOfSpins: 0,
    });
    const [todaySpins, setTodaySpins] = useState([]);
    const [allTimeSpins, setAllTimeSpins] = useState([]);
    const [error, setError] = useState("");
  
    const fetchData = useCallback(async () => {
      try {
        // Fetch spin info
        const spinInfoResponse = await axios.get(`${domain}/spin-info`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setSpinInfo(spinInfoResponse.data);
  
        // Fetch spin history
        const historyResponse = await axios.get(`${domain}/spin-history`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTodaySpins(historyResponse.data.todaySpins);
        setAllTimeSpins(historyResponse.data.allTimeSpins);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data");
      }
    }, []);
  
    useEffect(() => {
      fetchData(); // Initial fetch
  
      // Set up polling every 30//20//10 seconds
      const intervalId = setInterval(fetchData, 10000);
  
      // Clean up interval on component unmount
      return () => clearInterval(intervalId);
    }, [fetchData]);
    return (
      <Mobile>
        <Grid
          item
          container
          alignItems="center"
          justifyContent="center"
          sx={{ bgcolor: "#4782ff", py: 1 }} // Background color for the header
        >
          <Grid item xs={2}>
            <IconButton
              sx={{ color: "white", ml: -2 }} // White color for the icon
              onClick={handleBackClick}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
          </Grid>
          <Grid item xs={10}>
            <Typography
              variant="h6"
              sx={{
                color: "white", // White color for the text
                flexGrow: 1,
                textAlign: "center",
                mr: 8,
              }}
            >
              Wheel Spin
            </Typography>
          </Grid>
        </Grid>
        <img
          src="/assets/luckySpinBanner.png"
          alt="LuckySpin Banner"
          width="100%"
        />
        <Box sx={{ mx: 1, mt: 1 }}>
          <Box
            sx={{
              backgroundColor: "white",
              color: "black",
              borderRadius: "12px",
              padding: "16px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              textAlign: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                mb: 1,
                fontSize: "16px",
                color: "#4782ff",
              }}
            >
              Today
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#f5f5f5", // green accent background
                padding: "8px",
                borderRadius: "8px",
                mb: 2,
              }}
            >
              <Typography sx={{ color: "black" }}>Today Deposit</Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                  borderRadius: "20px",
                  padding: "4px 12px",
                }}
              >
                <Typography sx={{ color: "white", fontWeight: "bold" }}>
                  ₹{spinInfo.depositMadeToday.toFixed(2)}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                padding: "8px",
                borderRadius: "8px",
              }}
            >
              <Typography sx={{ color: "black" }}>Number of spins</Typography>
              <Typography sx={{ color: "#ff0000", fontWeight: "bold" }}>
              {spinInfo.SpinHave}/{spinInfo.numberOfSpins}
              </Typography>
            </Box>
          </Box>
          <LuckySpin />
          <Grid container xs={12} sx={{ my: 2 }}>
            <Grid
              xs={4}
              item
              onClick={() => navigate("/activity/lucky-spin/event-description")}
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 96 96"
                  fill="none"
                  width="3em"
                  height="3em"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <symbol id="icon-activityIntro">
                    <path
                      d="M72 59C63.1791 59 56 66.1791 56 75C56 83.8209 63.1791 91 72 91C80.8209 91 88 83.8209 88 75C88 66.1791 80.8209 59 72 59Z"
                      fill="#4782ff"
                    ></path>
                    <circle
                      cx="71.75"
                      cy="84.75"
                      r="1.75"
                      fill="#ffffff"
                    ></circle>
                    <rect
                      x="70"
                      y="75.5"
                      width="3.5"
                      height="6.5"
                      rx="1.75"
                      fill="#ffffff"
                    ></rect>
                    <path
                      d="M72 77C75.3137 77 78 74.3137 78 71C78 67.6863 75.3137 65 72 65C68.6863 65 66 67.6863 66 71C66 71.4413 66.0476 71.8715 66.1381 72.2857"
                      stroke="#ffffff"
                      stroke-width="3.5"
                      stroke-linecap="round"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M8 13C8 8.58172 11.5817 5 16 5H76C80.4183 5 84 8.58172 84 13V58.9985C80.6574 56.4878 76.5024 55 72 55C60.9543 55 52 63.9543 52 75C52 79.9631 53.8078 84.5039 56.8008 88H16C11.5817 88 8 84.4183 8 80V13ZM20.5 20C19.1193 20 18 21.1193 18 22.5C18 23.8807 19.1193 25 20.5 25H43.5C44.8807 25 46 23.8807 46 22.5C46 21.1193 44.8807 20 43.5 20H20.5ZM20.5 33C19.1193 33 18 34.1193 18 35.5C18 36.8807 19.1193 38 20.5 38H71.5C72.8807 38 74 36.8807 74 35.5C74 34.1193 72.8807 33 71.5 33H20.5ZM18 48.5C18 47.1193 19.1193 46 20.5 46H55.5C56.8807 46 58 47.1193 58 48.5C58 49.8807 56.8807 51 55.5 51H20.5C19.1193 51 18 49.8807 18 48.5Z"
                      fill="#4782ff"
                    ></path>
                  </symbol>
                  <use xlinkHref="#icon-activityIntro" />
                </svg>
              </span>
              <p
                style={{ margin: "0px", fontSize: "12px", fontWeight: "medium" }}
              >
                Event Description
              </p>
            </Grid>
            <Grid
              xs={4}
              item
              onClick={() => navigate("/activity/lucky-spin/event-details")}
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 96 96"
                  fill="none"
                  width="3em"
                  height="3em"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <symbol id="icon-activityDetail">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M16 5C11.5817 5 8 8.58172 8 13V80C8 84.4183 11.5817 88 16 88H56.8008C53.8078 84.5039 52 79.9631 52 75C52 63.9543 60.9543 55 72 55C76.5024 55 80.6574 56.4878 84 58.9985V13C84 8.58172 80.4183 5 76 5H75V22.382C75 23.1253 74.2177 23.6088 73.5528 23.2764L68.4472 20.7236C68.1657 20.5828 67.8343 20.5828 67.5528 20.7236L62.4472 23.2764C61.7823 23.6088 61 23.1253 61 22.382V5H16ZM18 22.5C18 21.1193 19.1193 20 20.5 20H43.5C44.8807 20 46 21.1193 46 22.5C46 23.8807 44.8807 25 43.5 25H20.5C19.1193 25 18 23.8807 18 22.5ZM18 35.5C18 34.1193 19.1193 33 20.5 33H71.5C72.8807 33 74 34.1193 74 35.5C74 36.8807 72.8807 38 71.5 38H20.5C19.1193 38 18 36.8807 18 35.5ZM20.5 46C19.1193 46 18 47.1193 18 48.5C18 49.8807 19.1193 51 20.5 51H55.5C56.8807 51 58 49.8807 58 48.5C58 47.1193 56.8807 46 55.5 46H20.5Z"
                      fill="#4782ff"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M56 75C56 66.1791 63.1791 59 72 59C80.8209 59 88 66.1791 88 75C88 83.8209 80.8209 91 72 91C63.1791 91 56 83.8209 56 75ZM63 77.5C64.3807 77.5 65.5 76.3807 65.5 75C65.5 73.6193 64.3807 72.5 63 72.5C61.6193 72.5 60.5 73.6193 60.5 75C60.5 76.3807 61.6193 77.5 63 77.5ZM72 77.5C73.3807 77.5 74.5 76.3807 74.5 75C74.5 73.6193 73.3807 72.5 72 72.5C70.6193 72.5 69.5 73.6193 69.5 75C69.5 76.3807 70.6193 77.5 72 77.5ZM83.5 75C83.5 76.3807 82.3807 77.5 81 77.5C79.6193 77.5 78.5 76.3807 78.5 75C78.5 73.6193 79.6193 72.5 81 72.5C82.3807 72.5 83.5 73.6193 83.5 75Z"
                      fill="#4782ff"
                    ></path>
                  </symbol>
                  <use xlinkHref="#icon-activityDetail" />
                </svg>
              </span>
              <p
                style={{ margin: "0px", fontSize: "12px", fontWeight: "medium" }}
              >
                Event Details
              </p>
            </Grid>
            <Grid
              xs={4}
              item
              onClick={() => navigate("/activity/lucky-spin/activity-rules")}
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 96 96"
                  fill="none"
                  width="3em"
                  height="3em"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <symbol id="icon-activityRule">
                    <path
                      d="M72 59C63.1791 59 56 66.1791 56 75C56 83.8209 63.1791 91 72 91C80.8209 91 88 83.8209 88 75C88 66.1791 80.8209 59 72 59ZM82.4095 72.1914L76.762 76.5848L78.6432 83.4903C78.7154 83.7601 78.6166 84.0451 78.3886 84.2048C78.2708 84.2884 78.134 84.3302 77.9972 84.3302C77.8679 84.3302 77.7387 84.2922 77.6285 84.22L72 80.4689L66.3715 84.2238C66.1397 84.3796 65.8394 84.372 65.6114 84.2086C65.3872 84.0451 65.2846 83.7601 65.3568 83.4941L67.238 76.5886L61.5905 72.1914C61.3663 72.0166 61.2751 71.7164 61.3701 71.4504C61.4613 71.1805 61.7159 70.9981 62.001 70.9981H68.8836L71.3805 64.7501C71.5819 64.2447 72.4143 64.2447 72.6195 64.7501L75.1164 70.9981H81.9991C82.2841 70.9981 82.5387 71.1805 82.6299 71.4504C82.7249 71.7202 82.6337 72.0166 82.4095 72.1914Z"
                      fill="#4782ff"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M8 13C8 8.58172 11.5817 5 16 5H76C80.4183 5 84 8.58172 84 13V58.9985C80.6574 56.4878 76.5024 55 72 55C60.9543 55 52 63.9543 52 75C52 79.9631 53.8078 84.5039 56.8008 88H16C11.5817 88 8 84.4183 8 80V13ZM20.5 20C19.1193 20 18 21.1193 18 22.5C18 23.8807 19.1193 25 20.5 25H43.5C44.8807 25 46 23.8807 46 22.5C46 21.1193 44.8807 20 43.5 20H20.5ZM20.5 33C19.1193 33 18 34.1193 18 35.5C18 36.8807 19.1193 38 20.5 38H71.5C72.8807 38 74 36.8807 74 35.5C74 34.1193 72.8807 33 71.5 33H20.5ZM18 48.5C18 47.1193 19.1193 46 20.5 46H55.5C56.8807 46 58 47.1193 58 48.5C58 49.8807 56.8807 51 55.5 51H20.5C19.1193 51 18 49.8807 18 48.5Z"
                      fill="#4782ff"
                    ></path>
                  </symbol>
                  <use xlinkHref="#icon-activityRule" />
                </svg>
              </span>
              <p
                style={{ margin: "0px", fontSize: "12px", fontWeight: "medium" }}
              >
                Activity Rules
              </p>
            </Grid>
          </Grid>
          {/* History Section */}
          <Box sx={{ color: "black" }}>
            <Typography
              variant="h6"
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                fontWeight: "medium",
                fontSize: "14px",
              }}
            >
              <svg
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="26px"
                style={{ marginRight: "4px" }}
              >
                <symbol id="icon-historyHead">
                  <path
                    d="M41 10H13V44H41V10Z"
                    fill="#4782ff"
                    stroke="#4782ff"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M35 10V4H8C7.44772 4 7 4.44772 7 5V38H13"
                    stroke="#4782ff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M21 22H33"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M21 30H33"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </symbol>
                <use xlinkHref="#icon-historyHead" />
              </svg>
              History
            </Typography>
  
            <Table
              sx={{
                background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                borderRadius: "12px",
                color: "black",
                textAlign: "center",
                minWidth: 300,
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ color: "#ffffff", textAlign: "center", padding: 1 }}
                  >
                    Spin Time
                  </TableCell>
                  <TableCell
                    sx={{ color: "#ffffff", textAlign: "center", padding: 1 }}
                  >
                    Reward Type
                  </TableCell>
                  <TableCell
                    sx={{ color: "#ffffff", textAlign: "center", padding: 1 }}
                  >
                    Prize
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ backgroundColor: "#ffffff" }}>
                {todaySpins.length > 0 ? (
                  todaySpins.map((spin, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ padding: 1 }}>
                        {new Date(spin.spinTime).toLocaleString()}
                      </TableCell>
                      <TableCell sx={{ padding: 1 }}>{spin.rewardType}</TableCell>
                      <TableCell sx={{ padding: 1 }}>{spin.prize}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      sx={{ textAlign: "center", padding: "32px" }}
                    >
                      <img
                        src="/assets/noData.png"
                        alt="No data"
                        style={{ width: "60%", marginBottom: "8px" }}
                      />
                      <Typography variant="body2" sx={{ color: "gray" }}>
                        No spins today.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Box>
        <br />
        <br />
        <br />
        <br />
      </Mobile>
    );
  };
  
  export default LuckySpinPage;