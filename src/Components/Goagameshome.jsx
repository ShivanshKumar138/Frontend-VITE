import React, { useState, useRef,useEffect ,useCallback, memo} from 'react';
import { Box } from '@mui/material';
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

  const tabs = [
    { id: 'lobby', label: 'Lobby', img: 'assets/banners/r1.png' },
    { id: 'flash', label: 'Flash', img: 'assets/banners/r2.png' },
    { id: 'slot', label: 'Slot', img: 'assets/banners/r3.png' },
    { id: 'sports', label: 'Popular', img: 'assets/banners/r4.png' },
    { id: 'casino', label: 'Video', img: 'assets/banners/r5.png' },
    { id: 'cards', label: 'Sport', img: 'assets/banners/r6.png' },
    { id: 'dice', label: 'Fish', img: 'assets/banners/r7.png' },
    { id: 'bingo', label: 'Lottery', img: 'assets/banners/r8.png' }
  ];

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
      { id: 'aviator1', title: 'Aviator', gameId: '404', img: '/assets/games/jili/JL_260x380_GameID404_en-US.png' },
      { id: 'cricket', title: 'Cricket', gameId: '259', img: '/assets/games/jili/JL_260x380_GameID259_en-US.png' },
      { id: 'aviator2', title: 'Aviator Pro', gameId: '427', img: '/assets/games/jili/JL_260x380_GameID427_en-US.png' },
      { id: 'dragon', title: 'Dragon', gameId: '441', img: '/assets/games/jili/JL_260x380_GameID441_en-US.png' },
      { id: 'keno', title: 'Keno 80', gameId: '439', img: '/assets/games/jili/JL_260x380_GameID439_en-US.png' },
      { id: 'crash', title: 'Crash', gameId: '372', img: '/assets/games/jili/JL_260x380_GameID372_en-US.png' },
      { id: 'aviator1', title: 'Aviator', gameId: '440', img: '/assets/games/jili/JL_260x380_GameID440_en-US.png' },
      { id: 'cricket', title: 'Cricket', gameId: '302', img: '/assets/games/jili/JL_260x380_GameID302_en-US.png' },
      { id: 'aviator2', title: 'Aviator Pro', gameId: '400', img: '/assets/games/jili/JL_260x380_GameID400_en-US.png' },
      { id: 'dragon', title: 'Dragon', gameId: '407', img: '/assets/games/jili/JL_260x380_GameID407_en-US.png' },
    ],
    slot: [
      { id: 'slot1', title: 'Slot Magic', gameId: '223', img: '/assets/games/jili/JL_260x380_GameID223_en-US.png' },
      { id: 'slot2', title: 'Super Slots', gameId: '240', img: '/assets/games/jili/JL_260x380_GameID240_en-US.png' },
      { id: 'slot1', title: 'Slot Magic', gameId: '180', img: '/assets/games/jili/JL_260x380_GameID180_en-US.png' },
      { id: 'slot2', title: 'Super Slots', gameId: '300', img: '/assets/games/jili/JL_260x380_GameID300_en-US.png' },
    ],
    sports: [
      { id: 'football', title: 'Football', gameId: '403', img: '/assets/games/jili/JL_260x380_GameID403_en-US.png' },
      { id: 'cricket', title: 'Cricket', gameId: '389', img: '/assets/games/jili/JL_260x380_GameID389_en-US.png' },
    ],
    casino: [
      { id: 'roulette', title: 'Roulette', gameId: '231', img: '/assets/games/jili/GAMEID_231_EN_260x380.png' },
      { id: 'blackjack', title: 'Blackjack', gameId: '114', img: '/assets/games/jili/260x380_EN_GAMEID_114.png' },
      { id: 'blackjack', title: 'Blackjack', gameId: '153', img: '/assets/games/jili/260x380_EN_GAMEID_153.png' },
      { id: 'blackjack', title: 'Blackjack', gameId: '253', img: '/assets/games/jili/260x380_EN_GAMEID_253.png' },
      { id: 'blackjack', title: 'Blackjack', gameId: '259', img: '/assets/games/jili/260x380_EN_GAMEID_259.png' },
      { id: 'blackjack', title: 'Blackjack', gameId: '301', img: '/assets/games/jili/260x380_EN_GAMEID_301.png' },
      { id: 'blackjack', title: 'Blackjack', gameId: '220', img: '/assets/games/jili/260x380_EN_GAMEID_220.png' },
      { id: 'blackjack', title: 'Blackjack', gameId: '226', img: '/assets/games/jili/260x380_EN_GAMEID_226.png' },
    ],
    cards: [
      { id: 'poker', title: 'Poker', gameId: '7009', img: '/assets/jdb/JDB_7_7009.png' },
      { id: 'baccarat', title: 'Baccarat', gameId: '14089', img: '/assets/jdb/JDB_0_14089.png' },
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
      fontSize: '16px',
      fontWeight: 900,
      fontFamily: 'Arial, sans-serif',
      color: '#333',
      mb: 3,
      borderLeft: '3px solid #4D8FFF',
      pl: 1, // Add padding to the left
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
      <Box 
        component="img"
        src={img}
        alt={title}
        sx={{ 
          width: '100px',
          height: 'calc(100% + 32px)',
          objectFit: 'cover',
          borderRadius: '8px',
          ml: 2,
          mt: -2,
          mb: -2
        }}
      />
    </Box>
  );

 // ...existing code...
 const GameGrid = ({ games, currentPage, setPage, onGameClick }) => {
  const itemsPerPage = 6;
  const currentItems = games.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  const totalPages = Math.ceil(games.length / itemsPerPage);

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 2,
        mb: 2
      }}>
        {currentItems.map((game) => (
          <Box
            key={game.id}
            onClick={() => onGameClick(game.gameId)}
            sx={{
              aspectRatio: '1',
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
                objectFit: 'cover'
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
      <Box sx={{ position: 'relative', px: 2 }}>
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
          <Box sx={{ display: 'flex', gap: 1 }}>
            {tabs.map((tab, index) => (
              <Box
                key={tab.id}
                onClick={() => handleTabClick(index)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  bgcolor: activeTab === index ? 'rgba(77, 143, 255, 0.5)' : 'white',
                  color: activeTab === index ? 'white' : 'inherit',
                  '&:hover': {
                    bgcolor: activeTab === index ? 'rgba(77, 143, 255, 0.5)' : '#f5f5f5',
                  },
                  whiteSpace: 'nowrap'
                }}
              >
                <Box
                  component="img"
                  src={tab.img}
                  alt={tab.label}
                  sx={{ 
                    width: 24,
                    height: 24,
                    objectFit: 'cover',
                  }}
                />
                <span style={{ fontWeight: 500 }}>{tab.label}</span>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 3, px: 2 }}>
        {activeTab === 0 && (
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
        


{activeTab === 1 && (
  <Box>
    <SectionHeading title="Flash Games" />
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

{activeTab === 3 && (
  <Box>
    <SectionHeading title="Sports Games" />
    <GameGrid 
      games={gamesByTab.sports}
      currentPage={sportsPage}
      setPage={setSportsPage}
      onGameClick={(gameId) => {
        if (!hasDeposit && !isDepositCheckLoading) {
          setSelectedGame({ game: 'Sports Game' });
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
)}

{activeTab === 5 && (
  <Box>
    <SectionHeading title="Card Games" />
    <GameGrid 
      games={gamesByTab.cards}
      currentPage={cardsPage}
      setPage={setCardsPage}
      onGameClick={(gameId) => {
        if (!hasDeposit && !isDepositCheckLoading) {
          setSelectedGame({ game: 'Card Game' });
          setOpenDialog(true);
          return;
        }
        jili(gameId);
      }}
    />
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