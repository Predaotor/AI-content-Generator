import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { Background } from '../background/Background';
import { Button } from '../button/Button';
import { useAuth } from '../context/AuthContext';
import { HeroOneButton } from '../hero/HeroOneButton';
import { Section } from '../layout/Section';
import { NavbarTwoColumns } from '../navigation/NavbarTwoColumns';
import { Logo } from './Logo';

const Hero = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [aiText] = useState('');
  const [loading] = useState(false);

  const handleStartTrial = async () => {
    if (!user) {
      router.push('/signin');
    } else {
      router.push('/ai');
    }
  };

  return (
    <Background color="bg-indigo-500" smoothScroll>
      <Section yPadding="py-6">
        <NavbarTwoColumns logo={<Logo xl />}>
          <li>
            <Link href="https://github.com/Predaotor/AI-content-Generator">
              GitHub
            </Link>
          </li>
          {user ? (
            <>
              <li className="text-black">
                <Link href="/profile">{user.username}</Link>
              </li>
              <li>
                <button onClick={logout} className="text-gray">
                  Log Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/signin">Log in</Link>
              </li>
              <li>
                <Link href="/signup">Sign up</Link>
              </li>
            </>
          )}
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
            <span className="text-black">
              Generate high-quality blog posts, email copy, sophisticated images
              and more with AI-powered writing tools.
            </span>
          }
          button={
            <button onClick={handleStartTrial}>
              <Button xl>
                {loading ? 'Generating...' : 'Start Your Free Trial'}
              </Button>
            </button>
          }
        />

        {aiText && (
          <div className="mx-auto mt-10 max-w-2xl rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-2 text-xl font-semibold text-indigo-700">
              AI Generated Output
            </h2>
            <p className="whitespace-pre-wrap text-gray-800">{aiText}</p>
          </div>
        )}
      </Section>
    </Background>
  );
};

export { Hero };
