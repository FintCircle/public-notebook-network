-- Seed: one complete fashion & beauty Notepage.
INSERT OR IGNORE INTO profiles (id, display_name, bio, country, country_code, portrait_url, interests_json, links_json, created_at)
VALUES ('usr_nalu_05', 'Nalule Achieng', 'Stylist and skincare nerd based in Kampala. I write about thrifted fabric, slow wardrobes, kitenge tailoring, and the small rituals that make getting dressed feel like a conversation with yourself rather than a performance for everyone else.', 'Uganda', 'UG', 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=500&q=80', '["Fashion","Beauty","Design","Life","Uganda"]', '[{"label":"Instagram","href":"https://instagram.com/nalule.styles"},{"label":"Lookbook","href":"https://nalule.style"}]', '2026-10-01 08:00:00');

INSERT OR IGNORE INTO notepages (id, owner_id, slug, name, description, cover_path, bg, ink, accent, heading_font, body_font, hand_font, paid_until, created_at)
VALUES ('np_nalu_05', 'usr_nalu_05', 'nalule', 'Threads & Glow', 'Notes on slow fashion, kitenge, skin rituals, and dressing for yourself.', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80', 'oklch(0.96 0.02 40)', 'oklch(0.24 0.03 30)', '#be185d', 'Instrument Serif', 'DM Sans', 'Caveat', '2030-01-01 00:00:00', '2026-10-01 08:30:00');

INSERT OR IGNORE INTO notes (id, notepage_id, author_id, title, html, preview, status, published_at, created_at, updated_at) VALUES
('note_nalu_1', 'np_nalu_05', 'usr_nalu_05', 'The tailor on Luwum Street', '<p>Mama Rose has been cutting kitenge for thirty years. She doesn''t take measurements twice.</p><p>I brought her a wax print I found at Owino and a photo of a dress I liked. She looked at me, not the photo, and said <em>"this one is not for your shoulders."</em> She was right.</p><blockquote><p>Good tailoring is just someone paying close attention to you.</p></blockquote><p>The dress cost less than a fast-fashion top and will outlive all of them.</p>', 'Mama Rose has been cutting kitenge for thirty years. She doesn''t take measurements twice.', 'published', '2026-10-06 10:00:00', '2026-10-06 10:00:00', '2026-10-06 10:00:00'),
('note_nalu_2', 'np_nalu_05', 'usr_nalu_05', 'My skincare routine is three things', '<p>Cleanser. Moisturiser. Sunscreen. That''s it.</p><p>I used to own eleven bottles. Most of them were promises. My skin got better when I stopped interrupting it.</p><p>Shea butter from Gulu does more for my elbows than anything with a French name.</p>', 'Cleanser. Moisturiser. Sunscreen. That''s it.', 'published', '2026-10-03 07:40:00', '2026-10-03 07:40:00', '2026-10-03 07:40:00'),
('note_nalu_3', 'np_nalu_05', 'usr_nalu_05', 'Thrifting at Owino before 8am', '<p>The good bales open early. Bring cash, small notes, and patience.</p><p>Today: a linen shirt, a wool blazer that needs new buttons, and a silk scarf someone in another country loved once.</p>', 'The good bales open early. Bring cash, small notes, and patience.', 'published', '2026-09-28 09:15:00', '2026-09-28 09:15:00', '2026-09-28 09:15:00'),
('note_nalu_4', 'np_nalu_05', 'usr_nalu_05', 'On wearing the same thing', '<p>I wore the same black dress four days in a row. Nobody noticed. I noticed how much lighter my mornings felt.</p>', 'I wore the same black dress four days in a row. Nobody noticed.', 'published', '2026-09-22 18:00:00', '2026-09-22 18:00:00', '2026-09-22 18:00:00');

INSERT OR IGNORE INTO notetags (id, name) VALUES
('tag_fashion', 'fashion'), ('tag_beauty', 'beauty'), ('tag_skincare', 'skincare'), ('tag_thrifting', 'thrifting'), ('tag_life', 'life');

INSERT OR IGNORE INTO note_notetags (note_id, notetag_id)
SELECT 'note_nalu_1', id FROM notetags WHERE name IN ('fashion','thrifting') UNION ALL
SELECT 'note_nalu_2', id FROM notetags WHERE name IN ('beauty','skincare') UNION ALL
SELECT 'note_nalu_3', id FROM notetags WHERE name IN ('thrifting','fashion') UNION ALL
SELECT 'note_nalu_4', id FROM notetags WHERE name IN ('fashion','life');
