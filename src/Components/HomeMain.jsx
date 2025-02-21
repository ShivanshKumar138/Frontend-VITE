import React, { useEffect, useState } from "react";
import Mobile from "./Mobile";
import IconButton from "@mui/material/IconButton";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import SmsIcon from "@mui/icons-material/Sms";
import DownloadIcon from "@mui/icons-material/Download";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { CSSTransition } from "react-transition-group";
import { makeStyles } from "@mui/styles";
import { Badge } from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
// import messageIcon from "../../public/assets/message.svg";
import messageIcon from "../../public/headerIcon/newMessageIcon.png";
// import downloadIcon from "../../public/headerIcon/download.svg";

import {
  Paper,
  Typography,
  Button,
  Grid,
  Box,
  List,
  Chip,
  Tabs,
  ListItem,
  Container,
  LinearProgress,
  Avatar,
  styled,
} from "@mui/material";
import { Whatshot } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
// import { ReactComponent as CustomerIcon } from '../assets/svgexport-3.svg';
import CustomerIcon from "../assets/svgexport-3.svg"; // ✅ No `{ ReactComponent as ... }`

import Games from "./Games";

import SvgIcon from "@mui/material/SvgIcon";

import LoadingLogo from "./LoadingLogo";
// import DepositModal from "../Pages/depositModal"; // Adjust the path as needed
import NotificationModal from "../Components/NotificationPopup";
import Winscroll from "./Winscroll";
import Stage from "./Stage";
// import DepositModal from '../Pages/depositModal';
import DepositModal from "../Pages/depositModal";
import { MessageCircleIcon } from "lucide-react";
import { width } from "@mui/system";
const Tab = styled(Container)(({ theme }) => ({
  textAlign: "center",
  borderRadius: "10px",
  padding: theme.spacing(1),
  overflow: "hidden",
}));

const MySvgIcon = () => (
  <img
    src="https://goagameb.com/assets/svg/redhomeN-ae7073a2.svg"
    alt="icon"
    style={{ width: "12px", height: "12px", marginRight: "-5px" }}
  />
);

const Loteria = [
  {
    id: 1,
    imgSrc: "/assets/wingo.png",
    game: "Win Go",
    path: "/timer/1min",
  },
  {
    id: 2,
    imgSrc: "/assets/k3.png",
    game: "k3",
    path: "/k3/1min",
  },
  {
    id: 3,
    imgSrc: "../../games/assets/TRX.png",
    game: "5d",
    path: "/5d/1min",
  },
];

const profitList = [
  {
    name: "Mem***EFJ",
    rank: "NO1",
    rankImg: "/assets/no1-5c6f8e80.png",
    price: "₹4,105,048.82",
    avatar: "/assets/avatar-ea3b8ee9.png",
  },
  {
    name: "Mem***DEC",
    rank: "NO2",
    rankImg: "/assets/no2-1683c744.png",
    price: "₹721,223.44",
    avatar: "/assets/avatar-ea3b8ee9.png",
  },
  {
    name: "Mem***HVK",
    rank: "NO3",
    rankImg: "/assets/no3-95e1b4d0.png",
    price: "₹533,333.20",
    avatar: "/assets/avatar-ea3b8ee9.png",
  },
  {
    name: "Mem***XTT",
    rank: "NO4",
    price: "₹454,093.24",
    avatar: "/assets/avatar-ea3b8ee9.png",
  },
  {
    name: "Mem***EME", //this will be done by me so we can skip the detail of it and i will do its
    rank: "NO5",
    price: "₹4,322,311.72",
    avatar: "/assets/avatar-ea3b8ee9.png",
  },
];

