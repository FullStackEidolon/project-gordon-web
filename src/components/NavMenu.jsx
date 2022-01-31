import React, { useState, useEffect } from 'react';
import axios from 'axios';

console.log(window.innerWidth);
const NavMenu = ({ captureNavigation }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)

  return (
      <div className="navmenu">
        <div className="navmenuitem" name="home" onClick={e => captureNavigation(e)}>Home</div>
        <div className="navmenuitem" name="explore" onClick={e => captureNavigation(e)}>Explore</div>
        <div className="navmenuitem" name="profile" onClick={e => captureNavigation(e)}>Profile</div>
        <div className="navmenuitem" name="favorites" onClick={e => captureNavigation(e)}>Favorites</div>
      </div>
  )
}

export default NavMenu;