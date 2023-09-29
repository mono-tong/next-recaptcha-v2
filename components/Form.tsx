'use client';
import { useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export default function Form() {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const schema = yup.object({
    name: yup.string().required(),
    email: yup.string().email().required(),
    phone: yup.string().required(),
    recaptcha: yup.string(),
  });
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data: { name: string; email: string; phone: string }) => {
    const recaptchaToken = recaptchaRef.current?.getValue();

    /** Check value of recaptcha */
    if (!recaptchaToken) {
      setError('recaptcha', { type: 'custom', message: 'Please verify reCAPTCHA' });
      return false;
    }

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.name);
    formData.append('phone', data.phone);
    formData.append('recaptchaToken', recaptchaToken);

    const response = await fetch('/api/contact', {
      method: 'post',
      body: formData,
    });

    if (response?.ok) {
      alert('passed');
    } else {
      alert('failed');
    }

    // clear recaptcha after submitted
    recaptchaRef.current?.reset()
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="block">Name:</label>
        <input className="border" {...register('name')} />
        {errors.name && <p className="text-red-500">{errors.name?.message}</p>}
      </div>
      <div>
        <label className="block">Email:</label>
        <input className="border" {...register('email')} />
        {errors.email && <p className="text-red-500">{errors.email?.message}</p>}
      </div>
      <div>
        <label className="block">Phone:</label>
        <input className="border" {...register('phone')} />
        {errors.phone && <p className="text-red-500">{errors.phone?.message}</p>}
      </div>
      <div>
        <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY as string} ref={recaptchaRef} />
        {errors.recaptcha && <p className="text-red-500">{errors.recaptcha?.message}</p>}
      </div>
      <div>
        <button className='border p-2 bg-slate-100 cursor-pointer'>Submit</button>
      </div>
    </form>
  );
}
