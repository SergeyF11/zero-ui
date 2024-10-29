import { useState } from "react";

import {
  Box,
  Divider,
  Grid,
  List,
  Typography,
  TextField,
  IconButton,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

import DataTable from "react-data-table-component";

import { validateIP, normilizeIP, validateCIDR } from "utils/IP";

function isValidDomain(domain) { 
    return /^[^A-Z0-9-.]([a-z0-9-]{0,60})+$/.test(domain);
} 

function CustomDNS({ dns, handleChange }){
  const [domain, setDomain] = useState("");
  const [newServer, setServer] = useState("");


  const handleDomainInput = (event) => {
    let newDomain=event.target.value;
    if ( newDomain == "" || isValidDomain( newDomain)){
      dns["domain"]=newDomain;
      handleChange("config", "dns", "custom", dns)(null);
      setDomain("");
    } else {
      return
    }
  };

  const handleServerInput = (event) => {
    setServer(event.target.value);
  };
  

  const addServerReq = () => {
    
    if (newServer && validateIP(newServer)) {
      let server = normilizeIP(newServer);
      let newDNS={"domain": dns.domain, "servers": [...dns.servers]};
      newDNS.servers.push(server);
      handleChange("config", "dns", "custom", newDNS)(null);
      setServer("");
    } else {
      return;
    }
 };

/*  const removeServerReqS = (delServer) => {
    let newDNS={ "domain": dns.domain, "servers": []};
    dns.servers.forEach(function(s){
      if (delServer != s){
        newDNS.servers.push(s);
      }
    })
    handleChange("config", "dns", "custom", newDNS)(null);
  //  setServer("");
  };*/

  const removeServerReqI = (index) => {
    let newDNS=dns;
    newDNS.servers.splice(index, 1);
    handleChange("config", "dns", "custom", newDNS)(null);
  //  setServer("");
  };
  const columnsServers = [

    {
      id: "remove",
      width: "10px",
      cell: (row, index) => (
        <IconButton
          size="small"
          color="secondary"
//          onClick={() => removeServerReq(row)}
          onClick={() => removeServerReqI(index)}
        >
          <DeleteOutlineIcon style={{ fontSize: 14 }} />
        </IconButton>
      ),
    },
    {
      id: "server",
      name: "Servers",
      cell: (row ) => row,
    },
  ];

  return (
    <>
      <Typography style={{ paddingBottom: "10px" }}>
        DNS 
      </Typography>

      <Box border={1} borderColor="grey.300">
            <TextField
              label="Search Domain"
              value={dns.domain}
              onChange={handleDomainInput}
              placeholder={"local"}
              variant="filled"
            />
        <Grid item style={{ margin: "10px" }}>
          <DataTable noHeader={true} columns={columnsServers} data={dns.servers} />
          <List
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <TextField
              label="Add server"
              id="newServer"
              value={newServer}
              onChange={handleServerInput}
              placeholder={"server ip"}
            />
            <IconButton size="small" color="primary" onClick={addServerReq}>
              <AddIcon
                style={{
                  fontSize: 16,
                }}
              />
            </IconButton>
          </List>

        </Grid>
      </Box>
    </>
  );
}

export default CustomDNS;
