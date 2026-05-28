/* global React */
function Footer() {
  return (
    <footer className="kit-footer">
      <div className="kit-footer-top">
        <div className="kit-footer-brand">
          <div className="kit-footer-wordmark">Swarom</div>
          <p className="kit-footer-tagline">
            Personalized 925 sterling silver, handcrafted in Bengaluru.
          </p>
          <div className="kit-shimmer-line" />
        </div>
        <div className="kit-footer-cols">
          <div className="kit-footer-col">
            <span className="kit-footer-label">Shop</span>
            <a>All pieces</a>
            <a>Pendants</a>
            <a>Rings</a>
            <a>Bracelets</a>
            <a>Anklets</a>
          </div>
          <div className="kit-footer-col">
            <span className="kit-footer-label">Help</span>
            <a>Care guide</a>
            <a>Shipping</a>
            <a>Returns</a>
            <a>Sizing</a>
          </div>
          <div className="kit-footer-col">
            <span className="kit-footer-label">Reach</span>
            <a><svg width="12" height="12"><use href="../../assets/icons.svg#swr-whatsapp"/></svg>&nbsp; WhatsApp</a>
            <a><svg width="12" height="12"><use href="../../assets/icons.svg#swr-instagram"/></svg>&nbsp; Instagram</a>
            <a><svg width="12" height="12"><use href="../../assets/icons.svg#swr-mail"/></svg>&nbsp; hello@swarom.in</a>
          </div>
          <div className="kit-footer-col">
            <span className="kit-footer-label">Newsletter</span>
            <p style={{fontFamily:"var(--font-sans)",fontSize:12,color:"var(--fg3)",lineHeight:1.5,margin:0,marginBottom:8}}>One quiet letter each month. New pieces, behind the bench.</p>
            <form className="kit-mini-form" onSubmit={(e)=>e.preventDefault()}>
              <input placeholder="your@email.com"/>
              <button>Notify me</button>
            </form>
          </div>
        </div>
      </div>
      <div className="kit-footer-bottom">
        <span>© 2026 Swarom</span>
        <span className="hairline-rule"><span/><em>Bengaluru · Est. 2026</em><span/></span>
        <span>Privacy &nbsp;·&nbsp; Terms</span>
      </div>
    </footer>
  );
}

window.Footer = Footer;
