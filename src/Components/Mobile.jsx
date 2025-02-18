import React, { useEffect, useState } from "react";
import { Box, Container, useMediaQuery, IconButton } from "@mui/material";
import Draggable from "react-draggable";

const Mobile = ({ children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

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

  const handleDragStop = (e, data) => {
    setIsDragging(false);
    const newPosition = { x: data.x, y: data.y };
    setPosition(newPosition);
    localStorage.setItem('chatButtonPosition', JSON.stringify(newPosition));
  };

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
              onClick={handleClick}
              onTouchEnd={handleClick}
            >
              <img src="/assets/slot/chat.png" alt="Customer Care" style={{ width: 50, height: 50 }} />
            </IconButton>
          </Box>
        </Draggable>
      </Container>
    </Box>
  );
};

export default Mobile;