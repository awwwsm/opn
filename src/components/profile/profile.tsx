import { useCallback, useEffect, useState } from 'react';

import { Container } from '../container';
import type { Profile as IProfile } from '@/types/profile';

import styles from './profile.module.css';
import { cn } from '@/helpers/styles';

interface ProfileProps {
  source: string;
  username: string;
}

export function Profile({ source, username }: ProfileProps) {
  const [profile, setProfile] = useState<IProfile | null>(null);

  const fetchProfile = useCallback(async () => {
    const res = await fetch(source);
    const data = (await res.json()) as IProfile;

    setProfile(data);
  }, [source]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile?.name) {
      document.title = `${profile.name} — OPN`;
    }
  }, [profile]);

  if (!profile) return null;

  return (
    <Container>
      <header className={styles.header}>
        <div className={styles.logo} />

        <h1 className={styles.name}>{profile.name}</h1>
        <p className={styles.description}>{profile.description}</p>

        <a className={styles.profileLink} href="https://opn.bio/@remvze">
          opn.bio/<strong>@{username}</strong>
        </a>
      </header>
      <main>
        {profile.sections &&
          profile.sections.map((section, index) => (
            <Section key={index} title={section.title}>
              {section.type === 'list' ? (
                <div className={styles.items}>
                  {section.items.map((item, index) => (
                    <div className={styles.item} key={index}>
                      {item.url ? (
                        <a className={styles.title} href={item.url}>
                          {item.title}
                        </a>
                      ) : (
                        <p className={styles.title}>{item.title}</p>
                      )}

                      {item.description && (
                        <p className={styles.description}>{item.description}</p>
                      )}

                      {item.date && (
                        <p className={styles.date}>({item.date})</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : section.type === 'text' ? (
                <p className={styles.text}>{section.content}</p>
              ) : section.type === 'links' ? (
                <div className={cn(styles.socials)}>
                  {section.links.map((link, index) => (
                    <a href={link.url} key={index}>
                      {link.title}
                    </a>
                  ))}
                </div>
              ) : null}
            </Section>
          ))}
      </main>
      <footer className={styles.footer}>
        Created using <a href="https://opn.bio">OPN</a>.
      </footer>
    </Container>
  );
}

function Section({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>
        {title} <div />
      </h2>
      <div className={styles.content}>{children}</div>
    </section>
  );
}
