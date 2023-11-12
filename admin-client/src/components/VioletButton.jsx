import {
  createTheme,
  ThemeProvider,
  alpha,
  getContrastRatio,
} from '@mui/material/styles';
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";

// Update the Button's color options to include a violet option

const violetBase = '#7F00FF';
const violetMain = alpha(violetBase, 0.7);

const theme = createTheme({
palette: {
  violet: {
    main: violetMain,
    light: alpha(violetBase, 0.5),
    dark: alpha(violetBase, 0.9),
    contrastText: getContrastRatio(violetMain, '#fff') > 4.5 ? '#fff' : '#111',
  },
},
});

function VioletButton(props){
  const navigate = useNavigate()
  return <div>
    <ThemeProvider theme={theme}>
    <Button
    color="violet"
        size={"large"}
        variant={"contained"}
        onClick={() => {
            navigate(props.link)
            console.log(props.link)
        }}
    >{props.text}</Button>
  </ThemeProvider>
  </div>
  
}

export default VioletButton;