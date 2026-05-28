/* global React, HOME_PRODUCTS, ProductTile */
function Shop({ setRoute }) {
  const all = [...HOME_PRODUCTS, ...HOME_PRODUCTS].map((p, i) => ({ ...p, id: p.id + "-" + i }));
  return (
    <main className="kit-shop">
      <section className="kit-shop-head">
        <span className="hairline-rule eyebrow"><span /><em>Shop · All pieces</em><span /></span>
        <h1 className="serif-h1">The Collection</h1>
        <p className="lede" style={{maxWidth:560,margin:"12px auto 0",textAlign:"center"}}>
          Twelve pieces. Each one personalized — a name, a date, a small mark.
        </p>
      </section>

      <div className="kit-shop-filters">
        <div className="kit-filter-row">
          <span className="kit-filter-label">Filter</span>
          {["All","Pendants","Rings","Bracelets","Anklets","For two"].map((f, i) => (
            <button key={f} className="kit-pill" data-active={i===0||undefined}>{f}</button>
          ))}
        </div>
        <div className="kit-filter-row">
          <span className="kit-filter-label">Sort</span>
          <button className="kit-pill ghost">Newest <svg width="10" height="10"><use href="../../assets/icons.svg#swr-chevron-down"/></svg></button>
        </div>
      </div>

      <section className="kit-product-grid wide">
        {all.map((p) => (
          <ProductTile key={p.id} p={p} onClick={() => setRoute("product")} />
        ))}
      </section>
    </main>
  );
}

window.Shop = Shop;
