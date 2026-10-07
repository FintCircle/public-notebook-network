-- Seed data for two fully complete Notepages in Cloudflare D1.

INSERT OR IGNORE INTO profiles (id, display_name, bio, country, country_code, portrait_url, interests_json, links_json, created_at)
VALUES
('usr_derrick_01', 'Derrick Katungi', 'Founder of Inktella. Building Pangisa. Thinking out loud about software, typography, and living in Kampala, Uganda.', 'Uganda', 'UG', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80', '["Technology","Building","Design","Uganda","Startups"]', '[{"label":"Website","href":"https://derrickkatungi.com"},{"label":"Twitter","href":"https://x.com/derrickkatungi"}]', '2026-09-01 08:00:00'),
('usr_amara_02', 'Amara Chen', 'Game designer & indie photographer living in Nairobi. Exploring slow software, pixel art, and morning walks.', 'Kenya', 'KE', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80', '["Design","Photography","Books","Life","Music"]', '[{"label":"Portfolio","href":"https://amarachen.design"},{"label":"Photos","href":"https://unsplash.com/@amara"}]', '2026-09-02 09:00:00'),
('usr_joel_03', 'Joel M', 'Software developer exploring decentralized web and photography.', 'Uganda', 'UG', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80', '["Technology","Building"]', '[]', '2026-09-03 10:00:00'),
('usr_sarah_04', 'Sarah W', 'Illustrator and storyteller.', 'Kenya', 'KE', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80', '["Design","Writing"]', '[]', '2026-09-04 11:00:00');

INSERT OR IGNORE INTO notepages (id, owner_id, slug, name, description, cover_path, bg, ink, accent, heading_font, body_font, hand_font, paid_until, created_at)
VALUES
('np_derrick_01', 'usr_derrick_01', 'derrick', 'Derrick''s Notes', 'Thoughts, things I''m building, and whatever else ends up here.', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80', '#f5f1e8', '#1f2933', '#c2410c', 'Space Grotesk', 'DM Sans', 'Caveat', '2030-01-01 00:00:00', '2026-09-01 08:30:00'),
('np_amara_02', 'usr_amara_02', 'amara', 'Amara''s Notebook', 'Wandering through games, morning walks, and quiet design observations.', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', '#dce8d5', '#1f2933', '#15803d', 'Lora', 'DM Sans', 'Caveat', '2030-01-01 00:00:00', '2026-09-02 09:30:00');

INSERT OR IGNORE INTO notes (id, notepage_id, author_id, title, html, preview, status, published_at, created_at, updated_at)
VALUES
('note_derrick_1', 'np_derrick_01', 'usr_derrick_01', 'I keep rebuilding things', '<p>Maybe rebuilding isn''t starting over. Sometimes the first version only exists to show you what you actually wanted.</p><p>I have done this with almost every project I''ve built. First comes the complex version with endless options, dashboards, and settings. Then comes the realization that nobody—including myself—actually wanted all that noise.</p><blockquote><p>Simplification is not the lack of features. It is the clarity of purpose.</p></blockquote><p>When we started working on Inktella, we almost made it another blogging tool. But then we remembered why people keep physical paper notebooks: because they''re personal, quiet, and imperfect.</p>', 'Maybe rebuilding isn''t starting over. Sometimes the first version only exists to show you what you actually wanted.', 'published', '2026-09-17 10:00:00', '2026-09-17 10:00:00', '2026-09-17 10:00:00'),
('note_derrick_2', 'np_derrick_01', 'usr_derrick_01', 'Something I noticed today', '<p>I think we''ve made personal websites far too serious.</p><p>Everyone''s home page looks like an enterprise SaaS landing page now. Hero headings, feature grids, logos of companies they once talked to, and newsletter popups before you can read a single sentence.</p><p>What happened to just writing down something you saw on your walk?</p>', 'I think we''ve made personal websites far too serious.', 'published', '2026-09-15 14:30:00', '2026-09-15 14:30:00', '2026-09-15 14:30:00'),
('note_derrick_3', 'np_derrick_01', 'usr_derrick_01', 'Why small teams move faster', '<p>When communication bandwidth is tight, momentum stays high.</p><p>Two people who trust each other''s taste don''t need wireframes or product spec documents for every small UI tweak. They just build it, look at it, and fix what feels wrong.</p>', 'When communication bandwidth is tight, momentum stays high.', 'published', '2026-09-10 09:15:00', '2026-09-10 09:15:00', '2026-09-10 09:15:00'),
('note_amara_1', 'np_amara_02', 'usr_amara_02', 'Maybe I don''t hate mornings', '<p>I started walking before work this week. Something about watching the coffee shops slowly open in Nairobi...</p><p>For years I convinced myself I was strictly a night owl. But early morning light through jacaranda trees has a kind of stillness you can''t buy at 1:00 AM.</p><p>I brought a tiny paper pocketbook and wrote three sentences while waiting for my coffee.</p>', 'I started walking before work this week. Something about watching the coffee shops slowly open in Nairobi...', 'published', '2026-09-18 07:20:00', '2026-09-18 07:20:00', '2026-09-18 07:20:00'),
('note_amara_2', 'np_amara_02', 'usr_amara_02', 'Designing small games', '<p>When building tiny games, the temptation to add extra mechanics is overwhelming. You think: <em>"What if the player had a grappling hook? What if there were skill trees?"</em></p><p>Then you strip it all away and leave only one core movement. Suddenly the game has a soul.</p>', 'The second version taught me something the first never could.', 'published', '2026-09-12 16:45:00', '2026-09-12 16:45:00', '2026-09-12 16:45:00'),
('note_amara_3', 'np_amara_02', 'usr_amara_02', 'Books on my wooden table', '<p>Physical books don''t send notifications. They just sit there patiently waiting for you.</p><p>Currently re-reading <em>The Architecture of Happiness</em>. It''s gentle and reminds me why spaces shape our minds.</p>', 'Physical books don''t send notifications. They just sit there patiently.', 'published', '2026-09-05 11:00:00', '2026-09-05 11:00:00', '2026-09-05 11:00:00');

INSERT OR IGNORE INTO notetags (id, name) VALUES
('tag_building', 'building'),
('tag_thoughts', 'thoughts'),
('tag_web', 'web'),
('tag_thingsinotice', 'thingsinotice'),
('tag_startups', 'startups'),
('tag_life', 'life'),
('tag_design', 'design'),
('tag_books', 'books');

INSERT OR IGNORE INTO note_notetags (note_id, notetag_id) VALUES
('note_derrick_1', 'tag_building'),
('note_derrick_1', 'tag_thoughts'),
('note_derrick_2', 'tag_web'),
('note_derrick_2', 'tag_thingsinotice'),
('note_derrick_3', 'tag_startups'),
('note_derrick_3', 'tag_building'),
('note_amara_1', 'tag_life'),
('note_amara_1', 'tag_thoughts'),
('note_amara_2', 'tag_design'),
('note_amara_2', 'tag_building'),
('note_amara_3', 'tag_books'),
('note_amara_3', 'tag_life');

INSERT OR IGNORE INTO likes (user_id, note_id, created_at) VALUES
('usr_amara_02', 'note_derrick_1', '2026-09-17 11:00:00'),
('usr_joel_03', 'note_derrick_1', '2026-09-17 12:00:00'),
('usr_amara_02', 'note_derrick_2', '2026-09-15 15:00:00'),
('usr_joel_03', 'note_derrick_3', '2026-09-10 10:00:00'),
('usr_sarah_04', 'note_derrick_3', '2026-09-10 11:00:00'),
('usr_derrick_01', 'note_amara_1', '2026-09-18 08:00:00'),
('usr_sarah_04', 'note_amara_1', '2026-09-18 09:00:00'),
('usr_derrick_01', 'note_amara_2', '2026-09-12 17:00:00'),
('usr_joel_03', 'note_amara_2', '2026-09-12 18:00:00'),
('usr_sarah_04', 'note_amara_3', '2026-09-05 12:00:00');

INSERT OR IGNORE INTO guestnotes (id, notepage_id, author_id, author_name, body, created_at) VALUES
('gn_derrick_1', 'np_derrick_01', 'usr_amara_02', 'Amara Chen', 'Love the quiet tone of this notebook, Derrick! Rebuilding really is just distilling down to what matters.', '2026-09-17 12:00:00'),
('gn_derrick_2', 'np_derrick_01', 'usr_joel_03', 'Joel M', 'That note on personal websites hit home. We need more spaces like Inktella!', '2026-09-16 08:45:00'),
('gn_amara_1', 'np_amara_02', 'usr_derrick_01', 'Derrick Katungi', 'The light in Nairobi early morning really is something special. Great to read your notes, Amara!', '2026-09-18 09:30:00'),
('gn_amara_2', 'np_amara_02', 'usr_sarah_04', 'Sarah W', 'Your note on small game design resonated so much with my work in illustration!', '2026-09-13 14:10:00');
