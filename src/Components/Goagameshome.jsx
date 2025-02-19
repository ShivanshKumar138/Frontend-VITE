import React, { useState, useRef,useEffect ,useCallback, memo} from 'react';
import { Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { domain } from "./config";
import axios from "axios";
import { styled } from "@mui/material/styles";
import { sub } from 'date-fns';
// import { Grid } from '@mui/system';

// Styled components remain the same
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
  backgroundColor: "#4781ff",
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
}));

// Separate RechargeDialog component with memo
const RechargeDialog = memo(({ open, onClose, onConfirm, selectedGame }) => {
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
          style={{ backgroundColor: "#4781ff", color: "white" }}
        >
          Recharge Now
        </StyledButton>
      </StyledDialogActions>
    </StyledDialog>
  );
});

RechargeDialog.displayName = 'RechargeDialog';
const TabLayout = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [flashPage, setFlashPage] = useState(0);
  const [slotPage, setSlotPage] = useState(0);
  const [sportsPage, setSportsPage] = useState(0);
  const [casinoPage, setCasinoPage] = useState(0);
  const [cardsPage, setCardsPage] = useState(0);
  const [dicePage, setDicePage] = useState(0);
  const [bingoPage, setBingoPage] = useState(0);
  const tabsRef = useRef(null);

  // const tabs = [
  //   { id: 'lobby', label: 'Lobby', img: 'assets/banners/r1.png' },
  //   { id: 'flash', label: 'Flash', img: 'assets/banners/r2.png' },
  //   { id: 'slot', label: 'Slot', img: 'assets/banners/r3.png' },
  //   { id: 'sports', label: 'Popular', img: 'assets/banners/r4.png' },
  //   { id: 'casino', label: 'Video', img: 'assets/banners/r5.png' },
  //   { id: 'cards', label: 'Sport', img: 'assets/banners/r6.png' },
  //   { id: 'dice', label: 'Fish', img: 'assets/banners/r7.png' },
  //   { id: 'bingo', label: 'Lottery', img: 'assets/banners/r8.png' }
  // ];


  //new tabs:
  // const tabs = [
  //   { id: 'lobby', label: 'Lottry', img: 'https://ossimg.goa999.vip/GoaGame/gamecategory/gamecategory_20240127134331wkt7.png' },
  //   { id: 'flash', label: 'Rummy', img: 'https://ossimg.goa999.vip/GoaGame/gamecategory/gamecategory_20240127140618epu3.png' },
  //   { id: 'slot', label: 'Slots', img: 'https://ossimg.goa999.vip/GoaGame/gamecategory/gamecategory_20240127160211wyu9.png' },
  //   { id: 'sports', label: 'Popular', img: 'https://ossimg.goa999.vip/GoaGame/gamecategory/gamecategory_20240127134718aedk.png' },
  //   { id: 'casino', label: 'Casino', img: 'https://ossimg.goa999.vip/GoaGame/gamecategory/gamecategory_20240127160544mw56.png' },
  //   { id: 'cards', label: 'Sport', img: 'https://ossimg.goa999.vip/GoaGame/gamecategory/gamecategory_20240127171151ol6s.png' },
  //   { id: 'dice', label: 'Fishing', img: 'https://ossimg.goa999.vip/GoaGame/gamecategory/gamecategory_20240306120644tfcu.png' },
  // ];


  const tabs = [
    {id: 'sports', label: 'Popular', img: 'https://ossimg.goa999.vip/GoaGame/gamecategory/gamecategory_20240127134718aedk.png', bgImage:"url(https://goagameb.com/assets/png/lottery_bg-1edd950a.png)" },
    
    {id: 'lobby', label: 'Lottry', img: 'https://ossimg.goa999.vip/GoaGame/gamecategory/gamecategory_20240127134331wkt7.png',bgImage:"url(https://goagameb.com/assets/png/lottery_bg-1edd950a.png)" },
    {id: 'slot', label: 'Slots', img: 'https://ossimg.goa999.vip/GoaGame/gamecategory/gamecategory_20240127160211wyu9.png', bgImage:"rgb(87,199,221)" },
    { id: 'cards', label: 'Sport', img: 'https://ossimg.goa999.vip/GoaGame/gamecategory/gamecategory_20240127171151ol6s.png', bgcolor: "transparent" },
    {id: 'casino', label: 'Casino', img: 'https://ossimg.goa999.vip/GoaGame/gamecategory/gamecategory_20240127160544mw56.png', bgcolor: "transparent" },
    {id: 'flash', label: 'Rummy', img: 'https://ossimg.goa999.vip/GoaGame/gamecategory/gamecategory_20240127140618epu3.png', bgcolor: "linear-gradient(to bottom, #fbb2ff, #e27bd1)" },
    

    { id: 'dice', label: 'Fishing', img: 'https://ossimg.goa999.vip/GoaGame/gamecategory/gamecategory_20240306120644tfcu.png', bgcolor: "rgb(253,177,107)" },
    { id: 'original', label: "Original", img: "https://ossimg.goa999.vip/GoaGame/gamecategory/gamecategory_2023071018441674yw.png", bgcolor: "rgb(245,144,193)" },
  ]

  const lotteryGames = [
    { 
      id: 'wingo', 
      title: 'Win Go',
      subtitle: 'Guess the number',
      desc: 'Green/Purple/Red to win', 
      img: '/assets/banners/wingo.png',
      path: "/timer/30sec" 
    },
    { 
      id: 'k3', 
      title: 'K3',
      subtitle: 'Guess the number',
      desc: 'high/low/odd/even', 
      img: '/assets/banners/k3.png',
      path: "/k3/1min"
    },
    { 
      id: '5d', 
      title: '5D',
      subtitle: 'Guess the number',
      desc: 'high/low/odd/even', 
      img: '/assets/banners/5d.png',
      path: "/5d/1min"
    },
    { 
      id: 'trxwin', 
      title: 'Trx Win',
      subtitle: 'Guess the number',
      desc: 'Green/Purple/Red to win', 
      img: '/assets/banners/trx.png',
      path: "/trx/1min"
    }
  ];

  const gamesByTab = {
    flash: [
      { id: 'aviator1', title: 'Aviator', gameId: '404', img: 'https://ossimg.goa999.vip/GoaGame/gamelogo/TB_Chess/800.png' },
      { id: 'cricket', title: 'Cricket', gameId: '259', img: 'https://ossimg.goa999.vip/GoaGame/gamelogo/EVO_Electronic/fivestar00000000.png' },
      { id: 'aviator2', title: 'Aviator Pro', gameId: '427', img: 'https://ossimg.goa999.vip/GoaGame/gamelogo/EVO_Electronic/reelsteal0000000.png' },
      { id: 'dragon', title: 'Dragon', gameId: '441', img: 'https://ossimg.goa999.vip/GoaGame/gamelogo/EVO_Electronic/risquemegaways00.png' },
      { id: 'keno', title: 'Keno 80', gameId: '439', img: 'https://ossimg.goa999.vip/GoaGame/gamelogo/EVO_Electronic/walkofshame00000.png' },
      { id: 'crash', title: 'Crash', gameId: '372', img: 'https://ossimg.goa999.vip/GoaGame/gamelogo/JDB/14025.png' },
    ],
    popular: [
      { id: 'aviator1', title: 'Aviator', gameId: '404', img: 'https://ossimg.goa999.vip/GoaGame/gamelogo/JILI/51.png' },
      { id: 'cricket', title: 'Cricket', gameId: '259', img: 'https://ossimg.goa999.vip/GoaGame/gamelogo/JILI/109.png' },
      { id: 'aviator2', title: 'Aviator Pro', gameId: '427', img: 'https://ossimg.goa999.vip/GoaGame/gamelogo/JILI/223.png' },
      { id: 'dragon', title: 'Dragon', gameId: '441', img: 'https://ossimg.goa999.vip/GoaGame/gamelogo/JILI/200.png' },
      { id: 'keno', title: 'Keno 80', gameId: '439', img: 'https://ossimg.goa999.vip/GoaGame/gamelogo/JILI/197.png' },
      { id: 'crash', title: 'Crash', gameId: '372', img: 'https://ossimg.goa999.vip/GoaGame/gamelogo/JDB/14036.png' },
      { id: 'aviator1', title: 'Aviator', gameId: '440', img: 'https://ossimg.goa999.vip/GoaGame/gamelogo/JDB/14025.png' },
      { id: 'cricket', title: 'Cricket', gameId: '302', img: 'https://ossimg.goa999.vip/GoaGame/gamelogo/JILI/35.png' },
      { id: 'aviator2', title: 'Aviator Pro', gameId: '400', img: 'https://ossimg.goa999.vip/GoaGame/gamelogo/EVO_Electronic/fivestar00000000.png' },
      { id: 'dragon', title: 'Dragon', gameId: '407', img: '/assets/games/jili/JL_260x380_GameID407_en-US.png' },
    ],
    slot: [
      { id: 'slot1', title: 'Slot Magic', gameId: '223', img: 'https://ossimg.goa999.vip/GoaGame/vendorlogo/vendorlogo_20230710184642yw3q.png' ,bgColor:'rgb(77,144,254)'},
      { id: 'slot2', title: 'Super Slots', gameId: '240', img: 'https://ossimg.goa999.vip/GoaGame/vendorlogo/vendorlogo_202307101846164xab.png',bgColor:'rgb(77,144,254)' },
      { id: 'slot1', title: 'Slot Magic', gameId: '180', img: 'https://ossimg.goa999.vip/GoaGame/vendorlogo/vendorlogo_20230710184633b9w1.png',bgColor:'rgb(77,144,254)'},
      { id: 'slot2', title: 'Super Slots', gameId: '300', img: 'https://ossimg.goa999.vip/GoaGame/vendorlogo/vendorlogo_20230724124135ypq8.png',bgColor:'rgb(77,144,254)' },
      { id: 'slot1', title: 'Slot Magic', gameId: '223', img: 'https://ossimg.goa999.vip/GoaGame/vendorlogo/vendorlogo_20230710184550vu9q.png' ,bgColor:'rgb(77,144,254)'},
      { id: 'slot2', title: 'Super Slots', gameId: '240', img: 'https://ossimg.goa999.vip/GoaGame/vendorlogo/vendorlogo_20241017050424j8it.png',bgColor:'rgb(77,144,254)' },
      { id: 'slot1', title: 'Slot Magic', gameId: '180', img: 'https://ossimg.goa999.vip/GoaGame/vendorlogo/vendorlogo_20240508124035qn6t.png ',bgColor:'rgb(77,144,254)'},
      { id: 'slot2', title: 'Super Slots', gameId: '300', img: 'https://ossimg.goa999.vip/GoaGame/vendorlogo/vendorlogo_20230710184642yw3q.png',bgColor:'rgb(77,144,254)' },
    ],
    sports: [
      { id: 'football', title: 'Football', gameId: '403', img: 'https://ossimg.goa999.vip/GoaGame/vendorlogo/vendorlogo_202312301253295lr5.png',subtitle:"Football",desc:"" },
      { id: 'cricket', title: 'Cricket', gameId: '389', img: 'https://ossimg.goa999.vip/GoaGame/vendorlogo/vendorlogo_20230724124223a1c6.png',subtitle:"Cricket",desc:"" },
    ],
    casino: [
      { id: 'roulette', title: 'Roulette Game', gameId: '231', img: 'https://ossimg.goa999.vip/GoaGame/vendorlogo/vendorlogo_20230724121059epjw.png' ,subtitle:"Roulette",desc:""},
      { id: 'blackjack', title: 'Blackjack Game', gameId: '114', img: 'https://ossimg.goa999.vip/GoaGame/vendorlogo/vendorlogo_20230724124206my28.png',subtitle:"Blackjack",desc:"" },
      { id: 'blackjack', title: 'Blackjack Game', gameId: '153', img: 'https://ossimg.goa999.vip/GoaGame/vendorlogo/vendorlogo_20230710184542ipg8.png' ,subtitle:"Blackjack",desc:""},
      { id: 'blackjack', title: 'Blackjack Game', gameId: '253', img: 'https://ossimg.goa999.vip/GoaGame/vendorlogo/vendorlogo_2023071120242713k7.png',subtitle:"Blackjack",desc:"" },
    ],
    cards: [
      { id: 'poker', title: 'Poker', gameId: '7009', img: 'https://ossimg.goa999.vip/GoaGame/vendorlogo/vendorlogo_20231222113041t8ry.png',subtitle:"Poker",desc:"365" },
      { id: 'baccarat', title: 'Baccarat', gameId: '14089', img: 'https://ossimg.goa999.vip/GoaGame/vendorlogo/vendorlogo_2023071018455962ki.png' ,subtitle:"Baccarat",desc:"365"},
    ],
    dice: [
      { id: 'dice1', title: 'Dice Pro', gameId: '7005', img: '/assets/jdb/JDB_7_7005.png' },
      { id: 'dice2', title: 'Lucky Dice', gameId: '7004', img: '/assets/jdb/JDB_7_7004.png' },
    ],
    bingo: [
      { id: 'bingo1', title: 'Classic Bingo', gameId: '7003', img: '/assets/jdb/JDB_7_7003.png' },
      { id: 'bingo2', title: 'Power Bingo', gameId: '7002', img: '/assets/jdb/JDB_7_7002.png' },
    ]
  };

  const [firstDepositMade, setFirstDepositMade] = useState(true);
  const [needToDepositFirst, setNeedToDepositFirst] = useState(false);
  const [phoneUserUid, setPhoneUserUid] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameType, setGameType] = useState("");
  const [isDepositCheckLoading, setIsDepositCheckLoading] = useState(true);
  const [hasDeposit, setHasDeposit] = useState(false);
  
 

  useEffect(() => {
    const checkDepositStatus = async () => {
      setIsDepositCheckLoading(true);
      try {
        const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
        const userResponse = await axios.get(`${domain}/user`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const depositResponse = await axios.get(`${domain}/need-to-deposit-first`, {
          withCredentials: true,
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

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const navigate = useNavigate();
  const handleConfirmRecharge = () => {
    // Navigate to recharge page or trigger recharge process
    window.location.href = "/recharge"; // Adjust this path as needed
  };

  const jili = useCallback(async (gameId) => {
    try {
      const response = await axios.post(`${domain}/jilireal-test-login/`, { GameId: gameId });
      const { ErrorCode, Data } = response.data.responseData;
      
      if (ErrorCode === 0) {
        window.location.href = Data;
      }
    } catch (error) {
      console.error('Jili game error:', error);
    }
  }, []);


const handleItemClick = useCallback((path) => {
  if (!hasDeposit && !isDepositCheckLoading) {
    setSelectedGame({ game: path.split('/').pop() });
    setOpenDialog(true);
    return;
  }

  if (!path) {
    console.error('No path provided for navigation');
    return;
  }

  try {
    console.log('Navigating to:', path);
    navigate(path);
  } catch (error) {
    console.error('Navigation error:', error);
  }
}, [hasDeposit, isDepositCheckLoading, navigate]);
  


  const handleTabClick = (index) => {
    setActiveTab(index);
    
    if (tabsRef.current) {
      const container = tabsRef.current;
      const tabElement = container.children[0].children[index];
      const containerWidth = container.offsetWidth;
      const tabPosition = tabElement.offsetLeft;
      const tabWidth = tabElement.offsetWidth;
      
      let newScrollPosition;
      if (index > activeTab) {
        newScrollPosition = tabPosition - containerWidth/4;
      } else {
        newScrollPosition = tabPosition - tabWidth;
      }
      
      container.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const SectionHeading = ({ title }) => (
<Box
    sx={{
      fontSize: '15px',
      fontWeight: 800,
      fontFamily: 'Arial, sans-serif',
      color: '#333',
      mb: 5,
      borderLeft: '3px solid #4D8FFF',
      pl: 2, // Add padding to the left
      lineHeight: '1.5', // Adjust line height to control border height
      width: 'fit-content'
    }}
  >
    {title}
  </Box>
);

  const LotteryItem = ({ title, subtitle, desc, img,onClick }) => (
    <Box
    onClick={onClick}
      sx={{
        height: '95px',
        bgcolor: '#4D8FFF',
        borderRadius: '16px',
        p: 1,
        mb: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        color: 'white',
        cursor: 'pointer',
        transition: '0.3s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }
      }}
    >
      <Box sx={{ textAlign: 'left', flex: 1 }}>
        <Box sx={{ fontSize: '19px', fontWeight: 700, mb: 1,fontFamily: "Arial, sans-serif" }}>
          {title}
        </Box>
        <Box sx={{ fontSize: '12px', fontWeight: 400, opacity: 0.9, mb: 0.5,fontFamily: "Arial, sans-serif" }}>
          {subtitle}
        </Box>
        <Box sx={{ fontSize: '12px', fontWeight: 400, opacity: 0.9, mb: 0.5,fontFamily: "Arial, sans-serif" }}>
          {desc}
        </Box>
      </Box>
      <Box //This is for the wingo tab
        component="img"
        src={img}
        alt={title}
        sx={{ 
          width: '110px',
          height: 'calc(100% + -10px)',
          objectFit: 'cover',
          borderRadius: '8px',
          ml: 2,
          mt: 1,
          mb: 1,
        }}
      />
    </Box>
  );

 // ...existing code...
 const GameGrid = ({ games, currentPage, setPage, onGameClick }) => {
  const itemsPerPage = 15;
  const currentItems = games.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  const totalPages = Math.ceil(games.length / itemsPerPage);

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 1,
        mb: 2
      }}>
        {currentItems.map((game) => (
         <Box
         key={game.id}
         onClick={() => onGameClick(game.gameId)}
         sx={{
           width: 118, // Increase width
           height: 140, // Increase height
           marginRight:0,
           bgcolor: '#4D8FFF',
           borderRadius: '16px',
           overflow: 'hidden',
           cursor: 'pointer',
           transition: '0.3s',
           '&:hover': {
             transform: 'scale(1.05)'
           }
         }}
       >
         <Box
           component="img"
           src={game.img}
           alt={game.title}
           sx={{
             width: '100%',
             height: '100%',
             objectFit: 'cover',
           }}
         />
       </Box>
       
        ))}
      </Box>
      
      {totalPages > 1 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          gap: 1,
          mt: 2
        }}>
          <Box 
            onClick={() => setPage(Math.max(0, currentPage - 1))}
            sx={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#4D8FFF',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#fff',
              '&:hover': { bgcolor: '#4D8FFF' }
            }}
          >
            {'<'}
          </Box>
          <Box
            onClick={() => setPage(Math.min(totalPages - 1, currentPage + 1))}
            sx={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#4D8FFF',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#fff',
              '&:hover': { bgcolor: '#4D8FFF' }
            }}
          >
            {'>'}
          </Box>
        </Box>
      )}
    </Box>
  );
};
// ...existing code...

  return (
    <Box sx={{ width: '100%', maxWidth: '4xl', margin: '0 auto' }}>
      <Box sx={{ position: 'relative', px: 1 }}>
        <Box 
          ref={tabsRef}
          sx={{
            display: 'flex',
            overflowX: 'hidden',
            scrollBehavior: 'smooth',
            position: 'relative',
            '&::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
<Grid container spacing={2} sx={{ mt: 0 }}>
  {/* First Row (3 items with background images) */}
  {tabs.slice(0, 3).map((tab, index) => (
  <Grid item xs={4} key={tab.id}>
    <Box
      onClick={() => handleTabClick(index)}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        borderRadius: 3,
        p: 1,
        minHeight: "80px", // Ensures the box doesn't shrink
        cursor: "pointer",
        transition: "all 0.3s",
        background: tab.bgImage,
        backgroundSize: "130% 130%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "white",
        boxShadow: activeTab === index
          ? "0px 4px 10px rgba(0, 0, 0, 0.1)"
          : "0px 2px 5px rgba(0, 0, 0, 0.1)",
        "&:hover": { transform: "scale(1.05)" },

        // Background overlay for first box
        ...(index === 0 && {
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgb(104,150,234)",
            opacity: 0.6,
            borderRadius: "inherit",
          },
        }),
      }}
    >
      {/* Larger Image Positioned Above the Box */}
      <Box
        component="img"
        src={tab.img}
        alt={tab.label}
        sx={{
          width: 100,  // Increase size
          height: 100,
          objectFit: "contain",
          position: "absolute",
          top: "-22px", // Moves image above the box
          zIndex: 3,
        }}
      />
      
      {/* Text below image to keep the box size */}
      <span style={{ 
        fontWeight: "bold", 
        fontSize: "1rem", 
        marginTop: "60px", // Push text lower to maintain box height
        position: "relative", 
        zIndex: 1 
      }}>
        {tab.label}
      </span>
    </Box>
  </Grid>
))}


  {/* Second Row (Gradient background with dividers) */}
  <Grid item xs={12}>
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      p: 1,
      borderRadius: 3,
      position: "relative", // Needed for overlay positioning
      background: "rgb(246,148,114)",
      overflow: "hidden",

      // Adding Overlay
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(180, 170, 170, 0)", // Adjust opacity as needed
        borderRadius: "inherit",
      },
    }}
  >
    {tabs.slice(3, 6).map((tab, index) => (
      <Box
        key={tab.id}
        onClick={() => handleTabClick(index + 3)}
        sx={{
          flex: 1,
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.3s",
          color: "white",
          zIndex: 1, // Keeps text and images above overlay
          "&:hover": { transform: "scale(1.05)" },
          position: "relative",

          // Vertical divider except for last item
          "&::after":
            index < 2
              ? {
                  content: '""',
                  position: "absolute",
                  right: 0,
                  top: "10%",
                  width: "2px",
                  height: "80%",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                }
              : {},
        }}
      >
        <Box
          component="img"
          src={tab.img}
          alt={tab.label}
          sx={{ width: 60, height: 60, objectFit: "contain", mb: 1 }}
        />
        <br />
        <span style={{ fontWeight: "bold", fontSize: "1rem" }}>{tab.label}</span>
      </Box>
    ))}
  </Box>