const useStyles = makeStyles({
  tabContainer: {
    transitionTimingFunction: "cubic-bezier(0.5, 0.5, 0.5, 0.99)",
    transitionDuration: "360ms",
    transform: "translate3d(0px, 0px, 0px)",
  },
  activeTab: {
    color: "rgb(22, 119, 255)",
  },
  inactiveTab: {
    display: "none",
  },
  tabItem: {
    display: "flex",
    alignItems: "center",
  },
  activeLine: {
    transition: "300ms",
    width: "0px",
    height: "3px",
    transform: "translate3d(41px, 0px, 0px)",
    backgroundColor: "rgb(22, 119, 255)",
  },
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  transition: "transform 0.5s ease-in-out",
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const win = [
  {
    txt: "Mem***GGD",
    image: "/assets/7-00479cfa.png",
    txt2: "28.09",
    image1: "/assets/g1.png",
  },
  {
    txt: "Mem***DHF",
    image: "/assets/8-ea087ede.png",
    txt2: "39.03",
    image1: "/assets/20240830_115031.png",
  },
  {
    txt: "Mem***SKL",
    image: "/assets/9-6d772f2c.png",
    txt2: "13.36",
    image1: "/assets/g1.png",
  },
  {
    txt: "Mem***PID",
    image: "/assets/13-5676d43f.png",
    txt2: "16.90",
    image1: "/assets/20240830_115031.png",
  },
  {
    txt: "Mem***JYR",
    image: "/assets/8-ea087ede.png",
    txt2: "69.03",
    image1: "/assets/g1.png",
  },
  {
    txt: "Mem***MKL",
    image: "/assets/9-6d772f2c.png",
    txt2: "139.03",
    image1: "/assets/20240830_114902.png",
  },
];
const Home = ({ children }) => {
  const [winners, setWinners] = useState(win || []); // Default to empty array if `win` is undefined or not set

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", setVh);
    setVh();

    return () => window.removeEventListener("resize", setVh);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWinners((prevWinners) => {
        if (prevWinners.length === 0) return prevWinners; // Prevent errors if no winners
        const lastWinner = prevWinners[prevWinners.length - 1];
        const newWinners = [lastWinner, ...prevWinners.slice(0, -1)];
        return newWinners;
      });
    }, 2000); // Adjust the timing as needed
    return () => clearInterval(interval);
  }, []);

  const lastWinner = winners.length > 0 ? winners[winners.length - 1] : null;
  const otherWinners = winners.length > 1 ? winners.slice(0, -1) : [];

  const images = [
    {
      id: 1,
      src: "assets/images/dragon1.jpg",
      alt: "First Image",
    },
    {
      id: 2,
      src: "assets/images/dragon2.jpg",
      alt: "Second Image",
    },
    {
      id: 3,
      src: "assets/images/dragon3.jpg",
      alt: "Third Image",
    },
  ];

  const [currentIndex, setCurrentIndex] = React.useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  });

  const imageUrls = [
    "assets/images/gamecategory_20231215033613klhe.png",
    "assets/images/gamecategory_202312150336204mtb.png",
    "assets/images/gamecategory_20231215033607yi17.png",
    "assets/images/gamecategory_20231215033600k8os.png",
    "assets/images/gamecategory_20231215033554mpgb.png",
    "assets/images/gamecategory_20231215033528g3gt.png",
    "assets/images/gamecategory_2023121503353389nc.png",
    "assets/images/gamecategory_202312150336366phx.png",
  ];

  const [subtitles] = useState([
    "Lottery",
    "Slots",
    "Sports",
    "Casino",
    "PVC",
    "Finishing",
    "Mini games",
    "Popular",
  ]);
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));
  const imageUrl = "assets/images/lottery-7b8f3f55.png";

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/head"); // Navigate to the specified link
  };
  const handleClick1 = () => {
    navigate("/k3"); // Navigate to the specified link
  };
  const handleClick2 = () => {
    navigate("/trx"); // Navigate to the specified link
  };

  const [activeTab, setActiveTab] = useState(0); // Add this line

  const handleDownload = () => {
    // Programmatically click the hidden anchor tag
    const link = document.createElement("a");
    link.href = `https://111club.online/abclottery.apk`; // Change this to the actual path of the APK file on your server
    link.download = "abclottery.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const imageurl = [
    {
      image: "/assets/banners/a1.png",
      txt: "Our customer service never sends a link to the member, if you received a link from someone else it might be a scam.",
    },
    {
      image: "/assets/banners/a2.png",
      txt: "Welcome to our TC Website our customer service never sends a link to the member.",
    },
    {
      image: "/assets/banners/a3.jpg",
      txt: "Thankyou for visting our website and your value time,our website deals with many features,hope you enjoy",
    },
    {
      image: "/assets/banners/a4.png",
      txt: "Thankyou for visting our website and your value time,our website deals with many features,hope you enjoy",
    },
    {
      image: "/assets/banners/a5.png",
      txt: "Thankyou for visting our website and your value time,our website deals with many features,hope you enjoy",
    },
  ];

  const TabIcon = ({ src, alt }) => (
    <img
      src={src}
      alt={alt}
      style={{
        width: "24px",
        height: "24px",
        marginRight: "8px",
      }}
    />
  );

  const Header = styled(Box)(({ theme }) => ({
    overflow: "hidden",
    position: "relative",
    paddingLeft: "10px",
    paddingRight: "10px",
  }));
  const ImageWrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "auto",
  }));

  const textArray = [
    "Welcome to the Black Lion Games! Greetings, Gamers and Enthusiasts!",
    "The Mahakal Club Games are here to provide excitement and fun.",
    "For your convenience and account safety, please ensure",
    "you fill in the genuine mobile number registered with your bank.",
    "Thank you for your cooperation and enjoy the games!",
  ];

  const [index, setIndex] = React.useState(0);
  const [inProp, setInProp] = React.useState(false);

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

  const handleTabClick = async (path) => {
    navigate(path);
  };

  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageurl.length);
    }, 2000);
    // Change image every 2 seconds
    return () => clearInterval(interval);
  }, [imageurl.length]);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % imageurl.length);
    }, 4000);
    // Change image every 2 seconds
    return () => clearInterval(interval);
  }, [imageurl.length]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds

    // Cleanup function to clear the timeout if the component unmounts before 2 seconds
    return () => clearTimeout(timer);
  }, []);

  const numberOfItems = Loteria.length;

  const [tabValue, setTabValue] = useState(2); // 'Mini games' tab is active by default

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Set a timeout to show the modal after 2 seconds
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 2000);

    // Clean up the timeout if the component unmounts to avoid memory leaks
    return () => clearTimeout(timer);
  }, []);

  const [isNotificationModalOpen, setNotificationModalOpen] = useState(false);
  const [isDepositModalOpen, setDepositModalOpen] = useState(false);

  useEffect(() => {
    // Automatically show NotificationModal 2 seconds after component mounts
    const timer = setTimeout(() => {
      setNotificationModalOpen(true);
    }, 2000); // 2 second delay

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  const handleNotificationClose = () => {
    setNotificationModalOpen(false);
    // Open DepositModal when NotificationModal is closed
    setTimeout(() => setDepositModalOpen(true), 300); // Delay to ensure modal transition
  };

  const handleDepositModalClose = () => {
    setDepositModalOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <Mobile>
        {/* Other content */}
        <Box
          display="flex"
          flexDirection="column"
          height="calc(var(--vh, 1vh) * 100)"
          position="relative"
          sx={{
            backgroundColor: "#F7F8FF",
            overflowY: "scroll",
            overflowX: "hidden",
            "&::-webkit-scrollbar": {
              width: "1px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#F7F8FF",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#F7F8FF",
            },
          }}
        >
          <Box flexGrow={1} sx={{ backgroundColor: "F7F8FF" }}>
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                backgroundColor: "#4781FF",
                padding: "0px 1px",
                color: "white",
              }}
            >
              {/* Left Side - Logo */}
              <Grid item xs={6} textAlign="left">
                <img
                  src="/assets/greenlogo.png"
                  alt="logo"
                  style={{ width: "140px", height: "45px" }}
                />
              </Grid>

              {/* Right Side - Icons */}
              <Grid item xs={6} textAlign="right">
                {/* Message Icon with Red Notification Dot */}
                <Badge
                  variant="dot"
                  color="error"
                  sx={{
                    "& .MuiBadge-dot": {
                      width: 8,
                      height: 8,
                      backgroundColor: "red",
                      opacity: 0.5,
                      top: 10,
                      right: 15,
                    },
                  }}
                >
                  <IconButton
                    sx={{
                      borderRadius: 2,
                      marginRight: "8px",
                    }}
                    onClick={() => navigate("/messages")}
                  >
                    <svg
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      xmlns="http://www.w3.org/2000/svg"
                      data-v-715dd0f6=""
                      class="svg-icon icon-notification"
                      width="30"
                      height="30"
                      viewBox="0 0 60 60"
                    >
                      <defs>
                        <symbol
                          id="icon-notification"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 61 60"
                          fill="#91B3FF"
                        >
                          {" "}
                          <path
                            opacity="0.2"
                            d="M43 51.25H18C10.5 51.25 5.5 47.5 5.5 38.75V21.25C5.5 12.5 10.5 8.75 18 8.75H43C50.5 8.75 55.5 12.5 55.5 21.25V38.75C55.5 47.5 50.5 51.25 43 51.25Z"
                            fill="#91B3FF"
                          ></path>{" "}
                          <path
                            d="M30.4987 32.1818C28.3987 32.1818 26.2737 31.5318 24.6487 30.2068L16.8237 23.9568C16.4598 23.6408 16.2319 23.1966 16.1876 22.7167C16.1433 22.2369 16.286 21.7584 16.5858 21.3812C16.8857 21.0039 17.3196 20.757 17.7971 20.6919C18.2746 20.6268 18.7588 20.7486 19.1487 21.0318L26.9737 27.2818C28.8737 28.8068 32.0987 28.8068 33.9987 27.2818L41.8237 21.0318C42.6237 20.3818 43.8237 20.5068 44.4487 21.3318C45.0987 22.1318 44.9737 23.3318 44.1487 23.9568L36.3237 30.2068C34.7237 31.5318 32.5987 32.1818 30.4987 32.1818Z"
                            fill="#91B3FF"
                          ></path>
                        </symbol>
                      </defs>
                      <g>
                        {" "}
                        <path
                          opacity="0.4"
                          d="M43 51.25H18C10.5 51.25 5.5 47.5 5.5 38.75V21.25C5.5 12.5 10.5 8.75 18 8.75H43C50.5 8.75 55.5 12.5 55.5 21.25V38.75C55.5 47.5 50.5 51.25 43 51.25Z"
                          fill="#91B3FF"
                        ></path>{" "}
                        <path
                          d="M30.4987 32.1818C28.3987 32.1818 26.2737 31.5318 24.6487 30.2068L16.8237 23.9568C16.4598 23.6408 16.2319 23.1966 16.1876 22.7167C16.1433 22.2369 16.286 21.7584 16.5858 21.3812C16.8857 21.0039 17.3196 20.757 17.7971 20.6919C18.2746 20.6268 18.7588 20.7486 19.1487 21.0318L26.9737 27.2818C28.8737 28.8068 32.0987 28.8068 33.9987 27.2818L41.8237 21.0318C42.6237 20.3818 43.8237 20.5068 44.4487 21.3318C45.0987 22.1318 44.9737 23.3318 44.1487 23.9568L36.3237 30.2068C34.7237 31.5318 32.5987 32.1818 30.4987 32.1818Z"
                          fill="white"
                        ></path>
                      </g>
                    </svg>
                  </IconButton>
                </Badge>

                {/* Download Button */}
                <IconButton
                  sx={{
                    borderRadius: 2,
                  }}
                  onClick={() => navigate("/download")}
                >
                  <DownloadIcon sx={{ fontSize: 20, color: "white" }} />
                </IconButton>
              </Grid>
            </Grid>

            {/* //content */}
            <Header>
              <ImageWrapper>
                <img
                  src={imageurl[currentImageIndex].image}
                  alt={`Banner ${currentImageIndex + 1}`}
                  style={{
                    marginTop: "0px",
                    borderRadius: 10,
                    width: "100%",
                    height: "200px",
                  }}
                />
              </ImageWrapper>
            </Header>
            <Grid
              item
              sx={{
                backgroundColor: "#FFFFFF",
                margin: "0px",
                borderRadius: "25px",
                padding: "2px 5px", // Adjust padding to make room for the button and text
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                overflow: "hidden", // Ensure content stays within the box
              }}
            >
              <IconButton>
                <VolumeUpIcon sx={{ color: "#4781FF" }} />
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
                      color: "#303A4C",

                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      textAlign: "left",
                      overflow: "hidden",
                      fontFamily: "Bahnschrift",
                      fontWeight: 400,
                      fontSize: "13px",
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
                variant="outlined"
                sx={{
                  borderColor: "#4781FF",
                  color: "#4781FF",
                  background: "transparent",
                  "&:hover": {
                    borderColor: "#4781FF",
                    background: "transparent",
                  },
                  borderRadius: "50px",
                  textTransform: "initial",
                  padding: "3px 10px",
                  fontFamily: "Bahnschrift",
                  fontWeight: 400,
                  fontSize: "13px",
                }}
                startIcon={<MySvgIcon />}
              >
                Detail
              </Button>
            </Grid>

            {/* All game cards section */}
            {/* <h1>Hey</h1> */}
            <Games />
            {/* <h1>Hey</h1> */}
            {/* Winning Information */}
            <Box
              display="flex"
              alignItems="center"
              mt={2}
              ml={2}
              mb={-1}
              sx={{
                fontSize: "16px",
                fontWeight: 900,
                fontFamily: "Arial, sans-serif",
                color: "#333",
                mb: 3,
                borderLeft: "3px solid #4D8FFF",
                pl: 1, // Add padding to the left
                lineHeight: "1.5", // Adjust line height to control border height
                width: "fit-content",
              }}
            ></Box>
            <Winscroll />
            <Stage />

            {/* Today's earning chart */}

            {/* InfoSection */}

            <br />
            <br />
            <br />
            <br />
            <br />

            {/* content end */}
          </Box>

          {children}
        </Box>
      </Mobile>
    </div>
  );
};

