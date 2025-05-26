import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { fetchAIResponse } from '../utils/api';

import { Background } from '../background/Background';
import { Button } from '../button/Button';
import { HeroOneButton } from '../hero/HeroOneButton';
import { Section } from '../layout/Section';
import { NavbarTwoColumns } from '../navigation/NavbarTwoColumns';
import { Logo } from './Logo';

const Hero = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [aiText, setAiText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStartTrial = async () => {
    if (!user) {
      router.push('/signin');
      return;
    } else {
      router.push('/ai');
    }
  };

  return (
    <Background color="bg-indigo-500" smoothScroll>
      <Section yPadding="py-6">
        <NavbarTwoColumns logo={<Logo xl />}>
          <li>
            <Link href="https://github.com/Predaotor/AI-content-Generator">GitHub</Link>
          </li>
          {user ? (
            <>
              <li className="text-black">
                <Link href="/profile">{user.username}</Link>
              </li>
              <li>
                <button onClick={logout} className="text-gray">Log Out</button>
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
              Generate high-quality blog posts, email copy, sophisticated images and more with AI-powered writing tools.
            </span>
          }
          button={
            <button onClick={handleStartTrial}>
              <Button xl>{loading ? 'Generating...' : 'Start Your Free Trial'}</Button>
            </button>
          }
        />

        {aiText && (
          <div className="mt-10 bg-white p-6 rounded-xl shadow-md max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-2 text-indigo-700">AI Generated Output</h2>
            <p className="text-gray-800 whitespace-pre-wrap">{aiText}</p>
          </div>
        )}
      </Section>
    </Background>
  );
};

export { Hero };
