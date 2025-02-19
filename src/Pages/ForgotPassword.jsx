import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Container,
  InputAdornment,
  Select,
  MenuItem,
  Divider,
  IconButton,
  Drawer,
  Grid,
} from "@mui/material"
import {
  ArrowBackIosNew as ArrowBackIosNewIcon,
  Translate as TranslateIcon,
  Flag as FlagIcon,
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  SupportAgent as SupportAgentIcon,
} from "@mui/icons-material"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import SendToMobileIcon from "@mui/icons-material/SendToMobile"
import GppGoodIcon from "@mui/icons-material/GppGood"
import { useState } from "react"
import Mobile from "../Components/Mobile"
import { useNavigate } from "react-router-dom"
import ReactCountryFlag from "react-country-flag"

const ForgotPassword = () => {
  const navigate = useNavigate()
  // State to manage visibility for each password field
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmNewPassword: false,
  })
  const [openDrawer, setOpenDrawer] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("")

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language)
    setOpenDrawer(false)
  }

  const handleRedirect = () => {
    navigate("/")
  }

  // Toggle visibility for the new password field
  const toggleNewPasswordVisibility = () => {
    setShowPassword({
      ...showPassword,
      newPassword: !showPassword.newPassword,
    })
  }

  // Toggle visibility for the confirm new password field
  const toggleConfirmNewPasswordVisibility = () => {
    setShowPassword({
      ...showPassword,
      confirmNewPassword: !showPassword.confirmNewPassword,
    })
  }
  return (
    <Mobile>
       <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
          padding: "8px 16px",
          color: "black",
        }}
      >
        <Grid item xs={4} textAlign="left">
          <IconButton sx={{ color: "white" }} onClick={handleRedirect}>
            <ArrowBackIosNewIcon sx={{ fontSize: "20px" }} />
          </IconButton>
        </Grid>
        <Grid item xs={4} textAlign="center">
          <img
            src="assets/genzwinlogo.png"
            alt="logo"
            style={{ width: "120px", height: "40px" }}
          />
        </Grid>
        <Grid item xs={4} textAlign="right">
          <IconButton onClick={() => setOpenDrawer(true)} color="inherit">
            <TranslateIcon sx={{ color: "white" }} />
            {selectedLanguage && (
              <>
                {selectedLanguage === "EN" && (
                  <FlagIcon
                    component="span"
                    fontSize="small"
                    sx={{ marginLeft: "4px" }}
                  />
                )}
                {selectedLanguage === "HN" && (
                  <FlagIcon
                    component="span"
                    fontSize="small"
                    sx={{ marginLeft: "4px" }}
                  />
                )}
                <span>{selectedLanguage}</span>
              </>
            )}
          </IconButton>
        </Grid>
      </Grid>

      <Drawer
        anchor="bottom"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <Grid
          container
          justifyContent="space-around"
          alignItems="center"
          sx={{ padding: "10px" }}
        >
          <Button onClick={() => handleLanguageSelect("EN")}>
            <ReactCountryFlag countryCode="US" svg />
            EN
          </Button>
          <Button onClick={() => handleLanguageSelect("HN")}>
            <ReactCountryFlag countryCode="IN" svg />
            HN
          </Button>
        </Grid>
      </Drawer>

      <Box
        container
        justifyContent="flex-start"
        alignItems="flex-start"
        sx={{
          background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
          padding: "16px",
          color: "white",
          minHeight: "fit-content",
          textAlign: "left"
        }}
        direction="column"
      >
        <Typography variant="h5">Login</Typography>
        <Typography variant="subtitle2">
          Please login with your phone number or email
        </Typography>
      </Box>


      <Container
        disableGutters
        maxWidth="xs"
        sx={{
          bgcolor: "#f5f5f5",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ mx: 2, mt: 1 }}>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <SendToMobileIcon sx={{ color: "#4782ff" }} />
            <Typography variant="body1" sx={{ color: "#4782ff" }}>
              Phone reset
            </Typography>
          </Box>

          <Divider sx={{ bgcolor: "#4782ff", mb: 2 }} />

          <Box sx={{ display: "flex", mb: 1 }}>
            <SendToMobileIcon sx={{ color: "#4782ff", mr: 1 }} />
            <Typography variant="body2" sx={{ color: "black", fontSize: 17 }}>
              Phone number
            </Typography>
          </Box>

          <Box sx={{ display: "flex" }}>
            <TextField
              variant="outlined"
              value="+91"
              InputProps={{
                readOnly: true,
              }}
              sx={{
                width: "25%",
                bgcolor: "white",
                borderRadius: 4,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#f5f5f5",
                  },
                },
                "& ::placeholder": {
                  color: "gray",
                },
              }}
            />
            <TextField
              variant="outlined"
              placeholder="Please enter the phone number"
              sx={{
                width: "75%",
                marginLeft: "10px",
                bgcolor: "#fff",
                borderRadius: 4,
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#4782ff",
                  },
                  "&:hover fieldset": {
                    borderColor: "#fff",
                  },
                  "& fieldset": {
                    borderColor: "#fff",
                    border: "none",
                  },
                },
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1, mt: 3 }}>
            <LockIcon sx={{ mr: 1, color: "#4782ff" }} />
            <Typography variant="body2" sx={{ color: "black", fontSize: 17 }}>
              A new password
            </Typography>
          </Box>

          <TextField
            fullWidth
            variant="outlined"
            type={showPassword.newPassword ? "text" : "password"}
            placeholder="A new password"
            sx={{
              mb: 2,
              bgcolor: "#fff",
              borderRadius: 4,
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#4782ff",
                },
                "&:hover fieldset": {
                  borderColor: "#fff",
                },
                "& fieldset": {
                  borderColor: "#fff",
                  border: "none",
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  onClick={toggleNewPasswordVisibility}
                >
                  {showPassword.newPassword ? (
                    <VisibilityIcon />
                  ) : (
                    <VisibilityOffIcon />
                  )}
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", mb: 1, mt: 2 }}>
            <LockIcon sx={{ mr: 1, color: "#4782ff" }} />
            <Typography variant="body2" sx={{ color: "black", fontSize: 17 }}>
              Confirm new password
            </Typography>
          </Box>

          <TextField
            fullWidth
            variant="outlined"
            type={showPassword.confirmNewPassword ? "text" : "password"}
            placeholder="Confirm new password"
            sx={{
              mb: 2,
              bgcolor: "#fff",
              borderRadius: 4,
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#4782ff",
                },
                "&:hover fieldset": {
                  borderColor: "#fff",
                },
                "& fieldset": {
                  borderColor: "#fff",
                  border: "none",
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  onClick={toggleConfirmNewPasswordVisibility}
                >
                  {showPassword.confirmNewPassword ? (
                    <VisibilityIcon />
                  ) : (
                    <VisibilityOffIcon />
                  )}
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", mb: 1, mt: 2 }}>
            <GppGoodIcon sx={{ mr: 1, color: "#4782ff" }} />
            <Typography variant="body2" sx={{ color: "black", fontSize: 17 }}>
              Verification Code
            </Typography>
          </Box>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Please enter the confirmation code"
            sx={{
              mb: 2,
              bgcolor: "#fff",
              borderRadius: 4,
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#4782ff",
                },
                "&:hover fieldset": {
                  borderColor: "#fff",
                },
                "& fieldset": {
                  borderColor: "#fff",
                  border: "none",
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="contained"
                    size="medium"
                    sx={{
                      bgcolor: "#4782ff",
                      color: "white",
                      borderRadius: 50,
                      textTransform: "capitalize",
                      px: 4,
                      py: 1,
                    }}
                  >
                    Send
                  </Button>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: "flex", flexDirection: "column", mt: 3, gap: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    borderRadius: "50%",
                    width: 24,
                    height: 24,
                    ml: 2,
                    mr: 1,
                    color: "#4782ff", // Default color for the checkbox
                    "&.Mui-checked": {
                      color: "#4782ff", // Color when the checkbox is checked
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2">
                  I have read and agree{" "}
                  <span style={{ color: "red" }}>[Privacy Agreement]</span>
                </Typography>
              }
            />

            <Box
              sx={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="contained"
                sx={{
                  width: "60%",
                  bgcolor: "#4782ff",
                  color: "white",
                  textTransform: "capitalize",
                  borderRadius: 50,
                  "&:hover": { bgcolor: "#4782ff" },
                }}
              >
                Reset
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Mobile>
  )
}

export default ForgotPassword