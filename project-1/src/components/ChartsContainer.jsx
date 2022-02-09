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

// let data = {
//   FACEBOOK: 3000,
//   GITHUB: 4400,
//   GOOGLE: 6400,
//   TWITTER: 1700,
//   WEIBO: 1900,
//   NEW: 1000,
//   RANDOM: 500,
//   OTHER: 9000,
// };

const useStyles = makeStyles({
  label: {
    color: "black",
    paddingRight: "220px",
  },
  select: {
    color: "black",
    width: "300px",
  },
  formGroup: {
    paddingTop: "30px",
  },
  paper: {
    backgroundColor: "#d5deec",
    marginTop: "30px",
    padding: "20px",
  },
  gridContainer: {
    marginLeft: "40px",
  },
});

const getParamColumn = (param) => {
  for(let i = 0; i < DataColumns.length; i++){
    if(DataColumns[i].name === param) return DataColumns[i].column;
  }
}
const getDataForParam = (param) => {
  let obj = {};
  const col = getParamColumn(param);
  for(let i = 0; i < mainData.length; i++){
    if(mainData[i][col] in obj){
      obj[mainData[i][col]] += 1;
    } else {
      obj[mainData[i][col]] = 1;
    }
  }

  console.log("loggin obj", obj);
  return obj;
};

export default function ChartsContainer({ param, setParam }) {
  const [column, setColumn] = useState(param);
  const [tilt, setTilt] = useState(false);
  const [data, setData] = useState(getDataForParam(param));
  const classes = useStyles();

  useEffect(() => {
    setData(getDataForParam(param));
  },[param]);

  const handleChange = (event) => {
    setColumn(event.target.value);
    setParam(event.target.value);
  };

  const handleSwitchChange = (event) => {
    setTilt(event.target.checked);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <Grid className={classes.gridContainer} container spacing={2}>
        <Grid item xs={6}>
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
        </Grid>
        <Grid item xs={6}>
          <FormGroup className={classes.formGroup}>
            <FormControlLabel
              control={<Switch onChange={handleSwitchChange} />}
              label="Tilt Right"
            />
          </FormGroup>
        </Grid>
      </Grid>
      <Paper elevation={0} className={classes.paper}>
        <BarChart width={400} height={400} data={data} tilt={tilt} />
      </Paper>
    </Box>
  );
}
