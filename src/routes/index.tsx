import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React, { useContext } from 'react';
import { BodySecondary } from '@/atomic/atm.typography/typography.component.style';
import { Form, FormError, FormField, FormSubmit } from '@/atomic/obj.form/form.component';
import { LoginHero } from '@/components/login-hero.component';
import { useNavigateToNextRoute } from '@/core/route/navigate-to-next-route.hook';
import { useLogin } from '@/core/use-login';
import { DrawerContext } from './__root';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

const DEV_EMAIL = import.meta.env.VITE_DEV_EMAIL;
const DEV_PASSWORD = import.meta.env.VITE_DEV_PASSWORD;

function RouteComponent() {
  const { openDrawer } = useContext(DrawerContext);
  const { login, loading, data, error } = useLogin();
  const { navigateToNextRoute } = useNavigateToNextRoute();
  const navigate = useNavigate();

  const [email, setEmail] = React.useState(import.meta.env.DEV ? DEV_EMAIL : '');
  const [password, setPassword] = React.useState(import.meta.env.DEV ? DEV_PASSWORD : '');

  React.useEffect(() => {
    if (data?.user) {
      navigateToNextRoute();
    }
  }, [data, navigateToNextRoute]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    if (!error) {
      navigate({ to: '/ok' });
    }
  };

  return (
    <div className="flex flex-col justify-between sm:flex-row">
      <div className="relative hidden items-center justify-center sm:flex sm:w-1/2">
        <LoginHero />
      </div>

      <div className="flex min-h-screen w-full flex-col items-center justify-center px-md sm:w-1/2 sm:px-sm">
        {/* Login Form */}
        <div className="flex w-[30vw] flex-col items-center gap-md">
          <Form onSubmit={handleSubmit} className="max-w-[20vw]">
            <FormField
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              required
            />

            <FormField
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Your password"
              required
            />

            <FormError error={error} defaultMessage="Invalid email or password" />

            <FormSubmit loading={loading}>Login</FormSubmit>

            <BodySecondary className="mt-md text-center font-light text-[#B6B6B6] text-sm">
              Forgot your password? <span className="text-normal font-normal hover:underline">Reset it</span>
            </BodySecondary>
            <BodySecondary className="text-center font-light text-[#B6B6B6] text-sm">
              Don't have an account?{' '}
              <span className="text-normal font-normal hover:underline cursor-pointer" onClick={openDrawer}>
                Register
              </span>
            </BodySecondary>
          </Form>
        </div>
      </div>
    </div>
  );
}
