/* global React */
function Story() {
  return (
    <main className="kit-story">
      <section className="kit-story-hero">
        <span className="hairline-rule eyebrow"><span /><em>Our Story</em><span /></span>
        <h1 className="serif-display">
          We make one thing.<br />
          <i>We try to make it well.</i>
        </h1>
        <div className="kit-shimmer-line" />
        <p className="lede">
          Swarom is a small studio in Bengaluru. We make personalized silver jewellery
          — the kind you wear every day, with a name or a date hidden where only you
          can find it.
        </p>
      </section>

      <section className="kit-story-grid">
        <figure className="kit-story-figure">
          <img src="../../assets/product-bracelet.svg" alt="" />
          <figcaption>The bench, 8 a.m.</figcaption>
        </figure>
        <div className="kit-story-prose">
          <h2 className="serif-h2">From the maker</h2>
          <p>
            I started Swarom because I couldn't find what I was looking for —
            silver that felt like a heirloom, but priced like an everyday thing.
            So I learned to cast, and to engrave, and to listen carefully when
            someone tells me a name.
          </p>
          <p>
            Every piece passes through one set of hands, from sketch to send-off.
            We never make more than we can polish carefully. It takes about ten
            days to make a piece. We think that's just right.
          </p>
          <p className="kit-signature">— Anjali · founder</p>
        </div>
      </section>

      <section className="kit-press-strip">
        <span className="kit-press-label">As seen in</span>
        <div className="kit-press-logos">
          <span className="serif-italic">The Hindu</span>
          <span className="serif-italic">Vogue India</span>
          <span className="serif-italic">Mint Lounge</span>
          <span className="serif-italic">Conde Nast Traveller</span>
        </div>
      </section>
    </main>
  );
}

window.Story = Story;
