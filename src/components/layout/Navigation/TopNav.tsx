"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MapPin,
  Phone,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

const navigationItems = [
  { name: "Home", href: "/" },
  {
    name: "Patient Resources",
    href: "",
    dropdown: [
      { name: "Before and After", href: "/patient-resources/before-after" },
      {
        name: "Surgical Pre-Operative Instructions",
        href: "/patient-resources/pre-operative",
      },
      {
        name: "Surgical Post-Operative Instructions",
        href: "/patient-resources/post-operative",
        subDropdown: [
          {
            name: "Dry Socket",
            href: "/patient-resources/post-operative/dry-socket",
          },
          {
            name: "For Those Who Smoke",
            href: "/patient-resources/post-operative/smoking",
          },
        ],
      },
      { name: "Testimonials", href: "/patient-resources/testimonials" },
      {
        name: "Video Testimonials",
        href: "/patient-resources/video-testimonials",
      },
      { name: "Fee Schedule", href: "/patient-resources/fee-schedule" },
    ],
  },
  {
    name: "Services",
    href: "/services",
    dropdown: [
      { name: "Dental Implants", href: "/services/dental-implants" },
      { name: "Teeth Whitening", href: "/services/teeth-whitening" },
      {
        name: "Oral Cancer Screening",
        href: "/services#oral-cancer-screening",
      },
      {
        name: "Cosmetic Bonding",
        href: "/services#oral-cancer-screening",
      },
      {
        name: "Veneers",
        href: "/services#veneers",
      },
      {
        name: "Teeth Cleanings",
        href: "/services#veneers",
      },
      {
        name: "Full and Partial Dentures",
        href: "/services#full-and-partial-dentures",
      },
      {
        name: "Oral Surgery",
        href: "/services#full-and-partial-dentures",
      },
      {
        name: "Dental Diet System",
        href: "/services#dental-diet-system",
      },
      {
        name: "Non-Surgical Gum Treatment",
        href: "/services#dental-diet-system",
      },
      {
        name: "Dental Fillings",
        href: "/services#dental-fillings",
      },
      {
        name: "Root Canal Therapy",
        href: "/services#dental-fillings",
      },
      {
        name: "ClearCorrect™",
        href: "/services#clearcorrect™",
      },
      {
        name: "Invisalign®",
        href: "/services#clearcorrect™",
      },
      {
        name: "Tooth Extractions",
        href: "/services#tooth-extractions",
      },
    ],
  },
  { name: "About Us", href: "/about-us" },
  { name: "Forms", href: "/forms" },
  { name: "Contact", href: "/contact" },
];

