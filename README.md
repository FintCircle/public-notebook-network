# Public Notebook Network

INKTELLA

The Public Notebook Network

1. Product Overview

Inktella is a typography-first public notebook network built around personal writing.

It is not designed around polished blog posts, newsletters, professional publishing, or building an audience.

People write Notes about:

experiences

thoughts

stories

observations

things they learned

things they are doing

unfinished ideas

things they simply want to put somewhere

The philosophy is simple:

Not everything needs to become an article.

Writing can be imperfect, short, strange, personal, unfinished, or spontaneous.

Inktella should feel more human than a traditional blogging platform.

2. Core Terminology

Inktella

The entire platform and public notes network.

Notepage

A user's personal public notebook.

A Notepage is a customizable writing space with its own identity, appearance, Notes and Notetags.

Users may own multiple Notepages.

Each Notepage costs:

$10/year

Pricing is per Notepage, not per account.

Example:

A user could own:

Derrick's Notes

Building Pangisa

Things I Notice

These are three independent Notepages and therefore cost $30/year total.

Note

An individual piece of writing published inside a Notepage.

A Note does NOT need to behave like a traditional blog article.

It may contain:

one paragraph

several sentences

a thought

a story

a long-form piece

images

links

quotations

headings

lists

embedded media

There should be no pressure for a Note to reach a certain length.

Notetag

Inktella's version of a hashtag.

Examples:

#building

#uganda

#life

#design

#thingsinotice

Notetags connect Notes both within an individual Notepage and across Inktella.

Notella

The minimal discovery feed.

Notella helps people encounter Notes and writers related to their selected interests.

Tellaverse

The wider Inktella network.

When viewing a Notetag from someone's Notepage, the reader can switch from that person's entries to entries carrying the same Notetag from across Inktella.

3. Product Philosophy

The interface should communicate:

Let's be human.

Avoid making Inktella feel like:

Medium

Substack

a CMS

LinkedIn

a creator dashboard

a traditional social network

Do not encourage people to optimize their writing for algorithms.

Avoid excessive metrics, dashboards and engagement mechanics.

The primary action throughout the product is:

Write a Note.

4. Visual Direction

Inktella should be:

Typography first + minimal + intentionally imperfect.

The underlying interface must be extremely clean and usable.

Human imperfection is then sprinkled over that foundation.

Examples:

handwritten annotations

handwritten headings

imperfect underlines

small arrows

crossed-out words

margin notes

slightly rotated decorative text

occasional paper/notebook references

irregular separators

subtle doodles

These should NEVER interfere with reading.

The design should feel intentionally messy rather than poorly designed.

Important rule

The UX is clean. The personality is messy.

Buttons, forms, menus, editor controls and navigation remain predictable.

5. Typography

Typography is one of the most important elements of Inktella.

Use excellent readable fonts for normal interface text and Notes.

Also provide several handwritten fonts for decorative elements.

Handwritten typography should be sprinkled throughout the platform rather than used for every piece of text.

Notepage owners can choose the typography used on their individual Notepage.

Provide a curated font collection rather than arbitrary uploaded fonts.

Font configuration could include:

Body font
Heading font
Accent/handwritten font

The reading experience must remain accessible regardless of customization.

6. Accounts

Users create one Inktella account.

An account can own multiple Notepages.

Account data includes:

name

username

profile image

bio

selected interests

owned Notepages

liked Notes

The account and Notepage should remain separate concepts.

A person owns Notepages.

7. Notepage Creation

Users can create a new Notepage.

Required:

Notepage name

Optional:

Description

Then allow customization.

Appearance

Choose:

background color

background image

heading font

body font

accent/handwritten font

The selected background applies sitewide while browsing that Notepage.

This includes:

Notepage homepage

individual Notes

local Notetag pages

The person's Notepage should therefore feel like entering their own little part of Inktella.

8. URL Architecture

Every Notepage receives a subdomain.

Example:

derrick.inktella.com

Individual Notes use:

derrick.inktella.com/notepage/note-xxx

Notetag example:

derrick.inktella.com/notetags/building

The platform itself remains:

inktella.com

Examples of platform-level pages:

inktella.com/notella

inktella.com/explore

inktella.com/notetags/building

inktella.com/settings

The architecture must support wildcard subdomains.

Conceptually:

