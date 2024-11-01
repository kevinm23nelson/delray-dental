'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Phone, ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin'] });

const navigationItems = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about-us' },
  {
    name: 'Services',
    href: '/services',
    dropdown: [
      { name: 'Dental Implants', href: '/services/dental-implants' },
      { name: 'Teeth Whitening', href: '/services/teeth-whitening' },
      { name: 'Oral Cancer Screening', href: '/services/oral-cancer-screening' },
      { name: 'Cosmetic Bonding', href: '/services/cosmetic-bonding' },
      { name: 'Veneers', href: '/services/veneers' },
      { name: 'Teeth Cleanings', href: '/services/teeth-cleanings' },
      { name: 'Full and Partial Dentures', href: '/services/dentures' },
      { name: 'Oral Surgery', href: '/services/oral-surgery' },
      { name: 'Dental Diet System', href: '/services/dental-diet-system' },
      { name: 'Non-Surgical Gum Treatment', href: '/services/gum-treatment' },
      { name: 'Dental Fillings', href: '/services/dental-fillings' },
      { name: 'Root Canal Therapy', href: '/services/root-canal' },
      { name: 'Tooth Extractions', href: '/services/tooth-extractions' },
      { name: 'ClearCorrect™', href: '/services/clearcorrect' },
      { name: 'Invisalign®', href: '/services/invisalign' }
    ]
  },
  {
    name: 'Patient Resources',
    href: '/patient-resources',
    dropdown: [
      { name: 'Before and After', href: '/before-after' },
      { name: 'Surgical Pre-Operative Instructions', href: '/pre-operative' },
      {
        name: 'Surgical Post-Operative Instructions',
        href: '/post-operative',
        subDropdown: [
          { name: 'Dry Socket', href: '/dry-socket' },
          { name: 'For Those Who Smoke', href: '/smoking' }
        ]
      },
      { name: 'Testimonials', href: '/testimonials' },
      { name: 'Video Testimonials', href: '/video-testimonials' },
      { name: 'Fee Schedule', href: '/fee-schedule' }
    ]
  },
  { name: 'Forms', href: '/forms' },
  { name: 'Contact', href: '/contact' }
];

