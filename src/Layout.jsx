// import { Box } from "@mui/material";
// import { Outlet } from "react-router-dom";
// import NavBar from "./components/navBar";
// import AppBar from "./components/appBar";
// import { useState } from "react";

// export default function Layout() {
//   const [collapsed, setCollapsed] = useState(false);
  
//   return (
//     <Box sx={{ display: "flex",
//               //  position: "fixed" 
//         }}
//       >

//       <NavBar collapsed={collapsed}  />

//       <Box
//         sx={{
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//                    position: "sticky",
//           marginLeft: collapsed ? "70px" : "242px",
//           width: collapsed
//             ? "calc(100% - 70px)"
//             : "calc(100% - 242px)",
//           transition: "all 0.3s ease",
//           minwidth: collapsed
//             ? "calc(100% - 70px)"
//             : "calc(100% - 242px)",
//           transition: "all 0.3s ease",
//         }}
//       >

//         <AppBar collapsed={collapsed} setCollapsed={setCollapsed} />

//         <Box sx={{ p: 3 }}>
//           <Outlet />
//         </Box>

//       </Box>

//     </Box>
//   );
// }




import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import NavBar from "./components/navBar";
import AppBar from "./components/appBar";

export default function Layout() {
  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <NavBar />

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh" }}>
        <AppBar />
        <Box sx={{ flex: 1, overflowY: "auto", p: 0 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}