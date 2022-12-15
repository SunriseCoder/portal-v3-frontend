import React, { useState } from "react";
import { eventData } from "../utils/eventData";
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

export default function Table1() {
  const [events, setEvents] = useState(eventData?.events);
  const [operations, setOperations] = useState(eventData?.eventOperationTypes);
  const [operationStatus, setOperationStatus] = useState(
    eventData?.eventOperationStatuses
  );
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
  console.log(eventDetailsForm);
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
          sx={{ overflow: "auto" }}
        >
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Starts on</TableCell>
                <TableCell>Ends on</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {events
                // .sort((a, b) => (a.startDate > b.startDate ? 1 : -1))
                .map((eve, eveIndex) => {
                  return (
                    <TableRow
                      key={"event" + eveIndex}
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
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
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
            height={500}
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

              {operations.map((op, i) => {
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
