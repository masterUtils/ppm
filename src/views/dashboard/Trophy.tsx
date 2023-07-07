// ** MUI Imports
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

const Trophy = () => {
  // ** Hook
  return (
    <Card sx={{ position: "relative" }}>
      <CardContent>
        <Typography variant="h6">解题</Typography>
        <Typography variant="h5" sx={{ mt: 4, color: "primary.main" }}>
          $42.8k
        </Typography>
        <Typography variant="body2" sx={{ mb: 4, letterSpacing: "0.25px" }}>
          Best seller of the month
        </Typography>
        <Button size="small" variant="contained">
          解决新题
        </Button>
      </CardContent>
    </Card>
  );
};

export default Trophy;
