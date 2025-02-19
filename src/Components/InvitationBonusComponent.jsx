import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import CloseIcon from "@mui/icons-material/Close";
import Mobile from "./Mobile";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { domain } from "./config";

// Background with Image and Gradient
const ImageBackground = styled(Box)({
  position: "relative",
  backgroundImage: `url("../../assets/box-5efaaed8.png"), linear-gradient(45deg, #4CAF50, #2E7D32)`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: "16px",
  zIndex: 1,
  color: "white",
  height: "150px",

  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'url("../assets/invitation_bg.png")',
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    opacity: 1,
    zIndex: 1,
  },
});

const GrayButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#f5f5f5",
  color: "#333",
  "&:hover": {
    backgroundColor: "#e0e0e0",
  },
  textTransform: "none",
  justifyContent: "center",
  padding: "8px 16px",
  width: "48%",
  borderRadius: "8px",
  fontSize: "14px",
}));

const StyledIconButton = styled(IconButton)({
  fontSize: "20px",
  color: "#757575",
});

const InvitationBonusComponent = () => {
  const navigate = useNavigate();
  const [isDataFetching, setIsDataFetching] = useState(true);
  const [eligibilityData, setEligibilityData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [claimedBonuses, setClaimedBonuses] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchEligibilityStatus = async () => {
    try {
      setIsDataFetching(true);
      const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
      const response = await axios.get(`${domain}/check-eligibility-status`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.data || !Array.isArray(response.data.bonusDetails)) {
        throw new Error("Invalid data format received from server");
      }
  
      const transformedData = {
        ...response.data,
        bonusDetails: response.data.bonusDetails.map((bonus, index) => ({
          ...bonus,
          displayLevel: bonus.displayLevel || (index + 1).toString(),
        })),
      };
  
      setEligibilityData(transformedData);
      setErrorMessage(null);
    } catch (error) {
      console.error("Error in fetchEligibilityStatus:", error);
      setErrorMessage(
        error.response?.data?.message ||
        "Unable to fetch eligibility status. Please try again."
      );
    } finally {
      setIsDataFetching(false);
    }
  };

  useEffect(() => {
    console.log("Component mounted - initiating data fetch");
    fetchEligibilityStatus();
  }, []);

  const handleBackClick = () => {
    console.log("Navigating back");
    navigate(-1);
  };
  const handleClaimBonus = async (level) => {
    try {
      const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
      const response = await axios.post(
        `${domain}/check-referral-bonus`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data) {
        // After successful claim, fetch updated data
        await fetchEligibilityStatus();
        // Show success message
        setSnackbar({
          open: true,
          message: "Bonus claimed successfully!",
          severity: "success",
        });
      } else {
        console.error("Failed to claim bonus");
        setSnackbar({
          open: true,
          message: "Failed to claim bonus. Please try again.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error claiming bonus:", error);
      setSnackbar({
        open: true,
        message: "An error occurred while claiming the bonus.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const getBonusStatus = (bonus) => {
    const { progress, achieved } = bonus;

    if (achieved) {
      return {
        text: "Already Claimed",
        disabled: true,
        color: "#e0e0e0",
      };
    }

    const hasRequiredReferrals =
      progress.referrals.total >= progress.referrals.required;
    const hasQualifyingDeposits =
      progress.referrals.qualifying >= progress.referrals.required;

    if (hasRequiredReferrals && hasQualifyingDeposits) {
      return {
        text: "Claim",
        disabled: false,
        color: "#4782ff",
      };
    }

    return {
      text: "Unfinished",
      disabled: true,
      color: "#e0e0e0",
    };
  };

  useEffect(() => {
    fetchEligibilityStatus();
  }, []);

  if (errorMessage) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error" gutterBottom>
          {errorMessage}
        </Typography>
        <Button
          variant="contained"
          onClick={fetchEligibilityStatus}
          sx={{ bgcolor: "#4782ff" }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (isDataFetching || !eligibilityData) {
    return (
      <Mobile>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography>Loading invitation bonus details...</Typography>
        </Box>
      </Mobile>
    );
  }

  return (
    <Mobile>
      <Box
        sx={{
          bgcolor: "#ffffff",
          minHeight: "100vh",
          maxWidth: "sm",
          mx: "auto",
        }}
      >
        <AppBar position="static" sx={{ bgcolor: "#4782ff" }}>
          <Toolbar>
            <Grid item xs={2} textAlign="left">
              <IconButton color="inherit" onClick={handleBackClick}>
                <ArrowBackIosOutlinedIcon sx={{ color: "white" }} />
              </IconButton>
            </Grid>
            <Typography
              variant="body1"
              sx={{ flexGrow: 1, fontWeight: "normal", fontSize: "18px" }}
            >
              Invitation Bonus
            </Typography>
          </Toolbar>
        </AppBar>

        <ImageBackground>
          <Box sx={{ position: "relative", zIndex: 2, textAlign: "left" }}>
            <Typography
              variant="h6"
              gutterBottom
              fontWeight="bold"
              sx={{ fontSize: "18px" }}
            >
              Invite friends and deposit
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "14px" }}>
              Both parties can receive rewards
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "14px" }}>
              Invite friends to register and recharge
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "14px" }}>
              to receive rewards
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, fontSize: "14px" }}>
              activity date:
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "14px", color: "white" }}
            >
              2024-05-03 - End date is not declared
            </Typography>
          </Box>
        </ImageBackground>

        <Box
          sx={{
            p: 1,
            margin: 5,
            display: "flex",
            justifyContent: "space-around",
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            marginTop: "-3%",
            zIndex: 10,
            position: "relative",
            gap: 2,
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Invitation Reward Rules */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: "50px",
                height: "50px",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src="/assets/inviterule-7c5f5524.svg"
                alt="Invitation Reward Rules"
                sx={{ width: "40px", height: "40px" }}
              />
            </Box>
            <Typography
              variant="body2"
              sx={{ color: "#333", fontWeight: "500" }}
            >
              Invitation reward rules
            </Typography>
          </Box>

          {/* Invitation Record */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: "50px",
                height: "50px",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src="/assets/inviterecord-83990d9a.svg"
                alt="Invitation Record"
                sx={{ width: "40px", height: "40px" }}
              />
            </Box>
            <Typography
              variant="body2"
              sx={{ color: "#333", fontWeight: "500" }}
            >
              Invitation record
            </Typography>
          </Box>
        </Box>

        <Box sx={{ px: 2 }}>
          {eligibilityData.bonusDetails.map((bonus, index) => {
            const bonusStatus = getBonusStatus(bonus);
            return (
              <Box key={index}>
                {/* Bonus and Close Button */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        bgcolor: "#4782ff",
                        color: "white",
                        mr: 1,
                        textTransform: "none",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        fontSize: "14px",
                        "&:hover": { bgcolor: "#0b4f12" },
                      }}
                    >
                      Bonus {bonus.displayLevel}
                    </Button>
                    <StyledIconButton size="small">
                      <CloseIcon fontSize="small" />
                    </StyledIconButton>
                  </Box>
                  <Typography
                    variant="h6"
                    color="#4782ff"
                    fontWeight="bold"
                    sx={{ fontSize: "16px" }}
                  >
                    ₹{bonus.bonusAmount.toFixed(2)}
                  </Typography>
                </Box>

                {/* Invitees and Recharge Info */}
                <Paper
                  elevation={1}
                  sx={{
                    bgcolor: "#ffffff",
                    p: 2,
                    borderRadius: "8px",
                    mb: 2,
                    color: "#333",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" color="#666">
                      Number of invitees
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" color="#333">
                      {bonus.level}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="#666">
                      Recharge per person
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="#4782ff"
                    >
                      ₹{bonus.minDepositAmount.toFixed(2)}
                    </Typography>
                  </Box>
                </Paper>

                {/* Progress Details */}
                <Paper
                  sx={{
                    bgcolor: "#f5f5f5",
                    color: "#333",
                    p: 2,
                    mb: 2,
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body1" sx={{ color: "#4782ff" }}>
                      {bonus.progress.referrals.total} /{" "}
                      {bonus.progress.referrals.required}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#4782ff" }}>
                      {bonus.progress.referrals.qualifying} /{" "}
                      {bonus.progress.referrals.required}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="caption" color="#666">
                      Number of invitees
                    </Typography>
                    <Typography variant="caption" color="#666">
                      Deposit number
                    </Typography>
                  </Box>
                </Paper>
                {/* Updated Claim/Unfinished Button */}
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleClaimBonus(bonus.displayLevel)}
                  disabled={bonusStatus.disabled}
                  sx={{
                    bgcolor: bonusStatus.color,
                    color: bonusStatus.disabled ? "#666" : "white",
                    "&:hover": {
                      bgcolor: bonusStatus.disabled ? "#d5d5d5" : "#0b4f12",
                    },
                    textTransform: "none",
                    borderRadius: "20px",
                    boxShadow: "none",
                    fontSize: "14px",
                    marginBottom: 4,
                  }}
                >
                  {bonusStatus.text}
                </Button>
                <Snackbar
                  open={snackbar.open}
                  autoHideDuration={6000}
                  onClose={handleCloseSnackbar}
                  anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                  <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                  >
                    {snackbar.message}
                  </Alert>
                </Snackbar>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Mobile>
  );
};

export default InvitationBonusComponent;
