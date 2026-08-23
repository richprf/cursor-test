import Image from 'next/image';
import { JOURNAL, TILES } from '@/lib/wwake-data';

export function WwakeIntro() {
  return (
    <section id="echoes" className="ww-intro">
      <h2>Echoes Collection</h2>
      <p>
        A new collection born from synchronicities hidden just under the surface: a swatch of lace, a seed pearl, a
        piece of gold, connections that have always been there, waiting to be noticed. Each piece is a world unto
        itself, and part of a larger conversation together— gestures we keep returning and responding to.
      </p>
      <a href="#shop" className="ww-link">
        Discover the Collection
      </a>
    </section>
  );
}

export function WwakeMega() {
  return (
    <section className="ww-mega">
      <article className="ww-mega-item">
        <Image src="/landing/wwake/aqua.jpg" alt="" width={1200} height={1500} />
        <div className="ww-mega-copy">
          <h2>Aquamarine</h2>
          <a href="#shop" className="ww-link">
            Shop [10]
          </a>
          <p>
            Aquamarine is named for what it resembles: not dark ocean depth, but crystalline shallows where sunlight
            cuts through. Ranging from pale sky to green-turquoise, aquamarine is a variety of beryl, the mineral from
            which the first spectacle lenses were cut in medieval Europe.
          </p>
          <a href="#shop" className="ww-link">
            Shop Aquamarine
          </a>
        </div>
      </article>
      <article className="ww-mega-item">
        <Image src="/landing/wwake/moon.jpg" alt="" width={1200} height={1500} />
        <div className="ww-mega-copy">
          <h2>Moonstones</h2>
          <a href="#shop" className="ww-link">
            Shop [14]
          </a>
          <p>
            A moonstone catches its own incandescence, set in asymmetry. Every piece is its own world, formed once in
            the making, and again with every wearing.
          </p>
          <a href="#shop" className="ww-link">
            Shop Moonstone
          </a>
        </div>
      </article>
    </section>
  );
}

export function WwakeJournal() {
  return (
    <section id="journal" className="ww-journal">
      <div className="ww-journal-intro">
        <h2>Continuum Journal Series</h2>
        <a href="#journal" className="ww-link">
          Shop [334]
        </a>
        <p>
          Jewelry exists within a continuum that begins with the earth and continues through every hand in between. We
          believe jewelry is a connection to the earth and the people who shape it along the way. Each piece begins
          with materials drawn from the earth, shaped through the knowledge and care of many hands. From sourcing and
          making to wearing and collecting, jewelry moves through lives and communities over time.
        </p>
        <p>
          Continuum is a journal series by WWAKE that traces this living process through five perspectives: From The
          Earth. Through The Studio. Onto The Body. Across A Lifetime. With Others.
        </p>
        <a href="#journal" className="ww-link">
          Read More
        </a>
      </div>
      <div className="ww-journal-track">
        {JOURNAL.map((entry) => (
          <article key={entry.title} className="ww-journal-card">
            <h3>{entry.title}</h3>
            <time>{entry.date}</time>
            <Image src={entry.image} alt="" width={286} height={358} />
          </article>
        ))}
      </div>
    </section>
  );
}

export function WwakeValues() {
  return (
    <section id="visit" className="ww-values">
      <ul className="ww-value-list">
        <li>
          <h3>
            <span>1</span> Made In New York
          </h3>
          <p>Ethically sourced solid gold and natural stones, selected with care</p>
        </li>
        <li>
          <h3>
            <span>2</span> Crafted To Last
          </h3>
          <p>Designed for longevity, covered under warranty</p>
        </li>
        <li>
          <h3>
            <span>3</span> Shipping & Returns
          </h3>
          <p>Worldwide shipping and returns, with duties calculated upfront</p>
        </li>
      </ul>
      <aside className="ww-value-post">
        <Image src="/landing/wwake/j5.jpg" alt="" width={144} height={180} />
        <p>27 05 2026</p>
        <p>Natural and Antique Diamonds: What Each Stone Carries</p>
      </aside>
    </section>
  );
}

export function WwakeTiles() {
  return (
    <section className="ww-tiles">
      {TILES.map((tile) => (
        <a key={tile.title} href={tile.href} className="ww-tile">
          <Image src={tile.image} alt="" width={400} height={500} />
          <span className="ww-link">
            {tile.title}
            {'count' in tile && tile.count ? ` [${tile.count}]` : ''}
          </span>
        </a>
      ))}
    </section>
  );
}

export function WwakeFooter() {
  return (
    <footer className="ww-footer">
      <div className="ww-footer-grid">
        <form className="ww-news" action="#visit">
          <label htmlFor="ww-email">Newsletter</label>
          <div className="ww-news-row">
            <input id="ww-email" type="email" name="email" placeholder="Your email here" />
            <button type="submit" className="ww-link">
              Get notified
            </button>
          </div>
        </form>
        <div className="ww-footer-menus">
          <div>
            <p>Follow</p>
            <a href="https://www.instagram.com/wwake/" className="ww-link">
              Instagram
            </a>
            <a href="https://www.facebook.com/WWAKEstudio" className="ww-link">
              Facebook
            </a>
            <a href="https://www.tiktok.com/@wwakeworld" className="ww-link">
              Tiktok
            </a>
            <a href="#journal" className="ww-link">
              Press
            </a>
          </div>
          <div>
            <p>Information</p>
            <a href="#visit" className="ww-link">
              FAQ&apos;s
            </a>
            <a href="/login" className="ww-link">
              Contact
            </a>
            <a href="#visit" className="ww-link">
              Visit Us
            </a>
            <a href="#shop" className="ww-link">
              Try At Home
            </a>
            <a href="#visit" className="ww-link">
              Stockists
            </a>
            <a href="#journal" className="ww-link">
              Careers
            </a>
          </div>
          <div>
            <p>Ethos</p>
            <a href="#journal" className="ww-link">
              Ethos
            </a>
            <a href="#visit" className="ww-link">
              Materials
            </a>
            <a href="#values" className="ww-link">
              Diamond Guide
            </a>
            <a href="#values" className="ww-link">
              Custom
            </a>
            <a href="#journal" className="ww-link">
              Heirloom
            </a>
            <a href="#journal" className="ww-link">
              Continuum Journal
            </a>
          </div>
        </div>
      </div>
      <p className="ww-wordmark">WW</p>
      <div className="ww-legal">
        <span>Privacy policy</span>
        <span>Terms of services</span>
        <span>© All rights reserved</span>
      </div>
    </footer>
  );
}
