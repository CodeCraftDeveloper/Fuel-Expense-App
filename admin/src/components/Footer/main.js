import React from "react";

export default function main() {
  return (
    <>
      <footer className="bg-body-tertiary text-center text-lg-start fixed-bottom shadow-lg">
        <div className="text-center p-3">
          © <b>{new Date().getFullYear()} </b>
          <a
            className="text-body"
            href="https://prempackaging.com/"
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "none" }}
          >
            Prem Industries India Limited
          </a>
        </div>
      </footer>
    </>
  );
}
