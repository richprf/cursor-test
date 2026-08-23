import Image from 'next/image';

export function WwakeHero() {
  return (
    <section className="ww-hero">
      <div className="ww-hero-media">
        <Image
          src="/landing/wwake/hero-banner.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hidden md:block"
        />
        <Image
          src="/landing/wwake/hero-portrait.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="md:hidden"
        />
      </div>
      <div className="ww-hero-copy">
        <h1 className="ww-hero-title">Echoes Collection</h1>
        <a href="#echoes" className="ww-link">
          Shop
        </a>
      </div>
    </section>
  );
}
