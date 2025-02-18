import React, { useState , useEffect} from "react";
import { AppBar, Tabs, Tab, Grid, Box ,} from "@mui/material";
import {
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { domain } from "../Components/config";
import axios from "axios";
import { styled } from "@mui/material/styles";

const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

const App = () => {


  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [firstDepositMade, setFirstDepositMade] = useState(true);
  const [needToDepositFirst, setNeedToDepositFirst] = useState(false);
  const [phoneUserUid, setPhoneUserUid] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameType, setGameType] = useState("");
  const [isDepositCheckLoading, setIsDepositCheckLoading] = useState(true);
  const [hasDeposit, setHasDeposit] = useState(false);
  
 

  const StyledDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper": {
      width: "70%",
      maxWidth: "330px",
      borderRadius: "15px",
      overflow: "hidden",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
    },
  }));

  const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    backgroundColor: "#4c8eff",
    color: "white",
    padding: theme.spacing(1.5),
  }));

  const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
    padding: theme.spacing(2.5),
  }));

  const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
    padding: theme.spacing(2, 3),
    backgroundColor: "#f5f5f5",
  }));

  const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: "10px",
    padding: theme.spacing(1, 2),
    textTransform: "none",
    // fontWeight: "bold",
  }));
const RechargeDialog = ({ open, onClose, onConfirm, selectedGame }) => {
  return (
    <StyledDialog open={open} onClose={onClose}>
      <StyledDialogTitle>
        <Typography variant="h6" component="div" fontWeight="bold">
          Recharge Required
        </Typography>
      </StyledDialogTitle>
      <StyledDialogContent>
        <Typography sx={{ marginTop: "0.5rem" }} variant="body1" gutterBottom>
          To enter{" "}
          <Box component="span" fontWeight="bold">
            {selectedGame?.game}
          </Box>
          , you need to make a deposit first.
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={2}>
          Recharging your account will allow you to enjoy all the exciting
          features of our games!
        </Typography>
      </StyledDialogContent>
      <StyledDialogActions>
        <StyledButton onClick={onClose} color="inherit">
          Cancel
        </StyledButton>
        <StyledButton
          onClick={onConfirm}
          variant="contained"
          style={{ backgroundColor: "#4c8eff", color: "white" }}
        >
          Recharge Now
        </StyledButton>
      </StyledDialogActions>
    </StyledDialog>
  );
};




