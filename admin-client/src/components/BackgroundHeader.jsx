import { Typography} from "@mui/material";

function BackgroundHeader(props) {
  return <div style={{height: 220, background: "#212121", top: 0, width: "100vw", zIndex: 0, marginBottom: -250}}>
      <div style={{ height: 220, display: "flex", justifyContent: "center", flexDirection: "column"}}>
          <div>
              <Typography style={{color: "white", fontWeight: 700}} variant="h3" textAlign={"center"}>
              {props.text}
              </Typography>
          </div>
      </div>
  </div>
}

export default BackgroundHeader;