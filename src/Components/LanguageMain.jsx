import {
    Box,
    Container,
    FormControlLabel,
    List,
    ListItem,
    Radio,
    RadioGroup,
    Typography,
  } from "@mui/material";
  import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
  import FlagIcon from "@mui/icons-material/Flag";
  import { useTranslation } from "react-i18next";
  import { useNavigate } from "react-router-dom";
  import Mobile from "./Mobile";
  
  const LanguageMain = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
  
    const handleChange = (event) => {
      i18n.changeLanguage(event.target.value);
    };
  
    return (
      <Mobile>
        <Container
          disableGutters
          maxWidth="xs"
          sx={{
            bgcolor: "#380003",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              bgcolor: "#a50000",
              padding: "8px 10px",
              display: "flex",
              alignItems: "center",
              color: "#e4911d",
            }}
          >
            <ChevronLeftIcon
              sx={{ fontSize: 30, cursor: "pointer" }}
              onClick={() => navigate(-1)}
            />
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#e4911d",
              }}
            >
              {t("language")}
            </Typography>
          </Box>
  
          <RadioGroup
            value={i18n.language}
            onChange={handleChange}
            aria-labelledby="language-select"
          >
            <List sx={{ borderRadius: "4px", p: 2 }}>
              <ListItem
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  mb: 1,
                  p: 1,
                  bgcolor: i18n.language === "en" ? "#e4911d" : "#720811", // Change background if selected
                  display: "flex",
                  justifyContent: "space-between", // Align items to the right
                  alignItems: "center",
                  color: "#fff",
                }}
              >
                <FormControlLabel
                  value="en"
                  control={<Radio />}
                  label={t("english")}
                  sx={{ width: "100%", textAlign: "right" }} // Align label to the right
                />
                <FlagIcon sx={{ ml: 1 }} />
              </ListItem>
              <ListItem
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  mb: 1,
                  p: 1,
                  bgcolor: i18n.language === "hi" ? "#e4911d" : "#720811", // Change background if selected
                  display: "flex",
                  justifyContent: "space-between", // Align items to the right
                  alignItems: "center",
                  color: "#fff",
                }}
              >
                <FormControlLabel
                  value="hi"
                  control={<Radio />}
                  label={t("hindi")}
                  sx={{ width: "100%", textAlign: "right" }} // Align label to the right
                />
                <FlagIcon sx={{ ml: 1 }} />
              </ListItem>
            </List>
          </RadioGroup>
        </Container>
      </Mobile>
    );
  };
  
  export default LanguageMain;
  