// ** MUI Imports
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

// ** Icons Imports
import Menu from "mdi-material-ui/Menu";

// ** Type Import
import { Settings } from "src/@core/context/settingsContext";

// ** Components
import ModeToggler from "src/@core/layouts/components/shared-components/ModeToggler";

interface Props {
  hidden: boolean;
  settings: Settings;
  toggleNavVisibility: () => void;
  saveSettings: (values: Settings) => void;
}

const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props;

  return (
    <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Box className="actions-left" sx={{ mr: 2, display: "flex", alignItems: "center" }}>
        {hidden ? (
          <IconButton
            color="inherit"
            onClick={toggleNavVisibility}
            sx={{ ml: -2.75 }}
          >
            <Menu />
          </IconButton>
        ) : null}
      </Box>
      <Box className="actions-right" sx={{ display: "flex", alignItems: "center" }}>
        <ModeToggler settings={settings} saveSettings={saveSettings} />
      </Box>
    </Box>
  );
};

export default AppBarContent;