*.inktella.com

The application should determine the requested Notepage from the subdomain and render that Notepage's theme and content.

9. Notepage Layout

A Notepage should remain extremely simple.

Desktop example:

DERRICK'S NOTES

Thoughts, things I'm building,
and whatever else ends up here.

                                    [About]

────────────────────────────────────────

17 SEPTEMBER 2026

I keep rebuilding things

Maybe rebuilding isn't starting over.
Sometimes the first version only exists
to show you what you actually wanted.

#building  #thoughts

♡ 12

────────────────────────────────────────

15 SEPTEMBER 2026

Something I noticed today

I think we've made personal websites
far too serious.

#web  #thingsinotice

♡ 4


No giant card grid.

No unnecessary sidebar.

No clutter.

Writing dominates the page.

10. Note Editor

The Note editor MUST be WYSIWYG.

Do not expose Markdown syntax as the primary writing experience.

The editor should feel closer to writing on an empty sheet of paper than operating a CMS.

Start with:

Untitled

Then an empty writing surface.

When text is selected, display a small contextual formatting toolbar.

Support:

bold

italic

headings

links

blockquotes

ordered lists

unordered lists

inline code where appropriate

code blocks

images

embeds

horizontal separators

Media must be insertable between paragraphs.

Do NOT require featured images.

Do NOT require excerpts.

Do NOT require categories.

Do NOT show SEO tools.

Do NOT clutter the editor with permanent formatting toolbars.

11. Publishing

Publishing should require minimal effort.

Primary controls:

Save draft

Publish

Before publishing, optionally add Notetags.

Example:

#building #design #thoughts

Once published, generate the Note URL.

Notes can later be:

edited

unpublished

deleted

12. Likes

Every Note has a simple like action.

Use:

♡ → unliked

♥ → liked

Do not make likes visually dominant.

The purpose is lightweight appreciation rather than competition.

Store:

note_id

user_id

created_at

One account may like a Note only once.

13. Notetags

Notetags are shared across the entire network.

Suppose Derrick publishes:

#building

Another user also publishes:

#building

Both belong to the same global Notetag concept.

However, clicking the Notetag while inside Derrick's Notepage initially shows Derrick's entries.

Example:

#building

Notes from Derrick

[DERRICK]   [TELLAVERSE]
────────

I rebuilt the homepage again
September 17

Why I'm simplifying Pangisa
September 12

Building something nobody asked for
September 3


The switcher allows:

Derrick

or

Tellaverse

Selecting Tellaverse displays Notes using #building from across Inktella.

Example:

#building

[DERRICK]   [TELLAVERSE]
             ──────────

Amara
Building my first tiny game

Joel
What I learned rebuilding authentication

Derrick
I rebuilt the homepage again


This mechanic is central to discovery.

14. Interests

During onboarding, users select interests.

Examples:

Technology
Building
Design
Books
Life
Travel
Photography
Startups
Writing
Music
Uganda
Culture
Personal stories

Interests are broader than Notetags.

Interests primarily influence Notella.

Allow users to modify interests later.

15. Notella

Notella is Inktella's discovery feed.

It connects people through interests and writing.

It should NOT look like a conventional social media feed.

Keep it extremely minimal.

Example:

NOTELLA

notes around things you care about

────────────────────────────

◯ Amara

Maybe I don't hate mornings

I started walking before work this
week. Something about watching the
shops slowly open...

#life  #thoughts

♡ 18                         Read →

────────────────────────────

◯ Joel

Building the same thing twice

The second version taught me something
the first never could...

#building

♡ 7                          Read →

────────────────────────────


Each feed entry should primarily contain:

profile image

writer/Notepage identity

Note title if one exists

short Note preview

Notetags

like

Read →

Do not turn Notes into large visual social-media cards.

16. Notella Matching

MVP recommendations can remain simple.

Rank Notes using signals such as:

shared interests

Notetags related to selected interests

recently published Notes

writers the reader has interacted with

Avoid optimizing solely around likes.

Popularity should not completely determine visibility.

The objective is:

Find people writing about things you care about.

Not:

Show whatever is currently viral.

17. Individual Note View

Reading mode should be beautiful and distraction-free.

Example:

← entry from Derrick's Notepage (handwritten font)


I KEEP REBUILDING THINGS

