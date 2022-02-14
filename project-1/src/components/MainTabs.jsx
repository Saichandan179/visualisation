import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ChartsContainer from "./ChartsContainer";
import ScatterPlot from "./ScatterPlot";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { makeStyles } from "@mui/styles";
import { DataColumns, mainData } from "../data";

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
  },
  formControl: {
    marginTop: "30px !important"
  },
  tab: {
    padding: "20px",
    marginRight: "90px"
  }
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box style={{backgroundColor: "white"}} sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

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
  if (a.x === b.x){
    if(a.y < b.y) {
      return -1;
    }
    if(a.y > b.y) {
      return 1;
    }
    return 0;
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
  console.log("sorted data", data);
  return data;
};

export default function MainTabs() {
  const [value, setValue] = React.useState(0);
  const [checked, setChecked] = React.useState("X");
  const [column, setColumn] = React.useState("Battery Power");
  const [param1, setParam1] = React.useState("Battery Power");
  const [param2, setParam2] = React.useState("Battery Power");
  const classes = useStyles();

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSelectChange = (event) => {
    setColumn(event.target.value);
    if(checked === "X"){
      setParam1(event.target.value);
    } else {
      setParam2(event.target.value);
    }
  };

  const handleRadioChange = (event) => {
    setChecked(event.target.value);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleTabChange}
          centered
        >
          <Tab label="Bar Chart/Histogram" {...a11yProps(0)} />
          <Tab label="ScatterPlot" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <ChartsContainer />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Grid style={{padding: "30px 0 0 30px"}} container spacing={2}>
          <Grid className="GridComp" style={{padding: "80px 20px 20px 70px"}} item xs={3}>
            <InputLabel className={classes.label}>Variable</InputLabel>
            <Select
              className={classes.select}
              value={column}
              // input={<OutlinedInput label="Name" />}
              onChange={handleSelectChange}
            >
              {DataColumns.map((c) => (
                <MenuItem key={c.column} value={c.name}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
            <FormControl style={{margin: "40px 100px 0 0"}} className={classes.formControl}>
              <FormLabel >Select Attribute For</FormLabel>
              <RadioGroup
                onChange={handleRadioChange}
                defaultValue="X"
                row
              >
                <FormControlLabel value="X" control={<Radio />} label="X" />
                <FormControlLabel value="Y" control={<Radio />} label="Y" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid className="GridComp" item xs={9}>
            <div
              className="ChartTitle"
              style={{ marginBottom: "30px", marginTop: "10px" }}
            >
              {param2} v/s {param1}
            </div>
            <ScatterPlot
              width={900}
              height={600}
              data={getScatterPlotData(param1, param2)}
              dataType={{
                var1: getParamInfo(param1).type,
                var2: getParamInfo(param2).type,
                var1Label: getParamInfo(param1).label,
                var2Label: getParamInfo(param2).label
              }}
            />
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
}
