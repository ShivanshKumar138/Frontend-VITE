import React, { useEffect, useState } from "react";
import { Box, Container, useMediaQuery, IconButton } from "@mui/material";
import Draggable from "react-draggable";
import { useLocation } from "react-router-dom";

const Mobile = ({ children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 20 });
  const location = useLocation();

  useEffect(() => {
    // Disable scrolling on the document body
    document.body.style.overflow = "hidden";

    // Load saved position from localStorage
    const savedPosition = localStorage.getItem('chatButtonPosition');
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const handleClick = () => {
    if (!isDragging) {
      window.location.href = "/customer-service";
    }
  };

  const handleClick2 = () => {
    if (!isDragging) {
      window.location.href = "/tele.me";
    }
  };

  const handleDragStop = (e, data) => {
    setIsDragging(false);
    const newPosition = { x: data.x, y: data.y };
    setPosition(newPosition);
    localStorage.setItem('chatButtonPosition', JSON.stringify(newPosition));
  };

  const showDraggable = ["/home", "/login", "/register"].includes(location.pathname);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="grey"
    >
      <Container
        maxWidth={isSmallScreen ? false : "xs"}
        sx={{
          height: "100vh",
          overflow: "hidden",
          position: "relative",
          padding: 0,
          margin: 0,
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <Box
          bgcolor="#f2f2f1"
          textAlign="center"
          minHeight="100%"
          maxHeight="100vh"
          width="100%"
          paddingX={0}
          sx={{
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            wordWrap: "break-word",
          }}
        >
          {children}
        </Box>
        {showDraggable && (
          <Draggable
            position={position}
            onStart={() => setIsDragging(false)}
            onDrag={() => setIsDragging(true)}
            onStop={handleDragStop}
          >
            
            <Box
              position="absolute"
              bottom={82}
              right={32}
              zIndex={1000}
            >
              <IconButton
                color="primary"
                onClick={handleClick2}
                onTouchEnd={handleClick}
              >
                <img src="https://goagameb.com/assets/png/tg_bg-37fa3454.png" style={{width:"60px",height:"60px"}}/>
              </IconButton>
              <br></br>
              <IconButton
                color="primary"
                onClick={handleClick}
                onTouchEnd={handleClick}
              >
                <img src="/assets/slot/chat.png" alt="Customer Care" style={{ width: 60, height: 60 }} />
              </IconButton>
            </Box>
          </Draggable>
        )}
      </Container>
    </Box>
  );
};

export default Mobile;