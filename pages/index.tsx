import * as React from "react";
import { Box, Divider, IconButton, List, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { AppBar } from "../src/components/AppBar";
import { Drawer } from "../src/components/Drawer";
import { GetServerSideProps, type InferGetServerSidePropsType } from "next";
import { MiddlewareUserKey } from "../src/constant";
import { prisma } from "../lib/prisma";
import { getMSLoginUrl } from "../lib/onenote";

export default function Index(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: "24px" // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" })
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1]
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">

        </List>
      </Drawer>
    </Box>
  );
}

type Props = {}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const user = ctx.req!.headers[MiddlewareUserKey] as string;

  const userE = await prisma
    .user
    .findFirst({ where: { name: user } });
  if (!userE) {
    const loginUri = await getMSLoginUrl();
    return {
      redirect: {
        destination: loginUri,
        permanent: false
      }
    };
  }

  return {
    props: {}
  };
};
