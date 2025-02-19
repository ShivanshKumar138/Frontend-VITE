import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Mobile from "../Components/Mobile";
import { Typography, Grid, Box, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { Button } from "@mui/material";
import { Refresh, AccountBalanceWallet, VolumeUp } from "@mui/icons-material";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import NoteIcon from "@mui/icons-material/Note";
import { Tabs, Tab } from "@mui/material";
import { Drawer } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { CSSTransition } from "react-transition-group";
import { useNavigate } from "react-router-dom";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import "../App.css";
import axios from "axios";
import {
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import RowVisualization from "./Row";
import CustomTable from "./Visualize";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { ButtonGroup, styled } from "@mui/material";
import { domain } from "../Components/config";
import { wssdomain } from "../Components/config";
import MusicOffIcon from "@material-ui/icons/MusicOff";
import Play from "./Play";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
// import icon from "../../public/games/assets/Clock.png"
import RemoveIcon from "@mui/icons-material/IndeterminateCheckBox";
import AddIcon from "@mui/icons-material/AddBox";
const countdownSound = new Audio("/assets/sound.mp3");
countdownSound.loop = true;

const images = [
  {
    id: 4,
    src: "../../games/assets/time-5d4e96a3.png",
    altSrc: "/assets/blueclock.png",
    subtitle: "30Sec", // Updated subtitle for 30 seconds
  },
  {
    id: 1,
    src: "../../games/assets/time-5d4e96a3.png",
    altSrc: "/assets/blueclock.png",
    subtitle: "1Min",
  },
  {
    id: 2,
    src: "../../games/assets/time-5d4e96a3.png",
    altSrc: "/assets/blueclock.png",
    subtitle: "3Min",
  },
  {
    id: 3,
    src: "../../games/assets/time-5d4e96a3.png",
    altSrc: "/assets/blueclock.png",
    subtitle: "5Min",
  },
];

const tabData = [
  { label: "Game History" },
  { label: "Chart" },
  { label: "My History" },
];

const TabPanel = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && (
        <Box p={0} m={0}>
          {children}
        </Box>
      )}
    </div>
  );
};

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  borderRadius: "5px",
  padding: "3px 0px",
  gap: "5.5px",
}));
const StyledButton = styled(Button)(({ theme, active, isRandom }) => ({
  backgroundColor: isRandom ? "#ffffff" : active ? "#17B15E" : "#f2f2f1",
  color: isRandom ? "#D23838" : active ? "#ffffff" : "#000000",
  fontSize: "0.8rem",
  padding: "3px 8px",
  border: isRandom ? "1px solid #D23838" : "none",
  "&:hover": {
    backgroundColor: isRandom ? "#ffffff" : active ? "#17B15E" : "#f2f2f1",
    border: isRandom ? "1px solid #D23838" : "none",
  },
}));

const multipliers = [
  { label: "Random", value: "random", isRandom: true },
  { label: "X1", value: 1 },
  { label: "X5", value: 5 },
  { label: "X10", value: 10 },
  { label: "X20", value: 20 },
  { label: "X50", value: 50 },
  { label: "X100", value: 100 },
];