</Grid>


  {/* Third Row (2 items with solid background colors) */}
  {tabs.slice(6, 8).map((tab, index) => (
    <Grid item xs={6} key={tab.id}>
      <Box
        onClick={() => handleTabClick(index + 6)}
        sx={{
          width:155,
          height: 65,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          borderRadius: 3,
          p: 1,
          cursor: "pointer",
          transition: "all 0.3s",
          background: tab.bgcolor,
          color: "white",
          boxShadow: activeTab === index + 6
            ? "0px 4px 10px rgba(0, 0, 0, 0.3)"
            : "0px 2px 5px rgba(0, 0, 0, 0.1)",
          "&:hover": { transform: "scale(1.05)" },
        }}
      >
       <Box
          sx={{
            display: "flex",
            alignItems: "center", // Aligns items vertically
            justifyContent: "space-between", // Centers content horizontally
            gap: 1, // Adds space between image and text
          }}
        >
          <Box
            component="img"
            src={tab.img}
            alt={tab.label}
            sx={{ width:65, height: 70, objectFit: "contain" }}
          />
          <span style={{ fontWeight: "bold", fontSize: "1rem" }}>{tab.label}</span>
      </Box>

       
      </Box>
    </Grid>
  ))}
</Grid>

        </Box>
      </Box>

      <Box sx={{ mt: 3, px: 2 }}>
        {activeTab === 1 && (
          <Box>
            <SectionHeading title="Lottery" />
            {lotteryGames.map((game) => (
              <LotteryItem
                key={game.id}
                title={game.title}
                subtitle={game.subtitle}
                desc={game.desc}
                img={game.img}
                onClick={() => handleItemClick(game.path)}
              />
            ))}
          </Box>
        )}
        


