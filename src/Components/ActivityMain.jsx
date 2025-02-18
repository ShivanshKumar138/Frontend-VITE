import React, { useEffect } from "react";
import Mobile from "./Mobile";
import IconButton from "@mui/material/IconButton";
import SmsIcon from "@mui/icons-material/Sms";
import DownloadIcon from "@mui/icons-material/Download";
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Grid,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const cardData = [
  {
    image: "../assets/banners/a2.png",
    text: "First Deposit Bonus",
    url: "/activity/FirstRecharge",
  },
  // {
  //   image: "../assets/luckySpinBannerImage.png",
  //   text: "Lucky Spin Bonus",
  //   url: "/activity/lucky-spin",
  // },
  {
    image: "../assets/banners/a1.png",
    text: "Real-Time Rebate",
    url: "/activity/ActivityDetail",
  },
  {
    image: "../assets/banners/a5.png",
    text: "Youtube Creative Video Event",
    url: "/activity/YouTubeCreative",
  },

];

const rewards = [
  {
    image: "../assets/invitationBonus.png",
    label: "Invitation Bonus",
    link: "/invitation-bonus",
  },
  {
    image: "../assets/BettingRebate-17d35455.png",
    label: "Betting Rebate",
    link: "/rebate",
  },
  {
    image: "../assets/superJackpot-ecb648b4.png",
    label: "Super Jackpot",
    link: "/superjackpot",
  },
];

const ActivityMain = ({ children }) => {
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", setVh);
    setVh();

    return () => window.removeEventListener("resize", setVh);
  }, []);
  const navigate = useNavigate();
  const navigateToPage2 = () => {
    navigate("/coupen-user"); // Replace '/path-to-page' with the actual path
  };
  const navigateToPage3 = () => {
    navigate("/attendance"); // Replace '/path-to-page' with the actual path
  };

  const navigateToPage4 = () => {
    navigate("/activity/YouTubeCreative"); // Replace '/path-to-page' with the actual path
  };
  const handleDownload = () => {
    // Programmatically click the hidden anchor tag
    const link = document.createElement("a");
    link.href = `https://111club.online/abclottery.apk`; // Change this to the actual path of the APK file on your server
    link.download = "abclottery.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          height="calc(var(--vh, 1vh) * 100)"
          position="relative"
        >
          <Box flexGrow={1} sx={{ backgroundColor: "#380003" }}>
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                backgroundColor: "#720811 ",
                padding: "8px 16px",
                color: "white",
                mb: 2,
              }}
            >
              <Grid item xs={12} textAlign="center">
                <img
                  src="/assets/genzwinlogo.png"
                  alt="logo"
                  style={{ width: "140px", height: "50px" }}
                />
              </Grid>
              <Grid
                item
                xs={6}
                textAlign="left"
                sx={{ fontSize: "18px", mt: 2 }}
              >
                <span style={{ fontWeight: "bold" }}>Activity</span>
              </Grid>
              <Grid item xs={12} textAlign="Left" sx={{ mt: 1 }}>
                <Typography sx={{ fontSize: "12px" }}>
                  Please remember to follow the event page
                  <br />
                  We will launch user feedback activities from time to time
                </Typography>
              </Grid>
            </Grid>

            {/* //content */}

            <Grid
              container
              spacing={{ xs: 4, sm: 2 }}
              justifyContent="center"
              alignItems="flex-start" // Ensures alignment at the start of the container
              sx={{ marginTop: 2, overflow: "hidden", gap:6 }}
            >
              {rewards.map((reward, index) => (
                <Grid item key={index}>
                  <Button
                    onClick={() => navigate(reward.link)}
                    sx={{ textAlign: "center", padding: 0, minWidth: 0 }}
                  >
                    <Box textAlign="center">
                      <img
                        src={reward.image}
                        alt={reward.label}
                        style={{ width: "40px", height: "40px" }}
                      />
                      <Typography
                        sx={{
                          color: "#e4911d",
                          textTransform: "initial",
                          fontSize: "11px",
                        }}
                      >
                        {reward.label.split(" ").map((word, i) => (
                          <span key={i}>
                            {word}
                            <br />
                          </span>
                        ))}
                      </Typography>
                    </Box>
                  </Button>
                </Grid>
              ))}
            </Grid>
            <Grid
              mt={0.5}
              container
              spacing={1}
              sx={{ marginLeft: "0px", marginRight: "auto", width: "98%" }}
            >


              <Grid item xs={6}>
                <Card onClick={navigateToPage2}>
                  <CardMedia
                    component="img"
                    height="110"
                    image="../assets/images/signInBanner-33f86d3f.png"
                    alt="Image 1"
                  />
                  <CardContent
                    sx={{
                      backgroundColor: "#ffffff",
                      textAlign: "left",
                      height: "50px",
                    }}
                  >
                    <Typography
                      component="div"
                      sx={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: "13px",
                      }}
                    >
                      Gifts
                    </Typography>
                    <Typography
                      variant="h1"
                      color="text.secondary"
                      sx={{ color: "#80849c", fontSize: "12px" }}
                    >
                      Enter the redemption code to receive gift rewards
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card onClick={navigateToPage3}>
                  <CardMedia
                    component="img"
                    height="110"
                    image="../../assets/images/giftRedeem-45917887.png"
                    alt="Image 2"
                  />
                  <CardContent
                    sx={{
                      backgroundColor: "#ffffff",
                      textAlign: "left",
                      height: "50px",
                    }}
                  >
                    <Typography
                      component="div"
                      sx={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: "13px",
                      }}
                    >
                      Attendance bonus
                    </Typography>
                    <Typography
                      variant="h1"
                      color="text.secondary"
                      sx={{ color: "#80849c", fontSize: "12px" }}
                    >
                      The more consecutive days you sign in, the higher the
                      reward will
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>




            </Grid>

            {/* Banner */}

            <Grid
              mt={1}
              container
              spacing={1}
              sx={{
                marginLeft: "1px",
                marginRight: "auto",
                width: "98%",
                marginBottom: "150px",
              }}
            >
              {cardData.map((card, index) => (
                <Grid item xs={12} key={index}>
                  <Card
                    sx={{ borderRadius: "10px", mt: 1, cursor: "pointer" }}
                    onClick={() => navigate(card.url)} // Add onClick event here
                  >
                    <CardMedia
                      component="img"
                      height="auto"
                      image={card.image}
                      alt={`Image ${index + 1}`}
                    />
                    <CardContent
                      sx={{
                        backgroundColor: "#ffffff",
                        height: "10px",
                        textAlign: "left",
                      }}
                    >
                      <Typography
                        variant="body2"
                        component="div"
                        sx={{ color: "black", fontWeight: "bold" }}
                      >
                        {card.text}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* content end */}
          </Box>

          {children}
        </Box>
      </Mobile>
    </div>
  );
};

export default ActivityMain;