export default Home;

/*eslint-disable*/

// import React, { useEffect, useState } from "react";
// import Mobile from "../Components/Mobile";
// import { IconButton, Button, Grid, Box, Typography } from "@mui/material";
// import { VolumeUp as VolumeUpIcon } from "@mui/icons-material";
// import { CSSTransition } from "react-transition-group";
// import { useNavigate } from "react-router-dom";
// import { ReactComponent as CustomerIcon } from '../assets/svgexport-3.svg';
// import Games from "../Components/Games";
// import LoadingLogo from "./LoadingLogo";
// import DepositModal from "../Pages/depositModal";
// import NotificationModal from "../Components/NotificationPopup";
// import { Tab } from '@headlessui/react';
// import { cn } from 'shadcn';

// const MySvgIcon = () => (
//   <img src="https://goagameb.com/assets/svg/redhomeN-ae7073a2.svg" alt="icon" style={{ width: '12px', height: '12px', marginRight: '-5px' }} />
// );

// const Home = ({ children }) => {
//   const [winners, setWinners] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [currentTextIndex, setCurrentTextIndex] = useState(0);
//   const [isNotificationModalOpen, setNotificationModalOpen] = useState(false);
//   const [isDepositModalOpen, setDepositModalOpen] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const setVh = () => {
//       const vh = window.innerHeight * 0.01;
//       document.documentElement.style.setProperty("--vh", `${vh}px`);
//     };

