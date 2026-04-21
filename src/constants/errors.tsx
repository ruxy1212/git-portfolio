import type { ReactElement } from 'react';

export interface CustomError {
  status: number;
  title: string;
  subTitle: string | ReactElement;
  cta?: 'home' | 'reload' | null;
}

export const INVALID_CONFIG_ERROR: CustomError = {
  status: 500,
  title: 'Invalid Config!',
  subTitle: (
    <p>
      Please provide correct config in <code>profile.config.ts</code>.
    </p>
  ),
  cta: 'reload',
};

export const setTooManyRequestError = (resetTime: string): CustomError => {
  return {
    status: 429,
    title: 'Too Many Requests!',
    subTitle: (
      <p>
        Oh no, you hit the{' '}
        <a
          href="https://developer.github.com/v3/rate_limit/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          rate limit
        </a>
        ! Try again later{` ${resetTime}`}.
      </p>
    ),
    cta: 'reload',
  };
};

export const INVALID_GITHUB_USERNAME_ERROR: CustomError = {
  status: 404,
  title: 'Invalid GitHub Username!',
  subTitle: (
    <p>
      Please provide correct github username in <code>portfolio.config.ts</code>
      .
    </p>
  ),
  cta: 'reload',
};

export const PAGE_NOT_FOUND_ERROR: CustomError = {
  status: 404,
  title: 'Page not found!',
  subTitle: <p>{"The page you're looking for does not exist."}</p>,
  cta: 'home',
};

export const AXIOS_GENERIC_ERROR: CustomError = {
  status: 400,
  title: 'Oops!!',
  subTitle: 'We ran into some issues fetching your data.',
  cta: 'reload',
};

export const GENERIC_ERROR: CustomError = {
  status: 500,
  title: 'Oops!!',
  subTitle: 'Something went wrong.',
  cta: 'reload',
};
