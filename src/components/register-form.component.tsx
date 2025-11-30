import React, { useContext } from 'react';
import { BodySecondary } from '@/atomic/atm.typography/typography.component.style';
import { Form, FormError, FormField, FormSubmit } from '@/atomic/obj.form/form.component';
import { useNavigateToNextRoute } from '@/core/route/navigate-to-next-route.hook';
import { useRegister } from '@/core/use-register';
import { DrawerContext } from '@/routes/__root';

export function RegisterForm() {
  const { closeDrawer } = useContext(DrawerContext);
  const { register, loading, data, error } = useRegister();
  const { navigateToNextRoute } = useNavigateToNextRoute();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(email, password);
  };

  React.useEffect(() => {
    if (data?.user) {
      navigateToNextRoute();
    }
  }, [data, navigateToNextRoute]);

  return (
    <div className="flex max-h-[100vh] flex-col justify-between overflow-y-hidden sm:flex-row">
      {/* Right */}
      <div className="flex min-h-screen w-full flex-col items-center justify-center px-md sm:px-sm">
        {/* Registration Form */}
        <div className="flex w-full flex-col items-center gap-md">
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
              <span className="text-normal font-normal hover:underline cursor-pointer" onClick={closeDrawer}>
                Login
              </span>
            </BodySecondary>
          </Form>
        </div>
      </div>
    </div>
  );
}
