/* global React */
function BagDrawer({ open, bag, removeFromBag, onClose }) {
  if (!open) return null;
  const subtotal = bag.reduce((s, it) => s + it.price, 0);
  return (
    <>
      <div className="kit-drawer-scrim" onClick={onClose} />
      <aside className="kit-drawer">
        <header className="kit-drawer-head">
          <span className="kit-drawer-title">Your bag <span className="mono-count">/ {bag.length} /</span></span>
          <button className="navicon" onClick={onClose} aria-label="Close">
            <svg width="14" height="14"><use href="../../assets/icons.svg#swr-close"/></svg>
          </button>
        </header>

        {bag.length === 0 ? (
          <div className="kit-drawer-empty">
            <p className="serif-italic" style={{fontSize:20,color:"var(--fg2)",margin:0}}>Your bag is quiet.</p>
            <p className="lede" style={{maxWidth:280,fontSize:14}}>Pieces you add will rest here, ready when you are.</p>
          </div>
        ) : (
          <ul className="kit-drawer-list">
            {bag.map((item, i) => (
              <li key={i} className="kit-drawer-item">
                <img src="../../assets/product-pendant.svg" alt="" />
                <div className="kit-drawer-info">
                  <strong>{item.name}</strong>
                  <span className="meta">Engraved · <i>{item.engraving}</i></span>
                  <span className="meta">Chain · {item.chain}</span>
                </div>
                <div className="kit-drawer-side">
                  <span className="pdp-price">₹ {item.price.toLocaleString("en-IN")}</span>
                  <button className="link" onClick={() => removeFromBag(i)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {bag.length > 0 && (
          <footer className="kit-drawer-foot">
            <div className="kit-drawer-subtotal">
              <span>Subtotal</span>
              <span className="pdp-price">₹ {subtotal.toLocaleString("en-IN")}</span>
            </div>
            <p className="meta tiny">Shipping &amp; taxes calculated at checkout.</p>
            <button className="btn btn-primary big block">Checkout</button>
            <button className="btn btn-link block">Continue browsing</button>
          </footer>
        )}
      </aside>
    </>
  );
}

window.BagDrawer = BagDrawer;
