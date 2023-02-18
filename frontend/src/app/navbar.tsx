"use client";

import React, { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { Burger } from "@mantine/core";

import { useSupabase } from "../components/supabase-provider";
import { classnames } from "../utils/utils";

const loaderProp = ({ src }) => {
  return src;
};

const StandardLink = ({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick?: () => void;
  children: React.ReactNode;
}) => {
  return (
    <div className="hidden md:flex items-center text-base text-gray-300 hover:text-gray-100 font-thin mr-4">
      <Link href={href} onClick={onClick}>
        {children}
      </Link>
    </div>
  );
};

const MobileLink = ({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick?: () => void;
  children: React.ReactNode;
}) => {
  return (
    <Link href={href} className="w-full text-center" onClick={onClick}>
      {children}
    </Link>
  );
};

const Navbar = () => {
  const { supabase, session, loggedIn } = useSupabase();

  // console.log("Session", session);
  // console.log("Logged In", loggedIn);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    // if (error) console.log("Error logging out:", error.message);
  };

  const [toggle, setToggle] = useState(false);

  return (
    <div
      className="w-full flex flex-col shadow-md text-gray-100"
      style={{ backgroundColor: "#343A40" }}
    >
      <div className="body-font sticky top-0 z-50 px-4 py-3 flex">
        <Link href="/" className="flex items-center gap-2 text-xl font-thin mr-8">
          <Image
            src="/favicon.ico"
            alt="logo"
            width={30}
            height={30}
            loader={loaderProp}
            unoptimized
          />
          Shareboard
        </Link>
        {loggedIn && <StandardLink href={"/dashboard"}>Dashboard</StandardLink>}
        <div className="flex-grow" />
        {loggedIn ? (
          <StandardLink href={"/"} onClick={handleLogout}>
            Logout
          </StandardLink>
        ) : (
          <StandardLink href={"/auth"}>Login</StandardLink>
        )}
        <div className="md:hidden flex ml-auto items-center">
          <Burger
            opened={toggle}
            onClick={() => setToggle(!toggle)}
            color="white"
            className="w-6 h-6"
          />
        </div>
      </div>
      <div
        className={classnames(
          "pt-0 border-t-[1px] border-gray-500 w-full flex flex-col gap-2",
          "md:hidden", // Hide on desktop
          !toggle && "hidden"
        )}
      >
        <div className="h-2" />
        {loggedIn && (
          <MobileLink href="/dashboard" onClick={() => setToggle(false)}>
            Dashboard
          </MobileLink>
        )}
        {loggedIn ? (
          <MobileLink
            href={"/"}
            onClick={() => {
              setToggle(false);
              handleLogout();
            }}
          >
            Logout
          </MobileLink>
        ) : (
          <MobileLink href={"/auth"} onClick={() => setToggle(false)}>
            Login
          </MobileLink>
        )}
        <div className="h-2" />
      </div>
    </div>
  );
};

export default Navbar;