useEffect(() => {
  const checkDepositStatus = async () => {
    setIsDepositCheckLoading(true);
    try {
      const token = sessionStorage.getItem('token'); // Assuming the token is stored in localStorage
      const userResponse = await axios.get(`${domain}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const depositResponse = await axios.get(`${domain}/need-to-deposit-first`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const hasFirstDeposit = userResponse?.data?.user?.firstDepositMade;
      const needsDeposit = depositResponse?.data?.data?.needToDepositFirst;

      setFirstDepositMade(hasFirstDeposit);
      setNeedToDepositFirst(needsDeposit);
      setHasDeposit(!needsDeposit || hasFirstDeposit);
    } catch (error) {
      console.error("Error checking deposit status:", error);
      // Default to requiring deposit on error
      setHasDeposit(false);
    } finally {
      setIsDepositCheckLoading(false);
    }
  };

  checkDepositStatus();
}, []);
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const flashGames = [
        { imageSrc: "/assets/games/jili/JL_260x380_GameID464_en-US.png", gameId: "464" },
        { imageSrc: "/assets/games/jili/JL_260x380_GameID404_en-US.png", gameId: "404" },
        { imageSrc: "/assets/games/jili/JL_260x380_GameID259_en-US.png", gameId: "259" },
        { imageSrc: "/assets/games/jili/JL_260x380_GameID427_en-US.png", gameId: "427" },
        { imageSrc: "/assets/games/jili/JL_260x380_GameID441_en-US.png", gameId: "441" },
        { imageSrc: "/assets/games/jili/JL_260x380_GameID439_en-US.png", gameId: "439" },
        { imageSrc: "/assets/games/jili/JL_260x380_GameID439_en-US.png", gameId: "439" },
        { imageSrc: "/assets/games/jili/JL_260x380_GameID439_en-US.png", gameId: "439" },
        { imageSrc: "/assets/games/jili/JL_260x380_GameID372_en-US.png", gameId: "372" },
        { imageSrc: "/assets/games/jili/JL_260x380_GameID440_en-US.png", gameId: "440" },
        { imageSrc: "/assets/games/jili/JL_260x380_GameID302_en-US.png", gameId: "302" },
        { imageSrc: "/assets/games/jili/JL_260x380_GameID400_en-US.png", gameId: "400" },
        { imageSrc: "/assets/games/jili/JL_260x380_GameID407_en-US.png", gameId: "407" },
        { imageSrc: "/assets/games/jili/JL_260x380_GameID399_en-US.png", gameId: "399" },
        { imageSrc: "/assets/games/jili/JL_260x380_GameID301_en-US.png", gameId: "301" },
        { imageSrc: "/assets/games/jili/JL_260x380_GameID258_en-US.png", gameId: "258" },
        { imageSrc: "/assets/games/jili/JL_260x380_GameID420_en-US.png", gameId: "420" },
        { imageSrc: "/assets/games/jili/JL_260x380_GameID074_en-US.png", gameId: "074" },
        { imageSrc: "/assets/games/jili/JL_260x380_GameID223_en-US.png", gameId: "223" },
        { imageSrc: "/assets/games/jili/JL_260x380_GameID240_en-US.png", gameId: "240" },
        { imageSrc: "/assets/games/jili/JL_260x380_GameID180_en-US.png", gameId: "180" },
        { imageSrc: "/assets/games/jili/JL_260x380_GameID300_en-US.png", gameId: "300" },
        { imageSrc: "/assets/games/jili/JL_260x380_GameID262_en-US.png", gameId: "262" },
        { imageSrc: "/assets/games/jili/JL_260x380_GameID403_en-US.png", gameId: "403" },
        { imageSrc: "/assets/games/jili/JL_260x380_GameID389_en-US.png", gameId: "389" },
        { imageSrc: "/assets/games/jili/JL_260x380_GameID464_en-US.png", gameId: "464" },
        { imageSrc: "/assets/games/jili/JL_260x380_GameID397_en-US.png", gameId: "397" },
        { imageSrc: "/assets/games/jili/JL_260x380_GameID299_en-US.png", gameId: "299" },
        { imageSrc: "/assets/games/jili/JL_260x380_GameID464_en-US.png", gameId: "464" },
        { imageSrc: "/assets/games/jili/JL_260x380_GameID264_en-US.png", gameId: "264" },
        { imageSrc: "/assets/games/jili/JL_260x380_GameID263_en-US.png", gameId: "263" },
        { imageSrc: "/assets/games/jili/260x380_EN_GAMEID_300.png", gameId: "300" },
        { imageSrc: "/assets/games/jili/260x380_EN_GAMEID_252.png", gameId: "252" },
        { imageSrc: "/assets/games/jili/GAMEID_231_EN_260x380.png", gameId: "231" },
        { imageSrc: "/assets/games/jili/260x380_EN_GAMEID_114.png", gameId: "114" },
        { imageSrc: "/assets/games/jili/260x380_EN_GAMEID_153.png", gameId: "153" },
        { imageSrc: "/assets/games/jili/260x380_EN_GAMEID_253.png", gameId: "253" },
        { imageSrc: "/assets/games/jili/260x380_EN_GAMEID_259.png", gameId: "259" },
        { imageSrc: "/assets/games/jili/260x380_EN_GAMEID_301.png", gameId: "301" },
        { imageSrc: "/assets/games/jili/260x380_EN_GAMEID_220.png", gameId: "220" },
        { imageSrc: "/assets/games/jili/260x380_EN_GAMEID_226.png", gameId: "226" },
        { imageSrc: "/assets/games/jili/GAMEID_132_EN_260x380.png", gameId: "132" },
        { imageSrc: "/assets/games/jili/260x380_EN_GAMEID_298.png", gameId: "298" },
        { imageSrc: "/assets/games/jili/260x380_EN_GAMEID_209.png", gameId: "209" },
        { imageSrc: "/assets/games/jili/260x380_EN_GAMEID_238.png", gameId: "238" },
        { imageSrc: "/assets/games/jili/260x380_EN_GAMEID_208.png", gameId: "208" },
        { imageSrc: "/assets/games/jili/260x380_EN_GAMEID_254.png", gameId: "254" },
        { imageSrc: "/assets/games/jili/260x380_EN_GAMEID_211.png", gameId: "211" },
  ];

  const slotGames= [
    { imageSrc: "/assets/jdb/JDB_0_14095.png", gameId: "JDB_0_14095" },
    { imageSrc: "/assets/jdb/JDB_0_14093.png", gameId: "JDB_0_14093" },
    { imageSrc: "/assets/jdb/JDB_0_14094.png", gameId: "JDB_0_14094" },
    { imageSrc: "/assets/jdb/JDB_0_14092.png", gameId: "JDB_0_14092" },
    { imageSrc: "/assets/jdb/JDB_0_14088.png", gameId: "JDB_0_14088" },
    { imageSrc: "/assets/jdb/JDB_0_14091.png", gameId: "JDB_0_14091" },
    { imageSrc: "/assets/jdb/JDB_7_7008.png", gameId: "JDB_7_7008" },
    { imageSrc: "/assets/jdb/JDB_9_9019.png", gameId: "JDB_9_9019" },
    { imageSrc: "/assets/jdb/JDB_0_14090.png", gameId: "JDB_0_14090" },
    { imageSrc: "/assets/jdb/JDB_9_9018.png", gameId: "JDB_9_9018" },
    { imageSrc: "/assets/jdb/JDB_7_7009.png", gameId: "JDB_7_7009" },
    { imageSrc: "/assets/jdb/JDB_0_14089.png", gameId: "JDB_0_14089" },
    { imageSrc: "/assets/jdb/JDB_0_14087.png", gameId: "JDB_0_14087" },
    { imageSrc: "/assets/jdb/JDB_0_14086.png", gameId: "JDB_0_14086" },
    { imageSrc: "/assets/jdb/JDB_7_7007.png", gameId: "JDB_7_7007" },
    { imageSrc: "/assets/jdb/JDB_7_7006.png", gameId: "JDB_7_7006" },
    { imageSrc: "/assets/jdb/JDB_7_7005.png", gameId: "JDB_7_7005" },
    { imageSrc: "/assets/jdb/JDB_7_7004.png", gameId: "JDB_7_7004" },
    { imageSrc: "/assets/jdb/JDB_7_7003.png", gameId: "JDB_7_7003" },
    { imageSrc: "/assets/jdb/JDB_7_7002.png", gameId: "JDB_7_7002" },
    { imageSrc: "/assets/jdb/JDB_7_7001.png", gameId: "JDB_7_7001" },
    { imageSrc: "/assets/jdb/JDB_9_9012.png", gameId: "JDB_9_9012" },
    { imageSrc: "/assets/jdb/JDB_0_14085.png", gameId: "JDB_0_14085" },
    { imageSrc: "/assets/jdb/JDB_9_9011.png", gameId: "JDB_9_9011" },
    { imageSrc: "/assets/jdb/JDB_9_9010.png", gameId: "JDB_9_9010" },
    { imageSrc: "/assets/jdb/JDB_9_9009.png", gameId: "JDB_9_9009" },
    { imageSrc: "/assets/jdb/JDB_9_9008.png", gameId: "JDB_9_9008" },
    { imageSrc: "/assets/jdb/JDB_9_9007.png", gameId: "JDB_9_9007" },
    { imageSrc: "/assets/jdb/JDB_9_9006.png", gameId: "JDB_9_9006" },
    { imageSrc: "/assets/jdb/JDB_9_9004.png", gameId: "JDB_9_9004" },
    { imageSrc: "/assets/jdb/JDB_9_9003.png", gameId: "JDB_9_9003" },
    { imageSrc: "/assets/jdb/JDB_9_9002.png", gameId: "JDB_9_9002" },
    { imageSrc: "/assets/jdb/JDB_9_9001.png", gameId: "JDB_9_9001" },
    { imageSrc: "/assets/jdb/JDB_0_14084.png", gameId: "JDB_0_14084" },
    { imageSrc: "/assets/jdb/JDB_0_14083.png", gameId: "JDB_0_14083" },
    { imageSrc: "/assets/jdb/JDB_0_14082.png", gameId: "JDB_0_14082" },
    { imageSrc: "/assets/jdb/JDB_0_14080.png", gameId: "JDB_0_14080" },
    { imageSrc: "/assets/jdb/JDB_0_14081.png", gameId: "JDB_0_14081" },
    { imageSrc: "/assets/jdb/JDB_0_14079.png", gameId: "JDB_0_14079" },
    { imageSrc: "/assets/jdb/JDB_0_14077.png", gameId: "JDB_0_14077" },
    { imageSrc: "/assets/jdb/JDB_0_14075.png", gameId: "JDB_0_14075" },
    { imageSrc: "/assets/jdb/JDB_0_14070.png", gameId: "JDB_0_14070" },
    { imageSrc: "/assets/jdb/JDB_0_14068.png", gameId: "JDB_0_14068" },
    { imageSrc: "/assets/jdb/JDB_0_14067.png", gameId: "JDB_0_14067" },
    { imageSrc: "/assets/jdb/JDB_0_14065.png", gameId: "JDB_0_14065" },
    { imageSrc: "/assets/jdb/JDB_0_14064.png", gameId: "JDB_0_14064" },
    { imageSrc: "/assets/jdb/JDB_0_14063.png", gameId: "JDB_0_14063" },
    { imageSrc: "/assets/jdb/JDB_0_14061.png", gameId: "JDB_0_14061" },
    { imageSrc: "/assets/jdb/JDB_0_14060.png", gameId: "JDB_0_14060" },
    { imageSrc: "/assets/jdb/JDB_0_14059.png", gameId: "JDB_0_14059" },
    { imageSrc: "/assets/jdb/JDB_0_14058.png", gameId: "JDB_0_14058" },
    { imageSrc: "/assets/jdb/JDB_0_14055.png", gameId: "JDB_0_14055" },
    { imageSrc: "/assets/jdb/JDB_0_14054.png", gameId: "JDB_0_14054" },
    { imageSrc: "/assets/jdb/JDB_0_14053.png", gameId: "JDB_0_14053" },
    { imageSrc: "/assets/jdb/JDB_0_14052.png", gameId: "JDB_0_14052" },
    { imageSrc: "/assets/jdb/JDB_0_14051.png", gameId: "JDB_0_14051" },
    { imageSrc: "/assets/jdb/JDB_0_14050.png", gameId: "JDB_0_14050" },
    { imageSrc: "/assets/jdb/JDB_0_14048.png", gameId: "JDB_0_14048" },
    { imageSrc: "/assets/jdb/JDB_0_14047.png", gameId: "JDB_0_14047" },
    { imageSrc: "/assets/jdb/JDB_0_14046.png", gameId: "JDB_0_14046" },
    { imageSrc: "/assets/jdb/JDB_0_14045.png", gameId: "JDB_0_14045" },
    { imageSrc: "/assets/jdb/JDB_0_14044.png", gameId: "JDB_0_14044" },
    { imageSrc: "/assets/jdb/JDB_0_14043.png", gameId: "JDB_0_14043" },
    { imageSrc: "/assets/jdb/JDB_0_14042.png", gameId: "JDB_0_14042" },
    { imageSrc: "/assets/jdb/JDB_0_14041.png", gameId: "JDB_0_14041" },
    { imageSrc: "/assets/jdb/JDB_0_14040.png", gameId: "JDB_0_14040" },
    { imageSrc: "/assets/jdb/JDB_0_14039.png", gameId: "JDB_0_14039" },
    { imageSrc: "/assets/jdb/JDB_0_14038.png", gameId: "JDB_0_14038" },
    { imageSrc: "/assets/jdb/JDB_0_14036.png", gameId: "JDB_0_14036" },
    { imageSrc: "/assets/jdb/JDB_0_14035.png", gameId: "JDB_0_14035" },
    { imageSrc: "/assets/jdb/JDB_0_14034.png", gameId: "JDB_0_14034" },
    { imageSrc: "/assets/jdb/JDB_0_14033.png", gameId: "JDB_0_14033" },
    { imageSrc: "/assets/jdb/JDB_0_14030.png", gameId: "JDB_0_14030" },
    { imageSrc: "/assets/jdb/JDB_0_14029.png", gameId: "JDB_0_14029" },
    { imageSrc: "/assets/jdb/JDB_0_14027.png", gameId: "JDB_0_14027" },
    { imageSrc: "/assets/jdb/JDB_0_14025.png", gameId: "JDB_0_14025" },
    { imageSrc: "/assets/jdb/JDB_0_14022.png", gameId: "JDB_0_14022" },
    { imageSrc: "/assets/jdb/JDB_0_14021.png", gameId: "JDB_0_14021" },
    { imageSrc: "/assets/jdb/JDB_0_14018.png", gameId: "JDB_0_14018" },
    { imageSrc: "/assets/jdb/JDB_0_14016.png", gameId: "JDB_0_14016" },
    { imageSrc: "/assets/jdb/JDB_0_14012.png", gameId: "JDB_0_14012" },
    { imageSrc: "/assets/jdb/JDB_0_14010.png", gameId: "JDB_0_14010" },
    { imageSrc: "/assets/jdb/JDB_0_14008.png", gameId: "JDB_0_14008" },
    { imageSrc: "/assets/jdb/JDB_0_14007.png", gameId: "JDB_0_14007" },
    { imageSrc: "/assets/jdb/JDB_0_14006.png", gameId: "JDB_0_14006" },
    { imageSrc: "/assets/jdb/JDB_0_14005.png", gameId: "JDB_0_14005" },
    { imageSrc: "/assets/jdb/JDB_0_14003.png", gameId: "JDB_0_14003" },
    { imageSrc: "/assets/jdb/JDB_0_15012.png", gameId: "JDB_0_15012" },
    { imageSrc: "/assets/jdb/JDB_0_15010.png", gameId: "JDB_0_15010" },
    { imageSrc: "/assets/jdb/JDB_0_15005.png", gameId: "JDB_0_15005" },
    { imageSrc: "/assets/jdb/JDB_0_15002.png", gameId: "JDB_0_15002" },
    { imageSrc: "/assets/jdb/JDB_0_15001.png", gameId: "JDB_0_15001" },
    { imageSrc: "/assets/jdb/JDB_0_8051.png", gameId: "JDB_0_8051" },
    { imageSrc: "/assets/jdb/JDB_0_8050.png", gameId: "JDB_0_8050" },
    { imageSrc: "/assets/jdb/JDB_0_8049.png", gameId: "JDB_0_8049" },
    { imageSrc: "/assets/jdb/JDB_0_8048.png", gameId: "JDB_0_8048" },
    { imageSrc: "/assets/jdb/JDB_0_8047.png", gameId: "JDB_0_8047" },
    { imageSrc: "/assets/jdb/JDB_0_8046.png", gameId: "JDB_0_8046" },
    { imageSrc: "/assets/jdb/JDB_0_8044.png", gameId: "JDB_0_8044" },
    { imageSrc: "/assets/jdb/JDB_0_8035.png", gameId: "JDB_0_8035" },
    { imageSrc: "/assets/jdb/JDB_0_8028.png", gameId: "JDB_0_8028" },
    { imageSrc: "/assets/jdb/JDB_0_8023.png", gameId: "JDB_0_8023" },
    { imageSrc: "/assets/jdb/JDB_0_8022.png", gameId: "JDB_0_8022" },
    { imageSrc: "/assets/jdb/JDB_0_8021.png", gameId: "JDB_0_8021" },
    { imageSrc: "/assets/jdb/JDB_0_8020.png", gameId: "JDB_0_8020" },
    { imageSrc: "/assets/jdb/JDB_0_8019.png", gameId: "JDB_0_8019" },
    { imageSrc: "/assets/jdb/JDB_0_8018.png", gameId: "JDB_0_8018" },
    { imageSrc: "/assets/jdb/JDB_0_8017.png", gameId: "JDB_0_8017" },
    { imageSrc: "/assets/jdb/JDB_0_8014.png", gameId: "JDB_0_8014" },
    { imageSrc: "/assets/jdb/JDB_0_8007.png", gameId: "JDB_0_8007" },
    { imageSrc: "/assets/jdb/JDB_0_8005.png", gameId: "JDB_0_8005" },
    { imageSrc: "/assets/jdb/JDB_0_8004.png", gameId: "JDB_0_8004" },
    { imageSrc: "/assets/jdb/JDB_0_8003.png", gameId: "JDB_0_8003" },
    { imageSrc: "/assets/jdb/JDB_0_8002.png", gameId: "JDB_0_8002" },
    { imageSrc: "/assets/jdb/JDB_0_8001.png", gameId: "JDB_0_8001" },
  ];

  const popularGames = [
    { imageSrc: "/assets/games/800.jpg", gameId: 800 },
    { imageSrc: "/assets/games/801.jpg", gameId: 801 },
    { imageSrc: "/assets/games/802.jpg", gameId: 802 },
    { imageSrc: "/assets/games/902.jpg", gameId: 902 },
    { imageSrc: "/assets/games/904.jpg", gameId: 904 },
    { imageSrc: "/assets/games/905.jpg", gameId: 905 },
    { imageSrc: "/assets/games/111.jpg", gameId: 111 },
    { imageSrc: "/assets/games/100.jpg", gameId: 100 },
    { imageSrc: "/assets/games/103.jpg", gameId: 103 },
    { imageSrc: "/assets/games/810.jpg", gameId: 810 },
    { imageSrc: "/assets/games/115.jpg", gameId: 115 },
    { imageSrc: "/assets/games/101.jpg", gameId: 101 },
    { imageSrc: "/assets/games/104.jpg", gameId: 104 },
    { imageSrc: "/assets/games/108.jpg", gameId: 108 },
    { imageSrc: "/assets/games/900.jpg", gameId: 900 },
    { imageSrc: "/assets/games/105.jpg", gameId: 105 },
    { imageSrc: "/assets/games/102.jpg", gameId: 102 },
    { imageSrc: "/assets/games/109.jpg", gameId: 109 },
    { imageSrc: "/assets/games/114.jpg", gameId: 114 },
    { imageSrc: "/assets/games/112.jpg", gameId: 112 },
    { imageSrc: "/assets/games/113.jpg", gameId: 113 },
  ];

  
  const topbet = async (app_id) => {
    console.log(app_id);
    setIsLoading(true);
    try {
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
        const response = await axios.post(`${domain}/topbetgaming-login/`, 
        { app_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { code, url } = response.data;
        console.log(url);
        console.log(response.data);
  
        if (code === 0) {
            window.location.href = url;
        }
    } finally {
        setIsLoading(false);
    }
  };

  const jdbcall = async (app_id) => {
    setIsLoading(true);
    try {
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
        const response = await axios.post(`${domain}/game/launch/jdb/`, 
        { "gameCode": app_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { status, data } = response.data;
       
        console.log(response.data);
  
        if (status === "SC_OK") {
            window.location.href = data.gameUrl;
        }
    } finally {
        setIsLoading(false);
    }
  };

  const jili = async (gameId) => {
    setIsLoading(true); // Assuming you want to set loading state when the function is triggered
    try {
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
        const response = await axios.post(`${domain}/jilireal-test-login/`, 
        { GameId: gameId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { ErrorCode, Data } = response.data.responseData;
        console.log(response.data.responseData);
  
        if (ErrorCode === 0) {
            window.location.href = Data;
        }
    } finally {
        setIsLoading(false);
    }
  };

  const handleConfirmRecharge = () => {
    // Navigate to recharge page or trigger recharge process
    window.location.href = "/recharge"; // Adjust this path as needed
  };
// Update handleBoxClick with strict deposit check
const handleBoxClick = (gameId, type) => {
  console.log(`Clicked gameId: ${gameId}`);
  
  if (isDepositCheckLoading) {
    return; // Prevent clicks while checking deposit status
  }

  if (!hasDeposit) {
    setSelectedGame({ game: gameId });
    setGameType(type);
    setOpenDialog(true);
    return;
  }
    // Only proceed if deposit requirements are met
    switch(type) {
      case "jili":
        jili(gameId);
        break;
      case "topbet": 
        topbet(gameId);
        break;
      case "JDB":
        jdbcall(gameId);
        break;
      default:
        console.error("Unknown game type:", type);
    }
  };

const renderGames = (games, type) => {
  return games.map((game, index) => (
    <Grid
      item
      xs={4} // 3 boxes in a row (12/4 = 3)
      sm={4}
      md={4}
      key={index}
      sx={{
        opacity: isDepositCheckLoading ? 0.5 : 1,
        pointerEvents: isDepositCheckLoading ? 'none' : 'auto'
      }}
    >
     <Box
          onClick={() => handleBoxClick(game.gameId, type)}
          sx={{
            width: "100%",
            aspectRatio: "1", // Ensures the box is square
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid #ddd",
            borderRadius: "8px",
            overflow: "hidden",
            backgroundColor: "#fff",
            cursor: "pointer",
            transition: "transform 0.2s ease-in-out",
            "&:hover": {
              transform: "scale(1.05)", // Add hover effect
            },
          }}
        >
          <img
            src={game.imageSrc}
            alt={`Game ${index + 1}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>
      </Grid>
    ));
  };

return (
  <Box sx={{ flexGrow: 1 }}>
  <AppBar position="static" color="default">
    <Tabs
      value={tabValue}
      onChange={handleTabChange}
      variant="scrollable"
      scrollButtons="auto"
      aria-label="tabs example"
    >
      <Tab label="Jili Games" />
      <Tab label="JDB Games" />
      <Tab label="TopBet Gaming" />
    </Tabs>
  </AppBar>
  <TabPanel value={tabValue} index={0}>
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      {renderGames(flashGames, "jili")}
    </Grid>
  </TabPanel>
  <TabPanel value={tabValue} index={1}>
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      {renderGames(slotGames, "JDB")}
    </Grid>
  </TabPanel>
  <TabPanel value={tabValue} index={2}>
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      {renderGames(popularGames, "topbet")}
    </Grid>
  </TabPanel>
  <RechargeDialog
    open={openDialog}
    onClose={handleCloseDialog}
    onConfirm={handleConfirmRecharge}
    selectedGame={selectedGame}
  />
</Box>
);

};

export default App;
