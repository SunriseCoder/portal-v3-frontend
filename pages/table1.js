import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";

//----------table components-------
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

//-----------radio button-------------
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RecordingOperation from "../components/RecordingOperation";

//----------fetch apis-------------
import axios from 'axios'
import { useQuery } from "@tanstack/react-query";

import Map from "../utils/map";

const fetchEventData = () => {
  // TODO: Move API URL to .env file
  //console.log('API url from .env: ', process.env.BACKEND_API_URL);
  //return axios.get(process.env.BACKEND_API_URL + "/events/complex");
  return axios.get("http://localhost:8000/api/events/complex");
}

export default function Table1() {
  const [data, setData] = useState(null);
  
  const updateMaps = (response) => {
    var data = response.data;
    var maps = {};

    // Event Operation Type Groups
    maps.eventOperationTypeGroups = new Map(data.eventOperationTypeGroups);

    // Event Operation Types
    maps.eventOperationTypes = new Map(data.eventOperationTypes);
    maps.eventOperationTypeGroups.addChildren(maps.eventOperationTypes.getAll(), 'groupId');

    // Events
    maps.events = new Map(data.events);
    // TODO: .sort((a, b) => (a.startDate > b.startDate ? 1 : -1))

    // Activity Operation Type Groups
    maps.activityOperationTypeGroups = new Map(data.activityOperationTypeGroups);

    // Activity Operation Types
    maps.activityOperationTypes = new Map(data.activityOperationTypes);
    maps.activityOperationTypeGroups.addChildren(maps.activityOperationTypes.getAll(), 'groupId');

    // Activity Operation Languages
    maps.activityOperationLanguages = new Map(data.activityOperationLanguages);

    // Activity Column Size
    maps.activityColumnSize = 0;
    maps.activityOperationTypeGroups.getAll().forEach(typeGroup => {
      maps.activityColumnSize += typeGroup.isLanguageDependent
          ? maps.activityOperationLanguages.size() * typeGroup.childrenSize
          : typeGroup.childrenSize;
    });

    // Language-dependent Activity Operation Types Size
    maps.languageDependentActivityOperationTypeSize = 0;
    maps.activityOperationTypeGroups.getAll().forEach(typeGroup => {
      if (typeGroup.isLanguageDependent) {
        maps.languageDependentActivityOperationTypeSize += typeGroup.childrenSize;
      }
    });

    setData(maps);
  }

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [eventDetailsForm, setEventDetailsForm] = useState({
    name: "",
    startDate: null,
    recordings: {},
  });
  const [recordingStatus, setRecordingStatus] = React.useState({
    Prepare: "",
    Record: "",
    Collect: "",
    Create: "",
  });

  const { data:apiData } = useQuery(['fetchPlanData'], fetchEventData, {
    onSuccess: (response) => {
      updateMaps(response);
    },
  })

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSt = (name, value) => {
    setRecordingStatus({ ...recordingStatus, [name]: value });
    setEventDetailsForm({
      ...eventDetailsForm,
      recordings: { ...recordingStatus, [name]: value },
    });
  };

  const handleEventDetails = (eve) => {
    setEventDetailsForm({
      name: eve.name,
      startDate: eve.startDate,
    });
    setDrawerOpen(true);
  };

  return (
    <Box>
      <Typography
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          borderBottom: "1px solid gray",
          padding: 5,
        }}
      >
        Portal V3
      </Typography>

      <Box sx={{ display: "flex", position: "relative" }}>

        {/* ---------------left side---------------------- */}
        <TableContainer
          component={Paper}
          minHeight={"100vh"}
          sx={{ overflow: "auto", maxHeight: 500 }}
        >
          {data && <Table aria-label="sticky table" dense size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell colSpan={5 + data.eventOperationTypes.size()}>Events</TableCell>
                <TableCell colSpan={data.activityColumnSize}>Activities</TableCell>
              </TableRow>
              <TableRow>
                <TableCell rowSpan={3}>ID</TableCell>
                <TableCell rowSpan={3}>Name</TableCell>
                <TableCell rowSpan={3}>Type</TableCell>
                <TableCell rowSpan={3}>Start</TableCell>
                <TableCell rowSpan={3}>End</TableCell>
                
                { // Event Operation Type Groups
                data.eventOperationTypeGroups.getAll().map((typeGroup, typeGroupIndex) => {
                  return (
                    <TableCell colSpan={typeGroup.childrenSize} rowSpan={2}>{typeGroup.name}</TableCell>
                  );
                })}

                { // Activity Operation Type Groups
                data.activityOperationTypeGroups.getAll().map((typeGroup, typeGroupIndex) => {
                  return (
                    <TableCell
                      colSpan={typeGroup.isLanguageDependent
                        ? typeGroup.childrenSize * data.activityOperationLanguages.size()
                        : typeGroup.childrenSize
                      }
                      rowSpan={typeGroup.isLanguageDependent ? 1 : 2}
                      >{typeGroup.name}</TableCell>
                  );
                })}
              </TableRow>
              <TableRow>
                { // Activity Operation Languages
                data.activityOperationLanguages.getAll().map((language, languageIndex) => {
                  return (
                    <TableCell colSpan={data.languageDependentActivityOperationTypeSize}>
                      {language.name}
                    </TableCell>
                  );
                })}
              </TableRow>
              <TableRow>
                { // Event Operation Types
                data.eventOperationTypes.getAll().map((type, typeIndex) => {
                  return (
                    <TableCell>{type.name}</TableCell>
                  );
                })}

                { // Activity Operation Types
                  data.activityOperationTypeGroups.getAll().map((typeGroup, typeGroupIndex) => {
                    if (typeGroup.isLanguageDependent) {
                      return data.activityOperationLanguages.getAll().map((language, languageIndex) => {
                        return typeGroup.children.map((type, typeIndex) => {
                          return (<TableCell>{type.name}</TableCell>);
                        });
                      });
                    } else {
                      return typeGroup.children.map((type, typeIndex) => {
                        return (<TableCell>{type.name}</TableCell>);
                      });
                    }
                  })
                }
              </TableRow>
            </TableHead>

            <TableBody>
              {data.events.getAll().map((eve, eveIndex) => {
                  return (
                    <TableRow
                      key={"event-" + eve.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      onClick={() => handleEventDetails(eve)}
                    >
                      <TableCell>{eve.id}</TableCell>
                      <TableCell>{eve.name}</TableCell>
                      <TableCell>
                        {eve.typeId === 1 ? "FESTIVAL" : "CONFERENCE"}
                      </TableCell>
                      <TableCell>{eve.startDate} </TableCell>
                      <TableCell>{eve.endDate}</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell>3</TableCell>
                      <TableCell>4</TableCell>
                      <TableCell>5</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>}
        </TableContainer>

        {/* -----------------right side------------------ */}
        {drawerOpen && (
          <Box
            sx={{
              borderLeft: "1px solid gray",
              padding: 5,
              position: "sticky",
              top: 0,
              background: "#f1faee",
            }}
            minWidth={"40%"}
            height={'100vh'}
          >
            {/* -----------close button------------ */}
            <Box
              onClick={() => setDrawerOpen(false)}
              sx={{
                border: "3px double gray",
                borderRadius: 10,
                padding: "1rem",
                height: 20,
                width: 20,
                textAlign: "center",
                cursor: "pointer",
                position: "absolute",
                top: "40vh",
                left: -20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "white",
              }}
            >
              <Typography
                sx={{ fontSize: "1.1rem", fontWeight: "bold", color: "gray" }}
              >
                X
              </Typography>
            </Box>

            <Typography sx={{ fontSize: "1.2rem", fontWeight: "bolder" }}>
              {eventDetailsForm.name}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.9rem",
                color: "gray",
                borderBottom: "1px solid gray",
                paddingBottom: 2,
              }}
            >
              {eventDetailsForm.startDate}
            </Typography>

            <Box>
              <Typography
                sx={{
                  background: "#ffb703",
                  color: "white",
                  padding: 1,
                  marginY: 2,
                  fontweight: "Bold",
                }}
              >
                RECORDINGS
              </Typography>

              {operations?.map((op, i) => {
                return (
                  <RecordingOperation
                    key={"op" + i}
                    name={op.name}
                    output={handleSt}
                  />
                );
              })}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