{activeTab === 0 && (
  <Box>
    <SectionHeading title="Platform Recommended Games" />
    <GameGrid 
      games={gamesByTab.flash}
      currentPage={flashPage}
      setPage={setFlashPage}
      onGameClick={(gameId) => {
        if (!hasDeposit && !isDepositCheckLoading) {
          setSelectedGame({ game: 'Flash Game' });
          setOpenDialog(true);
          return;
        }
        jili(gameId);
      }}
    />

<SectionHeading title="Popular Games" />
    <GameGrid 
      games={gamesByTab.popular}
      currentPage={flashPage}
      setPage={setFlashPage}
      onGameClick={(gameId) => {
        if (!hasDeposit && !isDepositCheckLoading) {
          setSelectedGame({ game: 'Flash Game' });
          setOpenDialog(true);
          return;
        }
        jili(gameId);
      }}
    />
  </Box>
)}

{activeTab === 2 && (
  <Box>
    <SectionHeading title="Slot Games" />
    <GameGrid 
      games={gamesByTab.slot}
      currentPage={slotPage}
      setPage={setSlotPage}
      onGameClick={(gameId) => {
        if (!hasDeposit && !isDepositCheckLoading) {
          setSelectedGame({ game: 'Slot Game' });
          setOpenDialog(true);
          return;
        }
        jili(gameId);
      }}
    />
  </Box>
)}


