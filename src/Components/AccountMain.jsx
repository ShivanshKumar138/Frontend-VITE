import React, { useEffect, useState } from "react";
import Mobile from "../Components/Mobile";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import Divider from "@mui/material/Divider";
import { useAuth } from "../contexts/AuthContext";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { MenuList, MenuItem, ListItemText } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import axios from "axios";
import { domain } from "./config";

const ImageSubtitleGrid = ({ imageSrc, subtitle1, subtitle2, onClick }) => (
  <Grid
    container
    onClick={onClick}
    sx={{
      backgroundColor: "#720811",
      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
      width: "100%",
      height: "80%",
      borderRadius: "5px",
      marginLeft: "6px",
      padding: 1,
      alignItems: "center",
      mb: 0,
      overflow: "hidden",
      cursor: "pointer",
    }}
  >
    <Grid
      item
      xs={2}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <img
        src={imageSrc}
        alt="icon"
        style={{ width: "35px", height: "35px", objectFit: "contain" }}
      />
    </Grid>
    <Grid
      item
      xs={10}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        textAlign: "left",
        paddingLeft: 1,
      }}
    >
      <Typography
        sx={{
          color: "#e4911d",
          fontSize: "0.95rem",
          mb: 0.5, // Space between title and subtitle
        }}
      >
        {subtitle1}
      </Typography>
      <Typography
        sx={{
          color: "white",
          fontSize: "0.75rem", // Adjusted for better readability
        }}
      >
        {subtitle2}
      </Typography>
    </Grid>
  </Grid>
);
const images = [
  { url: "/assets/settingicon.png", caption: "Settings" },
  { url: "/assets/fileicon.png", caption: "Feedback" },
  { url: "/assets/micicon.png", caption: "Notifications" },
  {
    url: "/assets/customerservice.png",
    caption: "24/7 Customer service",
  },
  { url: "/assets/bookicon.png", caption: "Beginers's Guide" },
  { url: "/assets/allicon.png", caption: "About Us" },
];

