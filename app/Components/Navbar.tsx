"use client";

import React from "react";
import { HiMenuAlt1 } from "react-icons/hi";
import Link from "next/link";
import { signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.log("Error signing in:", err);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.log("Error signing out:", err);
    }
  };

  const menuItems = (
    <>
      <li className="p-2">
        <Link href="/">Home</Link>
      </li>
      <li className="p-2">
        <Link href="/image-upload">Upload</Link>
      </li>
      <li className="p-2">
        <Link href="/profile">Profile</Link>
      </li>
      <li className="p-2">
        {user ? (
          <button
            onClick={signOut}
            className="btn flex items-center justify-center bg-gray-900 rounded-full w-32 text-white hover:text-gray-900"
          >
            Sign Out
          </button>
        ) : (
          <button
            onClick={signInWithGoogle}
            className="flex items-center justify-center bg-gray-900 rounded-full w-32 text-white hover:text-gray-900"
          >
            Sign In
          </button>
        )}
      </li>
    </>
  );

  return (
    <div>
      <div className="navbar px-16">
        <div className="flex-1">
          <Link href="/" className=" text-6xl font-whisper">AnimalLens</Link>
        </div>
        <div className="flex-none">
          {user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle "
              >
                <div className="w-auto rounded-full btn bg-[#FEFAF8]">
                  <img
                    alt="User Avatar"
                    src={user.photoURL || "/default-avatar.png"}
                    className="h-8 w-8 rounded-full"
                  />
                  <span>{user.displayName}</span>
               
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                {menuItems}
              </ul>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="px-6 py-2 bg-gray-900 text-white rounded-full"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
      {/* Horizontal line */}
      <div className="lg:px-16">
        <hr className="border-gray-900 h-3" />
      </div>
    </div>
  );
}