{activeTab === 4 && (
          <Box>
            <SectionHeading title="Casino" />
            {gamesByTab.casino.map((game) => (
              <LotteryItem
                key={game.id}
                title={game.title}
                subtitle={game.subtitle}
                desc={game.desc}
                img={game.img}
                onClick={() => handleItemClick(game.path)}
              />
            ))}
          </Box>
 )}

{activeTab === 3 && (
  <Box>
    <SectionHeading title="Sports Games" />
    {gamesByTab.sports.map((game) => (
              <LotteryItem
                key={game.id}
                title={game.title}
                subtitle={game.subtitle}
                desc={game.desc}
                img={game.img}
                onClick={() => handleItemClick(game.path)}
              />
            ))}
  </Box>
)}

{/* {activeTab === 4 && (
  <Box>
    <SectionHeading title="Casino Games" />
    <GameGrid 
      games={gamesByTab.casino}
      currentPage={casinoPage}
      setPage={setCasinoPage}
      onGameClick={(gameId) => {
        if (!hasDeposit && !isDepositCheckLoading) {
          setSelectedGame({ game: 'Casino Game' });
          setOpenDialog(true);
          return;
        }
        jili(gameId);
      }}
    />
  </Box>
)} */}

{activeTab === 5 && (
  <Box>
    <SectionHeading title="Card Games" />
    {gamesByTab.cards.map((game) => (
              <LotteryItem
                key={game.id}
                title={game.title}
                subtitle={game.subtitle}
                desc={game.desc}
                img={game.img}
                onClick={() => handleItemClick(game.path)}
              />
            ))}
  </Box>
)}

{activeTab === 6 && (
  <Box>
    <SectionHeading title="Dice Games" />
    <GameGrid 
      games={gamesByTab.dice}
      currentPage={dicePage}
      setPage={setDicePage}
      onGameClick={(gameId) => {
        if (!hasDeposit && !isDepositCheckLoading) {
          setSelectedGame({ game: 'Dice Game' });
          setOpenDialog(true);
          return;
        }
        jili(gameId);
      }}
    />
  </Box>
)}

{activeTab === 7 && (
  <Box>
    <SectionHeading title="Bingo Games" />
    <GameGrid 
      games={gamesByTab.bingo}
      currentPage={bingoPage}
      setPage={setBingoPage}
      onGameClick={(gameId) => {
        if (!hasDeposit && !isDepositCheckLoading) {
          setSelectedGame({ game: 'Bingo Game' });
          setOpenDialog(true);
          return;
        }
        jili(gameId);
      }}
    />
  </Box>
)}
      </Box>
      <RechargeDialog
    open={openDialog}
    onClose={handleCloseDialog}
    onConfirm={handleConfirmRecharge}
    selectedGame={selectedGame}
  />
    </Box>
  );
};

export default TabLayout;