"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { signIn, signOut, getProviders, useSession } from "next-auth/react";

const Nav = () => {
  const { data: session } = useSession(); 
  const [providers, setProviders] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);


  useEffect(() => {
    const setUpProviders = async () => {
      try {
        const response = await getProviders();
        setProviders(response);
      } catch (err) {
        setError('Failed to load providers.');
      } 
    };
    setUpProviders();
  }, []);

  return (
    <nav className="flex justify-between items-center w-full mb-16 pt-3">
      <Link href="/" className="flex gap-2 items-center">
        <Image
          src="/assets/images/logo.svg"
          alt="promptompia logo"
          width={30}
          height={30}
          className="object-contain"
        />
        <p className="logo_text">promptompia</p>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden sm:flex">
        { session?.user ? ( 
          <div className="flex gap-2">
            <Link href="/create-prompt" className="black_btn">
              Create Post
            </Link>
            <button
              className="outline_btn"
              type="button"
              onClick={signOut}
              aria-label="Sign out"
            >
              Sign Out
            </button>
            <Link href="/profile">
              <Image
               src={session?.user.image || "/default-profile.png"} // Fallback image
                alt="profile icon"
                width={37}
                height={37}
                className="rounded-full"
              />
            </Link>
          </div>
        ) : (
          providers && Object.values(providers).map((provider) => (
            <button
              type="button"
              key={provider.name}
              className="black_btn"
              onClick={() => signIn(provider.id)}
              aria-label={`Sign in with ${provider.name}`}
            >
              Sign In
            </button>
          ))
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="flex sm:hidden relative">
        {session?.user ? (
          <div className="flex">
            <Image
              src={session?.user.image }
              alt="profile icon"
              width={37}
              height={37}
              className="rounded-full cursor-pointer"
              onClick={() => setToggleDropdown((prev) => !prev)}
            />
            {toggleDropdown && (
              <div className="dropdown">
                <Link href="/profile" className="dropdown_link" onClick={() => setToggleDropdown(false)}>
                  My Profile
                </Link>
                <Link href="/create-prompt" className="dropdown_link" onClick={() => setToggleDropdown(false)}>
                  Create Prompt
                </Link>
                <button
                  className="black_btn mt-5 w-full"
                  type="button"
                  onClick={() => {
                    setToggleDropdown(false);
                    signOut();
                  }}
                  aria-label="Sign out"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          providers && Object.values(providers).map((provider) => (
            <button
              type="button"
              key={provider.name}
              className="black_btn"
              onClick={() => signIn(provider.id)}
              aria-label={`Sign in with ${provider.name}`}
            >
              Sign In
            </button>
          ))
        )}
      </div>
    </nav>
  );
};

export default Nav;
