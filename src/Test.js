import React from "react";
import { Menu, Image, Grid3X3, Copyright } from "lucide-react";

export default function TestIcons() {
  return (
    <div style={{ display: "flex", gap: "20px", fontSize: "24px" }}>
      <Menu />
      <Image />
      <Grid3X3 />
      <Copyright />
    </div>
  );
}