const Head = ({ timerKey }) => {
  const [activeId, setActiveId] = useState(images[0].id);
  const [selectedTimer, setSelectedTimer] = useState("1Min");
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [periodId, setPeriodId] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [user, setUser] = useState(null);
  const [index, setIndex] = React.useState(0);
  const [inProp, setInProp] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [betAmount, setBetAmount] = useState(1);
  const [multiplier, setMultiplier] = useState(1);
  const [totalBet, setTotalBet] = useState(0);
  const [betPlaced, setBetPlaced] = useState(false);
  const [betPeriodId, setBetPeriodId] = useState(null);
  const [lastAlertedPeriodId, setLastAlertedPeriodId] = useState(null);
  const [open, setOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState("");
  const [gameResult, setGameResult] = useState("");
  const [value, setValue] = useState(0);
  const [bets, setBets] = useState([]);
  const [selectedColor, setSelectedColor] = useState("RGB(71,129,255)");
  const [winloss, setWinLoss] = useState(0);
  const [popupperiod, setPopupPeriod] = useState(0);
  const [popupresult, setPopupResult] = useState(0);
  const [popupperiodid, setPopupPeriodId] = useState(0);
  const [popupTimer, setPopupTimer] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSmall, setIsSmall] = useState(false);
  const [isBig, setIsBig] = useState(true);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [popupQueue, setPopupQueue] = useState([]); // new queue to manage sequential popups
  const [currentBetIndex, setCurrentBetIndex] = useState(0); // tracks current popup being shown
  const [accountType, setAccountType] = useState("Normal");
  // State for tracking animation and selection
  const [animatedIndex, setAnimatedIndex] = useState(null);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [selectedMultiplier, setSelectedMultiplier] = useState(1);

  const navigate = useNavigate();

  // Handles the random selection animation
  const handleRandomSelection = () => {
    setIsRandomizing(true);
    let currentIndex = 0;
    const totalItems = 10;
    const intervalSpeed = 100; // Slower animation
    const animationDuration = 2000; // Longer duration for smoother feel
    const iterations = Math.floor(animationDuration / intervalSpeed);
    let count = 0;

    const animationInterval = setInterval(() => {
      setAnimatedIndex(currentIndex);
      currentIndex = (currentIndex + 1) % totalItems;
      count++;

      if (count >= iterations) {
        clearInterval(animationInterval);
        const finalIndex = Math.floor(Math.random() * totalItems);
        setAnimatedIndex(finalIndex);
        const eventType =
          finalIndex === 0
            ? "mix1"
            : finalIndex === 5
            ? "mix2"
            : finalIndex % 2 === 1
            ? "green"
            : "red";
        handleEventSelection(eventType);
        handleOpenDrawer(finalIndex.toString());
        setTimeout(() => {
          setIsRandomizing(false);
          setAnimatedIndex(null);
        }, 1000); // Longer delay before resetting
      }
    }, intervalSpeed);
  };

  useEffect(() => {
    if (timerKey) {
      console.log("Timer key received:", timerKey); // Console log the timerKey

      // Map timerKey to corresponding timer details
      const timerMap = {
        "30sec": { id: 4, subtitle: "30sec" }, // New timer entry
        "1min": { id: 1, subtitle: "1min" },
        "3min": { id: 2, subtitle: "3min" },
        "5min": { id: 3, subtitle: "5min" },
      };

      if (timerMap[timerKey]) {
        setActiveId(timerMap[timerKey].id);
        setSelectedTimer(timerMap[timerKey].subtitle);
        navigate(`/timer/${timerKey}`);
      }
    }
  }, [timerKey, navigate]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setIsSmall(true);
        setIsBig(false);
      } else {
        setIsSmall(false);
        setIsBig(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Set the initial state
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const fetchUserData = async () => {
    try {
      const token = sessionStorage.getItem('token'); // Assuming the token is stored in sessionStorage
      const response = await axios.get(`${domain}/user`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("User is----->",response.data.user)
      setAccountType(response.data.user.accountType);
      setUser(response.data.user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefresh = () => {
    // Handle refresh logic
    fetchUserData();
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem('token'); // Assuming the token is stored in sessionStorage
        const response = await axios.get(`${domain}/wingoresult`, {
          params: { timer: selectedTimer },
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // Filter the data based on the selectedTimer
        const filteredData = response.data.Result.filter(
          (item) => item.timer === selectedTimer
        );
  
        setRows(filteredData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserData();
    const intervalId = setInterval(fetchUserData, 1000);
    return () => clearInterval(intervalId);
  }, [selectedTimer]);

  useEffect(() => {
    const socket = new WebSocket(`${wssdomain}/`);
    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data && data.timers && data.timers[selectedTimer]) {
        setPeriodId(data.timers[selectedTimer].periodId); // Set the periodId
        // console.log("rem-->", data.timers[selectedTimer].remainingTime);
        setRemainingTime(data.timers[selectedTimer].remainingTime); // Set the remainingTime
      } else {
        console.error("Unexpected data structure", data);
      }
    };
    return () => socket.close(); // Cleanup WebSocket connection
  }, [selectedTimer]);

  const handleTimerChange = (id, subtitle) => {
    setActiveId(id);
    const newTimerKey = subtitle.toLowerCase().replace("min", "min");
    setSelectedTimer(subtitle);
    navigate(`/timer/${newTimerKey}`);
  };

  const handleClick = (id) => {
    if (!timerKey) {
      let newTimerKey;
      switch (id) {
        case 1:
          newTimerKey = "1min";
          break;
        case 2:
          newTimerKey = "3min";
          break;
        case 3:
          newTimerKey = "5min";
          break;
        case 4:
          newTimerKey = "30sec"; // Handle 30-second timer
          break;
        default:
          newTimerKey = "30sec";
      }
      navigate(`/timer/${newTimerKey}`);
      setSelectedTimer(images.find((img) => img.id === id).subtitle);
      setActiveId(id);
    }
  };

  const textArray = [
    "We are excited to welcome you to Gen-Z Win, where you can enjoy a wide range of games. But that's not all - there are also plenty of bonuses waiting for you to claim! Join us now and start play your game with Gen-Z Win. Get ready for non-stop fun and rewards. Welcome aboard!  Stay tuned for more updates and promotions.",
    "24/7 Live support on Gen-Z Win club ",
    "Gen-Z Win club welcomes you here !!",
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setInProp(false);

      setTimeout(() => {
        setIndex((oldIndex) => {
          return (oldIndex + 1) % textArray.length;
        });
        setInProp(true);
      }, 500); // This should be equal to the exit duration below
    }, 3000); // Duration between changing texts

    return () => clearInterval(timer);
  }, []);

  const navigateToPage = () => {
    navigate("/home"); // Replace '/path-to-page' with the actual path
  };

  const navigateToPage1 = () => {
    navigate("/recharge"); // Replace '/path-to-page' with the actual path
  };

  const navigateToPage2 = () => {
    navigate("/withdraw"); // Replace '/path-to-page' with the actual path
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpenDrawer = (item) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleBetAmount = (amount) => {
    setBetAmount(parseFloat(amount).toFixed(2));
  };

  const handleMultiplier = (multiplier) => {
    setMultiplier(multiplier);
  };

  const handleTotalBet = () => {
    setTotalBet(betAmount * multiplier);
  };

  const handlePlaceBet = async () => {
    const totalBet = betAmount * multiplier;

    // Check if user's wallet balance is less than the total bet amount
    if (betAmount === 0) {
      alert("You can't place a bet with 0 amount.");
      return;
    }
    if (user.walletAmount < totalBet) {
      alert("You don't have enough balance to place this bet.");
      return;
    }
    if (
      ["00:06", "00:05", "00:04", "00:03", "00:02", "00:01"].includes(
        remainingTime
      )
    ) {
      alert("You can't place a bet in the last 5 seconds.");
      return;
    }
    const betData = {
      selectedItem: selectedItem,
      betAmount: betAmount,
      multiplier: multiplier,
      totalBet: totalBet,
      selectedTimer: selectedTimer,
      periodId: periodId,
      result: " ",
      status: " ",
      winLoss: "",
      userType: accountType,
    };
    setLastAlertedPeriodId(periodId);
    // Send a POST request to the backend API endpoint
    try {
      const token = sessionStorage.getItem('token'); // Assuming the token is stored in sessionStorage
      const response = await axios.post(`${domain}/wingobet/`, betData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error(err);
    }

    setBetPlaced(true);
    setBetPeriodId(periodId);
    handleCloseDrawer();
    setOpenSnackbar(true);
  };

  const handleCancelBet = () => {
    setSelectedItem("");
    setBetAmount(0);
    setMultiplier(1);
    setTotalBet(0);
    handleCloseDrawer();
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };
  useEffect(() => {
    handleClick(images[0].id);
  }, []);

  const timeParts = (remainingTime || "00:00").split(":");
  const minutes = timeParts[0] || "00";
  const seconds = timeParts[1] || "00";
  const [lastPlayedTime, setLastPlayedTime] = useState(null);
  const [isSoundOn, setIsSoundOn] = useState(false);

  const toggleSound = () => {
    setIsSoundOn(!isSoundOn);
  };

  useEffect(() => {
    if (remainingTime >= "00:01" && remainingTime <= "00:05") {
      setOpenDialog(true);
      if (isSoundOn && remainingTime !== lastPlayedTime) {
        countdownSound.play();
        setLastPlayedTime(remainingTime);
        setTimeout(() => {
          countdownSound.pause();
          countdownSound.currentTime = 0;
        }, 1000 - countdownSound.duration * 1000);
      }
    } else {
      setOpenDialog(false);
      if (isSoundOn) {
        countdownSound.pause();
        countdownSound.currentTime = 0;
        setLastPlayedTime(null);
      }
    }
    // console.log("popupRemaningTime:", popupRemaningTime)
  }, [remainingTime, isSoundOn]);

  const handleEventSelection = (event) => {
    switch (event) {
      case "violet":
        setSelectedColor("#9B48DB");
        break;
      case "green":
        setSelectedColor("RGB(64,173,114)");
        break;
      case "red":
        setSelectedColor("RGB(253,86,92)");
        break;
      case "yellow":
        setSelectedColor("RGB(71,129,255)");
        break;
      case "blue":
        setSelectedColor("RGB(71,129,255)");
        break;
      case "big":
        setSelectedColor("rgb(255,168,46)");
        break;
      case "mix1":
        setSelectedColor(
          "linear-gradient(to right, rgb(253,86,92) 50%, rgb(182,89,254) 50%)"
        );
        break;
      case "mix2":
        setSelectedColor(
          "linear-gradient(to right, rgb(64,173,114) 50%, rgb(182,89,254) 50%)"
        );
        break;
      default:
        setSelectedColor("RGB(71,129,255)");
    }
  };

  const [activeButton, setActiveButton] = useState(1);
  const [activeBetAmount, setActiveBetAmount] = useState(1);
  const [customBetAmount, setCustomBetAmount] = useState("");

  const handleCustomBetChange = (event) => {
    const betAmount = parseFloat(event.target.value).toFixed(2);
    setCustomBetAmount(event.target.value);
    if (!isNaN(betAmount) && betAmount > 0) {
      handleBetAmount(betAmount);
      setActiveBetAmount(betAmount);
    }
  };

  const getColorAndSize = (popupresult) => {
    popupresult = Number(popupresult);

    let color = "unknown";
    let size = "";

    if ([1, 3, 7, 9].includes(popupresult)) {
      color = "green";
    } else if ([2, 4, 6, 8].includes(popupresult)) {
      color = "red";
    } else if (popupresult === 0) {
      color = "red and violet";
    } else if (popupresult === 5) {
      color = "green and violet";
    }

    if (popupresult > 5) {
      size = "big";
    } else {
      size = "small";
    }

    return `${color} ${popupresult} ${size}`;
  };

  useEffect(() => {
    setTotalBet(betAmount * multiplier);
  }, [betAmount, multiplier]);

  const firstFiveRows = rows.slice(0, 5);

  // Handle multiplier button clicks
  const handleMultiplierChange = (multiplier) => {
    if (multiplier.isRandom && !isRandomizing) {
      handleRandomSelection();
    } else {
      setSelectedMultiplier(multiplier.value);
    }
  };
  useEffect(() => {
    const fetchBets = async () => {
      try {
        const token = sessionStorage.getItem('token'); // Assuming the token is stored in sessionStorage
        const response = await axios.get(`${domain}/user/betshistory`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const filteredBets = response.data.filter(
          (bet) => bet.selectedTimer === selectedTimer
        );
  
        setBets(filteredBets);
        // console.log(filteredBets)
  
        const currentPeriodId = String(periodId);
        const previousAlertedPeriodId = String(lastAlertedPeriodId);
  
        if (
          currentPeriodId &&
          currentPeriodId !== "Loading..." &&
          currentPeriodId !== previousAlertedPeriodId
        ) {
          const completedBets = response.data.filter(
            (bet) =>
              String(bet.periodId) === previousAlertedPeriodId &&
              bet.status !== " " &&
              bet.result !== " " &&
              bet.winLoss !== ""
          );
  
          if (completedBets.length > 0) {
            console.log("Adding completed bets to popup queue...");
            setPopupQueue(completedBets);
            setCurrentBetIndex(0);
            setLastAlertedPeriodId(currentPeriodId);
            console.log("Popup queue updated:", completedBets);
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
  
    if (periodId && periodId !== "Loading...") {
      fetchBets();
      const intervalId = setInterval(fetchBets, 1000);
  
      return () => clearInterval(intervalId);
    }
  }, [periodId, lastAlertedPeriodId, domain]);

  useEffect(() => {
    if (popupQueue.length > 0 && currentBetIndex < popupQueue.length) {
      console.log("popupQueue:", popupQueue);
      console.log("currentBetIndex:", currentBetIndex);

      const currentBet = popupQueue[currentBetIndex];

      if (!currentBet) {
        console.error("currentBet is undefined or null.");
        return;
      }

      console.log("Current Bet Object:", currentBet);

      const announceBetResult = async () => {
        console.log(`Announcing bet status: ${currentBet.status}`);

        setGameResult(currentBet.status);
        setWinLoss(currentBet.winLoss);
        setPopupPeriodId(currentBet.periodId);
        setPopupResult(currentBet.result);
        setPopupTimer(currentBet.selectedTimer);
        setDialogContent(
          currentBet.status === "Succeed" ? "Bonus" : "You lost the bet"
        );

        setOpen(true);
        // console.log("currentBet:", currentBet)
      };

      announceBetResult();

      const timer = setTimeout(() => {
        setOpen(false);
        setTimeout(() => {
          setCurrentBetIndex((prevIndex) => prevIndex + 1);
        }, 1000);
      }, 2500);

      return () => clearTimeout(timer);
    } else {
      console.log(
        "No popup to show, either popupQueue is empty or currentBetIndex exceeds queue length."
      );
    }
  }, [popupQueue, currentBetIndex]);

  const seconds1 = remainingTime ? remainingTime.split(":")[1] : "00";

  // Determine the length of the seconds string
  const length = seconds1.length;

  // Split the seconds into two halves
  const firstHalf = seconds1.slice(0, Math.ceil(length / 2));
  const secondHalf = seconds1.slice(Math.ceil(length / 2));

  const renderImage = (num) => (
    <div
      key={num}
      style={{
        width: "18%",
        aspectRatio: "1",
        overflow: "hidden",
        borderRadius: "10px",
        boxShadow:
          animatedIndex === num ? "0 0 15px 5px rgba(255,255,255,0.7)" : "none",
        transition: "all 0.3s ease-in-out",
        transform: animatedIndex === num ? "scale(1.25)" : "scale(1)",
      }}
    >
      <img
        src={`../../games/assets/games/${num}.png`}
        alt={num.toString()}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.3s ease-in-out",
        }}
        onClick={() => {
          if (!isRandomizing) {
            handleOpenDrawer(num.toString());
            handleEventSelection(
              num === 0
                ? "mix1"
                : num === 5
                ? "mix2"
                : num % 2 === 1
                ? "green"
                : "red"
            );
          }
        }}
      />
    </div>
  );

  return (
    <div>
      <Mobile>
        {/* <h1>Hey</h1> */}
        <div style={{ backgroundColor: "#f2f2f1" }}>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 5000,
              background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
              padding: "8px 16px",
              color: "white",
            }}
          >
            <Grid item xs={3} textAlign="left">
              <IconButton style={{ color: "white" }} onClick={navigateToPage}>
                <ArrowBackIosNewIcon />
              </IconButton>
            </Grid>
            <Grid item xs={6} textAlign="center">
              <img
                src="/assets/genzwinlogo.png"
                alt="logo"
                style={{ width: "140px", height: "50px" }}
              />
            </Grid>
            <Grid item xs={3} textAlign="right">
              <IconButton style={{ color: "white" }}>
                <SupportAgentIcon />
              </IconButton>

              <IconButton
                style={{ color: "white" }}
                onClick={() => setIsSoundOn(!isSoundOn)}
              >
                {isSoundOn ? <MusicNoteIcon /> : <MusicOffIcon />}
              </IconButton>
            </Grid>
          </Grid>

          <Grid
            container
            direction="column"
            sx={{
              height: "300px",
              background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
              borderRadius: "0 0 70px 70px",
              textAlign: "center",
            }}
          >
            <Grid
              sx={{
                backgroundImage: `url("../../games/assets/walletbg.png")`,
                backgroundSize: "cover",
                backgroundColor: "#ffffff",
                backgroundPosition: "center",
                margin: "0 20px 20px 20px",
                borderRadius: "30px",
                padding: "10px",
                marginTop: "10px",
              }}
            >
              <Grid
                sm={12}
                item
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "black",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {user ? user.walletAmount.toFixed(2) : " Loading"}
                </Typography>
                <IconButton sx={{ color: "black" }}>
                  <Refresh onClick={handleRefresh} />
                </IconButton>
              </Grid>

              <Grid
                sm={12}
                item
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "black",
                }}
              >
                <AccountBalanceWallet
                  sx={{ marginRight: "10px", color: "#4782ff" }}
                />
                <Typography variant="subtitle2">Wallet Balance</Typography>
              </Grid>
              <Grid
                sm={12}
                mt={3}
                item
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="filled"
                  onClick={navigateToPage2}
                  fullWidth
                  sx={{
                    marginLeft: "10px",
                    color: "white",
                    backgroundColor: "#D23838",
                    "&:hover": {
                      backgroundColor: "#D23838",
                    },
                    borderColor: "#D23838",
                    borderRadius: "50px",
                  }}
                >
                  Withdraw
                </Button>
                <Button
                  variant="contained"
                  onClick={navigateToPage1}
                  fullWidth
                  sx={{
                    marginLeft: "10px",
                    backgroundColor: "#17B15E",
                    "&:hover": {
                      backgroundColor: "#17B15E",
                    },
                    borderRadius: "50px",
                  }}
                >
                  Deposit
                </Button>
              </Grid>
            </Grid>

            <Grid
              item
              sx={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                width: "90%",
                padding: "0 5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                overflow: "hidden",
                margin: "0 20px 20px 20px",
              }}
            >
              <IconButton>
                <VolumeUpIcon sx={{ color: "#4782ff" }} />
              </IconButton>

              <Box sx={{ flex: 1, overflow: "hidden", padding: "0 10px" }}>
                <CSSTransition
                  in={inProp}
                  timeout={500}
                  classNames="message"
                  unmountOnExit
                >
                  <Typography
                    sx={{
                      color: "#8c90a6",
                      fontSize: "12.8px",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      textAlign: "left",
                      overflow: "hidden",
                      WebkitLineClamp: 2, // Limits the text to 2 lines
                      lineClamp: 2, // Fallback for non-WebKit browsers
                      textOverflow: "ellipsis", // Adds "..." at the end of overflowed text
                    }}
                  >
                    {textArray[index]}
                  </Typography>
                </CSSTransition>
              </Box>

              <Button
                variant="contained"
                sx={{
                  background:
                    "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                  },
                  borderRadius: "50px",
                  fontSize: "11px",
                  textTransform: "initial",
                  padding: "4px 12px", // Adjust padding for a more balanced look
                  color: "#ffffff",
                }}
              >
                Details
              </Button>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={1}
            sx={{
              marginLeft: "auto",
              marginRight: "auto",
              maxWidth: "93%",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              marginTop: "-65px",
              backgroundColor: "#ffffff",
              borderRadius: "13px",
              color: "white",
            }}
          >
            {images.map((image) => (
              <Grid
                item
                xs={3}
                key={image.id}
                onClick={() => handleTimerChange(image.id, image.subtitle)}
                style={{
                  cursor: "pointer",
                  background:
                    activeId === image.id
                      ? "linear-gradient(to bottom, #4782ff, #4782ff)"
                      : "transparent",
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={activeId === image.id ? image.altSrc : image.src}
                  alt={image.subtitle}
                  style={{ width: "60%" }}
                />
                <div
                  style={{
                    textAlign: "center",
                    color: activeId === image.id ? "#ffffff" : "black",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    style={{
                      fontSize: "0.75rem",
                      lineHeight: "1",
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    Win Go
                  </Typography>
                  <Typography
                    variant="caption"
                    style={{
                      fontSize: "0.75rem",
                      lineHeight: "1.5",
                      marginBottom: "2px",
                    }}
                  >
                    {image.subtitle}
                  </Typography>
                </div>
              </Grid>
            ))}
          </Grid>

          <Grid
            container
            spacing={0}
            mt={2}
            sx={{
              marginLeft: "auto",
              marginRight: "auto",
              maxWidth: "95%",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              // backgroundImage: 'url("/assets/greenCard.png")',
              background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
              borderRadius: "0.7rem",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Grid
              item
              xs={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                pl: "4%",
              }}
            >
              <Grid item mt={2} sx={{ justifyContent: "flex-start" }}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    color: "white",
                    borderColor: "white",
                    padding: "0.8px 22px",
                    textTransform: "initial",
                    borderRadius: "20px",
                  }}
                  startIcon={<NoteIcon />}
                  onClick={handleOpenPopup}
                >
                  How to play
                </Button>
                <Play isOpen={isPopupOpen} onClose={handleClosePopup} />
              </Grid>
              <Grid item>
                <Typography
                  variant="caption"
                  sx={{ color: "white" }}
                >{`Win Go ${selectedTimer}`}</Typography>
              </Grid>
              <Grid
                item
                sx={{
                  display: "flex",
                  marginBottom: "10px",
                  justifyContent: "center",
                }}
              >
                {firstFiveRows.map((row, index) => (
                  <img
                    key={index}
                    src={`../../games/assets/games/${row.numberOutcome.trim()}.png`}
                    className="auja"
                    alt={`Image ${index + 1}`}
                    style={{
                      width: "13%",
                      marginRight:
                        index !== firstFiveRows.length - 1 ? "10px" : "0",
                    }}
                  />
                ))}
              </Grid>
            </Grid>
            <Grid
              item
              xs={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-end",
                pr: "4%",
              }}
            >
              <Grid item>
                <Typography variant="caption" sx={{ color: "white" }}>
                  Time Remaining
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "16px",
                      height: "22px",
                      marginTop: "12px",
                      backgroundColor: "#f2f2f1",
                      color: "#000000",
                      textAlign: "center",
                      fontWeight: "bold",
                      lineHeight: "25px",
                      margin: "2px 2px",
                    }}
                  >
                    {minutes[0]}
                  </Box>
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "16px",
                      height: "22px",
                      marginTop: "8px",
                      backgroundColor: "#f2f2f1",
                      color: "#000000",
                      fontWeight: "bold",
                      textAlign: "center",
                      lineHeight: "25px",
                      margin: "0 2px",
                    }}
                  >
                    {minutes[1]}
                  </Box>
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "16px",
                      height: "22px",
                      backgroundColor: "#f2f2f1",
                      color: "#000000",
                      marginTop: "8px",
                      fontWeight: "bold",
                      textAlign: "center",
                      lineHeight: "20px",
                      margin: "0 2px",
                    }}
                  >
                    :
                  </Box>
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "16px",
                      height: "22px",
                      backgroundColor: "#f2f2f1",
                      color: "#000000",
                      marginTop: "10px",
                      fontWeight: "bold",
                      textAlign: "center",
                      lineHeight: "25px",
                      margin: "0 2px",
                    }}
                  >
                    {seconds[0]}
                  </Box>
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "16px",
                      height: "22px",
                      backgroundColor: "#f2f2f1",
                      color: "#000000",
                      fontWeight: "bold",
                      marginTop: "8px",
                      textAlign: "center",
                      lineHeight: "25px",
                      margin: "2px 2px",
                    }}
                  >
                    {seconds[1]}
                  </Box>
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant="h6"
                  sx={{ color: "white", fontSize: "18px" }}
                >
                  {periodId ? periodId : ""}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            container
            mt={2}
            spacing={2}
            sx={{
              // boxShadow: "0px 4px 8px #f2f2f1",
              marginLeft: "auto",
              marginRight: "auto",
              maxWidth: "95%",
              borderRadius: "15px",
              backgroundColor: "#ffffff",
              position: "relative",
              pointerEvents: openDialog ? "none" : "auto",
            }}
          >
            <div
              className="overlay"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: "20px",
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                zIndex: 100,
                display: openDialog ? "inline-block" : "none",
                cursor: "not-allowed",
              }}
            ></div>
            <div
              style={{
                width: "300px",
                height: "200px",
                display: openDialog ? "flex" : "none",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                color: "#4782ff",
                fontWeight: "bold",
                textAlign: "center",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 900,
              }}
            >
              <div style={{ display: "flex", gap: "10px" }}>
                <p
                  style={{
                    textAlign: "center",
                    paddingLeft: "20px",
                    borderRadius: "20px",
                    fontSize: "130px",
                    paddingRight: "20px",
                    backgroundColor: "#ffffff",
                  }}
                >
                  {firstHalf}
                </p>
                <p
                  style={{
                    textAlign: "center",
                    paddingLeft: "20px",
                    borderRadius: "20px",
                    fontSize: "130px",
                    paddingRight: "20px",
                    backgroundColor: "#ffffff",
                  }}
                >
                  {secondHalf}
                </p>
              </div>
            </div>
            {/* First Row */}
            <Grid item xs={12} container justifyContent="space-evenly">
              <Button
                onClick={() => {
                  handleOpenDrawer("green");
                  handleEventSelection("green");
                }}
                variant="contained"
                sx={{
                  backgroundColor: "RGB(64,173,114)",
                  "&:hover": {
                    backgroundColor: "RGB(64,173,114)",
                  },
                  width: "100px",
                  borderRadius: "0 10px 0 10px",
                }}
              >
                Green
              </Button>
              <Button
                onClick={() => {
                  handleOpenDrawer("violet");
                  handleEventSelection("violet");
                }}
                variant="contained"
                sx={{
                  backgroundColor: "#9B48DB",
                  "&:hover": {
                    backgroundColor: "#9B48DB",
                  },
                  width: "100px",
                  borderRadius: "10px",
                  color: "white",
                }}
              >
                Violet
              </Button>
              <Button
                onClick={() => {
                  handleOpenDrawer("red");
                  handleEventSelection("red");
                }}
                variant="contained"
                sx={{
                  backgroundColor: "RGB(253,86,92)",
                  "&:hover": {
                    backgroundColor: "RGB(253,86,92)",
                  },
                  width: "100px",
                  borderRadius: "10px 0 10px 0",
                }}
              >
                Red
              </Button>
            </Grid>
            {/* Second Row */}
            <Grid
              container
              mt={2}
              sx={{
                backgroundColor: "#f2f2f1",
                marginLeft: "auto",
                marginRight: "auto",
                maxWidth: "95%",
                borderRadius: "20px",
                padding: "20px",
              }}
            >
              <Grid
                item
                xs={12}
                mb={2}
                container
                justifyContent="space-between"
              >
                {[0, 1, 2, 3, 4].map(renderImage)}
              </Grid>
              <Grid item xs={12} container justifyContent="space-between">
                {[5, 6, 7, 8, 9].map(renderImage)}
              </Grid>
            </Grid>
            {/* Third Row */}
            <Box
              sx={{
                width: "80%",
                marginX: "auto",
                display: "flex",
                justifyContent: "center",
                p: 2,
              }}
            >
              <StyledButtonGroup aria-label="multiplier selection">
                {multipliers.map((multiplier) => (
                  <StyledButton
                    key={multiplier.label}
                    onClick={() => handleMultiplierChange(multiplier)}
                    active={
                      !multiplier.isRandom &&
                      selectedMultiplier === multiplier.value
                        ? 1
                        : 0
                    }
                    isRandom={multiplier.isRandom}
                    disabled={isRandomizing}
                  >
                    {multiplier.label}
                  </StyledButton>
                ))}
              </StyledButtonGroup>
            </Box>
            {/* Fourth Row */}
            <Grid
              container
              item
              xs={12}
              justifyContent="center"
              sx={{ marginBottom: "10px" }}
            >
              <Grid item>
                <Button
                  onClick={() => {
                    handleOpenDrawer("big");
                    handleEventSelection("big");
                  }}
                  variant="contained"
                  sx={{
                    width: "150px",
                    borderRadius: "20px 0 0 20px",
                    margin: "0",
                    backgroundColor: "rgb(255,168,46)",
                    "&:hover": {
                      backgroundColor: "rgb(255,168,46)",
                    },
                  }}
                >
                  Big
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={() => {
                    handleOpenDrawer("small");
                    handleEventSelection("small");
                  }}
                  variant="contained"
                  sx={{
                    width: "150px",
                    borderRadius: "0 20px 20px 0",
                    margin: "0",
                  }}
                >
                  Small
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={1000}
            onClose={handleCloseSnackbar}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <MuiAlert
              onClose={handleCloseSnackbar}
              severity="success"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "white" }}
            >
              Bet placed successfully!
            </MuiAlert>
          </Snackbar>

          <Drawer
            anchor="bottom"
            open={drawerOpen}
            onClose={handleCloseDrawer}
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
            <Grid
              container
              alignItems="center"
              style={{
                position: "relative",
                color: "black",
                backgroundColor: "#ffffff",
              }}
            >
              <Grid
                item
                xs={12}
                align="center"
                style={{
                  position: "relative",
                  marginBottom: "-5px",
                  height: "90px",
                  color: "white",
                  backgroundColor: "#ffffff",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "70%",
                    background: selectedColor,
                    clipPath: "polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)",
                  }}
                ></div>
                <div style={{ position: "relative" }}>
                  <Typography variant="h6">{`Win Go ${selectedTimer}`}</Typography>
                  <Typography variant="body1">{`${selectedItem} is selected`}</Typography>
                </div>
              </Grid>
              <Grid padding={1}>
              <Grid item xs={12}>
  <Grid container justifyContent="space-between" alignItems="center">
    <Typography
      variant="h6"
      sx={{
        color: "#666",
        fontSize: "1rem",
        marginTop: "5px",
      }}
    >
      Balance
    </Typography>
    <Box sx={{ display: 'flex', gap: '5px' }}>
      <Button
        
        sx={{
          minWidth: "40px",
          height: "25px",
          padding: "2px 4px",
          fontSize: "0.75rem",
          backgroundColor: activeBetAmount === 1 ? selectedColor : "#f2f2f1",
          color: activeBetAmount === 1 ? "white" : "#666",
          "&:hover": {
            backgroundColor: activeBetAmount === 1 ? selectedColor : "#f2f2f1",
          },
        }}
        onClick={() => {
          handleBetAmount(1);
          setActiveBetAmount(1);
        }}
      >
        {"1"}
      </Button>
      <Button
        
        sx={{
          minWidth: "40px",
          height: "25px",
          padding: "2px 4px",
          fontSize: "0.75rem",
          backgroundColor: activeBetAmount === 10 ? selectedColor : "#f2f2f1",
          color: activeBetAmount === 10 ? "white" : "#666",
          "&:hover": {
            backgroundColor: activeBetAmount === 10 ? selectedColor : "#f2f2f1",
          },
        }}
        onClick={() => {
          handleBetAmount(10);
          setActiveBetAmount(10);
        }}
      >
        {"10"}
      </Button>
      <Button
      
        sx={{
          minWidth: "40px",
          height: "25px",
          padding: "2px 4px",
          fontSize: "0.75rem",
          backgroundColor: activeBetAmount === 100 ? selectedColor : "#f2f2f1",
          color: activeBetAmount === 100 ? "white" : "#666",
          "&:hover": {
            backgroundColor: activeBetAmount === 100 ? selectedColor : "#f2f2f1",
          },
        }}
        onClick={() => {
          handleBetAmount(100);
          setActiveBetAmount(100);
        }}
      >
        {"100"}
      </Button>
      <Button
      
        sx={{
          minWidth: "40px",
          height: "25px",
          padding: "2px 4px",
          fontSize: "0.75rem",
          backgroundColor: activeBetAmount === 1000 ? selectedColor : "#f2f2f1",
          color: activeBetAmount === 1000 ? "white" : "#666",
          "&:hover": {
            backgroundColor: activeBetAmount === 1000 ? selectedColor : "#f2f2f1",
          },
        }}
        onClick={() => {
          handleBetAmount(1000);
          setActiveBetAmount(1000);
        }}
      >
        {"1000"}
      </Button>
    </Box>
  </Grid>
