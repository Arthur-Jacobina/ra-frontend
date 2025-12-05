import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React from 'react';
import { BodySecondary } from '@/atomic/atm.typography/typography.component.style';
import { Form, FormField, FormSubmit } from '@/atomic/obj.form/form.component';
import { LoginHero } from '@/components/login-hero.component';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [paperId, setPaperId] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paperId.trim()) {
      navigate({ to: '/pdf/$paperId', params: { paperId: paperId.trim() } });
    }
  };

  return (
    <div className="flex flex-col justify-between sm:flex-row">
      <div className="relative hidden items-center justify-center sm:flex sm:w-1/2">
        <LoginHero />
      </div>

      <div className="flex min-h-screen w-full flex-col items-center justify-center px-md sm:w-1/2 sm:px-sm">
        {/* Paper Search */}
        <div className="flex w-[30vw] flex-col items-center gap-md">

          <Form onSubmit={handleSubmit} className="max-w-[20vw]">
            <FormField
              label="Paper ID"
              type="text"
              value={paperId}
              onChange={e => setPaperId(e.target.value)}
              placeholder="e.g., 2301.07041"
              required
            />

            <FormSubmit loading={false}>View Paper</FormSubmit>

            <BodySecondary className="mt-md text-center font-light text-[#B6B6B6] text-sm">
              Example: 2301.07041, 1706.03762, 2103.14030
            </BodySecondary>
          </Form>
        </div>
      </div>
    </div>
  );
}