const AnimatedSubmenu = ({ isOpen, children }) => {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setHeight(isOpen ? contentHeight : 0);
    }
  }, [isOpen, children]);

  return (
    <div
      className="overflow-hidden transition-all duration-300 ease-in-out"
      style={{ height }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
};

const MobileDropdownMenu = ({ items, level = 0, onNavigate }) => {
  const [expandedItem, setExpandedItem] = useState(null);
  const [expandedSubItem, setExpandedSubItem] = useState(null);

  const handleDropdownToggle = (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedItem(expandedItem === item.name ? null : item.name);
  };

  const handleSubItemClick = (itemName, e) => {
    e.preventDefault();
    setExpandedSubItem(expandedSubItem === itemName ? null : itemName);
  };

  return (
    <div className={`pl-${level * 4}`}>
      {items.map((item) => (
        <div key={item.name}>
          {item.dropdown || item.subDropdown ? (
            <div className="flex w-full">
              <Link
                href={item.href}
                onClick={() => onNavigate?.()}
                className="flex-1 py-3 px-4 text-left hover:bg-sky-50 transition-all duration-200"
              >
                <span className="text-gray-700 hover:text-sky-500 text-base">
                  {item.name}
                </span>
              </Link>

              <button
                onClick={(e) => handleDropdownToggle(item, e)}
                className="px-4 py-3 hover:bg-sky-50 transition-all duration-200 flex items-center"
              >
                <ChevronDown
                  className={`h-5 w-5 text-gray-600 transform transition-transform duration-300 ease-in-out
                    ${expandedItem === item.name ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          ) : (
            <Link
              href={item.href}
              onClick={() => onNavigate?.()}
              className="block w-full text-left py-3 px-4 hover:bg-sky-50 transition-all duration-200"
            >
              <span className="text-gray-700 hover:text-sky-500 text-base">
                {item.name}
              </span>
            </Link>
          )}

          {/* Dropdown items */}
          {item.dropdown && (
            <AnimatedSubmenu isOpen={expandedItem === item.name}>
              <div className="pl-4 border-l-2 border-sky-100 ml-4 mt-1">
                {item.dropdown.map((subItem) => (
                  <div key={subItem.name} className="py-1">
                    {subItem.subDropdown ? (
                      <div>
                        <button
                          onClick={(e) => handleSubItemClick(subItem.name, e)}
                          className="w-full text-left flex items-center justify-between px-4 py-2 text-gray-600 hover:text-sky-500 transition-all duration-200"
                        >
                          <span className="text-sm">{subItem.name}</span>
                          <ChevronRight
                            className={`h-4 w-4 transform transition-transform duration-300 ease-in-out
                              ${
                                expandedSubItem === subItem.name
                                  ? "rotate-90"
                                  : ""
                              }`}
                          />
                        </button>

                        <AnimatedSubmenu
                          isOpen={expandedSubItem === subItem.name}
                        >
                          <div className="pl-4 border-l-2 border-sky-100 mt-1">
                            {subItem.subDropdown.map((nestedItem) => (
                              <Link
                                key={nestedItem.name}
                                href={nestedItem.href}
                                onClick={() => onNavigate?.()}
                                className="block px-4 py-2 text-sm text-gray-600 hover:text-sky-500 transition-colors duration-200"
                              >
                                {nestedItem.name}
                              </Link>
                            ))}
                          </div>
                        </AnimatedSubmenu>
                      </div>
                    ) : (
                      <Link
                        href={subItem.href}
                        onClick={() => onNavigate?.()}
                        className="block px-4 py-2 text-sm text-gray-600 hover:text-sky-500 transition-colors duration-200"
                      >
                        {subItem.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </AnimatedSubmenu>
          )}

          {/* Direct subDropdown items */}
          {item.subDropdown && (
            <AnimatedSubmenu isOpen={expandedItem === item.name}>
              <div className="pl-4 border-l-2 border-sky-100 ml-4 mt-1">
                {item.subDropdown.map((subItem) => (
                  <Link
                    key={subItem.name}
                    href={subItem.href}
                    onClick={() => onNavigate?.()}
                    className="block px-4 py-2 text-sm text-gray-600 hover:text-sky-500 transition-colors duration-200"
                  >
                    {subItem.name}
                  </Link>
                ))}
              </div>
            </AnimatedSubmenu>
          )}
        </div>
      ))}
    </div>
  );
};

const DropdownMenu = ({ items, className = "", menuType }) => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const positionClass =
    menuType === "patient-resources" ? "left-[-50%]" : "left-[-20%]";

  const getSubmenuPosition = (windowWidth) => {
    return "left-full";
  };

  return (
    <div
      className={`absolute mt-0 w-80 bg-white rounded-md shadow-lg py-1 z-50 
      opacity-0 pointer-events-none translate-y-[-10px] transition-all duration-200 ease-in-out 
      group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0
      ${positionClass}
      ${className}`}
    >
      {items.map((item) => {
        const hasSubmenu = Boolean(item.subDropdown?.length);

        return (
          <div key={item.name} className="relative group/sub">
            <Link
              href={item.href}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-500 whitespace-nowrap"
            >
              <div className="flex items-center justify-between w-full pr-2">
                <span className="flex-grow">{item.name}</span>
                {item.name === "Surgical Post-Operative Instructions" && (
                  <span className="flex items-center pl-4">
                    <ChevronRight className="h-4 w-4 flex-shrink-0" />
                  </span>
                )}
              </div>
            </Link>

            {hasSubmenu && (
              <div
                className={`absolute ${getSubmenuPosition(
                  windowWidth
                )} top-0 -right-1 opacity-0 pointer-events-none 
                translate-y-[-10px] transition-all duration-200 ease-in-out
                group-hover/sub:opacity-100 group-hover/sub:pointer-events-auto group-hover/sub:translate-y-0 z-[60]`}
              >
                <div className="w-48 bg-white rounded-md shadow-lg py-1">
                  {" "}
                  {item.subDropdown.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-500 whitespace-nowrap"
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const TopNav = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const getNavItemClass = (hasDropdown) => {
    let baseClasses = `font-semibold transition-colors duration-200 hover:text-sky-500 flex items-center px-2 py-1`;

    if (windowWidth >= 768 && windowWidth <= 1100) {
      baseClasses += " text-sm";
    } else {
      baseClasses += " text-base";
    }

    return baseClasses;
  };

  return (
    <header className={`fixed w-full top-0 z-50 ${montserrat.className}`}>
      <div className="bg-sky-500 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link
            href="https://maps.google.com"
            target="_blank"
            className="flex items-center hover:text-sky-100 transition-colors font-bold text-2xl"
          >
            <MapPin className="h-5 w-5 mr-2" />
            <span className="hidden sm:inline">Get Directions</span>
          </Link>

          <Link
            href="tel:5612726664"
            className="flex items-center hover:text-sky-100 transition-colors font-bold text-2xl"
          >
            <Phone className="h-5 w-5 mr-2" />
            (561) 272-6664
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-gray-800">
                Delray Dental
              </Link>
              <div className="text-sm text-gray-600 mt-1">
                Ritota & Ritota, P.A.
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-800" />
              ) : (
                <Menu className="h-6 w-6 text-gray-800" />
              )}
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:block transition-opacity duration-200 ">
              <ul className="flex items-center space-x-6 lg:space-x-8 ">
                {navigationItems.map((item) => (
                  <li key={item.name} className="group">
                    <div className="relative inline-block">
                      <Link
                        href={item.href}
                        className={`${getNavItemClass(!!item.dropdown)} 
                          ${
                            pathname === item.href
                              ? "text-sky-500"
                              : "text-gray-600"
                          }`}
                      >
                        {item.name}
                        {item.dropdown && (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </Link>

                      {item.dropdown && (
                        <div className="absolute top-full min-w-max">
                          <DropdownMenu
                            items={item.dropdown}
                            menuType={item.name.toLowerCase().replace(" ", "-")}
                          />
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Mobile Menu Overlay */}
          <div
            className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden
              ${
                isMobileMenuOpen
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Mobile Header */}
          <div
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl z-50 
  transform transition-transform duration-300 ease-in-out lg:hidden
  flex flex-col"
            style={{
              transform: isMobileMenuOpen
                ? "translateX(0)"
                : "translateX(100%)",
            }}
          >
            {/* Header with Close Button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
                aria-label="Close menu"
              >
                <X className="h-6 w-6 text-gray-800" />
              </button>
            </div>

            {/* Scrollable Menu Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain pb-6">
              <div className="py-2">
                {navigationItems.map((item) => (
                  <div
                    key={item.name}
                    className="border-b border-gray-200 last:border-0"
                  >
                    <MobileDropdownMenu
                      items={[item]}
                      onNavigate={() => setIsMobileMenuOpen(false)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Overlay */}
          <div
            className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden
    ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        </div>
      </div>
    </header>
  );
};

export default TopNav;
