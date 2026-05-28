/* global React */
const { useState: useStateHome } = React;

function AmbientOrbs() {
  return (
    <>
      <div aria-hidden className="orb orb-1 swr-float" />
      <div aria-hidden className="orb orb-2 swr-float" style={{ animationDelay: "2s" }} />
    </>
  );
}

function Home({ setRoute }) {
  return (
    <main className="kit-home">
      <AmbientOrbs />
      <section className="kit-hero">
        <div className="kit-hero-text">
          <span className="hairline-rule eyebrow">
            <span /><em>The Everyday Collection</em><span />
          </span>
          <h1 className="serif-display">
            Elegance Is a Way Of<br />
            Expression And<br />
            It Lasts Longer Than Life
          </h1>
          <div className="kit-signature kit-signature-brand">Swarom</div>
          <p className="lede">
            Personalized 925 sterling silver jewellery, handcrafted in Bengaluru.
            Made to order. Made to last.
          </p>
          <div className="kit-cta-row">
            <button className="btn btn-primary" onClick={() => setRoute("product")}>
              Shop the collection
            </button>
            <button className="btn btn-secondary" onClick={() => setRoute("story")}>
              Read our story →
            </button>
          </div>
          <div className="kit-trust-row">
            <div><svg width="16" height="16"><use href="../../assets/icons.svg#swr-stamp"/></svg><span>925 Silver</span></div>
            <div><svg width="16" height="16"><use href="../../assets/icons.svg#swr-heart"/></svg><span>Personalized</span></div>
            <div><svg width="16" height="16"><use href="../../assets/icons.svg#swr-leaf"/></svg><span>Made to order</span></div>
          </div>
        </div>
        <div className="kit-hero-art">
          <img src="../../assets/hero-still-life.svg" alt="" />
          <div className="kit-hero-floating">
            <img src="../../assets/product-pendant.svg" alt="" />
          </div>
        </div>
      </section>

      <section className="kit-feature-band">
        <div className="kit-feature">
          <span className="kit-feature-num">01</span>
          <span className="kit-feature-label">Sketch</span>
          <p>Tell us a name, a date, a feeling. We sketch by hand.</p>
        </div>
        <div className="kit-feature">
          <span className="kit-feature-num">02</span>
          <span className="kit-feature-label">Cast</span>
          <p>Hand-cast in 925 sterling silver in our Bengaluru studio.</p>
        </div>
        <div className="kit-feature">
          <span className="kit-feature-num">03</span>
          <span className="kit-feature-label">Send</span>
          <p>Polished, packaged, and on its way within 10 days.</p>
        </div>
      </section>

      <section className="kit-grid-section">
        <div className="kit-section-head">
          <span className="hairline-rule eyebrow">
            <span /><em>The Collection</em><span />
          </span>
          <h2 className="serif-h2">A small, made-to-last assembly.</h2>
        </div>
        <div className="kit-product-grid">
          {HOME_PRODUCTS.map((p) => (
            <ProductTile key={p.id} p={p} onClick={() => setRoute("product")} />
          ))}
        </div>
      </section>

      <section className="kit-story-strip">
        <img src="../../assets/product-bracelet.svg" alt="" />
        <div className="kit-story-text">
          <span className="hairline-rule eyebrow"><span /><em>Behind the bench</em><span /></span>
          <h2 className="serif-h2">Hand-finished, one piece at a time.</h2>
          <p className="lede">
            Every Swarom piece passes through one set of hands from sketch to send-off.
            We use the same 925 alloy you'd find in heirlooms, and we hallmark each piece
            with the date it was made.
          </p>
          <button className="btn btn-link" onClick={() => setRoute("story")}>
            Read our story <span aria-hidden>→</span>
          </button>
        </div>
      </section>
    </main>
  );
}

function ProductTile({ p, onClick }) {
  return (
    <article className="kit-tile" onClick={onClick}>
      <div className="kit-tile-image"><img src={p.image} alt={p.name} /></div>
      <div className="kit-tile-caption">
        <h3 className="serif-h4">
          {p.name} <i className="kit-tile-modifier">{p.modifier}</i>
        </h3>
        <span className="kit-tile-meta">{p.meta}</span>
        <span className="kit-tile-price">₹ {p.price.toLocaleString("en-IN")}</span>
      </div>
    </article>
  );
}

const HOME_PRODUCTS = [
  { id: "p1", name: "Pendant",  modifier: "in your hand",   meta: "925 silver · engraved",   price: 4800, image: "../../assets/product-pendant.svg" },
  { id: "p2", name: "Ring",     modifier: "for the second one", meta: "925 silver · date",   price: 6200, image: "../../assets/product-ring.svg" },
  { id: "p3", name: "Bracelet", modifier: "with a charm",   meta: "925 silver · initial",   price: 5400, image: "../../assets/product-bracelet.svg" },
  { id: "p4", name: "Pendant",  modifier: "for two",        meta: "925 silver · double",    price: 7200, image: "../../assets/product-pendant.svg" },
];

window.Home = Home;
window.ProductTile = ProductTile;
window.HOME_PRODUCTS = HOME_PRODUCTS;
