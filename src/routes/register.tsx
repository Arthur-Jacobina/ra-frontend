import { createFileRoute, Link } from '@tanstack/react-router';
import React from 'react';
import { BodySecondary } from '@/atomic/atm.typography/typography.component.style';
import { Form, FormError, FormField, FormSubmit } from '@/atomic/obj.form/form.component';
import { LoginHero } from '@/components/login-hero.component';
import { useNavigateToNextRoute } from '@/core/route/navigate-to-next-route.hook';
import { useRegister } from '@/core/use-register';

export const Route = createFileRoute('/register')({
  component: RouteComponent,
});

function RouteComponent() {
  const { register, loading, data, error } = useRegister();
  const { navigateToNextRoute } = useNavigateToNextRoute();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(email, password);
  };

  // Only navigate after successful registration
  const hasNavigated = React.useRef(false);
  React.useEffect(() => {
    if (data?.user && !hasNavigated.current) {
      hasNavigated.current = true;
      navigateToNextRoute();
    }
  }, [data, navigateToNextRoute]);

  return (
    <div className="flex max-h-[100vh] flex-col justify-between overflow-y-hidden sm:flex-row">
      {/* Left */}
      <div className="relative hidden items-center justify-center bg-primary text-center sm:flex sm:w-1/2">
        <LoginHero />
      </div>

      {/* Right */}
      <div className="flex min-h-screen w-full flex-col items-center justify-center px-md sm:w-1/2 sm:px-sm">
        {/* Registration Form */}
        <div className="flex w-[30vw] flex-col items-center gap-md">
          <Form onSubmit={handleSubmit} className="max-w-[20vw]">
            <FormField
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              autoComplete="email"
            />

            <FormField
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Choose a strong password"
              required
              autoComplete="new-password"
              minLength={6}
            />

            <FormError error={error} defaultMessage="Registration failed. Please try again." />

            <FormSubmit loading={loading}>Register</FormSubmit>

            <BodySecondary className="mt-md text-center font-light text-[#B6B6B6] text-sm">
              Already have an account?{' '}
              <Link to="/" className="text-normal font-normal hover:underline">
                Login
              </Link>
            </BodySecondary>
          </Form>
        </div>
      </div>
    </div>
  );
}
