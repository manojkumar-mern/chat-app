import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Outlet />
    </div>
  );
}
