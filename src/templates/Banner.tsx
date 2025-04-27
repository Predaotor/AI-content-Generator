import Link from 'next/link';

import { Background } from '../background/Background';
import { Button } from '../button/Button';
import { CTABanner } from '../cta/CTABanner';
import { Section } from '../layout/Section';

const Banner = () => (
  <Background color="bg-indigo-600">
    <Section>
      <CTABanner
        title=" Start generating high-quality content for blogs, emails, ads, and more. Save time and boost productivity!"
        subtitle="Start your Free Trial."
        button={
          <Link href="#">
            <Button>Get Started</Button>
          </Link>
        }
      />
    </Section>
  </Background>
);

export { Banner };
