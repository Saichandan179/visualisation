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
import { DataColumns, mainData } from "../data";

const useStyles = makeStyles({
  Button: {
    width: "900px",
    textTransform: "capitalize !important",
  },
});

const getParamInfo = (param) => {
  for (let i = 0; i < DataColumns.length; i++) {
    if (DataColumns[i].name === param) return DataColumns[i];
  }
};

function compare(a, b) {
  if (a.x < b.x) {
    return -1;
  }
  if (a.x > b.x) {
    return 1;
  }
  return 0;
}

const getScatterPlotData = (var1, var2) => {
  let data = [];
  const col1 = getParamInfo(var1);
  const col2 = getParamInfo(var2);

  if (col1.type == "categorical" && col2.type == "categorical") {
    for (let i = 0; i < mainData.length; i++) {
      let found = false;
      for (let j = 0; j < data.length; j++) {
        if (
          data[j].x === mainData[i][col1.column] &&
          data[j].y === mainData[i][col2.column]
        ) {
          data[j].z += 1;
          found = true;
        }
      }
      if (!found) {
        data.push({
          x: mainData[i][col1.column],
          y: mainData[i][col2.column],
          z: 1,
        });
      }
    }
  } else {
    for (let i = 0; i < mainData.length; i++) {
      data.push({
        x: mainData[i][col1.column],
        y: mainData[i][col2.column],
        z: 1,
      });
    }
  }

  data.sort(compare);
  return data;
  // 
  // console.log("scatter data for categorical vars",data);
};

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
    // console.log("logging params");
    // console.log(param1);
    // console.log(param2);
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
            Scatter Plot - {param1} v/s {param2}
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{"Scatter Plot Title"}</DialogTitle>
            <DialogContent>
              <ScatterPlot
                width={800}
                height={600}
                data={getScatterPlotData(param1, param2)}
                dataType={{
                  var1: getParamInfo(param1).type,
                  var2: getParamInfo(param2).type,
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color={"error"}>
                Close
              </Button>
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