const MobileDropdownMenu = ({ items, level = 0 }) => {
  const [expandedItem, setExpandedItem] = useState(null);
  const [expandedSubItem, setExpandedSubItem] = useState(null);

  const handleItemClick = (item, e) => {
    e.preventDefault();
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
          {/* Main section button */}
          <button 
            onClick={(e) => handleItemClick(item, e)}
            className="w-full text-left flex items-center justify-between py-2 px-4 hover:bg-sky-50 transition-colors duration-200"
          >
            <span className="text-gray-700 hover:text-sky-500">{item.name}</span>
            {(item.dropdown || item.subDropdown) && (
              <ChevronDown 
                className={`h-5 w-5 text-gray-600 transition-transform duration-300 ease-in-out ml-2
                  ${expandedItem === item.name ? 'rotate-180' : ''}`}
              />
            )}
          </button>

          {/* Dropdown items */}
          {item.dropdown && expandedItem === item.name && (
            <div className="overflow-hidden transition-all duration-300 ease-in-out">
              <div className="pl-4 border-l-2 border-sky-100 ml-4 mt-1">
                {item.dropdown.map((subItem) => (
                  <div key={subItem.name} className="py-2">
                    {subItem.subDropdown ? (
                      <div>
                        <button
                          onClick={(e) => handleSubItemClick(subItem.name, e)}
                          className="w-full text-left flex items-center justify-between px-4 py-2 text-gray-600 hover:text-sky-500 transition-colors duration-200"
                        >
                          <span>{subItem.name}</span>
                          <ChevronRight 
                            className={`h-4 w-4 transition-transform duration-300 ease-in-out
                              ${expandedSubItem === subItem.name ? 'rotate-90' : ''}`}
                          />
                        </button>
                        
                        {/* Nested submenu items */}
                        {expandedSubItem === subItem.name && (
                          <div className="pl-4 border-l-2 border-sky-100 ml-4 mt-1">
                            {subItem.subDropdown.map((nestedItem) => (
                              <Link
                                key={nestedItem.name}
                                href={nestedItem.href}
                                className="block px-4 py-2 text-gray-600 hover:text-sky-500 transition-colors duration-200"
                              >
                                {nestedItem.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={subItem.href}
                        className="block px-4 py-2 text-gray-600 hover:text-sky-500 transition-colors duration-200"
                      >
                        {subItem.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Direct subDropdown items */}
          {item.subDropdown && expandedItem === item.name && (
            <div className="overflow-hidden transition-all duration-300 ease-in-out">
              <div className="pl-4 border-l-2 border-sky-100 ml-4 mt-1">
                {item.subDropdown.map((subItem) => (
                  <Link
                    key={subItem.name}
                    href={subItem.href}
                    className="block px-4 py-2 text-gray-600 hover:text-sky-500 transition-colors duration-200"
                  >
                    {subItem.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const DropdownMenu = ({ items, className = '', menuType }) => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const positionClass = menuType === 'patient-resources' 
    ? 'left-[-10%]'
    : 'left-[-20%]';

  const getSubmenuPosition = (windowWidth) => {
    // Start with maximum offset
    let baseOffset = 60; // percentage

    // If screen is getting smaller, gradually reduce the offset
    if (windowWidth < 1200) {
      baseOffset = Math.max(30, (windowWidth - 800) / 400 * 30 + 30); // Linear reduction
    }

    return `left-[${baseOffset}%]`;
  };

  return (
    <div className={`absolute mt-0 w-80 bg-white rounded-md shadow-lg py-1 z-50 
      opacity-0 pointer-events-none translate-y-[-10px] transition-all duration-200 ease-in-out 
      group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0
      ${positionClass}
      ${className}`}>
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
                {item.name === 'Surgical Post-Operative Instructions' && (
                  <span className="flex items-center pl-4">
                    <ChevronRight className="h-4 w-4 flex-shrink-0" />
                  </span>
                )}
              </div>
            </Link>
            
            {hasSubmenu && (
              <div className={`absolute ${getSubmenuPosition(windowWidth)} top-0 opacity-0 pointer-events-none 
                translate-y-[-10px] transition-all duration-200 ease-in-out
                group-hover/sub:opacity-100 group-hover/sub:pointer-events-auto group-hover/sub:translate-y-0 z-[60]`}>
                <div className="w-48 bg-white rounded-md shadow-lg py-1">
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
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getNavItemClass = (hasDropdown) => {
    let baseClasses = `font-semibold transition-colors hover:text-sky-500 flex items-center px-2 py-1`;
    
    if (windowWidth >= 768 && windowWidth <= 973) {
      baseClasses += ' text-xs';
    } else {
      baseClasses += ' text-sm lg:text-base';
    }

    if (hasDropdown) {
      baseClasses += ' items-center';
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
            className="flex items-center hover:text-sky-100 transition-colors font-semibold text-sm"
          >
            <MapPin className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Get Directions</span>
          </Link>
          
          <Link 
            href="tel:5612726664" 
            className="flex items-center hover:text-sky-100 transition-colors font-semibold text-sm"
          >
            <Phone className="h-4 w-4 mr-2" />
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
            <nav className="hidden lg:block">
              <ul className="flex space-x-4 lg:space-x-8">
                {navigationItems.map((item) => (
                  <li key={item.name} className="group">
                    <div className="relative inline-block">
                      <Link
                        href={item.href}
                        className={`${getNavItemClass(!!item.dropdown)} 
                          ${pathname === item.href ? 'text-sky-500' : 'text-gray-600'}`}
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
                            menuType={item.name.toLowerCase().replace(' ', '-')}
                          />
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Mobile Menu */}
          <div 
            className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="py-2 space-y-1">
              {navigationItems.map((item) => (
                <div key={item.name} className="border-b border-gray-200 last:border-0">
                  <MobileDropdownMenu items={[item]} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;