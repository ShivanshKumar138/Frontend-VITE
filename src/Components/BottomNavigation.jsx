import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccountIcon from "@mui/icons-material/AccountCircle";
import RedeemIcon from "@mui/icons-material/Redeem";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import DiamondIcon from "@mui/icons-material/Diamond";
import { Box } from "@mui/material";

const BottomNavigationArea = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState(location.pathname);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    setValue(location.pathname);
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(newValue);
  };

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      showLabels
      style={{
        position: "fixed",
        bottom: 0,
        padding: "6px 0",
        backgroundImage: "url(/assets/images/tabBarBg-01df93c.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "transparent",
        width: "100%",
        maxWidth: isSmallScreen ? "" : "396px",
        paddingTop: "1%",
        // Adjust height based on screen size
      }}
    >
      <BottomNavigationAction
        style={{ color: value === "/home" ? "#4782ff" : "#80849c" }}
        label="Home"
        value="/home"
        icon={
          <img
            src={
              value === "/home"
                ? "/assets/home1.png"
                : "/assets/images/home-3e6a9291.png"
            }
            width="25px"
            height="25px"
            style={{
              color: value === "/home" ? "#4782ff" : "#80849c", // hide image when src is empty
            }}
            alt="icon"
          />
        }
      />
      <BottomNavigationAction
        style={{ color: value === "/activity" ? "#4782ff" : "#80849c" }}
        label="Activity"
        value="/activity"
        icon={
          <img
            src={
              value === "/activity"
                ? "/assets/activity1.png"
                : "/assets/images/activity-bb37b07c.png"
            }
            width="25px"
            height="25px"
            style={{
              color: value === "/activity" ? "#4782ff" : "#80849c", // hide image when src is empty
            }}
            alt="icon"
          />
        }
      />

      <BottomNavigationAction
         label="Promotion"
         value="/promotion"
         icon={
           <Box
             sx={{
               width: "70px", // Slightly larger container
               height: "70px",
               backgroundColor: "white", // White background
               borderRadius: "60%", // Circular shape
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
               border: "2px solid #ccc", // Light border
               boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Soft shadow
             }}
           >
             <img
               src="/assets/diamond-blue.png"
               width="72px"
               height="72px"
               alt="icon"
               style={{ objectFit: "contain" }}
             />
           </Box>
         }
         style={{
           color: "#80849c",
           marginTop: "-40px",
         }}
      />
      <BottomNavigationAction
        style={{ color: value === "/wallet" ? "#4782ff" : "#80849c" }}
        label="Wallet"
        value="/wallet"
        icon={
          <img
            src={
              value === "/wallet"
                ? "/assets/wallet1.png"
                : "/assets/images/wallet-dd37d20a.png"
            }
            width="25px"
            height="25px"
            style={{
              color: value === "/wallet" ? "#4782ff" : "#80849c", // hide image when src is empty
            }}
            alt="icon"
          />
        }
      />
      <BottomNavigationAction
        style={{ color: value === "/account" ? "#4782ff" : "#80849c" }}
        label="Account"
        value="/account"
        icon={
          <img
            src={
              value === "/account"
                ? "/assets/account1.png"
                : "/assets/images/main-53f64122.png"
            }
            width="25px"
            height="25px"
            style={{
              color: value === "/account" ? "#4782ff" : "#80849c", // hide image when src is empty
            }}
            alt="icon"
          />
        }
      />
    </BottomNavigation>
  );
};

export default BottomNavigationArea;
