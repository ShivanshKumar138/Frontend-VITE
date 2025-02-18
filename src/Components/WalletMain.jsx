import React, { useEffect, useState , useMemo} from "react";
import Mobile from "./Mobile";
import IconButton from "@mui/material/IconButton";
import SmsIcon from "@mui/icons-material/Sms";
import DownloadIcon from "@mui/icons-material/Download";
import { Typography, Button, Grid, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { domain } from "./config";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth hook
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const WalletMain = ({ children }) => {
  const [user, setUser] = useState(null);
  const [depositHistory, setDepositHistory] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [thirdPartyWalletBalance, setThirdPartyWalletBalance] = useState(0); // State for third party wallet balance
  const [jilithirdpartywalletbalance, setJiliRealMemberStatus] = useState(null); // State for JiliReal member status
   
  const totalBalance = useMemo(() => {
    return thirdPartyWalletBalance + (jilithirdpartywalletbalance || 0);
  }, [thirdPartyWalletBalance, jilithirdpartywalletbalance]);


  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); // Use useAuth hook to access isAuthenticated

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", setVh);
    setVh();

    return () => window.removeEventListener("resize", setVh);
  }, []);

  const mainWalletBalance = user ? user.walletAmount : 0;
  const progressMainWallet = mainWalletBalance ? 100 : (mainWalletBalance / 100) * 100;
  const progressThirdPartyWallet = totalBalance ? 100 : (totalBalance / 100) * 100;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem('token');// Assuming the token is stored in localStorage
        const response = await axios.get(`${domain}/user`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setUser(response.data.user);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    const fetchDepositHistory = async () => {
      try {
        const token = sessionStorage.getItem('token');// Assuming the token is stored in localStorage
        const response = await axios.get(`${domain}/user/depositHistory/sum`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDepositHistory(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDepositHistory();
  }, []);

  useEffect(() => {
    const fetchWithdrawAmount = async () => {
      try {
       const token = sessionStorage.getItem('token'); // Assuming the token is stored in localStorage
        const response = await axios.get(`${domain}/completed_withdraws_sum`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWithdrawAmount(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchWithdrawAmount();
  }, []);

  useEffect(() => {
    const fetchThirdPartyWalletBalance = async () => {
      try {
         const token = sessionStorage.getItem('token');// Assuming the token is stored in localStorage
        const response = await axios.post(`${domain}/topbetgaming-balance`, 
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("response", response.data);
        setThirdPartyWalletBalance(response.data.balance);
      } catch (err) {
        console.error(err);
      }
    };

    fetchThirdPartyWalletBalance();
  }, []);

  useEffect(() => {
    const fetchJiliRealMemberStatus = async () => {
      try {
         const token = sessionStorage.getItem('token'); // Assuming the token is stored in localStorage
        const response = await axios.post(`${domain}/jilireal-get-member-status`, 
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("JiliReal response", response.data);
        const balance = response.data.responseData.Data[0].Balance;
        setJiliRealMemberStatus(balance);
      } catch (err) {
        console.error(err);
      }
    };

    fetchJiliRealMemberStatus();
  }, []);

  const handleTransfer = async () => {
    if (thirdPartyWalletBalance > 0) {
      try {
         const token = sessionStorage.getItem('token'); // Assuming the token is stored in localStorage
        const response = await axios.post(
          `${domain}/topbetgaming-withdraw/`,
          {},
          { 
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success == 1) {
          setThirdPartyWalletBalance(0); // Set third-party wallet balance to 0
          alert("Transfer successful");
        } else {
          console.error(response.data.message);
        }
      } catch (err) {
        console.error(err);
      }
    }
  
    if (jilithirdpartywalletbalance > 0) {
      try {
         const token = sessionStorage.getItem('token'); // Assuming the token is stored in localStorage
        const response = await axios.post(
          `${domain}/jilireal-withdraw/`,
          { Balance: jilithirdpartywalletbalance }, // Send jilithirdpartywalletbalance in the body
          { 
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success == 1) {
          setJiliRealMemberStatus(0); // Set JiliReal member status to 0
          alert("Transfer successful");
        } else {
          console.error(response.data.message);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };


  const handleRedirect = () => {
    navigate(-1);
  };

  const data = [
    { label: "Lottery", value: `${user ? user.walletAmount.toFixed(2) : 0}` },
    { label: "TB_Chess", value: 0.0 },
    { label: "Wickets9", value: 0.0 },
    { label: "CQ9", value: 0.0 },
    { label: "MG", value: 0.0 },
    { label: "JDB", value: 0.0 },
    { label: "CMD", value: 0.0 },
    { label: "SaBa", value: 0.0 },
    { label: "IM", value: 0.0 },
    { label: "EVO_Video", value: 0.0 },
    { label: "JILI", value: 0.0 },
    { label: "Card365", value: 0.0 },
    { label: "V8Card", value: 0.0 },
    { label: "AG_Video", value: 0.0 },
    { label: "DG", value: 0.0 },
    { label: "PG", value: 0.0 },
    { label: "WM_Video", value: 0.0 },
    { label: "TB", value: 0.0 },
  ];

  return (
    <div>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          height="calc(var(--vh, 1vh) * 100)"
          position="relative"
        >
          <Box flexGrow={1} sx={{ backgroundColor: "#380003"}}>
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                background: "#a50000",
                padding: "4px 8px",
                color: "#e4911d",
              }}
            >
              <Grid item container alignItems="center" justifyContent="center">
                <Grid item xs={2}>
                  <IconButton
                    sx={{ color: "#e4911d", ml: -5 }}
                    onClick={handleRedirect}
                  >
                    <ArrowBackIosNewIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={10}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "e4911d",
                      flexGrow: 1,
                      textAlign: "center",
                      mr: 8,
                    }}
                  >
                    Wallet
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              container
              spacing={2}
              sx={{
                background: "#380003",
                height: "13.5rem",
                padding: "7px",
              }}
            >
              {/* Image Section */}
              <Grid item xs={12} display="flex" justifyContent="center" mt={1}>
                <img
                  src="assets/images/wallets-55b46543.png"
                  alt="Placeholder"
                  width={40}
                  height={40}
                />
              </Grid>

              {/* Wallet Amount Section */}
              <Grid
                item
                xs={12}
                textAlign="center"
                sx={{
                  marginTop: "-20px", // Space between the image and the wallet amount
                }}
              >
                <Typography
                  color={"#e4911d"}
                  sx={{ fontSize: "1.5rem" }}
                >{`\u20B9${user ? user.walletAmount.toFixed(2) : " Loading"}`}</Typography>
                <Typography color={"#e4911d"} sx={{ fontSize: "15.36px" }}>
                  Total balance
                </Typography>
              </Grid>

              {/* Total Amount and Total Deposit Sections */}
              <Grid item xs={6} textAlign="center">
                <Typography
                  color={"#e4911d"}
                  sx={{ fontSize: "20.6px" }}
                >{`\u20B9${
                  withdrawAmount ? withdrawAmount.totalBalance : " Loading"
                }`}</Typography>
                <Typography color={"#e4911d"} sx={{ fontSize: "12px" }}>
                  Total Amount
                </Typography>
              </Grid>
              <Grid item xs={6} textAlign="center">
                <Typography
                  color={"#e4911d"}
                  sx={{ fontSize: "20.6px" }}
                >{`\u20B9${
                  depositHistory ? depositHistory.totalDeposit : " Loading"
                }`}</Typography>
                <Typography color={"#e4911d"} sx={{ fontSize: "12px" }}>
                  Total Deposit Amount
                </Typography>
              </Grid>
            </Grid>

            <Grid
              container
              mt={2}
              sx={{
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                marginLeft: "auto",
                marginRight: "auto",
                maxWidth: "95%",
                backgroundColor: "#720811",
                borderRadius: "20px",
              }}
            >
              {/* First Grid */}
              <Grid item xs={6} mt={2}>
                <Box position="relative" display="inline-flex">
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size={80}
                    sx={{ color: "#D8D8D8" }}
                  />
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size={80}
                    sx={{ color: "#e4911d", position: "absolute" }}
                  />
                  <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography
                      variant="body2"
                      component="div"
                      sx={{ color: "#e4911d", fontWeight: "bold" }}
                    >
                      {`${Math.round(progressMainWallet)}%`}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="h6"
                  sx={{ color: "#e4911d", fontSize: "1rem" }}
                >{`\u20B9${user ? user.walletAmount.toFixed(2) : " Loading"}`}</Typography>
                <Typography sx={{ color: "#e4911d", fontSize: "0.9rem" }}>
                  Main Wallet
                </Typography>
              </Grid>
              <Grid item xs={6} mt={2}>
                <Box position="relative" display="inline-flex">
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size={80}
                    sx={{ color: "#D8D8D8" }}
                  />
                  <CircularProgress
                    variant="determinate"
                    value={progressThirdPartyWallet}
                    size={80}
                    sx={{ color: "#e4911d", position: "absolute" }}
                  />
                  <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography
                      variant="body2"
                      component="div"
                      sx={{ color: "#e4911d", fontWeight: "bold" }}
                    >
                      {`${Math.round(progressThirdPartyWallet)}%`}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  sx={{ color: "#e4911d", fontSize: "1rem" }}
                >{`₹${totalBalance}`}</Typography>
                <Typography sx={{ color: "#e4911d", fontSize: "0.9rem" }}>
                  3rd Party Wallet
                </Typography>
              </Grid>
              {/* Second Grid */}
              <Grid item xs={12} mt={2}>
                <Button
                  variant="contained"
                  sx={{
                    background: "linear-gradient(180deg, #fbfff4 0%, #efb228 30%, #986800 100% )",
                    borderRadius: "20px",
                    width: "95%",
                    fontWeight: "bold",
                    textTransform: "initial",
                  }}
                  fullWidth
                  onClick={handleTransfer}
                >
                  Main wallet transfer
                </Button>
              </Grid>
              {/* Third Grid */}
              <Grid container item xs={12} spacing={1} mt={1} mb={1}>
                <Grid item xs={3} onClick={() => navigate("/recharge")}>
                  <img
                    src="https://bdgacting.com/assets/png/rechargeIcon-efb79f43.png"
                    alt="1"
                    width={60}
                    height={60}
                  />
                  <Typography sx={{ color: "white", fontSize: "0.8rem" }}>
                    Deposit{" "}
                  </Typography>
                </Grid>
                <Grid item xs={3} onClick={() => navigate("/withdraw")}>
                  <img
                    src="https://bdgacting.com/assets/png/widthdrawBlue-5fcf62bd.png"
                    alt="2"
                    width={60}
                    height={60}
                  />
                  <Typography sx={{ color: "white", fontSize: "0.8rem" }}>
                    Withdraw
                  </Typography>
                </Grid>
                <Grid item xs={3} onClick={() => navigate("/deposit-history")}>
                  <img
                    src="https://bdgacting.com/assets/png/rechargeHistory-28b45ebe.png"
                    alt=" 3"
                    width={60}
                    height={60}
                  />
                  <Typography sx={{ color: "white", fontSize: "0.8rem" }}>
                    Deposit history
                  </Typography>
                </Grid>
                <Grid item xs={3} onClick={() => navigate("/withdraw-history")}>
                  <img
                    src="https://bdgacting.com/assets/png/withdrawHistory-033a34f8.png"
                    alt="4"
                    width={60}
                    height={60}
                  />
                  <Typography sx={{ color: "white", fontSize: "0.8rem" }}>
                    Withdraw History
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Box sx={{ p: 2, borderRadius: 1, marginBottom: "100px" }}>
              <Grid container spacing={1.5}>
                {data.map((item, index) => (
                  <Grid item xs={4} key={index}>
                    <Box sx={{ bgcolor: "#720811 ", p: 2.7, borderRadius: 1 }}>
                      <Typography variant="h7" sx={{ color: "#e4911d" }}>
                        {item.value}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#e4911d", fontSize: "0.8rem" }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
            {/* content end */}
            <br />
            <br />
          </Box>

          {children}
        </Box>
      </Mobile>
    </div>
  );
};

export default WalletMain;