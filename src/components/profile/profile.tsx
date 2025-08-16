import { useCallback, useEffect, useState } from 'react';
import { MdArrowOutward } from 'react-icons/md';

import { Container } from '../container';
import type { Profile as IProfile } from '@/types/profile';

import styles from './profile.module.css';
import { cn } from '@/helpers/styles';
import { ProfileSchema } from '@/validators/profile';

interface ProfileProps {
  source: string;
  username: string;
}

export function Profile({ source, username }: ProfileProps) {
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [errors, setErrors] = useState<
    Array<{ message: string; path: string }>
  >([]);
  const [error, setError] = useState('');

  const fetchProfile = useCallback(async () => {
    const res = await fetch(source);

    if (!res.ok) return setError('Profile not found.');

    const data = await res.json();

    const parsed = ProfileSchema.safeParse(data);

    if (!parsed.success) {
      setErrors(
        parsed.error.issues.map(issue => ({
          message: issue.message,
          path: issue.path.join(' → '),
        })),
      );
    } else {
      setProfile(parsed.data);
    }
  }, [source]);

  useEffect(() => {
    fetchProfile().catch(() =>
      setError('Something went wrong. The JSON file might be invalid.'),
    );
  }, [fetchProfile]);

  useEffect(() => {
    if (profile?.name) {
      document.title = `${profile.name} — OPN`;
    }

    if (profile?.style?.theme === 'light') {
      document.body.style.background = 'var(--color-neutral-950)';
    }
  }, [profile]);

  if (error) {
    return (
      <div className={styles.error}>
        <Container>
          <p className={styles.errorText}>Error: {error}</p>
        </Container>
      </div>
    );
  }

  if (errors.length > 0) {
    return (
      <Container>
        <div className={styles.errors}>
          <h1 className={styles.title}>Wrong Format:</h1>

          {errors.map((error, i) => (
            <p className={styles.error} key={i}>
              <span>[{error.path}]:</span> {error.message}
            </p>
          ))}
        </div>
      </Container>
    );
  }

  if (!profile) return null;

  return (
    <div
      className={cn(
        profile.style?.theme === 'light' && styles.light,
        profile.style?.font === 'serif' && styles.serif,
      )}
    >
      <Container>
        <header className={styles.header}>
          <div className={styles.logo} />

          <h1 className={styles.name}>{profile.name}</h1>
          <p className={styles.description}>{profile.description}</p>

          <a
            className={styles.profileLink}
            href={`https://opn.bio/@${username}`}
          >
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
                            <span>
                              <MdArrowOutward />
                            </span>
                          </a>
                        ) : (
                          <p className={styles.title}>{item.title}</p>
                        )}

                        {item.description && (
                          <p className={styles.description}>
                            {item.description}
                          </p>
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
    </div>
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
