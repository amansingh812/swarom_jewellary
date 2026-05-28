/* global React */
const { useState: useStatePDP } = React;

function ProductDetail({ addToBag, setRoute }) {
  const [engraving, setEngraving] = useStatePDP("amelia");
  const [chain, setChain] = useStatePDP("16″");
  const [thumb, setThumb] = useStatePDP(0);
  const images = [
    "../../assets/product-pendant.svg",
    "../../assets/product-bracelet.svg",
    "../../assets/product-ring.svg",
  ];

  return (
    <main className="kit-pdp">
      <nav className="kit-breadcrumbs">
        <a onClick={() => setRoute("home")}>Home</a>
        <span>›</span>
        <a onClick={() => setRoute("shop")}>Shop</a>
        <span>›</span>
        <span className="current">Pendant <i>in your hand</i></span>
      </nav>

      <section className="kit-pdp-layout">
        <div className="kit-pdp-gallery">
          <div className="kit-pdp-thumbs">
            {images.map((src, i) => (
              <button key={i} className="kit-thumb" data-active={thumb===i||undefined} onClick={() => setThumb(i)}>
                <img src={src} alt="" />
              </button>
            ))}
          </div>
          <div className="kit-pdp-main">
            <img src={images[thumb]} alt="" />
            <div className="kit-pdp-grain swr-grain" />
          </div>
        </div>

        <aside className="kit-pdp-aside">
          <span className="hairline-rule eyebrow"><span /><em>The Everyday</em><span /></span>
          <h1 className="serif-h1 pdp-title">
            Pendant <i>in your hand</i>
          </h1>
          <p className="lede">
            A small silver droplet on a fine cable chain. Engrave a name, a word,
            a date — whatever you carry.
          </p>
          <div className="kit-pdp-price-row">
            <span className="pdp-price">₹ 4,800</span>
            <span className="pdp-meta">925 silver · made in 10 days</span>
          </div>

          <div className="kit-pdp-divider" />

          <div className="kit-pdp-field">
            <label className="field-label">Engraving</label>
            <div className="field-input">
              <input value={engraving} onChange={(e) => setEngraving(e.target.value.slice(0, 12))} maxLength={12} />
              <span className="field-counter">{engraving.length}/12</span>
            </div>
            <div className="kit-pdp-preview">
              <span className="serif-italic">{engraving || "—"}</span>
            </div>
          </div>

          <div className="kit-pdp-field">
            <label className="field-label">Chain length</label>
            <div className="kit-chip-row">
              {["14″","16″","18″","20″"].map((c) => (
                <button key={c} className="kit-pill" data-active={chain===c||undefined} onClick={() => setChain(c)}>{c}</button>
              ))}
            </div>
          </div>

          <div className="kit-pdp-cta">
            <button className="btn btn-primary big" onClick={() => addToBag({ name: "Pendant in your hand", engraving, chain, price: 4800 })}>
              Add to bag — ₹ 4,800
            </button>
            <button className="btn btn-link"><svg width="12" height="12"><use href="../../assets/icons.svg#swr-whatsapp"/></svg> &nbsp;Ask on WhatsApp</button>
          </div>

          <ul className="kit-pdp-bullets">
            <li><svg width="14" height="14"><use href="../../assets/icons.svg#swr-stamp"/></svg>Hallmarked 925 sterling silver</li>
            <li><svg width="14" height="14"><use href="../../assets/icons.svg#swr-truck"/></svg>Free shipping across India</li>
            <li><svg width="14" height="14"><use href="../../assets/icons.svg#swr-shield"/></svg>30-day return — engraved pieces included</li>
          </ul>

          <details className="kit-pdp-accordion">
            <summary>Details &amp; care <svg width="12" height="12"><use href="../../assets/icons.svg#swr-chevron-down"/></svg></summary>
            <p>Wipe with the cotton cloth that comes in your box. Avoid perfume and pool water. Silver darkens with time — that's the patina; rub it lightly to bring back the shine.</p>
          </details>
          <details className="kit-pdp-accordion">
            <summary>How it's made <svg width="12" height="12"><use href="../../assets/icons.svg#swr-chevron-down"/></svg></summary>
            <p>Each piece is cast individually from your engraving, then hand-finished and polished. We mark every pendant with the year it was made.</p>
          </details>
        </aside>
      </section>
    </main>
  );
}

window.ProductDetail = ProductDetail;
