import { useTranslation } from "react-i18next";




export default function getPageLinks() {
  const {t} = useTranslation()

  const pageLinks = {
    about: [
      // {
      //   title: t('nav.about.partners.title'),
      //   description: t('nav.about.partners.description'),
      //   href: '/team',
      // },
      {
        title: t('nav.about.ourMissions.title'),
        description: t('nav.about.ourMissions.description'),
        href: '/#missions',
      },
      {
        title: t('nav.about.aboutOrganization.title'),
        description: t('nav.about.aboutOrganization.description'),
        href: '/about',
      },
      {
        title: t('nav.about.testimonials.title'),
        description: t('nav.about.testimonials.description'),
        href: '/#testimonials',
      },
    ],
    services: [
      {
        title: t('nav.services.courses.title'),
        description: t('nav.services.courses.description'),
        href: '/courses',
      },
      {
        title: t('nav.services.calendar.title'),
        description: t('nav.services.calendar.description'),
        href: '/calendar',
      },
      {
        title: t('nav.services.competences.title'),
        description: t('nav.services.competences.description'),
        href: '/competences',
      },
    ],
    team: [
      {
        title: t('nav.team.team.title'),
        description: t('nav.team.team.description'),
        href: '/team',
      },
      {
        title: t('nav.team.join.title'),
        description: t('nav.team.join.description'),
        href: '/team/join',
      },
    ],
  } as const;

  return pageLinks
};
