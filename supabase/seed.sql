-- ───────────────────────────────────────────────────────────────────
-- Swarom — Seed data (optional)
-- Run AFTER schema.sql + policies.sql.
-- Loads four collections and ~8 sample products matching the mock catalog.
-- ───────────────────────────────────────────────────────────────────

-- ───── Collections ───────────────────────────────────────────────
insert into public.collections (slug, name, description, position) values
  ('everyday', 'The Everyday', 'What you wear every day, with a name hidden where only you can find it.', 1),
  ('letters',  'Letters',      'One letter, cast in silver, traced in your handwriting.',                   2),
  ('for-two',  'For Two',      'Two halves of one thing — for a friend, a sister, a love.',                3),
  ('keepsake', 'Keepsake',     'Pieces that open, that hold, that carry.',                                  4)
on conflict (slug) do nothing;

-- ───── Products ────────────────────────────────────────────────
-- (uses a CTE so we can reference collection IDs cleanly)
with c as (
  select slug, id from public.collections
)
insert into public.products
  (slug, name, modifier, description, collection_id, category, price, status, meta, image_main, images, options)
values
  (
    'pendant-in-your-hand', 'Pendant', 'in your hand',
    'A small silver droplet on a fine cable chain. Engrave a name, a word, a date — whatever you carry.',
    (select id from c where slug = 'everyday'), 'pendant', 4800, 'active', '925 silver · engraved',
    '/products/pendant.svg',
    array['/products/pendant.svg', '/products/bracelet.svg', '/products/ring.svg'],
    '{"engraving":{"type":"text","max":12,"label":"Engraving"},"chain":{"type":"select","label":"Chain length","choices":["14″","16″","18″","20″"],"default":"16″"}}'::jsonb
  ),
  (
    'ring-for-the-second-one', 'Ring', 'for the second one',
    'A slim band you''d notice on a hand. Inside the band, a date that''s yours.',
    (select id from c where slug = 'everyday'), 'ring', 6200, 'active', '925 silver · date',
    '/products/ring.svg', array['/products/ring.svg', '/products/pendant.svg'],
    '{"engraving":{"type":"text","max":10,"label":"Date or initials"},"size":{"type":"select","label":"Ring size","choices":["10","12","14","16","18","20"],"default":"14"}}'::jsonb
  ),
  (
    'bracelet-with-a-charm', 'Bracelet', 'with a charm',
    'A delicate chain with one engraved charm. The kind that lives on a wrist and feels heavier than it weighs.',
    (select id from c where slug = 'everyday'), 'bracelet', 5400, 'active', '925 silver · initial',
    '/products/bracelet.svg', array['/products/bracelet.svg', '/products/pendant.svg'],
    '{"engraving":{"type":"text","max":3,"label":"Initial"},"length":{"type":"select","label":"Wrist size","choices":["6″","6.5″","7″","7.5″"],"default":"6.5″"}}'::jsonb
  ),
  (
    'pendant-for-two', 'Pendant', 'for two',
    'Two droplets on one chain. Two names, two dates, two halves of one thing.',
    (select id from c where slug = 'for-two'), 'for-two', 7200, 'active', '925 silver · double',
    '/products/pendant.svg', array['/products/pendant.svg', '/products/bracelet.svg'],
    '{"engraving_a":{"type":"text","max":10,"label":"First name"},"engraving_b":{"type":"text","max":10,"label":"Second name"},"chain":{"type":"select","label":"Chain length","choices":["16″","18″","20″"],"default":"18″"}}'::jsonb
  ),
  (
    'pendant-letter', 'Pendant', 'your letter',
    'A single letter, cast in silver, traced in your handwriting.',
    (select id from c where slug = 'letters'), 'pendant', 3900, 'active', '925 silver · letter',
    '/products/pendant.svg', array['/products/pendant.svg'],
    '{"engraving":{"type":"text","max":1,"label":"Letter"},"chain":{"type":"select","label":"Chain length","choices":["16″","18″"],"default":"16″"}}'::jsonb
  ),
  (
    'anklet-with-a-name', 'Anklet', 'with a name',
    'A whisper of silver at the ankle, with a name you''d whisper too.',
    (select id from c where slug = 'everyday'), 'anklet', 4200, 'active', '925 silver · name',
    '/products/bracelet.svg', array['/products/bracelet.svg'],
    '{"engraving":{"type":"text","max":8,"label":"Name"},"length":{"type":"select","label":"Length","choices":["9″","10″","11″"],"default":"10″"}}'::jsonb
  ),
  (
    'ring-stacker', 'Ring', 'to stack',
    'A pair of slim bands you wear with the others. Hand-finished, never sized down.',
    (select id from c where slug = 'everyday'), 'ring', 5800, 'active', '925 silver · pair',
    '/products/ring.svg', array['/products/ring.svg'],
    '{"engraving":{"type":"text","max":6,"label":"Word or word"},"size":{"type":"select","label":"Ring size","choices":["10","12","14","16","18"],"default":"14"}}'::jsonb
  ),
  (
    'pendant-keepsake', 'Pendant', 'the keepsake',
    'A locket that opens. A photograph inside, or a date, or nothing at all.',
    (select id from c where slug = 'keepsake'), 'pendant', 8900, 'active', '925 silver · locket',
    '/products/pendant.svg', array['/products/pendant.svg'],
    '{"engraving":{"type":"text","max":16,"label":"On the back"},"chain":{"type":"select","label":"Chain length","choices":["18″","20″","22″"],"default":"20″"}}'::jsonb
  )
on conflict (slug) do nothing;

-- ───── Make yourself an admin ─────────────────────────────────
-- After you've signed up via the site, run this with your auth email:
-- update public.profiles
-- set role = 'admin'
-- where id = (select id from auth.users where email = 'YOU@example.com');
