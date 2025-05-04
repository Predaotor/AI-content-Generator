import Link from 'next/link';
import { useAuth } from '../context/AuthContext';  // Import the custom hook for auth context

import { Background } from '../background/Background';
import { Button } from '../button/Button';
import { HeroOneButton } from '../hero/HeroOneButton';
import { Section } from '../layout/Section';
import { NavbarTwoColumns } from '../navigation/NavbarTwoColumns';
import { Logo } from './Logo';


const Hero = () => {
  const { user, logout } = useAuth();  // Get user data and logout function from context
  
  return (
    <Background color="bg-indigo-500" smoothScroll>
      <Section yPadding="py-6">
        <NavbarTwoColumns logo={<Logo xl />}>
          <li>
            <Link href="https://github.com/your-repo">GitHub</Link>
          </li>
          {user ? (
            // Show username and logout button when user is logged in
            <>
              <li className="text-black">
                <Link href='/profile'>{user.username}</Link>
                </li>
              <li>
                <button onClick={logout} className="text-gray">Log Out</button>
              </li>
            </>
          ) : (
            // Show Sign In and Sign Up when user is not logged in
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
              Generate high-quality blog posts, email copy, and more with AI-powered writing tools.
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
};

export { Hero };
