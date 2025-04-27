import Link from 'next/link';

import { Background } from '../background/Background';
import { Button } from '../button/Button';
import { HeroOneButton } from '../hero/HeroOneButton';
import { Section } from '../layout/Section';
import { NavbarTwoColumns } from '../navigation/NavbarTwoColumns';
import { Logo } from './Logo';

const Hero = () => (
  <Background color="bg-indigo-500">
    <Section yPadding="py-6">
      <NavbarTwoColumns logo={<Logo xl />}>
        <li>
          <Link href="https://github.com/your-repo">GitHub</Link>
        </li>
        <li>
          <Link href="/signin">Sign in</Link>
        </li>
      </NavbarTwoColumns>
    </Section>

    <Section yPadding="pt-20 pb-32">
      <HeroOneButton
        title={
          <>
            {'Boost Your Content Creation with AI\n'}
            <span className="text-black-500 font-medium">
              Effortless Content, Faster Results
            </span>
          </>
        }
        description={
          <span className=" text-black">
            Generate high-quality blog posts, email copy, and more with
            AI-powered writing tools.
          </span>
        }
        button={
          <Link href="/signup">
            <Button xl>Start Your Free Trial</Button>
          </Link>
        }
      />
    </Section>
  </Background>
);

export { Hero };
