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
          <Box flexGrow={1} backgroundColor="#380003">
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                backgroundColor: "#a50000",
                padding: "7px 4px",
                color: "white",
              }}
            >
              <Grid item container alignItems="center" justifyContent="center">
                <Grid item xs={3}>
                  <IconButton
                    sx={{ color: "#e4911d", mr: 8 }}
                    onClick={handleRedirect}
                  >
                    <ArrowBackIosNewIcon sx={{ fontSize: "20px" }} />
                  </IconButton>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#e4911d",
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
                      color: "#e4911d",
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
                // backgroundImage: `url('assets/greencard.png')`,
                background: "#720811",
                borderRadius: 8,
                padding: 8,
                backgroundSize: "cover",
                width: "95%",
                marginLeft: "auto", 
                marginRight: "auto",
                height: "150px",
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
                    sx={{ color: "#e4911d" }}
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
                    fontSize="20px"
                    sx={{ color: "#e4911d", fontWeight: "bold" }}
                  >
                    {`\u20B9 ${
                      user ? user.walletAmount.toFixed(2) : "Loading..."
                    }`}
                  </Typography>
                  <IconButton sx={{ marginLeft: "5px", fontWeight: "bold" }}>
                    <RefreshIcon
                      onClick={handleRefresh}
                      style={{ color: "#ffffff" }}
                    />
                  </IconButton>
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
                <Grid item xs={4} key={mode}>
                  <div
                    style={{
                      background:
                        paymentMode === mode
                          ? "linear-gradient(to right,#4782ff, #4782ff)"
                          : "#ffffff",
                      borderRadius: 8,
                      color: paymentMode === mode ? "#ffffff" : "black",
                      padding: 16,
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
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
                border: "#a50000",
                borderRadius: "12px",
                padding: "12px",
                paddingBottom: "15px",
                paddingTop: "15px",
                backgroundColor: "#720811",
                width: "91%",
                margin: "0 auto",
                mt: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <img
                  src="assets/card.png"
                  alt="Placeholder"
                  width={25}
                  height={25}
                />
                <Typography
                  variant="h6"
                  sx={{ fontSize: "1rem", marginLeft: 1, fontWeight: "bold", color:"#e4911D" }}
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
              sx={{ bgcolor: "#720811", p: 2, borderRadius: 2, margin: "10px" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AccountBalanceWalletIcon sx={{ color: "#e4911d", mr: 1 }} />
                <Typography variant="h7" sx={{ fontWeight: "bold", color:"#e4911d" }}>
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
                bgcolor: "#720811",
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
                  <RhombusIcon sx={{ fontSize: 30, color: "#e4911d", mr: 1 }} />
                  <Typography variant="body1" fontWeight="bold" align="left" color="#e4911d">
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
                      color: "white",
                    }}
                    align="left"
                  >
                    <RhombusIcon
                      sx={{ fontSize: 12, color: "white", mr: 1 }} // Slightly larger icon for better visibility
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
                      color: "white",
                    }}
                    align="left"
                  >
                    <RhombusIcon
                      sx={{ fontSize: 12, color: "white", mr: 1 }} // Slightly larger icon for better visibility
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
                      color: "white",
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
                      color: "white",
                    }}
                    align="left"
                  >
                    <RhombusIcon
                      sx={{ fontSize: 12, color: "white", mr: 1 }} // Slightly larger icon for better visibility
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
                  color: "#e4911d",
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
                    <img
                      src="../../games/assets/No data-rafiki.png" // Replace with the correct path to your image file
                      alt="No data available"
                      style={{ width: "150px", marginBottom: "10px" }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        textAlign: "center",
                        color: "#757575",
                        marginBottom: "1rem",
                      }}
                    >
                      No deposit history available.
                    </Typography>
                  </Box>
                )}

                {/* Button to navigate to all deposit histories */}
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    marginBottom: "3rem",
                    textTransform: "initial",
                    width: "100%",
                    borderRadius: "20px",
                    background:
                      "linear-gradient(180deg, #fbfff4 0%, #efb228 30%, #986800 100% )",
                    "&:hover": {
                      background:
                        "linear-gradient(to right, #4782ff  , #4782ff  )",
                    },
                  }}
                  onClick={handlePage}
                >
                  All Deposit Histories
                </Button>
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
