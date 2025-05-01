import { Background } from '../background/Background';
import { VerticalFeatureRow } from '../feature/VerticalFeatureRow';
import { Section } from '../layout/Section';

const VerticalFeatures = () => (
  <Background color="bg-indigo-800" smoothScroll>
    <Section
      title="How Our AI Content Generator Helps You"
      description="Stop wasting hours writing. Let AI do the hard work while you focus on what matters."
    >
      <VerticalFeatureRow
        title="Write Blog Posts in Seconds"
        description="Input a topic and generate a full SEO-optimized blog post instantly. Save time, grow traffic."
        image="/assets/images/feature.svg"
        imageAlt="Blog writing feature"
      />
      <VerticalFeatureRow
        title="Generate Product Descriptions Easily"
        description="Turn boring product specs into captivating product descriptions that sell more."
        image="/assets/images/feature2.svg"
        imageAlt="Product description feature"
        reverse
      />
      <VerticalFeatureRow
        title="Emails, Ads, Captions – All Done"
        description="Whether it's emails, Facebook ads, or Instagram captions, create it fast with just a few clicks."
        image="/assets/images/feature3.svg"
        imageAlt="Marketing content feature"
      />
    </Section>
  </Background>
);

export { VerticalFeatures };
