import * as React from "react";
import { styled, Box, List, ListItem,ListItemAvatar, ListItemText, Avatar, IconButton, FormGroup, TextField, Button , Grid, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Person2Icon from '@mui/icons-material/Person2';

export default function UserListItem(props) {

    const handleDelete = async () => {
         
    }

  return (
    <ListItem
      // secondaryAction={
      //   <IconButton edge="end" aria-label="delete" onClick={handleDelete}>
      //     <DeleteIcon />
      //   </IconButton>   
      // }
    >
      <ListItemAvatar>
        <Avatar>
          <Person2Icon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={props.name}
        secondary={props.email}
      />
    </ListItem>
  );
}