17 September 2026


Maybe rebuilding isn't starting over.

Sometimes the first version only exists
to show you what you actually wanted.

I have done this with almost every
project I've built...


#building   #thoughts


♡ 12


                         — Derrick
(short bio) 


The owner's selected Notepage:

background

typography

styling

remain visible.

The reader should feel they are still inside that person's space.

18. Homepage

The homepage should explain Inktella without lengthy SaaS marketing language.

Suggested direction:

INKTELLA

the public notebook network


Not everything needs
to be an article.


Write what happened.

Something you're thinking about.

Something you learned.

A story you don't want to lose.

Something unfinished.


     it doesn't have to be impressive.
                  ↖ handwritten


[ Start a Notepage — $10/year ]

Wander around →


Further down:

People have always
kept notebooks.

We just made these
ones public.


Show actual public Notes beneath this rather than endless feature cards.

Another section:

YOUR LITTLE CORNER.

Your background.
Your type.
Your notes.

        make a mess if you want.

$10 / year / Notepage


19. Navigation

Keep global navigation tiny.

Desktop:

Inktella · Notella · Explore · Note down(write) · Profile

Mobile should use similarly minimal navigation.

When inside a personal Notepage, prioritize the person's identity instead of Inktella's global navigation.

20. Search and Discovery

Search should eventually support:

people

Notepages

Notes

Notetags

Notetags and Notella should remain major discovery mechanisms.

Search should not overwhelm the homepage.

21. Payments

Each Notepage requires an active annual subscription.

Price:

$10 USD/year per Notepage

Subscription belongs to the Notepage.

Data model should therefore not simply contain:

user.subscription = active

Instead:

notepage
    owner_id
    subscription_status
    subscription_started_at
    subscription_expires_at


This allows one account to own multiple independently billed Notepages.

Do not delete writing immediately if a subscription expires.

Place the Notepage into an inactive/grace state and allow renewal.

22. Suggested Data Model

Core entities:

users

id
username
name
bio
avatar_url
created_at

interests

id
name
slug

user_interests

user_id
interest_id

notepages

id
owner_id
name
slug
subdomain
description
background_type
background_value
heading_font
body_font
accent_font
subscription_status
subscription_expires_at
created_at

notes

id
notepage_id
author_id
slug
title
content
content_text
status
published_at
updated_at
created_at

notetags

id
name
slug

note_notetags

note_id
notetag_id

likes

user_id
note_id
created_at

media

id
owner_id
note_id
type
url
metadata
created_at

23. Important Product Rules

A user can own multiple Notepages.

Each Notepage costs $10/year.

A Note always belongs to a Notepage.

Notepages are public spaces.

Notes can be short or long.

There is no minimum writing length.

No featured image is required.

The editor is WYSIWYG.

Typography is central to the product.

Notepage customization must never destroy readability.

Notetags work locally and globally.

Notella connects people through interests.

Likes remain lightweight.

The network should not revolve around popularity.

24. Responsive Design

Inktella must be designed mobile-first.

Notes should have comfortable reading widths.

Desktop layouts should NOT simply stretch text across the screen.

Target approximately:

620–760px

for primary reading content.

Large desktop screens should use whitespace deliberately.

Personal backgrounds can fill the wider viewport while the Note itself remains comfortably readable.

25. MVP

Build first:

Account creation and authentication → onboarding/interests → create Notepage → Notepage customization → WYSIWYG editor → drafts → publishing → public Notepage → individual Note → Notetags → likes → Notella → Tellaverse Notetag switching → $10/year Notepage billing → responsive interface.

Avoid adding creator analytics, newsletters, follower gamification, AI writing, complex themes, monetized posts, recommendations based on elaborate ML, or traditional blogging/CMS functionality during the first version.

26. Core Experience

The product should always preserve this hierarchy:

INKTELLA
the network

↓

NOTEBOOK / NOTEPAGE
my place

↓

NOTE
something I wrote

↓

NOTETAG
a thread through what I've written

↓

TELLAVERSE
other people's writing along that thread

↓

NOTELLA
where I discover people and Notes around things I care about

The result should feel like wandering through people's public notebooks on the web rather than scrolling through another social network.

Inktella is where the internet writes a little less perfectly.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/104d11f7-711e-445c-9f9d-63d258b6de6c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