const AccountMain = ({ children }) => {
  const profilePhotoUrl = "assets/images/15-80f41fc6.png";
  const heading = "Profile Name";
  const lastLogin = "Last Login: 2024-02-24";
  const captionText =
    "Daily intrest rate 0.1% + VIP extra incocme safe, calculated every 1 minute ";
  const [userData, setUserData] = React.useState(null);
  const [lastAchievement, setLastAchievement] = useState(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(subtitle);
  };

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", setVh);
    setVh();

    return () => window.removeEventListener("resize", setVh);
  }, []);

  const [user, setUser] = useState(null);
  console.log(user);

  useEffect(() => {
    const fetchLastAchievement = async () => {
      try {
        const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
        const response = await axios.get(`${domain}/last-achievement`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLastAchievement(response.data.lastAchievement);
      } catch (err) {
        console.error("Error fetching last achievement:", err);
      }
    };

    fetchLastAchievement();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
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

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleRefresh = () => {
    // Handle refresh logic
    fetchUserData();
  };

  const handleButtonClick = (action) => {
    // Handle button click logic
  };

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const admin = sessionStorage.getItem("admin");
    setIsAdmin(admin === "true");
  }, []);

  const options = [
    {
      label: "Notifications",
      icon: "/assets/mess.png",
      subLabel: null,
      onClick: () => navigate("/messages"),
    },
    {
      label: "Gifts",
      icon: "/assets/gifticon.png",
      subLabel: null,
      onClick: () => navigate("/coupen-user"),
    },
    {
      label: "Game Statistics",
      icon: "/assets/staticon.png",
      subLabel: null,
      onClick: () => navigate("/game-statistics"),
    },

    {
      label: "Language",
      icon: "/assets/webicon.png",
      subLabel: "English",
      onClick: () => navigate("/language"),
    },
    
  ].filter(Boolean);

  const { logout } = useAuth();

  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleImageClick = (index) => {
    switch (index) {
      case 0: // Settings
        navigate("/settings");
        break;
      case 1: // Settings
        navigate("/feedback");
        break;
      case 2: // Notifications
        navigate("/messages");
        break;
      case 3: // 24/7 Customer service
        navigate("/customer-service");
        break;
      case 4: // 24/7 Customer service
        navigate("");
        break;
      case 5: // 24/7 Customer service
        navigate("/about-us");
        break;
      default:
        console.log(`Clicked Image ${index + 1}`);
        break;
    }
  };

  const getImageForAchievement = () => {
    if (!lastAchievement) return "../../assets/vip-zero.png";

    switch (lastAchievement) {
      case "Bronze":
        return "../../assets/Vip1.png";
      case "Silver":
        return "../../assets/Vip2.png";
      case "Gold":
        return "../../assets/Vip3.png";
      case "Platinum":
        return "../../assets/Vip4.png";
      case "Diamond":
        return "../../assets/Vip5.png";
      default:
        return "../../assets/vip-zero.png";
    }
  };

  const subtitle = `${user ? user.uid : 0}`;

  return (
    <div>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          height="calc(var(--vh, 1vh) * 100)"
          position="relative"
          sx={{
            backgroundColor: "#f2f2f1", // Base background color
            overflowY: "scroll",
            overflowX: "hidden",
            "&::-webkit-scrollbar": {
              width: "0px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f2f2f1",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#f2f2f1",
            },
          }}
        >
          <Box flexGrow={1}sx={{ backgroundColor: "#380003"}}>
            <Grid
              container
              sx={{
                background:
                  "#380003",
                borderRadius: "0 0 20px 20px",
                padding: "20px",
              }}
            >
              <Grid
                item
                xs={12}
                sx={{
                  height: "20px",
                }}
              ></Grid>
              <Grid
                item
                xs={4}
                align="center"
                onClick={() =>
                  navigate("/avatar-change", { state: { avatar: user.avatar } })
                }
              >
                <img
                  src={user?.avatar}
                  alt="Profile Avatar"
                  style={{
                    width: '75px', // Set explicit dimensions
                    height: '75px',
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                  onError={(e) => {
                    console.error("Image load error:", e); // Debug logging
                    e.target.onerror = null;
                    e.target.src = '/assets/profile-1.png'; // Fallback image
                  }}
                  crossOrigin="anonymous" // Handle CORS
                />
              </Grid>
              <Grid
                item
                xs={8}
                container
                direction="column"
                justifyContent="space-between"
              >
                <Grid item align="left">
                  <Typography
                    variant="caption"
                    align="center"
                    color="white"
                    fontSize={14}
                  >
                    {user ? user.username : "Loading.."}
                  </Typography>{" "}
                  <img
                    src={getImageForAchievement()}
                    alt="Achievement"
                    width="20%"
                    height="80%"
                  />
                </Grid>
                <Grid
                  item
                  container
                  sx={{
                    borderRadius: "25px",
                    padding: "2px 4px",

                    backgroundColor: "rgb(221,144,56)",
                    width: { xs: '55%', sm: '55%', md: '55%' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Grid
                    item
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      flex: 1,
                      minWidth: 0, // Allows text truncation
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: { xs: 10, sm: 11 },
                        color: "white",
                        whiteSpace: 'nowrap',
                      }}
                    >
                      UID
                    </Typography>
                    <Box
                      sx={{
                        height: "10px",
                        borderLeft: "1px solid white",
                        margin: "0 8px",
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: { xs: 10, sm: 11 },
                        color: "white",
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {user ? user.uid : 0}
                    </Typography>
                    <IconButton
                      onClick={handleCopy}
                      sx={{
                        marginLeft: "-20px",
                        p: 0,
                        ml: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.1)',
                        }
                      }}
                    >
                      <FileCopyIcon
                        sx={{
                          color: "white",
                          width: "12px",
                          height: "12px"
                        }}
                      />
                    </IconButton>
                  </Grid>

                </Grid>
                <Grid item align="left">
                  <Typography
                    variant="caption"
                    align="left"
                    color="white"
                  >{`Last Login: ${user
                      ? new Date(user.lastLoginTime).toLocaleString()
                      : "Loading.."
                    }`}</Typography>
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  height: "100px",
                }}
              ></Grid>
            </Grid>

            <div style={{ position: "relative", marginTop: "-20%", zIndex: 1 }}>
              <Grid
                container
                sx={{
                  backgroundColor: "#720811",
                  padding: "20px",
                  borderRadius: "12px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  marginLeft: "auto",
                  marginRight: "auto",
                  maxWidth: "95%", // Decreased width
                }}
              >
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    align="left"
                    sx={{ color: "#e4911d", fontSize: "12px", fontFamily: 'helvetica', fontWeight: 400 }}
                  >
                    Total Balance
                  </Typography>
                </Grid>

                <Grid item xs={12} align="Left">
                  <Typography
                    variant="caption"
                    align="center"
                    sx={{
                      color: "#e4911d",
                      fontWeight: "bold",
                      fontSize: "20px",
                    }}
                  >
                    {`\u20B9${user ? user.walletAmount.toFixed(2) : "Loading"}`}
                    <IconButton onClick={handleRefresh}>
                      <AutorenewIcon
                        style={{ color: "white", width: "20", height: "20" }}
                      />
                    </IconButton>
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ opacity: 0.3 }} />
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={3}>
                      <IconButton onClick={() => navigate("/wallet")}>
                        <img
                          src="assets/images/download.png"
                          alt="Wallet"
                          width="30"
                          height="30"
                        />
                      </IconButton>
                      <Typography
                        variant="subtitle2"
                        align="center"
                        sx={{ color: "white", fontSize: "12px", fontFamily: 'helvetica', fontWeight: 400 }}
                      >
                        Wallet
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <IconButton onClick={() => navigate("/recharge")}>
                        <img
                          src="assets/images/download (1).png"
                          width="30"
                          height="30"
                          alt="Deposit"
                        />
                      </IconButton>
                      <Typography
                        variant="subtitle2"
                        align="center"
                        sx={{ color: "white", fontSize: "12px", fontFamily: 'helvetica', fontWeight: 400 }}
                      >
                        Deposit
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <IconButton onClick={() => navigate("/withdraw")}>
                        <img
                          src="assets/images/download (2).png"
                          width="30"
                          height="30"
                          alt="Withdraw"
                        />
                      </IconButton>
                      <Typography
                        variant="subtitle2"
                        align="center"
                        sx={{ color: "white", fontSize: "12px", fontFamily: 'helvetica', fontWeight: 400 }}
                      >
                        Withdraw
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <IconButton onClick={() => navigate("/vip")}>
                        <img
                          src="assets/images/VipIcon-3c72b1cc.png"
                          width="30"
                          height="30"
                          alt="VIP"
                        />
                      </IconButton>
                      <Typography
                        variant="subtitle2"
                        align="center"
                        sx={{ color: "white", fontSize: "12px", fontFamily: 'helvetica', fontWeight: 400 }}
                      >
                        VIP
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>

            <Box sx={{ p: 0.8, borderRadius: 1 }}>
              <Grid
                container
                spacing={1}
                mt={1}
                sx={{
                  width: "99%",
                  height: "12rem",


                }}
              >
                <Grid item xs={6}>
                  <ImageSubtitleGrid
                    
                    imageSrc="/assets/images/download (3).png"
                    subtitle1="Game History"
                    subtitle2="My game history"
                    onClick={() => navigate("/bet-history")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <ImageSubtitleGrid
                    imageSrc="/assets/images/download (4).png"
                    subtitle1="Transaction"
                    subtitle2="My transaction history"
                    onClick={() => navigate("/transaction")}
                  />
                </Grid>
                <Grid item xs={6} sx={{ mt: -1,  }}>
                  <ImageSubtitleGrid
                    imageSrc="/assets/images/download (28).png"
                    subtitle1="Deposit"
                    subtitle2="My deposit history"
                    onClick={() => navigate("/deposit-history")}
                  />
                </Grid>
                <Grid item xs={6} sx={{ mt: -1 }}>
                  <ImageSubtitleGrid
                    imageSrc="/assets/images/download (5).png"
                    subtitle1="Withdraw"
                    subtitle2="My withdraw history"
                    onClick={() => navigate("/withdraw-history")}
                  />
                </Grid>
              </Grid>
            </Box>

            <MenuList
              sx={{
                backgroundColor: "#720811",
                borderRadius: "8px",
                marginLeft: "auto",
                marginRight: "auto",
                width: "94%",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              {options.map((option, index) =>
                [
                  <MenuItem
                    key={index}
                    sx={{ display: "flex", alignItems: "center" }}
                    onClick={option.onClick}
                  >
                    <img
                      src={option.icon}
                      alt={option.label}
                      style={{ width: "24px", marginRight: "8px" }}
                    />
                    <ListItemText
                      primary={option.label}
                      sx={{ textAlign: "left", color: "white", fontSize: "15px", fontFamily: 'helvetica', fontWeight: 400 }}
                    />
                    {option.subLabel && (
                      <ListItemText
                        secondary={option.subLabel}
                        secondaryTypographyProps={{ style: { color: "white" } }}
                      />
                    )}
                    <ArrowForwardIcon style={{ color: "white" }} />
                  </MenuItem>,
                  index < options.length - 1 && (
                    <Divider key={`divider-${index}`} />
                  ),
                ].filter(Boolean)
              )}
            </MenuList>

            <Grid
              container
              spacing={2}
              mt={2}
              sx={{
                backgroundColor: "#720811",
                borderRadius: "8px",
                padding: "10px",
                marginLeft: "auto",
                marginRight: "auto",
                width: "93%",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              {images.map((image, index) => (
                <Grid
                  item
                  xs={4}
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    onClick={() => handleImageClick(index)}
                    style={{
                      cursor: "pointer",
                      width: "100%",
                      marginBottom: "10px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={image.url}
                      alt={` ${index + 1}`}
                      style={{ width: "30%", borderRadius: "8px" }}
                    />
                    <Typography
                      variant="caption"
                      align="center"
                      sx={{ marginTop: "8px", color: "white", fontSize: "12px", fontFamily: 'helvetica', fontWeight: 400 }}
                    >
                      {image.caption}
                    </Typography>
                  </div>
                </Grid>
              ))}
            </Grid>

            <IconButton
              onClick={handleLogout}
              sx={{
                width: "80%",
                border: "1px solid #e4911d",
                borderRadius: "50px",
                marginTop: "8%",
                marginBottom: "25%",
              }}
            >
              <Grid container alignItems="center">
                <Grid item>
                  <ExitToAppIcon style={{ color: "#e4911d" }} />
                </Grid>
                <Grid item xs={10}>
                  <Typography
                    variant="body1"
                    sx={{ marginLeft: "8px", color: "#e4911d" }}
                  >
                    Log Out
                  </Typography>
                </Grid>
              </Grid>
            </IconButton>

            {/* content end */}
          </Box>

          {children}
        </Box>
      </Mobile>
    </div>
  );
};

export default AccountMain;