</Grid>
                <Grid item xs={12} mt={2}>
                  <Grid container>
                    <Grid
                      item
                      container
                      direction="row"
                      justifyContent="space-between"
                      align="center"
                      alignItems="center"
                    >
                      <Typography
                        variant="h6"
                        sx={{ color: "#666", fontSize: "1rem" }}
                      >
                        Add your money
                      </Typography>
                      <Grid justifyContent="flex-end">
                        <TextField
                          label="Add custom amount"
                          variant="outlined"
                          value={customBetAmount}
                          onChange={handleCustomBetChange}
                          style={{
                            height: 40, // Reduced from 50
                            backgroundColor: "#f2f2f1",
                            color: "#666",
                            fontSize: "14px", // Added font size
                          }}
                          InputProps={{
                            style: {
                              color: "#666",
                              height: 40, // Reduced from 50
                              fontSize: "14px", // Added font size
                              padding: "4px 10px", // Added padding
                            },
                          }}
                          InputLabelProps={{
                            style: {
                              color: "#666",
                              fontSize: "12px", // Added smaller font size for label
                            },
                          }}
                          size="small" // Added size prop for more compact look
                        />
                      </Grid>
                      <Grid item xs={12} mt={2}>
                        <Grid
                          container
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{}}
                        >
                          <Typography
                            variant="h6"
                            sx={{ color: "#666", fontSize: "1rem" }}
                          >
                            Quantity
                          </Typography>
                          <Grid
                            item
                            container
                            xs={6}
                            justifyContent="flex-end"
                            alignItems="center"
                            spacing={1}
                          >
                            <Grid item>
                              <IconButton
                                onClick={() =>
                                  setMultiplier(
                                    multiplier > 1 ? multiplier - 1 : 1
                                  )
                                }
                                sx={{
                                  color: "white",
                                  "&:hover": {},
                                  padding: "4px",
                                }}
                              >
                                <RemoveIcon
                                  fontSize="small"
                                  sx={{ color: selectedColor, fontSize: 30 }}
                                />
                              </IconButton>
                            </Grid>
                            <Grid item>
                              <Typography
                                variant="body1"
                                sx={{
                                  border: `1px solid ${selectedColor}`,
                                  borderRadius: "4px",
                                  padding: "4px 12px",
                                  backgroundColor: "white",
                                  color: "#666",
                                  minWidth: "40px",
                                  textAlign: "center",
                                }}
                              >
                                {multiplier}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <IconButton
                                onClick={() => setMultiplier(multiplier + 1)}
                                sx={{
                                  color: "white",
                                  "&:hover": {},
                                  padding: "4px",
                                }}
                              >
                                <AddIcon
                                  fontSize="small"
                                  sx={{ color: selectedColor, fontSize: 30 }}
                                />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} mt={2}>
                  <Grid
                    container
                    justifyContent="flex-end"
                    sx={{ color: "#666" }}
                  >
                    <div
                      className={`button ${activeButton === 1 ? "active" : ""}`}
                      onClick={() => {
                        handleMultiplier(1);
                        setActiveButton(1);
                      }}
                      style={
                        activeButton === 1
                          ? { backgroundColor: selectedColor, color: "white" }
                          : { backgroundColor: "#f2f2f1", color: "#666" }
                      }
                    >
                      X1
                    </div>
                    <div
                      className={`button ${activeButton === 5 ? "active" : ""}`}
                      onClick={() => {
                        handleMultiplier(5);
                        setActiveButton(5);
                      }}
                      style={
                        activeButton === 5
                          ? { backgroundColor: selectedColor, color: "white" }
                          : { backgroundColor: "#f2f2f1", color: "#666" }
                      }
                    >
                      X5
                    </div>
                    <div
                      className={`button ${
                        activeButton === 10 ? "active" : ""
                      }`}
                      onClick={() => {
                        handleMultiplier(10);
                        setActiveButton(10);
                      }}
                      style={
                        activeButton === 10
                          ? { backgroundColor: selectedColor, color: "white" }
                          : { backgroundColor: "#f2f2f1", color: "#666" }
                      }
                    >
                      X10
                    </div>
                    <div
                      className={`button ${
                        activeButton === 20 ? "active" : ""
                      }`}
                      onClick={() => {
                        handleMultiplier(20);
                        setActiveButton(20);
                      }}
                      style={
                        activeButton === 20
                          ? { backgroundColor: selectedColor, color: "white" }
                          : { backgroundColor: "#f2f2f1", color: "#666" }
                      }
                    >
                      X20
                    </div>
                    <div
                      className={`button ${
                        activeButton === 50 ? "active" : ""
                      }`}
                      onClick={() => {
                        handleMultiplier(50);
                        setActiveButton(50);
                      }}
                      style={
                        activeButton === 50
                          ? { backgroundColor: selectedColor, color: "white" }
                          : { backgroundColor: "#f2f2f1", color: "#666" }
                      }
                    >
                      X50
                    </div>
                    <div
                      className={`button ${
                        activeButton === 100 ? "active" : ""
                      }`}
                      onClick={() => {
                        handleMultiplier(100);
                        setActiveButton(100);
                      }}
                      style={
                        activeButton === 100
                          ? { backgroundColor: selectedColor, color: "white" }
                          : { backgroundColor: "#f2f2f1", color: "#666" }
                      }
                    >
                      X100
                    </div>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} mt={2}>
                <Grid container justifyContent="space-around" spacing={0}>
                  <Grid item xs={3}>
                    <Button
                      onClick={handleCancelBet}
                      fullWidth
                      style={{ backgroundColor: "#f2f2f1", color: "grey" }}
                      variant="contained"
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item xs={9}>
                    <Button
                      onClick={handlePlaceBet}
                      fullWidth
                      style={{ background: selectedColor }}
                      variant="contained"
                    >{`Total Bet: ${betAmount * multiplier}`}</Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Drawer>

          <Grid
            mt={2}
            container
            justifyContent="center"
            sx={{ marginBottom: "15%" }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: "95%",
                margin: "0 auto",
              }}
            >
              <Grid container spacing={1} sx={{ mb: 1.5 }}>
                {tabData.map((tab, index) => (
                  <Grid item xs={4} key={index}>
                    <Box
                      onClick={() => setActiveTab(index)}
                      sx={{
                        height: "40px", // Adjust this value to change the tab height
                        backgroundColor:
                          activeTab === index ? "#4782ff" : "#ffffff",
                        color: activeTab === index ? "#ffffff" : "grey",
                        borderRadius: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.3s",
                        "&:hover": {
                          backgroundColor:
                            activeTab === index ? "#4782ff" : "#f5f5f5",
                        },
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "12px",
                          textTransform: "none",
                          fontWeight: "bold",
                        }}
                      >
                        {tab.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mt: 2 }}>
                {activeTab === 0 && (
                  <TabPanel>
                    <CustomTable data={rows} />
                  </TabPanel>
                )}
                {activeTab === 1 && (
                  <TabPanel>
                    <RowVisualization data={rows} />
                  </TabPanel>
                )}
                {activeTab === 2 && (
                  <TabPanel>
                    <Grid container sx={{ justifyContent: "center" }}>
                      {bets
                        .slice()
                        .sort((a, b) =>
                          b.timestamp && a.timestamp
                            ? b.timestamp.seconds - a.timestamp.seconds
                            : 0
                        )
                        .map((bet, index) => (
                          <Accordion
                            key={index}
                            sx={{
                              backgroundColor: "#ffffff",
                              width: "100%",
                            }}
                          >
                            <AccordionSummary>
                              <Grid
                                container
                                sx={{
                                  alignItems: "center",
                                  p: 1,
                                  margin: "0px",
                                }}
                              >
                                <Grid item xs={2}>
                                  <Box
                                    border={1}
                                    borderRadius={2}
                                    style={{
                                      background:
                                        bet.selectedItem.toLowerCase() ===
                                          "green" ||
                                        [1, 3, 7, 9].includes(
                                          Number(bet.selectedItem)
                                        )
                                          ? "RGB(64,173,114)"
                                          : bet.selectedItem.toLowerCase() ===
                                              "red" ||
                                            [2, 4, 6, 8].includes(
                                              Number(bet.selectedItem)
                                            )
                                          ? "RGB(253,86,92)"
                                          : bet.selectedItem.toLowerCase() ===
                                            "violet"
                                          ? "RGB(182,89,254)"
                                          : bet.selectedItem.toLowerCase() ===
                                            "big"
                                          ? "#ffa82e" // Background color for "big"
                                          : bet.selectedItem.toLowerCase() ===
                                            "small"
                                          ? "#1876d2" // Background color for "small"
                                          : Number(bet.selectedItem) === 0
                                          ? "linear-gradient(to right, rgb(253,86,92) 50%, rgb(182,89,254) 50%)"
                                          : Number(bet.selectedItem) === 5
                                          ? "linear-gradient(to right, rgb(64,173,114) 50%, rgb(182,89,254) 50%)"
                                          : "rgb(71,129,255)",
                                      color: "white",
                                      height: "40px",
                                      width: "40px",
                                      display: "flex",
                                      border: "none",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Typography sx={{ fontSize: "10px" }}>
                                      {bet.selectedItem.toUpperCase()}
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={7} textAlign="left">
                                  <Typography variant="body2">
                                    {bet.periodId}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{ color: "text.secondary" }}
                                  >
                                    {bet.timestamp
                                      ? new Date(bet.timestamp).toLocaleString(
                                          "en-GB"
                                        )
                                      : "N/A"}
                                  </Typography>
                                </Grid>
                                <Grid item xs={3} sx={{ textAlign: "right" }}>
                                  <Box
                                    sx={{
                                      border: 1,
                                      borderColor:
                                        bet.status === "Failed"
                                          ? "error.main"
                                          : "success.main",
                                      borderRadius: 1,
                                      pt: 0.1,
                                      pb: 0.1,
                                      pl: 1,
                                      pr: 1,
                                      display: "inline-block",
                                      mb: 0.5,
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color:
                                          bet.winLoss > 0 ? "green" : "red",
                                      }}
                                    >
                                      {bet.status}
                                    </Typography>
                                  </Box>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color:
                                        bet.status === "Failed"
                                          ? "error.main"
                                          : "success.main",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {bet.status === "Failed"
                                      ? `-₹${Math.abs(
                                          parseFloat(bet.winLoss).toFixed(2)
                                        )}`
                                      : `+₹${parseFloat(bet.winLoss).toFixed(
                                          2
                                        )}`}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </AccordionSummary>
                            <AccordionDetails sx={{ m: 0, p: 0 }}>
                              <Table size="small" style={{ padding: 2 }}>
                                <TableBody>
                                  {[
                                    {
                                      label: "Order number",
                                      value: bet.orderId,
                                    },
                                    { label: "Period", value: bet.periodId },
                                    {
                                      label: "Purchase amount",
                                      value: `₹${parseFloat(
                                        bet.betAmount
                                      ).toFixed(2)}`,
                                    },
                                    {
                                      label: "Quantity",
                                      value: bet.multiplier,
                                    },
                                    {
                                      label: "Amount after tax",
                                      value: `₹${parseFloat(
                                        bet.totalBet
                                      ).toFixed(2)}`,
                                    },
                                    {
                                      label: "Tax",
                                      value: `₹${parseFloat(bet.tax).toFixed(
                                        2
                                      )}`,
                                    },
                                    { label: "Result", value: bet.result },
                                    {
                                      label: "Select",
                                      value: bet.selectedItem,
                                    },
                                    { label: "Status", value: bet.status },
                                    {
                                      label: "Win/lose",
                                      value:
                                        bet.winLoss > 0
                                          ? `+₹${parseFloat(
                                              bet.winLoss
                                            ).toFixed(2)}`
                                          : `₹${parseFloat(bet.winLoss).toFixed(
                                              2
                                            )}`,
                                    },
                                    {
                                      label: "Order time",
                                      value: new Date(
                                        bet.timestamp
                                      ).toLocaleString("en-GB"),
                                    },
                                  ].map((row, index) => (
                                    <TableRow
                                      key={index}
                                      sx={{
                                        py: 2,
                                        px: 1,
                                        border: "0.4rem solid #ffffff",
                                        backgroundColor: "#f6f6f6",
                                      }}
                                    >
                                      <TableCell component="th" scope="row">
                                        {row.label}
                                      </TableCell>
                                      <TableCell align="right">
                                        {row.label === "Amount after tax" ? (
                                          <Typography sx={{ color: "red" }}>
                                            {row.value}
                                          </Typography>
                                        ) : row.label === "Result" ? (
                                          <Typography
                                            sx={{
                                              color: "black",
                                              fontSize:
                                                Number(row.value) >= 0 &&
                                                Number(row.value) <= 4
                                                  ? "16px"
                                                  : "16px",
                                            }}
                                          >
                                            {row.value}{" "}
                                            {Number(row.value) >= 0 &&
                                            Number(row.value) <= 4 ? (
                                              <span
                                                style={{ color: "#6ea8f4" }}
                                              >
                                                Small
                                              </span>
                                            ) : (
                                              <span
                                                style={{ color: "#feaa57" }}
                                              >
                                                Big
                                              </span>
                                            )}{" "}
                                            {Number(row.value) === 0 ? (
                                              <span style={{ color: "green" }}>
                                                Green
                                              </span>
                                            ) : [1, 3, 7, 9].includes(
                                                Number(row.value)
                                              ) ? (
                                              <span style={{ color: "green" }}>
                                                Green
                                              </span>
                                            ) : [2, 4, 6, 8].includes(
                                                Number(row.value)
                                              ) ? (
                                              <span style={{ color: "red" }}>
                                                Red
                                              </span>
                                            ) : Number(row.value) === 5 ? (
                                              <span style={{ color: "red" }}>
                                                Red
                                              </span>
                                            ) : (
                                              <span style={{ color: "black" }}>
                                                Unknown
                                              </span>
                                            )}
                                          </Typography>
                                        ) : row.label === "Win/lose" ? (
                                          <Typography
                                            sx={{
                                              color:
                                                Number(
                                                  row.value.replace(
                                                    /[^0-9.-]+/g,
                                                    ""
                                                  )
                                                ) >= 0
                                                  ? "green"
                                                  : "red",
                                            }}
                                          >
                                            {row.value}
                                          </Typography>
                                        ) : (
                                          row.value
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </AccordionDetails>
                          </Accordion>
                        ))}
                    </Grid>
                  </TabPanel>
                )}
              </Box>
            </Box>
          </Grid>

          <>
            {/* ...rest of the code... */}


            <div
              style={{
                display: open ? "block" : "none", 
                position: "absolute",
                zIndex: 2000,
                left: 10,
                top: "120px",
                width: "100%",
                height: "100%",
                overflow: "auto",
                border: "none",
              }}
            >
              <div
                style={{
                  backgroundColor: "transparent",
                  margin: "15% auto",
                  padding: 20,
                  width: "75%",
                  height: "55%",
                  backgroundImage: `url(${
                    gameResult === "Succeed"
                      ? "../../assets/images/missningBg-6f17b242.png"
                      : "../../assets/images/missningLBg-73e02111.png"
                  })`,
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h4"
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    marginTop: "7rem",
                  }}
                >
                  {gameResult === "Succeed" ? "Congratulations" : "Sorry"}
                </Typography>
                <Typography
                  variant="h6"
                  style={{ color: "white", marginBottom: "1rem" }}
                >
                  Lottery results {popupresult}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  mb={5}
                  mt={5}
                >
                  {dialogContent}
                  <br />
                  <span
                    style={{
                      color: gameResult === "Succeed" ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    ₹{parseFloat(winloss).toFixed(2)}
                  </span>

                  <br />
                  <span style={{ fontSize: "0.85rem", fontWeight: "bold" }}>
                    Period: Win {popupTimer}
                  </span>
                  <br />
                  <span style={{ fontSize: "1rem", fontWeight: "bold" }}>
                    {popupperiodid}
                  </span>
                </Typography>
                <Button onClick={() => setOpen(false)}>Close</Button>
              </div>
            </div>
          </>
        </div>
        <br />
        <br />
        <br />
      </Mobile>
    </div>
  );
};

export default Head;