//     window.addEventListener("resize", setVh);
//     setVh();

//     return () => window.removeEventListener("resize", setVh);
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setWinners((prevWinners) => {
//         const lastWinner = prevWinners[prevWinners.length - 1];
//         const newWinners = [lastWinner, ...prevWinners.slice(0, -1)];
//         return newWinners;
//       });
//     }, 2000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   });

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageurl.length);
//     }, 2000);
//     return () => clearInterval(interval);
//   }, [imageurl.length]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentTextIndex((prevIndex) => (prevIndex + 1) % imageurl.length);
//     }, 4000);
//     return () => clearInterval(interval);
//   }, [imageurl.length]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 2000);
//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setNotificationModalOpen(true);
//     }, 2000);
//     return () => clearTimeout(timer);
//   }, []);

//   const handleNotificationClose = () => {
//     setNotificationModalOpen(false);
//     setTimeout(() => setDepositModalOpen(true), 300);
//   };

//   const handleDepositModalClose = () => {
//     setDepositModalOpen(false);
//   };

//   const imageurl = [
//     {
//       image: "/assets/banners/a1.png",
//       txt: "Our customer service never sends a link to the member, if you received a link from someone else it might be a scam.",
//     },
//     {
//       image: "/assets/banners/a2.png",
//       txt: "Welcome to our TC Website our customer service never sends a link to the member.",
//     },
//     {
//       image: "/assets/banners/a3.jpg",
//       txt: "Thankyou for visting our website and your value time,our website deals with many features,hope you enjoy",
//     },
//     {
//       image: "/assets/banners/a4.png",
//       txt: "Thankyou for visting our website and your value time,our website deals with many features,hope you enjoy",
//     },
//     {
//       image: "/assets/banners/a5.png",
//       txt: "Thankyou for visting our website and your value time,our website deals with many features,hope you enjoy",
//     },
//   ];

//   const textArray = [
//     "Welcome to the Black Lion Games! Greetings, Gamers and Enthusiasts!",
//     "The Mahakal Club Games are here to provide excitement and fun.",
//     "For your convenience and account safety, please ensure",
//     "you fill in the genuine mobile number registered with your bank.",
//     "Thank you for your cooperation and enjoy the games!",
//   ];

//   const [index, setIndex] = React.useState(0);
//   const [inProp, setInProp] = React.useState(false);

//   React.useEffect(() => {
//     const timer = setInterval(() => {
//       setInProp(false);

//       setTimeout(() => {
//         setIndex((oldIndex) => {
//           return (oldIndex + 1) % textArray.length;
//         });
//         setInProp(true);
//       }, 500);
//     }, 3000);

//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <div className="relative">
//       <Mobile>
//         <NotificationModal
//           open={isNotificationModalOpen}
//           onClose={handleNotificationClose}
//         />
//         <DepositModal
//           open={isDepositModalOpen}
//           onClose={handleDepositModalClose}
//         />
//         <Box
//           display="flex"
//           flexDirection="column"
//           height="calc(var(--vh, 1vh) * 100)"
//           position="relative"
//           className="bg-gray-100 overflow-y-scroll overflow-x-hidden"
//         >
//           <Box flexGrow={1} className="bg-gray-100">
//             <Grid
//               container
//               alignItems="center"
//               justifyContent="space-between"
//               className="sticky top-0 z-50 bg-blue-600 p-1 text-white"
//             >
//               <Grid item xs={6} textAlign="left">
//                 <img
//                   src="/assets/greenlogo.png"
//                   alt="logo"
//                   className="w-36 h-12"
//                 />
//               </Grid>
//               <Grid item xs={6} textAlign="right">
//                 <IconButton
//                   className="text-blue-300"
//                   onClick={() => navigate("/messages")}
//                 >
//                   <CustomerIcon className="w-6 h-6 fill-current text-blue-300" />
//                 </IconButton>
//               </Grid>
//             </Grid>

//             <Box className="relative overflow-hidden px-2">
//               <Box className="flex justify-center items-center w-full h-auto">
//                 <img
//                   src={imageurl[currentImageIndex].image}
//                   alt={`Banner ${currentImageIndex + 1}`}
//                   className="rounded-lg w-full h-44"
//                 />
//               </Box>
//             </Box>

//             <Grid
//               item
//               className="bg-white m-2 rounded-lg p-1 flex items-center justify-between overflow-hidden"
//             >
//               <IconButton>
//                 <VolumeUpIcon className="text-blue-600" />
//               </IconButton>

//               <Box className="flex-1 overflow-hidden px-2">
//                 <CSSTransition
//                   in={inProp}
//                   timeout={500}
//                   classNames="message"
//                   unmountOnExit
//                 >
//                   <Typography
//                     className="text-gray-800 text-left overflow-hidden font-light text-sm"
//                     style={{
//                       display: "-webkit-box",
//                       WebkitBoxOrient: "vertical",
//                       WebkitLineClamp: 2,
//                       lineClamp: 2,
//                       textOverflow: "ellipsis",
//                     }}
//                   >
//                     {textArray[index]}
//                   </Typography>
//                 </CSSTransition>
//               </Box>

//               <Button
//                 variant="outlined"
//                 className="border-blue-600 text-blue-600 bg-transparent hover:bg-transparent rounded-full text-sm px-2"
//                 startIcon={<MySvgIcon />}
//               >
//                 Detail
//               </Button>
//             </Grid>

//             <Games />

//             <Box className="flex items-center mt-2 ml-2 mb-1 text-lg font-bold text-gray-800 border-l-4 border-blue-600 pl-1">
//               Winning details
//             </Box>

//             <br />
//             <br />
//             <br />
//             <br />
//             <br />
//           </Box>

//           {children}
//         </Box>
//       </Mobile>
//     </div>
//   );
// };

// export default Home;
