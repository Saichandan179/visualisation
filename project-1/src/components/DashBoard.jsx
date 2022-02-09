import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import ChartsContainer from "./ChartsContainer";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ScatterPlot from "./ScatterPlot";
import { makeStyles } from "@mui/styles";
import { DataColumns } from "../data";

const useStyles = makeStyles({
  Button: {
    width: "900px",
  },
});

export default function DashBoard() {
  const [open, setOpen] = useState(false);
  const [param1, setParam1] = useState(DataColumns[0].name);
  const [param2, setParam2] = useState(DataColumns[1].name);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    console.log("logging params");
    console.log(param1);
    console.log(param2);
  }, [param1, param2]);

  const classes = useStyles();
  return (
    <Grid className="GridWrap" container spacing={2}>
      <Grid className="GridComp" item xs={6}>
        <ChartsContainer param={param1} setParam={setParam1} />
      </Grid>
      <Grid className="GridComp" item xs={6}>
        <ChartsContainer param={param2} setParam={setParam2} />
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <Button
            className={classes.Button}
            variant="contained"
            onClick={handleClickOpen}
          >
            Scatter Plot
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{"Scatter Plot Title"}</DialogTitle>
            <DialogContent>
              <ScatterPlot width={800} height={600} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </Grid>
  );
}

// import React, { useState } from "react";
// import Grid from "@mui/material/Grid";
// import ChartsContainer from "./ChartsContainer";

// export default function BasicGrid() {
//   return (
//     <Grid className="GridWrap" container spacing={2}>
//       <Grid className="GridComp" item xs={6}>
//         <ChartsContainer />
//         <ChartsContainer />
//       </Grid>
//       <Grid className="GridComp" item xs={6}>

//       </Grid>
//     </Grid>
//   );
// }
