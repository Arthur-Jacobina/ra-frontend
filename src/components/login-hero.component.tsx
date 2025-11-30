import { Link } from '@tanstack/react-router';
import { H1 } from '@/atomic/atm.typography/typography.component.style';

export const LoginHero = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-row items-center font-bold">
        <div className="absolute top-0 left-0 z-1000 h-[100vh] w-[50vw] bg-gradient-to-t from-primary/75 to-primary/0 object-cover"></div>
        <img
          src="art6.png"
          alt="Logo"
          className="hidden sm:block absolute top-0 left-0 h-[100vh] w-[50vw] object-cover"
        />
        <Link to="/" className="z-1000 font-bold text-3xl text-neutral-xsoft">
          Livus
        </Link>
      </div>
      <H1 className="z-1000 text-neutral-xsoft text-center">
        Healthcare made simple. <br /> AI-powered insights for better care.
      </H1>
    </div>
  );
};
