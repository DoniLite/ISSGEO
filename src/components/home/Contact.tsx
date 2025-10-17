/** biome-ignore-all lint/correctness/useUniqueElementIds: <> */
import { Link } from '@tanstack/react-router';
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Twitter,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../ui/badge';
import Container from './Container';
import useContactStore from '@/stores/contact.store';
import { useState, type MouseEvent } from 'react';
import type { CreateContactDTO } from '@/api/contact';
import { Button } from '../ui/button';
import { toast } from 'sonner';

export default function Contact() {
  const { t } = useTranslation();
  return (
    <Container id='contact'>
      <div className='container mx-auto'>
        <Badge className='my-4'>{t('navBadge.contact')}</Badge>
        <div className='flex flex-col lg:flex-row gap-4'>
          <ContactForm />
          <div className='w-full lg:w-3/5 p-2 lg:p-4 flex flex-col'>
            <h1 className='text-xl lg:text-3xl font-bold hover:underline transition-all'>
              {t('contact.title')}
            </h1>
            <p className='text-muted-foreground font-bold mt-4'>
              {t('contact.description')}
            </p>
            <div className='w-full flex flex-col gap-2 mt-6'>
              <h2 className='text-lg font-bold'>{t('contact.contact_info')}</h2>
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
  const { t } = useTranslation();
  const [contact, setContact] = useState<CreateContactDTO>({
    name: '',
    email: '',
    message: '',
  });
  const { create } = useContactStore();

  async function handleCreateContact(
    e: MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault();
    try {
      await create(contact);
      toast.success(
        `${t('contact.toast.success.title')}\n${t('contact.toast.success.message')}`
      );
    } catch (e) {
      console.error(e);
      toast.error(
        `${t('contact.toast.error.title')}\n${t('contact.toast.error.message')}`
      );
    }
  }
  return (
    <form className='w-full rounded-md dark:border dark:border-border shadow-lg lg:border-0 border border-primary bg-card/20 p-2 lg:p-4 lg:w-2/5 min-h-[20rem] flex flex-col gap-4 hover:ring transition-all'>
      <div className='w-full flex flex-col gap-1'>
        <span className='text-lg font-bold relative left-3'>
          {t('contact.form.name.label')}
        </span>
        <input
          type='text'
          id='name'
          name='name'
          value={contact.name}
          onChange={(e) => {
            e.preventDefault();
            const v = e.currentTarget.value;
            setContact((c) => ({
              ...c,
              name: v,
            }));
          }}
          className='outline-none focus:ring px-3 py-2 rounded-md border'
          placeholder={t('contact.form.name.placeholder')}
        />
      </div>

      <div className='w-full flex flex-col gap-1'>
        <span className='text-lg font-bold relative left-3'>
          {t('contact.form.email.label')}
        </span>
        <input
          type='email'
          id='email'
          name='email'
          value={contact.email}
          onChange={(e) => {
            e.preventDefault();
            const v = e.currentTarget.value;
            setContact((c) => ({
              ...c,
              email: v,
            }));
          }}
          className='outline-none focus:ring px-3 py-2 rounded-md border'
          placeholder={t('contact.form.email.placeholder')}
        />
      </div>

      <div className='w-full flex flex-col gap-1'>
        <span className='text-lg font-bold relative left-3'>
          {t('contact.form.message.label')}
        </span>
        <textarea
          id='message'
          name='message'
          value={contact.message}
          onChange={(e) => {
            e.preventDefault();
            const v = e.currentTarget.value;
            setContact((c) => ({
              ...c,
              message: v,
            }));
          }}
          className='outline-none focus:ring px-3 py-2 rounded-md border'
          placeholder={t('contact.form.message.placeholder')}
        />
      </div>

      <Button
        type='submit'
        className='w-full rounded-lg py-3 px-4 flex justify-center items-center'
        onClick={handleCreateContact}
      >
        {t('contact.form.submit')}
      </Button>
    </form>
  );
}
