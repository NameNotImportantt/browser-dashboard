import type {MessageKey} from '@/i18n';

interface AboutLinkDefinition {
    href: string;
    labelKey: MessageKey;
}

export const ABOUT_GITHUB_URL = 'https://github.com/NameNotImportantt/browser-dashboard';

export const ABOUT_README_URL = 'https://github.com/NameNotImportantt/browser-dashboard#readme';

export const ABOUT_AUTHOR_NAME = 'NameNotImportant';

export const ABOUT_COPYRIGHT = '© 2026 NameNotImportant';

export const ABOUT_LINKS: AboutLinkDefinition[] = [
    {
        href: ABOUT_GITHUB_URL,
        labelKey: 'settingsAboutGithub',
    },
    {
        href: ABOUT_README_URL,
        labelKey: 'settingsAboutReadme',
    },
];
