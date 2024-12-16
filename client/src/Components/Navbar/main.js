import React from "react";
import Logo from "../Images/logo.png";

export default function main() {
  return (
    <>
      <nav className="navbar bg-light shadow-lg">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <img src={Logo} alt="" width="110" height="80" />
          </a>
        </div>
      </nav>
    </>
  );
}
