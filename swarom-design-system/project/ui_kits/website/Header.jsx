/* global React */
const { useState } = React;

function Header({ route, setRoute, bag, openBag }) {
  const link = (id, label) => (
    <button
      key={id}
      onClick={() => setRoute(id)}
      className="navlink"
      data-active={route === id || undefined}
    >
      {label}
    </button>
  );
  return (
    <header className="kit-header">
      <div className="kit-header-inner">
        <nav className="kit-nav-left">
          {link("shop", "Shop")}
          {link("collections", "Collections")}
          {link("story", "Story")}
          {link("care", "Care")}
        </nav>

        <button className="kit-wordmark" onClick={() => setRoute("home")}>
          Swarom
        </button>

        <div className="kit-nav-right">
          <button className="navicon" aria-label="Search">
            <svg width="16" height="16"><use href="../../assets/icons.svg#swr-search" /></svg>
          </button>
          <button className="navicon" aria-label="Account">
            <svg width="16" height="16"><use href="../../assets/icons.svg#swr-user" /></svg>
          </button>
          <button className="navicon bag" aria-label="Bag" onClick={openBag}>
            <svg width="16" height="16"><use href="../../assets/icons.svg#swr-bag" /></svg>
            <span className="bag-count">/ {bag.length} /</span>
          </button>
        </div>
      </div>
      <div className="kit-eyebrow-strip">
        <span>Free shipping across India</span>
        <span>·</span>
        <span>Made to order in Bengaluru</span>
        <span>·</span>
        <span>30-day returns</span>
      </div>
    </header>
  );
}

window.Header = Header;
