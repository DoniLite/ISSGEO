import { Facebook, Instagram, Linkedin, Mail, Phone, Twitter } from 'lucide-react';
import { Badge } from '../ui/badge';
import Container from './Container';
import { Link } from '@tanstack/react-router';

export default function Contact() {
  return (
    <Container>
      <div className='container mx-auto'>
        <Badge className='my-4'>Contact</Badge>
        <div className='flex flex-col lg:flex-row gap-4'>
          <ContactForm />
          <div className='w-full lg:w-3/5 p-2 lg:p-4 flex flex-col'>
            <h1 className='text-xl lg:text-3xl font-bold hover:underline transition-all'>
              Get in Touch with Us
            </h1>
            <p className='text-muted-foreground font-bold mt-4'>
              We would love to hear from you! Whether you have questions about
              our services, need assistance, or want to provide feedback, our
              team is here to help. Please fill out the contact form, and we
              will get back to you as soon as possible.
            </p>
            <div className='w-full flex flex-col gap-2 mt-6'>
              <h2 className='text-lg font-bold'>Contact Information</h2>
              <div className='w-full flex flex-col lg:flex-row gap-2 lg:gap-8'>
                <div className='flex gap-1 items-center'>
                  <Mail className='w-5 h-5 text-muted-foreground' />
                  <span className='text-muted-foreground'>
                    info@example.com
                  </span>
                </div>
                <div className='flex gap-1 items-center'>
                  <Phone className='w-5 h-5 text-muted-foreground' />
                  <span className='text-muted-foreground'>(123) 456-7890</span>
                </div>
              </div>

              <div className='mt-4 w-full flex gap-4'>
                <Link
                  target='_blank'
                  rel='noopener noreferrer'
                  to={'/'}
                  className='p-2 rounded-full bg-primary flex justify-center items-center transition-colors'
                >
                  <Facebook className='w-6 h-6 text-primary-foreground hover:text-accent transition-colors' />
                </Link>
                <Link
                  target='_blank'
                  rel='noopener noreferrer'
                  to={'/'}
                  className='p-2 rounded-full bg-primary flex justify-center items-center transition-colors'
                >
                  <Instagram className='w-6 h-6 text-primary-foreground hover:text-accent transition-colors' />
                </Link>
                <Link
                  target='_blank'
                  rel='noopener noreferrer'
                  to={'/'}
                  className='p-2 rounded-full bg-primary flex justify-center items-center transition-colors'
                >
                  <Linkedin className='w-6 h-6 text-primary-foreground hover:text-accent transition-colors' />
                </Link>
                <Link
                  target='_blank'
                  rel='noopener noreferrer'
                  to={'/'}
                  className='p-2 rounded-full bg-primary flex justify-center items-center transition-colors'
                >
                  <Twitter className='w-6 h-6 text-primary-foreground hover:text-accent transition-colors' />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}


function ContactForm() {
  return (
    <form
      className='w-full rounded-md shadow-lg lg:border-0 border border-primary bg-card/20 p-2 lg:p-4 lg:w-2/5 min-h-[20rem] flex flex-col gap-4 hover:ring transition-all'
      action=''
    >
      <div className='w-full flex flex-col gap-1'>
        <span className='text-lg font-bold relative left-3'>Name</span>
        <input
          type='text'
          id='name'
          name='name'
          className='outline-none focus:ring px-3 py-2 rounded-md border'
          placeholder='Name'
        />
      </div>

      <div className='w-full flex flex-col gap-1'>
        <span className='text-lg font-bold relative left-3'>Email</span>
        <input
          type='email'
          id='email'
          name='email'
          className='outline-none focus:ring px-3 py-2 rounded-md border'
          placeholder='Email'
        />
      </div>

      <div className='w-full flex flex-col gap-1'>
        <span className='text-lg font-bold relative left-3'>Message</span>
        <textarea
          id='message'
          name='message'
          className='outline-none focus:ring px-3 py-2 rounded-md border'
          placeholder='Message'
        />
      </div>
    </form>
  );
}