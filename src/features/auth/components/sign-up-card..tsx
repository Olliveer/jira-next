'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import React from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { registerSchema } from '../schemas';
import { useRegister } from '../api/use-register';
import { LoaderCircleIcon } from 'lucide-react';
import { toast } from 'sonner';

export function SignUpCard() {
  const { mutate, isPending } = useRegister();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof registerSchema>) {
    mutate(
      { json: values },
      {
        onSuccess: data => {
          form.reset();
          toast.success(`Welcome ${data.message}`);
        },
        onError: error => {
          toast.error(error.message);
        },
      },
    );
  }
  return (
    <Card className="w-full h-full md:w-[487px] border-none ">
      <CardHeader className="flex flex-col items-center justify-between text-center p-7">
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          By signing up, you agree to our{' '}
          <Link href={'/privacy-policy'}>
            <span className="text-blue-700">privacy policy</span>
          </Link>{' '}
          and{' '}
          <Link href={'/terms'}>
            <span className="text-blue-700">terms and conditions</span>
          </Link>
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 ">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending && <LoaderCircleIcon className="-ms-1 animate-spin" size={16} aria-hidden="true" />}
              Sign Up
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex flex-col gap-y-4 ">
        <Button variant={'secondary'} className="w-full">
          <FcGoogle className="mr-2 size-5" /> Sign Up with Google
        </Button>
        <Button variant={'secondary'} className="w-full">
          <FaGithub className="mr-2 size-5" /> Sign Up with GitHub
        </Button>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex items-center justify-center ">
        <p>
          Already have an account?{' '}
          <Link href={'/sign-in'}>
            <span className="text-blue-700">Sign In</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
