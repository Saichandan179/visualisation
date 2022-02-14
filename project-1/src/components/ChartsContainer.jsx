import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { makeStyles } from "@mui/styles";
import BarChart from "./Chart";
import Paper from "@mui/material/Paper";
import { DataColumns, mainData } from "../data";

const maxBars = 10;

const useStyles = makeStyles({
  label: {
    color: "black",
    paddingRight: "220px",
    marginBottom: "10px",
    marginRight: "150px"
  },
  select: {
    color: "black",
    width: "300px",
  },
  formGroup: {
    paddingTop: "30px",
    paddingLeft: "20px"
  },
  paper: {
    backgroundColor: "white",
    marginTop: "30px",
    padding: "20px",
  },
  gridContainer: {
    marginLeft: "60px !important",
  },
});

function sortObj(obj) {
  return Object.keys(obj)
    .sort()
    .reduce(function (result, key) {
      result[key] = obj[key];
      return result;
    }, {});
}

const getParamInfo = (param) => {
  for (let i = 0; i < DataColumns.length; i++) {
    if (DataColumns[i].name === param) return DataColumns[i];
  }
};

const getDataForParam = (param) => {
  let obj = {};
  const p = getParamInfo(param);
  const col = p.column;

  if (p.type === "numerical") {
    const bucket = (p.max - p.min) / maxBars;
    let mini = p.min;
    for (let i = 0; i < maxBars; i++) {
      obj[`${mini}-${mini + bucket}`] = 0;
      mini = mini + bucket;
    }
    mini = p.min;
    for (let i = 0; i < mainData.length; i++) {
      let val = Math.floor((mainData[i][col] - mini) / bucket);
      // console.log("")
      // console.log("mainData val: ", mainData[i][col], "mini: ", mini, "final val: ", val);
      // console.log(`${mini+bucket*val}-${mini+bucket*(val+1)}`);
      obj[`${mini + bucket * val}-${mini + bucket * (val + 1)}`] += 1;
    }

    // console.log("logging converted data", obj);
    return obj;
  }

  for (let i = 0; i < mainData.length; i++) {
    if (mainData[i][col] in obj) {
      obj[mainData[i][col]] += 1;
    } else {
      obj[mainData[i][col]] = 1;
    }
  }
  // console.log("loggin obj", obj);
  return sortObj(obj);
};

export default function ChartsContainer() {
  const [column, setColumn] = useState("Battery Power");
  const [tilt, setTilt] = useState(false);
  const [data, setData] = useState(getDataForParam("Battery Power"));
  const classes = useStyles();

  useEffect(() => {
    setData(getDataForParam(column));
  }, [column]);

  const handleChange = (event) => {
    setColumn(event.target.value);
    // setParam(event.target.value);
  };

  const handleSwitchChange = (event) => {
    setTilt(event.target.checked);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <Grid className={classes.gridContainer} container spacing={2}>
        <Grid style={{paddingTop: "110px"}} item xs={3}>
          <InputLabel className={classes.label}>Variable</InputLabel>
          <Select
            className={classes.select}
            value={column}
            label="Variable"
            onChange={handleChange}
          >
            {DataColumns.map((c) => (
              <MenuItem key={c.column} value={c.name}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
          <FormGroup className={classes.formGroup}>
            <FormControlLabel
              control={<Switch onChange={handleSwitchChange} />}
              label="Tilt Right"
            />
          </FormGroup>
        </Grid>
        <Grid item xs={9}>
          <Paper elevation={0} className={classes.paper}>
            <BarChart
              width={600}
              height={700}
              data={data}
              tilt={tilt}
              labels={{ title: column, xLabel: getParamInfo(column).label }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
