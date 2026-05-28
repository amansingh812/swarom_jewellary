/* global React, Header, Footer, Home, Shop, ProductDetail, Story, BagDrawer */
const { useState: useStateApp } = React;

function App() {
  const [route, setRoute] = useStateApp("home");
  const [bag, setBag] = useStateApp([]);
  const [bagOpen, setBagOpen] = useStateApp(false);

  const addToBag = (item) => {
    setBag((b) => [...b, item]);
    setBagOpen(true);
  };
  const removeFromBag = (idx) => setBag((b) => b.filter((_, i) => i !== idx));

  let page = null;
  if (route === "home") page = <Home setRoute={setRoute} />;
  else if (route === "shop" || route === "collections") page = <Shop setRoute={setRoute} />;
  else if (route === "product") page = <ProductDetail addToBag={addToBag} setRoute={setRoute} />;
  else if (route === "story" || route === "care") page = <Story />;

  return (
    <>
      <Header route={route} setRoute={setRoute} bag={bag} openBag={() => setBagOpen(true)} />
      {page}
      <Footer />
      <BagDrawer open={bagOpen} bag={bag} removeFromBag={removeFromBag} onClose={() => setBagOpen(false)} />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
