import React, { useEffect, useState, useRef } from "react";
import Mobile from "./Mobile";
import IconButton from "@mui/material/IconButton";
import SmsIcon from "@mui/icons-material/Sms";
import DownloadIcon from "@mui/icons-material/Download";
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  Card,
  CardContent,
  SvgIcon,
  List,
  ListItem,
  InputAdornment,
  ListItemText,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import axios from "axios";
import ListItemIcon from "@mui/material/ListItemIcon";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { domain } from "./config";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CloseIcon from "@mui/icons-material/Close";

const RhombusIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M12 2L22 12L12 22L2 12L12 2Z" />
  </SvgIcon>
);

const upiQrAmounts = [
  100, 500, 800, 1000, 2000, 3000, 5000, 10000, 20000, 30000, 40000, 50000,
];
const upiPaytmAmounts = [
  200, 500, 800, 1000, 2000, 3000, 5000, 10000, 20000, 30000, 40000, 50000,
];
const upiLgPayAmounts = [
  200, 500, 1000, 2000, 3000, 5000, 10000, 20000, 30000, 40000, 50000,
];
const usdtAmounts = [10, 50, 100, 200, 500, 1000];

const PromotionMain = ({ children }) => {
  useEffect(() => {
    const fetchQueryOrder = async () => {
      try {
        const token = sessionStorage.getItem('token'); // Replace with your actual token
        const response = await axios.get(`${domain}/query-order`, {
          withCredentials: true, // Ensures credentials like cookies are sent with the request
          headers: {
            Authorization: `Bearer ${token}`, // Add the Bearer token in the header
          },
        });
        console.log("Query order data:", response.data);
      } catch (err) {
        console.error("Error fetching order query:", err);
      }
    };

    fetchQueryOrder(); // Call the function inside useEffect
  }, []); // Empty dependency array means this will run once after the component mounts
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", setVh);
    setVh();

    return () => window.removeEventListener("resize", setVh);
  }, []);

  const [remainingTime, setRemainingTime] = useState(300); // 5 minutes in seconds
  const timerRef = useRef(null);
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("UPIxPAYTM");
  const [walletAmount, setWalletAmount] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const conversionRate = 93;
  const [depositHistories, setDepositHistories] = useState([]);
  const [walletData, setWalletData] = useState(0);
  const [openDepositDialog, setOpenDepositDialog] = useState(false);
  const [utr, setUtr] = useState("");
  const [utrAlert, setUtrAlert] = useState(false);
  const [duplicateUtrAlert, setDuplicateUtrAlert] = useState("");
  const [depositRequests, setDepositRequests] = useState([]);
  const [usdtAmount, setUsdtAmount] = useState("");
  // Add these state variables to your existing state declarations
  const [isPolling, setIsPolling] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  // Function to determine the color based on deposit status
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#4782ff"; // Green for completed
      case "pending":
        return "#FFA500"; // Orange for pending
      case "failed":
        return "#FF0000"; // Red for failed
      default:
        return "#757575"; // Grey for unknown statuses
    }
  };
  
  const getAmountArray = () => {
    switch (paymentMode) {
      case "UPI x QR":
        return upiQrAmounts;
      case "UPIxPAYTM":
        return upiPaytmAmounts;
      case "UPIxLGPay":
        return upiLgPayAmounts;
      case "USDT":
        return usdtAmounts;
      default:
        return [];
    }
  };

  useEffect(() => {
    // Fetching deposit history data from the API
    const fetchDepositHistory = async () => {
      try {
        const token = sessionStorage.getItem('token'); // Replace with your actual token
        const response = await axios.get(`${domain}/deposit-history`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`, // Add the Bearer token in the header
          },
        });
        console.log("MY DATA ISSSSSSS--->", response.data);
        const latestFiveHistories = response.data.depositHistory.slice(-5);
        setDepositHistories(latestFiveHistories);
      } catch (error) {
        console.error("Error fetching deposit history:", error);
      }
    };

    fetchDepositHistory();
  }, []);

  const handleUtrChange = (event) => {
    setUtr(event.target.value);
  };

  const handleUsdtInputChange = (event) => {
    const value = event.target.value;
    setUsdtAmount(value);
    if (value !== "") {
      setAmount((parseFloat(value) * conversionRate).toFixed(2));
    } else {
      setAmount("");
    }
  };
  // Define the function to close the dialog
  const closeDepositDialog = () => {
    setOpenDepositDialog(false);
  };

  const [userData, setUserData] = React.useState(null);

  useEffect(() => {
    if (paymentMode === "USDT" && amount !== "") {
      setUsdtAmount((parseFloat(amount) / conversionRate).toFixed(2));
    }
  }, [paymentMode, amount]);

  const handleButtonClick = (value) => {
    if (paymentMode === "USDT") {
      setUsdtAmount(value.toString());
      setAmount((value * 93).toString()); // Assuming 1 USDT = 93 INR
    } else {
      setAmount(value.toString());
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    if (paymentMode === "USDT" && value !== "") {
      setUsdtAmount((parseFloat(value) / 93).toFixed(2)); // Assuming 1 USDT = 93 INR
    }
  };

  const sendDepositRequest = async () => {
    setUtrAlert(false);
    setDuplicateUtrAlert("");
    if (!utr) {
      setUtrAlert(true);
      return;
    }

    // Check if the UTR is already used by the current user
    if (
      depositRequests.some(
        (request) => request.utr === utr && request.userId === userData.userId
      )
    ) {
      setDuplicateUtrAlert(
        "This UTR has already been used. Please enter a unique UTR."
      );
      return;
    }

    // Call your createDeposit endpoint
    try {
      const response = await fetch(`${domain}/createDeposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          amount,
          depositId: utr,
          depositMethod: paymentMode,
        }),
      });

      if (response.ok) {
        setOpenDepositDialog(false);

        // Clear the input fields after a successful request
        setAmount("");
        setUsdtAmount("");
      } else {
        const errorData = await response.json();
        setDuplicateUtrAlert(
          errorData.msg || "An error occurred while processing your request."
        );
      }
    } catch (error) {
      setDuplicateUtrAlert(
        "An unexpected error occurred. Please try again later."
      );
    }
  };

  useEffect(() => {
    if (openDepositDialog) {
      timerRef.current = setInterval(() => {
        setRemainingTime((time) => time - 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setRemainingTime(300);
    }

    return () => clearInterval(timerRef.current);
  }, [openDepositDialog, imageUrl]);

  useEffect(() => {
    if (remainingTime === 0) {
      setOpenDepositDialog(false);
    }
  }, [remainingTime]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // make a random 10 digit transaction id
  const transaction = Math.floor(1000000000 + Math.random() * 9000000000);
  const [paymentUrl, setPaymentUrl] = useState("");
  // Function to generate a 16-digit unique order number
  const generateOrderNumber = () => {
    return Math.floor(Math.random() * 10 ** 16)
      .toString()
      .padStart(16, "0");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Define a minimum amount check or any additional validation if required
    const minAmount = paymentMode === "USDT" ? 10 : 100;
    const currentAmount =
      paymentMode === "USDT" ? parseFloat(usdtAmount) : parseFloat(amount);
  
    console.log(`Selected payment mode: ${paymentMode}`);
    console.log(`Entered amount: ${currentAmount}`);
    console.log(`Minimum required amount: ${minAmount}`);
  
    if (isNaN(currentAmount) || currentAmount < minAmount) {
      alert(
        `Amount must be at least ${paymentMode === "USDT" ? "10$" : "₹100"}`
      );
      console.log("Amount validation failed, operation aborted.");
      return;
    }
  
    try {
      // Generate a unique 16-digit order number
      const orderNumber = generateOrderNumber();
      console.log(`Generated order number: ${orderNumber}`);
  
      let response;
  
      if (paymentMode === "UPIxPAYTM" || paymentMode === "UPIxLGPay") {
        console.log(`Starting BTCash payment process for ${paymentMode}...`);
  
        // Call the create-btcash-order API for both UPIxPAYTM and UPIxLGPay
        const token = "your_token_here";
        response = await axios.post(
          `${domain}/create-btcash-order`,
          {
            channel_cashflow_id: "26",
            amount: currentAmount,
            order_number: orderNumber,
            url: "https://gen-zwin.fun/callback-btcash",
            redirect_url: "https://gen-zwin.fun/redirect"
          },
          { withCredentials: true,
             headers:{
              Authorization: `Bearer ${token}`,
             },
           },
        );
  
        console.log("API call to /create-btcash-order completed. Response:", response);
  
        // Check if the order creation was successful
        if (response.status !== 201 || !response.data.payment) {
          console.error(
            "Failed to create order or invalid response structure.",
            response
          );
          throw new Error(
            "Failed to create order or invalid response structure"
          );
        }
  
        const { payment, paymentUrl } = response.data;
        const { payOrderId, status } = payment;
  
        console.log(
          `Payment response: payOrderId=${payOrderId}, status=${status}`
        );
  
        // Ensure that payOrderId is present and status is pending
        if (payOrderId && status === "pending") {
          console.log(
            "Payment successful, redirecting to payment URL:",
            paymentUrl
          );
          handleSuccessfulPayment(paymentUrl);
        } else {
          console.error("Invalid payment response:", payment);
          throw new Error("Invalid payment response. Please try again.");
        }
      } else {
        console.log(
          `Starting deposit process for payment mode: ${paymentMode}...`
        );
  
        // Handle other payment modes
        response = await axios
          .post(
            `${domain}/deposit`,
            {
              am: currentAmount,
              user: user.username,
              orderid: orderNumber,
              depositMethod: paymentMode,
            },
            { withCredentials: true }
          );
  
        console.log("API call to /deposit completed. Response:", response);
  
        if (response.status === 200 && response.data.paymentResponse) {
          const payUrl = response.data.paymentResponse.payParams.payUrl;
          console.log(
            "Deposit successful, redirecting to payment URL:",
            payUrl
          );
          handleSuccessfulPayment(payUrl);
        } else {
          console.error(
            "Failed to process deposit or invalid response structure.",
            response
          );
          throw new Error(
            "Failed to process deposit or invalid response structure"
          );
        }
      }
    } catch (error) {
      console.error("Error during payment process:", error);
      handlePaymentError(error);
    }
  };
  const handleSuccessfulPayment = (payUrl) => {
    setPaymentUrl(payUrl);
    window.location.href = payUrl;
    setAmount("");
    setUsdtAmount("");
  };

  // Add this function to your component
  const pollPaymentStatus = async (orderSn) => {
    console.log(`Starting to poll payment status for order: ${orderSn}`);
    const maxAttempts = 60; // 5 minutes (5 * 60 seconds)
    let attempts = 0;

    const pollInterval = setInterval(async () => {
      try {
        attempts++;
        console.log(`Polling attempt ${attempts} for order: ${orderSn}`);
        const token = "your_token_here";
        const response = await axios.post(
          `${domain}/query-lgpay-order`,
          { order_sn: orderSn },
          { withCredentials: true,
            Authorization: `Bearer ${token}`, // Add the Bearer token in the header
           },
        );

        console.log(`Poll response for attempt ${attempts}:`, response.data);

        setPaymentStatus(`Checking payment status... Attempt ${attempts}`);

        if (
          response.data.queryResponse &&
          response.data.queryResponse.status === 1
        ) {
          console.log(`Payment successful for order: ${orderSn}`);
          clearInterval(pollInterval);
          setIsPolling(false);
          setPaymentStatus("Payment successful!");
          // handlePaymentSuccess(response.data);
        } else {
          console.log(
            `Payment not yet successful, continuing to poll for order: ${orderSn}`
          );
        }

        // Continue polling until we get a success status, regardless of the number of attempts
      } catch (error) {
        console.error(
          `Error polling payment status for order ${orderSn}:`,
          error
        );
        setPaymentStatus("Error checking payment status. Retrying...");
        // Don't stop polling on error, let it continue
      }
    }, 5000); // Poll every 5 seconds

    // Cleanup function
    return () => {
      console.log(`Stopping poll for order: ${orderSn}`);
      clearInterval(pollInterval);
      setIsPolling(false);
    };
  };

  // Modify your existing handleSuccessfulLGPayPayment function
  const handleSuccessfulLGPayPayment = (payUrl, orderSn) => {
    setPaymentUrl(payUrl);
    setOrderNumber(orderSn); // Store the order number
    window.open(payUrl);
    setAmount("");
    setUsdtAmount("");

    // Start polling
    setIsPolling(true);
    pollPaymentStatus(orderSn);
  };

  const handlePaymentError = (error) => {
    console.error("Error processing payment:", error.message);
    if (error.response) {
      console.error("Server Error:", error.response.data);
      console.error("Status Code:", error.response.status);
      console.error("Response Headers:", error.response.headers);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    alert("Payment request failed. Please try again or check your details.");
  };

  const [upiId, setUpiId] = useState("best4world6677@okaxis");
  const [usdtWalletAddress, setUsdtWalletAddress] = useState("");
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate(-1);
  };

  const handlePage = () => {
    navigate("/deposit-history");
  };

  const [selectedChannel, setSelectedChannel] = useState(0);

  const paymentModes = {
    UPIxPAYTM: [
      { name: "UPIxPAYTM", balance: "500 - 50K", bonus: "3%" },
      { name: "UPIxPAYTM", balance: "100 - 50K", bonus: "3%" },
      { name: "UPIxPAYTM", balance: "500 - 50K", bonus: "3%" },
      { name: "UPIxPAYTM", balance: "500 - 50K", bonus: "3%" },
    ],
    UPIxLGPay: [
      { name: "UPIxLGPay", balance: "500 - 50K", bonus: "3%" },
      { name: "UPIxLGPay", balance: "100 - 50K", bonus: "3%" },
      { name: "UPIxLGPay", balance: "500 - 50K", bonus: "3%" },
      { name: "UPIxLGPay", balance: "500 - 50K", bonus: "3%" },
    ],
    USDT: [
      {
        name: "UUPayUSDTCU",
        balance: "10-1M",
        bonus: "3%",
        image: "../../assets/3-6bb1e3bd.png",
      },
    ],
  };

  const [user, setUser] = useState(null);

  const handleDeposit = (e) => {
    e.preventDefault();
    const minAmount = paymentMode === "USDT" ? 10 : 100;
    const currentAmount =
      paymentMode === "USDT" ? parseFloat(usdtAmount) : parseFloat(amount);

    if (isNaN(currentAmount) || currentAmount < minAmount) {
      alert(
        `Amount must be at least ${paymentMode === "USDT" ? "10$" : "₹100"}`
      );
    } else {
      if (paymentMode === "UPIxPAYTM") {
        handleSubmit(e);
      } else if (paymentMode === "UPIxLGPay") {
        handleSubmit(e);
      } else {
        setOpenDepositDialog(true);
      }
    }
  };

  const fetchUserData = async () => {
    try {
      const token = sessionStorage.getItem('token'); // Replace with your actual token
      const response = await axios.get(`${domain}/user`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`, // Add the Bearer token in the header
        },
      });
      console.log("coming data is --->", response.data);
      setUser(response.data.user);
      setWalletAmount(response.data.user.walletAmount); // Assuming response.data contains user details including walletAmount
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleRefresh = () => {
    // Handle refresh logic
    fetchUserData();
  };

  const [get1, setGet1] = useState("");
  const [get2, setGet2] = useState("");
  useEffect(() => {
    const handleGet = () => {
      axios
        .get(`${domain}/Getid`, { withCredentials: true })
        .then((res) => {
          console.log("res-->", res.data);
          setGet1(res.data.Upi);
          setGet2(res.data.Trx);
          setImageUrl(`${domain}${res.data.imageUrl}`);
          console.log("---->", res.data.imageUrl);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    handleGet();
  }, []);

  useEffect(() => {
    // Reset amount and usdtAmount when payment mode changes
    setAmount("");
    setUsdtAmount("");
  }, [paymentMode]);
  return (
    <div>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          height="calc(var(--vh, 1vh) * 100)"
          position="relative"
        >
          <Box flexGrow={1} backgroundColor="#F7F8FF">
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                backgroundColor: "#FFFFFF",
                padding: "7px 4px",
                color: "white",
              }}
            >
              <Grid item container alignItems="center" justifyContent="center">
                <Grid item xs={3}>
                  <IconButton
                    sx={{ color: "#1e2637", mr: 8 }}
                    onClick={handleRedirect}
                  >
                    <ArrowBackIosNewIcon sx={{ fontSize: "20px" }} />
                  </IconButton>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#1e2637",
                      flexGrow: 1,
                      textAlign: "center",
                      mr: 3,
                    }}
                  >
                    Deposit
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    variant="caption"
                    sx={{
                      textAlign: "left",
                      color: "#1e2637",
                      fontSize: "12px",
                      flexGrow: 1,
                    }}
                    onClick={handlePage}
                  >
                    Deposit history
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              container
              mt={0}
              style={{
                backgroundImage: `url('/assets/bgblue2.png')`,
                background: "#FFFFFF",
                borderRadius: 8,
                padding: 8,
                backgroundSize: "cover",
                width: "95%",
                marginLeft: "auto", 
                marginRight: "auto",
                height: "140px",
                marginTop: "1rem",
              }}
            >
              <Grid container item alignItems="center">
                <Grid item xs={1.5} align="center">
                  <img
                    src="assets/images/download (16).png"
                    alt="Your Image"
                    style={{ maxWidth: "50%" }}
                  />
                </Grid>
                <Grid item xs={10.5}>
                  <Typography
                    fontSize="15px"
                    sx={{ color: "white" }}
                    align="left"
                  >
                    Balance
                  </Typography>
                </Grid>
              </Grid>
              <Grid container item alignItems="center" mt={-3}>
                <Grid
                  item
                  xs={12} 
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "20px",
                  }}
                >
                  <Typography
                    fontSize="26px"
                    sx={{ color: "white", fontWeight: "bold" }}
                  >
                    {`\u20B9 ${
                      user ? user.walletAmount.toFixed(2) : "Loading..."
                    }`}
                  </Typography>
                  <img
                    src="assets/refresh1.png"
                    alt="Your Image"
                    style={{ width:"20px",height:"18px",marginLeft:"10px" }}
                  />
                </Grid>
              </Grid>

              <Grid
                container
                item
                alignItems="center"
                style={{ marginTop: 16 }}
              >
                <Grid item xs={3}></Grid>
                <Grid item xs={9}>
                  <Typography
                    variant="body1"
                    sx={{ color: "#9e9c9b" }}
                  ></Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              container
              spacing={1}
              mt={0}
              style={{
                width: "97%",
                marginLeft: "auto",
                marginRight: "10px",
                alignItems: "center",
              }}
            >
              {Object.keys(paymentModes).map((mode) => (
                <Grid item xs={4} key={mode} sx={{boxShadow: "none" }}>
                  <div
                    style={{
                      background:
                        paymentMode === mode
                          ? "linear-gradient(to right,#4782ff, #4782ff)"
                          : "#ffffff",
                      borderRadius: 8,
                      color: paymentMode === mode ? "#ffffff" : "black",
                      padding: 16,
                     
                    }}
                    onClick={() => {
                      setPaymentMode(mode);
                      setSelectedChannel(null); // Reset selected channel when changing mode
                    }}
                  >
                    <img
                      src={`assets/images/${mode}.png`}
                      alt={mode}
                      style={{
                        display: "block",
                        margin: "0 auto",
                        maxWidth: "50%",
                        borderRadius: "50%",
                      }}
                    />
                    <Typography
                      variant="caption"
                      align="center"
                      style={{ marginTop: 8 }}
                    >
                      {mode}
                    </Typography>
                  </div>
                </Grid>
              ))}
            </Grid>

            {/* Channels Based on Payment Mode */}
            <Box
              sx={{
                border: "#FFFFFF",
                borderRadius: "12px",
                padding: "12px",
                paddingBottom: "15px",
                paddingTop: "15px",
                backgroundColor: "#FFFFFF",
                width: "91%",
                margin: "0 auto",
                mt: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <img
                  src="assets/channel1.png"
                  alt="Placeholder"
                  width={25}
                  height={25}
                />
                <Typography
                  variant="h6"
                  sx={{ fontSize: "1rem", marginLeft: 1, fontWeight: "bold", color:"#1e2637" }}
                >
                  Select channel
                </Typography>
              </Box>

              <Grid container spacing={2}>
                {paymentModes[paymentMode].map((channel, index) => (
                  <Grid item xs={6} key={index}>
                    <Card
                      onClick={() => setSelectedChannel(index)}
                      sx={{
                        borderRadius: "8px",
                        backgroundColor:
                          selectedChannel === index ? "#4782ff" : "#f5f5f5",
                        cursor: "pointer",
                        height: "65px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 1,
                        "&:hover": {
                          backgroundColor:
                            selectedChannel === index ? "#4782ff" : "#eeeeee",
                        },
                        boxShadow: "none",
                      }}
                    >
                      <CardContent
                        sx={{
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                          padding: "3.5px",
                          mt: 2,
                        }}
                      >
                        {/* Conditionally render the image only for USDT channels */}
                        {channel.image && (
                          <img
                            src={channel.image}
                            alt="Channel"
                            style={{
                              width: "2rem",
                              height: "2rem",
                              marginRight: "12px",
                              marginLeft: "-10px", // Add space between the image and text
                            }}
                          />
                        )}
                        <Box>
                          <Typography
                            sx={{
                              color:
                                selectedChannel === index ? "#fff" : "#424242",
                              fontSize: "12px",
                            }}
                          >
                            {channel.name}
                          </Typography>
                          <Typography
                            sx={{
                              color:
                                selectedChannel === index ? "#fff" : "#757575",
                              fontSize: "13px",
                            }}
                          >
                            Balance: {channel.balance}
                          </Typography>
                          <Typography
                            sx={{
                              color:
                                selectedChannel === index ? "#fff" : "#757575",
                              fontSize: "13px",
                            }}
                          >
                            {channel.bonus} bonus
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Deposit Amount */}
            <Box
              sx={{ bgcolor: "#FFFFFF", p: 2, borderRadius: 2, margin: "10px" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
               <svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-v-9e03166f="" class="svg-icon icon-saveWallet"  width="40"
                  height="40"
                  viewBox="0 0 70 70"><defs><symbol id="icon-saveWallet" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M29.7 15.4996V7.89961C29.7 5.71961 27.9 4.09961 25.9 4.09961C25.46 4.09961 25 4.17961 24.56 4.33961L8.68004 10.3396C6.46004 11.1796 5.00004 13.2996 5.00004 15.6796V23.0196C5.00004 20.5596 6.18004 18.3796 8.00004 17.0196V15.6796C8.00004 14.5396 8.68004 13.5396 9.74004 13.1396L25.6 7.15961C25.7 7.11961 25.8 7.09961 25.9 7.09961C26.22 7.09961 26.7 7.35961 26.7 7.89961V15.4996H29.7ZM43 30.9996V28.9996C43 28.4596 42.58 28.0196 42 27.9996H38.98C38.7194 27.9951 38.4606 28.0442 38.2197 28.144C37.9789 28.2438 37.7611 28.3921 37.58 28.5796C37.18 28.9796 36.94 29.5596 37 30.1796C37.08 31.2196 38.04 31.9996 39.1 31.9996H42.02C42.2818 31.9944 42.531 31.8867 42.7142 31.6997C42.8975 31.5128 43.0001 31.2614 43 30.9996ZM5.00004 31.7596C6.38004 30.6596 8.12004 29.9996 10 29.9996C14.42 29.9996 18 33.5796 18 37.9996C18 39.4996 17.58 40.9196 16.84 42.1196C16.42 42.8396 15.88 43.4796 15.26 43.9996C13.86 45.2596 12.02 45.9996 10 45.9996C8.62116 46.0025 7.26531 45.6462 6.06596 44.9659C4.86661 44.2855 3.8651 43.3046 3.16004 42.1196C2.42004 40.9196 2.00004 39.4996 2.00004 37.9996C1.99643 36.8005 2.26448 35.6161 2.78406 34.5354C3.30363 33.4547 4.06125 32.5057 5.00004 31.7596ZM7.62669 34.2867C7.24931 33.8621 6.59918 33.8238 6.17459 34.2012C5.75 34.5786 5.71173 35.2287 6.08911 35.6533L8.22438 38.0557L6.08892 40.4581C5.71152 40.8826 5.74976 41.5328 6.17434 41.9102C6.59892 42.2876 7.24905 42.2493 7.62645 41.8248L10.3693 38.739C10.7157 38.3493 10.7157 37.7621 10.3693 37.3724L7.62669 34.2867ZM11.741 34.2867C11.3636 33.8621 10.7135 33.8238 10.2889 34.2012C9.86428 34.5786 9.82601 35.2287 10.2034 35.6533L12.3387 38.0557L10.2032 40.4581C9.8258 40.8826 9.86405 41.5328 10.2886 41.9102C10.7132 42.2876 11.3633 42.2493 11.7407 41.8248L14.4836 38.739C14.83 38.3493 14.83 37.7621 14.4836 37.3724L11.741 34.2867Z" fill="#4781FF"></path><path d="M38.96 25.9H41C42.1 25.9 43 25 43 23.9V23.02C43 18.88 39.62 15.5 35.48 15.5H12.52C10.82 15.5 9.26 16.06 8 17.02C6.18 18.38 5 20.56 5 23.02V26.58C5 27.34 5.8 27.82 6.52 27.58C7.64 27.2 8.82 27 10 27C16.06 27 21 31.94 21 38C21 39.44 20.62 41.02 20.02 42.42C19.7 43.14 20.2 44 20.98 44H35.48C39.62 44 43 40.62 43 36.48V36.1C43 35 42.1 34.1 41 34.1H39.26C37.34 34.1 35.5 32.92 35 31.06C34.6 29.54 35.08 28.06 36.08 27.1C36.82 26.34 37.84 25.9 38.96 25.9V25.9ZM28 25.5H18C17.18 25.5 16.5 24.82 16.5 24C16.5 23.18 17.18 22.5 18 22.5H28C28.82 22.5 29.5 23.18 29.5 24C29.5 24.82 28.82 25.5 28 25.5Z" fill="#4781FF"></path></symbol></defs><g><path fill-rule="evenodd" clip-rule="evenodd" d="M29.7 15.4996V7.89961C29.7 5.71961 27.9 4.09961 25.9 4.09961C25.46 4.09961 25 4.17961 24.56 4.33961L8.68004 10.3396C6.46004 11.1796 5.00004 13.2996 5.00004 15.6796V23.0196C5.00004 20.5596 6.18004 18.3796 8.00004 17.0196V15.6796C8.00004 14.5396 8.68004 13.5396 9.74004 13.1396L25.6 7.15961C25.7 7.11961 25.8 7.09961 25.9 7.09961C26.22 7.09961 26.7 7.35961 26.7 7.89961V15.4996H29.7ZM43 30.9996V28.9996C43 28.4596 42.58 28.0196 42 27.9996H38.98C38.7194 27.9951 38.4606 28.0442 38.2197 28.144C37.9789 28.2438 37.7611 28.3921 37.58 28.5796C37.18 28.9796 36.94 29.5596 37 30.1796C37.08 31.2196 38.04 31.9996 39.1 31.9996H42.02C42.2818 31.9944 42.531 31.8867 42.7142 31.6997C42.8975 31.5128 43.0001 31.2614 43 30.9996ZM5.00004 31.7596C6.38004 30.6596 8.12004 29.9996 10 29.9996C14.42 29.9996 18 33.5796 18 37.9996C18 39.4996 17.58 40.9196 16.84 42.1196C16.42 42.8396 15.88 43.4796 15.26 43.9996C13.86 45.2596 12.02 45.9996 10 45.9996C8.62116 46.0025 7.26531 45.6462 6.06596 44.9659C4.86661 44.2855 3.8651 43.3046 3.16004 42.1196C2.42004 40.9196 2.00004 39.4996 2.00004 37.9996C1.99643 36.8005 2.26448 35.6161 2.78406 34.5354C3.30363 33.4547 4.06125 32.5057 5.00004 31.7596ZM7.62669 34.2867C7.24931 33.8621 6.59918 33.8238 6.17459 34.2012C5.75 34.5786 5.71173 35.2287 6.08911 35.6533L8.22438 38.0557L6.08892 40.4581C5.71152 40.8826 5.74976 41.5328 6.17434 41.9102C6.59892 42.2876 7.24905 42.2493 7.62645 41.8248L10.3693 38.739C10.7157 38.3493 10.7157 37.7621 10.3693 37.3724L7.62669 34.2867ZM11.741 34.2867C11.3636 33.8621 10.7135 33.8238 10.2889 34.2012C9.86428 34.5786 9.82601 35.2287 10.2034 35.6533L12.3387 38.0557L10.2032 40.4581C9.8258 40.8826 9.86405 41.5328 10.2886 41.9102C10.7132 42.2876 11.3633 42.2493 11.7407 41.8248L14.4836 38.739C14.83 38.3493 14.83 37.7621 14.4836 37.3724L11.741 34.2867Z" fill="#4781FF"></path><path d="M38.96 25.9H41C42.1 25.9 43 25 43 23.9V23.02C43 18.88 39.62 15.5 35.48 15.5H12.52C10.82 15.5 9.26 16.06 8 17.02C6.18 18.38 5 20.56 5 23.02V26.58C5 27.34 5.8 27.82 6.52 27.58C7.64 27.2 8.82 27 10 27C16.06 27 21 31.94 21 38C21 39.44 20.62 41.02 20.02 42.42C19.7 43.14 20.2 44 20.98 44H35.48C39.62 44 43 40.62 43 36.48V36.1C43 35 42.1 34.1 41 34.1H39.26C37.34 34.1 35.5 32.92 35 31.06C34.6 29.54 35.08 28.06 36.08 27.1C36.82 26.34 37.84 25.9 38.96 25.9V25.9ZM28 25.5H18C17.18 25.5 16.5 24.82 16.5 24C16.5 23.18 17.18 22.5 18 22.5H28C28.82 22.5 29.5 23.18 29.5 24C29.5 24.82 28.82 25.5 28 25.5Z" fill="#4781FF"></path></g></svg>
                <Typography variant="h7" sx={{ fontWeight: "bold", color:"#1e2637" }}>
                  Deposit amount
                </Typography>
              </Box>

              <Grid container spacing={1}>
                {getAmountArray().map((value) => (
                  <Grid item xs={4} key={value}>
                    <Button
                      variant="outlined"
                      onClick={() => handleButtonClick(value)}
                      startIcon={
                        <Typography sx={{ color: "grey" }}>
                          {paymentMode === "USDT" ? (
                            <img
                              src="assets/3-6bb1e3bd.png"
                              alt="USDT"
                              style={{
                                maxWidth: "20%",
                                paddingRight: "4rem",
                              }}
                            />
                          ) : (
                            "₹"
                          )}
                        </Typography>
                      }
                      sx={{
                        width: "100%",
                        bgcolor: "white",
                        color: "#4782ff",
                        borderColor: "lightgray",
                        justifyContent: "center",
                        "&:hover": {
                          bgcolor: "#f0f0f0",
                          borderColor: "gray",
                        },
                        "& .MuiButton-startIcon": {
                          position: "absolute",
                          left: "16px",
                        },
                      }}
                    >
                      <Typography variant="h7">
                        {paymentMode === "USDT"
                          ? value
                          : value >= 1000
                          ? `${value / 1000}K`
                          : value}
                      </Typography>
                    </Button>
                  </Grid>
                ))}
              </Grid>

              {paymentMode === "USDT" ? (
                <TextField
                  fullWidth
                  placeholder="Please enter USDT amount"
                  value={usdtAmount}
                  onChange={handleUsdtInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <img
                          src="assets/3-6bb1e3bd.png"
                          alt="USDT"
                          style={{ maxWidth: "1.5rem", marginRight: "0.5rem" }}
                        />
                        <span
                          style={{
                            color: "#b7bdc8",
                            fontSize: "20px",
                            fontWeight: "bold",
                          }}
                        >
                          |
                        </span>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            setUsdtAmount("");
                            setAmount("");
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    marginTop: "1rem",
                    bgcolor: "grey.200",
                    borderRadius: "10px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      "& fieldset": { border: "none" },
                      "&:hover fieldset": { border: "none" },
                      "&.Mui-focused fieldset": { border: "none" },
                    },
                  }}
                />
              ) : null}

              <TextField
                fullWidth
                placeholder="Please enter the amount"
                value={amount}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      ₹
                      <span
                        style={{
                          color: "#b7bdc8",
                          fontSize: "20px",
                          fontWeight: "bold",
                          marginLeft: "0.5rem",
                        }}
                      >
                        |
                      </span>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          setAmount("");
                          setUsdtAmount("");
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  marginTop: "1rem",
                  bgcolor: "grey.200",
                  borderRadius: "10px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "& fieldset": { border: "none" },
                    "&:hover fieldset": { border: "none" },
                    "&.Mui-focused fieldset": { border: "none" },
                  },
                }}
              />

              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  textTransform: "initial",
                  bgcolor: "#4782ff",
                  borderRadius: "20px",
                  color: "white",
                  "&:hover": { bgcolor: "#4782ff" },
                  boxShadow: "none",
                }}
                onClick={handleDeposit}
              >
                Deposit
              </Button>
            </Box>

            <div>
              {paymentUrl && <a href={paymentUrl}>Proceed to Payment</a>}
            </div>

            {/* Recharge Instructions */}

            <Box
              sx={{
                margin: "10px auto", // Centered horizontally with automatic margins
                borderRadius: 2,
                bgcolor: "#FFFFFF",
                mt: 2,
                width: "95%",
              }}
            >
              <Box sx={{ padding: 2 }}>
                {" "}
                {/* Adjusted padding for better spacing */}
                <Box display="flex" alignItems="center" mb={2}>
                  {" "}
                  {/* Increased bottom margin */}
                  <svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-v-7cba6004="" class="svg-icon icon-shuoming" width="40" height="40" viewBox="0 0 80 80"><defs><symbol id="icon-shuoming" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 37C7 29.2967 7 11 7 11C7 7.68629 9.68629 5 13 5H35V31C35 31 18.2326 31 13 31C9.7 31 7 33.6842 7 37Z" fill="#4781FF" stroke="#4781FF" stroke-width="2px" stroke-linejoin="round"></path><path d="M35 31C35 31 14.1537 31 13 31C9.68629 31 7 33.6863 7 37C7 40.3137 9.68629 43 13 43C15.2091 43 25.8758 43 41 43V7" stroke="#4781FF" stroke-width="2px" stroke-linecap="round" stroke-linejoin="round" fill="none"></path><path d="M14 37H34" stroke="#4781FF" stroke-width="2px" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></symbol></defs><g><path d="M7 37C7 29.2967 7 11 7 11C7 7.68629 9.68629 5 13 5H35V31C35 31 18.2326 31 13 31C9.7 31 7 33.6842 7 37Z" fill="#4781FF" stroke="#4781FF" stroke-width="2px" stroke-linejoin="round"></path><path d="M35 31C35 31 14.1537 31 13 31C9.68629 31 7 33.6863 7 37C7 40.3137 9.68629 43 13 43C15.2091 43 25.8758 43 41 43V7" stroke="#4781FF" stroke-width="2px" stroke-linecap="round" stroke-linejoin="round" fill="none"></path><path d="M14 37H34" stroke="#4781FF" stroke-width="2px" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></g></svg>
                  <Typography variant="body1" fontWeight="bold" align="left" color="#768096">
                    Recharge Instructions
                  </Typography>
                </Box>
                <Box
                  sx={{
                    border: "1px solid #E0E0E0", // Light grey border color
                    borderRadius: 1, // Rounded corners
                    padding: 2, // Increased padding inside the border
                    ml: 0, // No left margin for alignment
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1.5, // Increased bottom margin
                      color: "#768096",
                    }}
                    align="left"
                  >
                    <RhombusIcon
                      sx={{ fontSize: 12, color: "#768096", mr: 1 }} // Slightly larger icon for better visibility
                    />
                    If the transfer time is up, please fill out the deposit form
                    again.
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1.5, // Increased bottom margin
                      color: "#768096",
                    }}
                    align="left"
                  >
                    <RhombusIcon
                      sx={{ fontSize: 12, color: "#768096", mr: 1 }} // Slightly larger icon for better visibility
                    />
                    The transfer amount must match the order you created,
                    otherwise the money cannot be credited successfully.
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1.5, // Increased bottom margin
                      color: "#768096",
                    }}
                    align="left"
                  >
                    <RhombusIcon
                      sx={{ fontSize: 12, color: "white", mr: 1 }} // Slightly larger icon for better visibility
                    />
                    If you transfer the wrong amount, our company will not be
                    responsible for the lost amount!
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "#768096",
                    }}
                    align="left"
                  >
                    <RhombusIcon
                      sx={{ fontSize: 12, color: "#768096", mr: 1 }} // Slightly larger icon for better visibility
                    />
                    Note: Do not cancel the deposit order after the money has
                    been transferred.
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Dialog
              open={openDepositDialog}
              onClose={closeDepositDialog} // Handle close event
              disableBackdropClick
              disableEscapeKeyDown
              sx={{
                "& .MuiDialog-paper": {
                  backgroundColor: "#e8f5e9", // Light green background
                  borderRadius: "16px",
                },
              }}
            >
              <DialogTitle
                sx={{
                  backgroundColor: "#4782ff", // Green header
                  color: "white",
                  fontWeight: "bold",
                  borderTopLeftRadius: "16px",
                  borderTopRightRadius: "16px",
                }}
              >
                Deposit
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Typography
                      variant="h6"
                      sx={{ color: "#2e7d32", paddingTop: "1rem" }}
                    >
                      Remaining Time
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography
                      variant="h6"
                      align="right"
                      sx={{ color: "#d32f2f", paddingTop: "1rem" }} // Red color for the countdown
                    >
                      {Math.floor(remainingTime / 60)}:
                      {remainingTime % 60 < 10 ? "0" : ""}
                      {remainingTime % 60}
                    </Typography>
                  </Grid>
                  {paymentMode === "UPI x QR" && (
                    <>
                      {imageUrl ? (
                        <Grid item xs={12}>
                          <img
                            src={imageUrl}
                            alt="QR Code"
                            style={{
                              maxWidth: "100%",
                              height: "auto",
                              display: "block",
                              margin: "0 auto",
                            }}
                          />
                        </Grid>
                      ) : (
                        <Grid item xs={12}>
                          <Typography>Loading QR Code...</Typography>
                        </Grid>
                      )}
                      <Grid item xs={12}>
                        <Typography variant="body1">
                          UPI ID: {get1 ? get1 : "Loading"}
                          <IconButton
                            onClick={() =>
                              copyToClipboard(get1 ? get1 : "Loading")
                            }
                          >
                            <FileCopyIcon sx={{ color: "#2e7d32" }} />
                          </IconButton>
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name="utr"
                          label="UTR"
                          value={utr}
                          onChange={handleUtrChange}
                          sx={{
                            width: "100%",
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#f1f8e9", // Light green background
                              borderRadius: "8px",
                              "& fieldset": {
                                border: "1px solid #c8e6c9", // Light green border
                              },
                            },
                          }}
                        />
                      </Grid>
                    </>
                  )}
                  {paymentMode === "USDT" && (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="body1">
                          USDT Wallet Address: {get2 ? get2 : "Loading"}
                          <IconButton
                            onClick={() =>
                              copyToClipboard(get2 ? get2 : "Loading")
                            }
                          >
                            <FileCopyIcon sx={{ color: "#2e7d32" }} />
                          </IconButton>
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption">
                          Conversion Rate: 1 USDT = 93 INR
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name="utr"
                          label="UTR"
                          value={utr}
                          onChange={handleUtrChange}
                          sx={{
                            width: "100%",
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#f1f8e9", // Light green background
                              borderRadius: "8px",
                              "& fieldset": {
                                border: "1px solid #c8e6c9", // Light green border
                              },
                            },
                          }}
                        />
                      </Grid>
                    </>
                  )}
                  {paymentMode === "UPIxPAYTM" && (
                    <Grid item xs={12}>
                      <Typography variant="body1">
                        Currently this payment option is not available.
                      </Typography>
                    </Grid>
                  )}
                  {utrAlert && (
                    <Grid item xs={12}>
                      <Alert severity="error" sx={{ marginBottom: 2 }}>
                        UPI ID or QR Scan is required
                      </Alert>
                    </Grid>
                  )}
                  {duplicateUtrAlert && (
                    <Grid item xs={12}>
                      <Alert severity="error" sx={{ marginBottom: 2 }}>
                        {duplicateUtrAlert}
                      </Alert>
                    </Grid>
                  )}
                </Grid>
              </DialogContent>
              <DialogActions
                sx={{
                  justifyContent: "center",
                  borderTop: "1px solid #c8e6c9", // Light green border
                  padding: "16px",
                }}
              >
                <Button
                  onClick={closeDepositDialog} // Cancel button to close the dialog
                  sx={{
                    backgroundColor: "#e0e0e0", // Red color for cancel button
                    color: "black",
                    textTransform: "initial",
                    "&:hover": {
                      backgroundColor: "#e0e0e0", // Darker red on hover
                    },
                    mr: 2, // Margin-right for spacing
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={sendDepositRequest}
                  sx={{
                    backgroundColor: "#4782ff",
                    color: "white",
                    textTransform: "initial",

                    "&:hover": {
                      backgroundColor: "#4782ff", // Darker green on hover
                    },
                  }}
                >
                  Send Request
                </Button>
              </DialogActions>
            </Dialog>

            <br />
            {/* content end */}

            <Box sx={{ paddingX: "1rem" }}>
              {/* Heading */}
              <Typography
                variant="h6"
                sx={{
                  textAlign: "left",
                  marginBottom: "10px",
                  fontWeight: "bold",
                  color: "#1e2637",
                  // textAlign: "center",
                  ml: 1,
                }}
              >
                Deposit Histories
              </Typography>

              <div>
                {depositHistories.length > 0 ? (
                  depositHistories.map((deposit) => (
                    <Card
                      key={deposit.depositId}
                      sx={{
                        marginBottom: "16px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      <CardContent
                        sx={{ padding: "16px", position: "relative" }}
                      >
                        <Grid
                          container
                          mt={-1}
                          mb={1}
                          sx={{ borderBottom: "1px solid #eee" }}
                        >
                          <Grid item xs={3}>
                            <Box
                              sx={{
                                backgroundColor: getStatusColor(
                                  deposit.depositStatus
                                ),
                                color: "#FFFFFF",
                                fontWeight: "bold",
                                borderRadius: "5px",
                                padding: "4px 0px",
                                marginBottom: "10%",
                                fontSize: "14px",
                                textAlign: "center",
                              }}
                            >
                              Deposit
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
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
                            <Typography
                              variant="body2"
                              sx={{ color: "#757575" }}
                            >
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
                            <Typography
                              variant="body2"
                              sx={{ color: "#757575" }}
                            >
                              Type
                            </Typography>
                          </Grid>
                          <Grid item xs={9} textAlign="end">
                            <Typography variant="body2">
                              {deposit.depositMethod}
                            </Typography>
                          </Grid>
                          <Grid item xs={3} textAlign="left">
                            <Typography
                              variant="body2"
                              sx={{ color: "#757575" }}
                            >
                              Time
                            </Typography>
                          </Grid>
                          <Grid item xs={9} textAlign="end">
                            <Typography variant="body2">
                              {new Date(deposit.depositDate).toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={4} textAlign="left">
                            <Typography
                              variant="body2"
                              sx={{ color: "#757575" }}
                            >
                              Order number
                            </Typography>
                          </Grid>
                          <Grid item xs={8} textAlign="end">
                            <Typography variant="body2">
                              {deposit.depositId}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Box
                    sx={{
                      textAlign: "center",
                      marginTop: "10%",
                      marginBottom: "15%",
                    }}
                  >
                    <svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-v-f84b843f="" class="svg-icon icon-empty" width="300" height="300"
                      viewBox="0 0 400 600"><defs><symbol id="icon-empty" viewBox="0 0 389 227" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.3" d="M185.676 227C268.288 227 335.259 205.097 335.259 178.077C335.259 151.058 268.288 129.156 185.676 129.156C103.064 129.156 36.0938 151.058 36.0938 178.077C36.0938 205.097 103.064 227 185.676 227Z" fill="url(&quot;#paint0_linear_6306_124794&quot;)"></path><path d="M24.2361 48.4838C39.3083 46.0376 45.4084 44.1986 60.1233 29.9067C74.8398 15.6163 89.7608 36.4663 111.891 28.0943C134.02 19.7238 136.044 9.58829 169.892 40.6345C185.494 53.8291 197.904 48.6052 205.553 53.8291C210.65 57.3103 215.564 65.8955 220.296 79.5818H24.2361C8.62556 74.1061 0.820312 69.5603 0.820312 65.9399C0.820312 60.5116 9.1638 50.9284 24.2361 48.4838Z" fill="url(&quot;#paint1_linear_6306_124794&quot;)"></path><path d="M237.112 86.6013C248.773 84.7933 253.495 83.4326 264.881 72.8706C276.268 62.3072 287.815 77.7185 304.939 71.5305C322.063 65.3441 323.628 57.8532 349.821 80.7998C361.895 90.5518 371.497 86.6901 377.415 90.5518C381.36 93.1253 385.162 99.4702 388.823 109.586H237.112C225.031 105.54 218.992 102.178 218.992 99.5043C218.992 95.4915 225.448 88.4078 237.112 86.6013Z" fill="url(&quot;#paint2_linear_6306_124794&quot;)"></path><path d="M273.802 0C283.932 0 292.144 8.2002 292.144 18.3165V20.12H259.592V159.109C259.592 169.224 251.381 177.425 241.251 177.425H123.687C123.322 177.425 122.973 177.28 122.715 177.022C122.457 176.765 122.312 176.415 122.313 176.051V14.6532C122.313 6.56105 128.881 0 136.986 0H273.802Z" fill="url(&quot;#paint3_linear_6306_124794&quot;)"></path><path opacity="0.712" d="M240.78 9.13086H137.104C136.363 9.13086 135.629 9.27668 134.944 9.55999C134.26 9.84329 133.637 10.2585 133.113 10.782C132.589 11.3055 132.174 11.9269 131.89 12.6108C131.607 13.2948 131.461 14.0277 131.461 14.7679V162.656C131.461 163.396 131.607 164.129 131.89 164.813C132.174 165.496 132.59 166.118 133.114 166.641C133.638 167.164 134.26 167.579 134.945 167.863C135.629 168.146 136.363 168.292 137.104 168.292H240.78C241.522 168.292 242.255 168.146 242.94 167.863C243.625 167.579 244.247 167.164 244.771 166.641C245.295 166.118 245.711 165.496 245.994 164.813C246.278 164.129 246.424 163.396 246.424 162.656V14.7679C246.424 14.0277 246.278 13.2948 245.995 12.6108C245.711 11.9269 245.296 11.3055 244.771 10.782C244.247 10.2585 243.625 9.84329 242.94 9.55999C242.256 9.27668 241.522 9.13086 240.78 9.13086Z" fill="url(&quot;#paint4_linear_6306_124794&quot;)"></path><path d="M225.836 144.809V160.94C225.836 170.043 233.226 177.424 242.343 177.424H114.529C104.401 177.424 96.1875 169.223 96.1875 159.108V144.809H225.836ZM259.174 161.117C259.174 170.123 251.863 177.424 242.843 177.424H242.667C251.783 177.424 259.174 170.043 259.174 160.94L259.173 161.028L259.174 161.117Z" fill="url(&quot;#paint5_linear_6306_124794&quot;)"></path><path d="M275.816 0C284.834 0 292.145 7.29993 292.145 16.3071L292.144 30.0052H259.484V16.3086C259.484 7.30141 266.796 0 275.816 0Z" fill="url(&quot;#paint6_linear_6306_124794&quot;)"></path><rect x="48.8203" y="144" width="5" height="20" rx="2.5" fill="url(&quot;#paint7_linear_6306_124794&quot;)"></rect><path fill-rule="evenodd" clip-rule="evenodd" d="M46.1844 105.961C41.438 115.8 25.098 145.98 47.9933 149.359C70.8901 152.738 69.8685 132.651 65.8517 125.462C61.8364 118.273 57.3036 114.249 57.3036 105.961C57.3036 97.6734 50.9292 96.1201 46.1829 105.961H46.1844Z" fill="url(&quot;#paint8_linear_6306_124794&quot;)"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M343.974 165.449H344.221C344.921 165.449 345.491 166.016 345.491 166.717V180.068C345.491 180.405 345.357 180.727 345.119 180.965C344.881 181.203 344.558 181.337 344.221 181.337H343.974C343.637 181.337 343.314 181.204 343.075 180.966C342.837 180.728 342.703 180.405 342.703 180.068V166.717C342.703 166.016 343.272 165.449 343.974 165.449Z" fill="url(&quot;#paint9_linear_6306_124794&quot;)"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M340.932 145.174C337.834 151.355 327.164 170.311 342.114 172.434C357.066 174.556 356.399 161.939 353.778 157.424C351.155 152.908 348.195 150.38 348.195 145.174C348.195 139.968 344.031 138.994 340.932 145.174Z" fill="url(&quot;#paint10_linear_6306_124794&quot;)"></path><path d="M269.941 131.764H322.196C323.639 131.764 324.809 132.933 324.809 134.373V168.292C324.809 169.734 323.639 170.901 322.196 170.901H269.941C269.248 170.901 268.583 170.626 268.093 170.137C267.603 169.648 267.328 168.984 267.328 168.292V134.373C267.328 132.933 268.498 131.764 269.941 131.764Z" fill="url(&quot;#paint11_linear_6306_124794&quot;)"></path><path opacity="0.398" d="M284.309 32.6133C282.541 53.9608 273.212 64.0459 263.885 69.6786C249.04 78.6443 231.874 74.1814 227.627 69.6786C220.715 62.3476 233.578 51.1844 246.322 59.5164C259.065 67.8484 223.925 97.2125 187.223 92.0122C162.755 88.5459 140.684 82.0766 121.008 72.6045" stroke="#908E9B" stroke-width="0.881px" stroke-linecap="round" stroke-dasharray="2.64 2.64" fill="none"></path><path d="M83.2109 50.6191L124.558 71.2914L116.173 82.6011L83.2109 50.6191Z" fill="#565461"></path><path d="M83.2109 50.6191L116.168 82.5997L118.765 69.3487L83.2109 50.6191Z" fill="url(&quot;#paint12_linear_6306_124794&quot;)"></path><path d="M83.2109 50.6191L103.479 66.3814L118.759 69.3443L83.2109 50.6191Z" fill="url(&quot;#paint13_linear_6306_124794&quot;)"></path><path d="M88.8516 53.4336L136.814 71.5901L124.564 71.291L88.8516 53.4336Z" fill="#6D6B7A"></path><defs><linearGradient id="paint0_linear_6306_124794" x1="185.676" y1="129.156" x2="185.676" y2="227" gradientUnits="userSpaceOnUse"><stop stop-color="#484852"></stop><stop offset="0.615" stop-color="#777783" stop-opacity="0.1"></stop><stop offset="1" stop-color="#DEDEE6" stop-opacity="0"></stop></linearGradient><linearGradient id="paint1_linear_6306_124794" x1="110.557" y1="19.5694" x2="110.557" y2="79.5818" gradientUnits="userSpaceOnUse"><stop stop-color="#353240"></stop><stop offset="1" stop-color="#24212F" stop-opacity="0"></stop></linearGradient><linearGradient id="paint2_linear_6306_124794" x1="303.907" y1="65.2301" x2="303.907" y2="109.586" gradientUnits="userSpaceOnUse"><stop stop-color="#353240"></stop><stop offset="1" stop-color="#24212F" stop-opacity="0"></stop></linearGradient><linearGradient id="paint3_linear_6306_124794" x1="212.361" y1="177.425" x2="211.673" y2="-1.70206e-05" gradientUnits="userSpaceOnUse"><stop stop-color="#100F15"></stop><stop offset="0.232" stop-color="#27252F"></stop><stop offset="0.925" stop-color="#514E5A"></stop><stop offset="1" stop-color="#33323C"></stop></linearGradient><linearGradient id="paint4_linear_6306_124794" x1="188.942" y1="9.13086" x2="188.942" y2="155.486" gradientUnits="userSpaceOnUse"><stop stop-color="#676570"></stop><stop offset="1" stop-color="#403F4B"></stop></linearGradient><linearGradient id="paint5_linear_6306_124794" x1="177.68" y1="144.809" x2="177.68" y2="177.424" gradientUnits="userSpaceOnUse"><stop stop-color="#504F5C"></stop><stop offset="1" stop-color="#2E2C3B"></stop></linearGradient><linearGradient id="paint6_linear_6306_124794" x1="275.816" y1="28.1825" x2="275.816" y2="3.62035" gradientUnits="userSpaceOnUse"><stop stop-color="#31303A"></stop><stop offset="1" stop-color="#2B2930"></stop></linearGradient><linearGradient id="paint7_linear_6306_124794" x1="51.3203" y1="144" x2="51.3203" y2="164" gradientUnits="userSpaceOnUse"><stop stop-color="#33303E"></stop><stop offset="1" stop-color="#3D3B46"></stop></linearGradient><linearGradient id="paint8_linear_6306_124794" x1="52.0976" y1="99.1497" x2="52.0976" y2="149.74" gradientUnits="userSpaceOnUse"><stop stop-color="#302C3F"></stop><stop offset="1" stop-color="#494854"></stop></linearGradient><linearGradient id="paint9_linear_6306_124794" x1="344.097" y1="165.449" x2="344.097" y2="181.337" gradientUnits="userSpaceOnUse"><stop stop-color="#23202A"></stop><stop offset="1" stop-color="#42404B"></stop></linearGradient><linearGradient id="paint10_linear_6306_124794" x1="344.795" y1="140.896" x2="344.795" y2="172.673" gradientUnits="userSpaceOnUse"><stop stop-color="#302C3F"></stop><stop offset="1" stop-color="#494854"></stop></linearGradient><linearGradient id="paint11_linear_6306_124794" x1="296.068" y1="131.764" x2="296.068" y2="170.902" gradientUnits="userSpaceOnUse"><stop stop-color="#494855"></stop><stop offset="1" stop-color="#312F3B"></stop></linearGradient><linearGradient id="paint12_linear_6306_124794" x1="84.0489" y1="52.2659" x2="113.914" y2="80.8551" gradientUnits="userSpaceOnUse"><stop stop-color="#605D6A"></stop><stop offset="1" stop-color="#7D7B8B"></stop></linearGradient><linearGradient id="paint13_linear_6306_124794" x1="83.5475" y1="51.2645" x2="106.537" y2="69.6654" gradientUnits="userSpaceOnUse"><stop stop-color="#7C7A84"></stop><stop offset="1" stop-color="#ABAAB3"></stop></linearGradient></defs></symbol></defs><g><path opacity="0.3" d="M185.676 227C268.288 227 335.259 205.097 335.259 178.077C335.259 151.058 268.288 129.156 185.676 129.156C103.064 129.156 36.0938 151.058 36.0938 178.077C36.0938 205.097 103.064 227 185.676 227Z" fill="url(&quot;#paint0_linear_6306_124794&quot;)"></path><path d="M24.2361 48.4838C39.3083 46.0376 45.4084 44.1986 60.1233 29.9067C74.8398 15.6163 89.7608 36.4663 111.891 28.0943C134.02 19.7238 136.044 9.58829 169.892 40.6345C185.494 53.8291 197.904 48.6052 205.553 53.8291C210.65 57.3103 215.564 65.8955 220.296 79.5818H24.2361C8.62556 74.1061 0.820312 69.5603 0.820312 65.9399C0.820312 60.5116 9.1638 50.9284 24.2361 48.4838Z" fill="url(&quot;#paint1_linear_6306_124794&quot;)"></path><path d="M237.112 86.6013C248.773 84.7933 253.495 83.4326 264.881 72.8706C276.268 62.3072 287.815 77.7185 304.939 71.5305C322.063 65.3441 323.628 57.8532 349.821 80.7998C361.895 90.5518 371.497 86.6901 377.415 90.5518C381.36 93.1253 385.162 99.4702 388.823 109.586H237.112C225.031 105.54 218.992 102.178 218.992 99.5043C218.992 95.4915 225.448 88.4078 237.112 86.6013Z" fill="url(&quot;#paint2_linear_6306_124794&quot;)"></path><path d="M273.802 0C283.932 0 292.144 8.2002 292.144 18.3165V20.12H259.592V159.109C259.592 169.224 251.381 177.425 241.251 177.425H123.687C123.322 177.425 122.973 177.28 122.715 177.022C122.457 176.765 122.312 176.415 122.313 176.051V14.6532C122.313 6.56105 128.881 0 136.986 0H273.802Z" fill="url(&quot;#paint3_linear_6306_124794&quot;)"></path><path opacity="0.712" d="M240.78 9.13086H137.104C136.363 9.13086 135.629 9.27668 134.944 9.55999C134.26 9.84329 133.637 10.2585 133.113 10.782C132.589 11.3055 132.174 11.9269 131.89 12.6108C131.607 13.2948 131.461 14.0277 131.461 14.7679V162.656C131.461 163.396 131.607 164.129 131.89 164.813C132.174 165.496 132.59 166.118 133.114 166.641C133.638 167.164 134.26 167.579 134.945 167.863C135.629 168.146 136.363 168.292 137.104 168.292H240.78C241.522 168.292 242.255 168.146 242.94 167.863C243.625 167.579 244.247 167.164 244.771 166.641C245.295 166.118 245.711 165.496 245.994 164.813C246.278 164.129 246.424 163.396 246.424 162.656V14.7679C246.424 14.0277 246.278 13.2948 245.995 12.6108C245.711 11.9269 245.296 11.3055 244.771 10.782C244.247 10.2585 243.625 9.84329 242.94 9.55999C242.256 9.27668 241.522 9.13086 240.78 9.13086Z" fill="url(&quot;#paint4_linear_6306_124794&quot;)"></path><path d="M225.836 144.809V160.94C225.836 170.043 233.226 177.424 242.343 177.424H114.529C104.401 177.424 96.1875 169.223 96.1875 159.108V144.809H225.836ZM259.174 161.117C259.174 170.123 251.863 177.424 242.843 177.424H242.667C251.783 177.424 259.174 170.043 259.174 160.94L259.173 161.028L259.174 161.117Z" fill="url(&quot;#paint5_linear_6306_124794&quot;)"></path><path d="M275.816 0C284.834 0 292.145 7.29993 292.145 16.3071L292.144 30.0052H259.484V16.3086C259.484 7.30141 266.796 0 275.816 0Z" fill="url(&quot;#paint6_linear_6306_124794&quot;)"></path><rect x="48.8203" y="144" width="5" height="20" rx="2.5" fill="url(&quot;#paint7_linear_6306_124794&quot;)"></rect><path fill-rule="evenodd" clip-rule="evenodd" d="M46.1844 105.961C41.438 115.8 25.098 145.98 47.9933 149.359C70.8901 152.738 69.8685 132.651 65.8517 125.462C61.8364 118.273 57.3036 114.249 57.3036 105.961C57.3036 97.6734 50.9292 96.1201 46.1829 105.961H46.1844Z" fill="url(&quot;#paint8_linear_6306_124794&quot;)"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M343.974 165.449H344.221C344.921 165.449 345.491 166.016 345.491 166.717V180.068C345.491 180.405 345.357 180.727 345.119 180.965C344.881 181.203 344.558 181.337 344.221 181.337H343.974C343.637 181.337 343.314 181.204 343.075 180.966C342.837 180.728 342.703 180.405 342.703 180.068V166.717C342.703 166.016 343.272 165.449 343.974 165.449Z" fill="url(&quot;#paint9_linear_6306_124794&quot;)"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M340.932 145.174C337.834 151.355 327.164 170.311 342.114 172.434C357.066 174.556 356.399 161.939 353.778 157.424C351.155 152.908 348.195 150.38 348.195 145.174C348.195 139.968 344.031 138.994 340.932 145.174Z" fill="url(&quot;#paint10_linear_6306_124794&quot;)"></path><path d="M269.941 131.764H322.196C323.639 131.764 324.809 132.933 324.809 134.373V168.292C324.809 169.734 323.639 170.901 322.196 170.901H269.941C269.248 170.901 268.583 170.626 268.093 170.137C267.603 169.648 267.328 168.984 267.328 168.292V134.373C267.328 132.933 268.498 131.764 269.941 131.764Z" fill="url(&quot;#paint11_linear_6306_124794&quot;)"></path><path opacity="0.398" d="M284.309 32.6133C282.541 53.9608 273.212 64.0459 263.885 69.6786C249.04 78.6443 231.874 74.1814 227.627 69.6786C220.715 62.3476 233.578 51.1844 246.322 59.5164C259.065 67.8484 223.925 97.2125 187.223 92.0122C162.755 88.5459 140.684 82.0766 121.008 72.6045" stroke="#908E9B" stroke-width="0.881px" stroke-linecap="round" stroke-dasharray="2.64 2.64" fill="none"></path><path d="M83.2109 50.6191L124.558 71.2914L116.173 82.6011L83.2109 50.6191Z" fill="#565461"></path><path d="M83.2109 50.6191L116.168 82.5997L118.765 69.3487L83.2109 50.6191Z" fill="url(&quot;#paint12_linear_6306_124794&quot;)"></path><path d="M83.2109 50.6191L103.479 66.3814L118.759 69.3443L83.2109 50.6191Z" fill="url(&quot;#paint13_linear_6306_124794&quot;)"></path><path d="M88.8516 53.4336L136.814 71.5901L124.564 71.291L88.8516 53.4336Z" fill="#6D6B7A"></path><defs><lineargradient id="paint0_linear_6306_124794" x1="185.676" y1="129.156" x2="185.676" y2="227" gradientunits="userSpaceOnUse"><stop stop-color="#484852"></stop><stop offset="0.615" stop-color="#777783" stop-opacity="0.1"></stop><stop offset="1" stop-color="#DEDEE6" stop-opacity="0"></stop></lineargradient><lineargradient id="paint1_linear_6306_124794" x1="110.557" y1="19.5694" x2="110.557" y2="79.5818" gradientunits="userSpaceOnUse"><stop stop-color="#353240"></stop><stop offset="1" stop-color="#24212F" stop-opacity="0"></stop></lineargradient><lineargradient id="paint2_linear_6306_124794" x1="303.907" y1="65.2301" x2="303.907" y2="109.586" gradientunits="userSpaceOnUse"><stop stop-color="#353240"></stop><stop offset="1" stop-color="#24212F" stop-opacity="0"></stop></lineargradient><lineargradient id="paint3_linear_6306_124794" x1="212.361" y1="177.425" x2="211.673" y2="-1.70206e-05" gradientunits="userSpaceOnUse"><stop stop-color="#100F15"></stop><stop offset="0.232" stop-color="#27252F"></stop><stop offset="0.925" stop-color="#514E5A"></stop><stop offset="1" stop-color="#33323C"></stop></lineargradient><lineargradient id="paint4_linear_6306_124794" x1="188.942" y1="9.13086" x2="188.942" y2="155.486" gradientunits="userSpaceOnUse"><stop stop-color="#676570"></stop><stop offset="1" stop-color="#403F4B"></stop></lineargradient><lineargradient id="paint5_linear_6306_124794" x1="177.68" y1="144.809" x2="177.68" y2="177.424" gradientunits="userSpaceOnUse"><stop stop-color="#504F5C"></stop><stop offset="1" stop-color="#2E2C3B"></stop></lineargradient><lineargradient id="paint6_linear_6306_124794" x1="275.816" y1="28.1825" x2="275.816" y2="3.62035" gradientunits="userSpaceOnUse"><stop stop-color="#31303A"></stop><stop offset="1" stop-color="#2B2930"></stop></lineargradient><lineargradient id="paint7_linear_6306_124794" x1="51.3203" y1="144" x2="51.3203" y2="164" gradientunits="userSpaceOnUse"><stop stop-color="#33303E"></stop><stop offset="1" stop-color="#3D3B46"></stop></lineargradient><lineargradient id="paint8_linear_6306_124794" x1="52.0976" y1="99.1497" x2="52.0976" y2="149.74" gradientunits="userSpaceOnUse"><stop stop-color="#302C3F"></stop><stop offset="1" stop-color="#494854"></stop></lineargradient><lineargradient id="paint9_linear_6306_124794" x1="344.097" y1="165.449" x2="344.097" y2="181.337" gradientunits="userSpaceOnUse"><stop stop-color="#23202A"></stop><stop offset="1" stop-color="#42404B"></stop></lineargradient><lineargradient id="paint10_linear_6306_124794" x1="344.795" y1="140.896" x2="344.795" y2="172.673" gradientunits="userSpaceOnUse"><stop stop-color="#302C3F"></stop><stop offset="1" stop-color="#494854"></stop></lineargradient><lineargradient id="paint11_linear_6306_124794" x1="296.068" y1="131.764" x2="296.068" y2="170.902" gradientunits="userSpaceOnUse"><stop stop-color="#494855"></stop><stop offset="1" stop-color="#312F3B"></stop></lineargradient><lineargradient id="paint12_linear_6306_124794" x1="84.0489" y1="52.2659" x2="113.914" y2="80.8551" gradientunits="userSpaceOnUse"><stop stop-color="#605D6A"></stop><stop offset="1" stop-color="#7D7B8B"></stop></lineargradient><lineargradient id="paint13_linear_6306_124794" x1="83.5475" y1="51.2645" x2="106.537" y2="69.6654" gradientunits="userSpaceOnUse"><stop stop-color="#7C7A84"></stop><stop offset="1" stop-color="#ABAAB3"></stop></lineargradient></defs></g></svg>
                    {/* <Typography
                      variant="body2"
                      sx={{
                        textAlign: "center",
                        color: "#757575",
                        marginBottom: "1rem",
                      }}
                    >
                      No deposit history available.
                    </Typography> */}
                  </Box>
                )}

                {/* Button to navigate to all deposit histories */}
                {/* <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    marginBottom: "3rem",
                    textTransform: "initial",
                    width: "100%",
                    borderRadius: "20px",
                    background:
                      "linear-gradient(180deg, #398EFF 0%, #398EFF 30%, #398EFF 100% )",
                    "&:hover": {
                      background:
                        "linear-gradient(to right, #4782ff  , #4782ff  )",
                    },
                  }}
                  onClick={handlePage}
                >
                  All Deposit Histories
                </Button> */}
              </div>
            </Box>
          </Box>

          {children}
          <br />
          <br />
        </Box>
      </Mobile>
    </div>
  );
};

export default PromotionMain;
