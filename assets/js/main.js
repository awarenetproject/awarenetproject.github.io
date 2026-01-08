const toggleButton = document.querySelector('.navbar__toggle');
const navigation = document.querySelector('#primary-navigation');

if (toggleButton && navigation) {
    toggleButton.addEventListener('click', () => {
        const expanded = toggleButton.getAttribute('aria-expanded') === 'true';
        toggleButton.setAttribute('aria-expanded', String(!expanded));
        navigation.classList.toggle('navbar__menu--open');
    });

    navigation.querySelectorAll('.navbar__link').forEach((link) => {
        link.addEventListener('click', () => {
            navigation.classList.remove('navbar__menu--open');
            toggleButton.setAttribute('aria-expanded', 'false');
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const getHeaderHeight = () => {
        const header = document.querySelector('.site-header');
        return header ? header.getBoundingClientRect().height : 0;
    };

    const focusRegion = (element) => {
        if (!element) {
            return;
        }

        const focusableSelector = 'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])';

        const candidate = element.matches(focusableSelector)
            ? element
            : element.querySelector(focusableSelector);

        if (candidate) {
            candidate.focus({ preventScroll: true });
            return;
        }

        element.setAttribute('tabindex', '-1');
        element.addEventListener(
            'blur',
            () => {
                if (element.getAttribute('tabindex') === '-1') {
                    element.removeAttribute('tabindex');
                }
            },
            { once: true }
        );

        element.focus({ preventScroll: true });
    };

    const scrollToHash = (hash) => {
        if (!hash || hash === '#') {
            return;
        }

        const target = document.querySelector(hash);
        if (!target) {
            return;
        }

        const headerHeight = getHeaderHeight();
        const dynamicSpacing = headerHeight * 0.75;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = Math.max(0, targetPosition - headerHeight - dynamicSpacing);

        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });

        const focusTarget =
            target.closest('[data-scroll-focus]') ||
            target.querySelector('[data-scroll-focus]') ||
            target;

        focusRegion(focusTarget);
    };

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const hash = anchor.getAttribute('href');
            if (!hash || hash === '#') {
                return;
            }

            const targetExists = document.querySelector(hash);
            if (!targetExists) {
                return;
            }

            event.preventDefault();
            scrollToHash(hash);
            if (history.pushState) {
                history.pushState(null, '', hash);
            } else {
                window.location.hash = hash;
            }
        });
    });

    if (window.location.hash) {
        requestAnimationFrame(() => {
            scrollToHash(window.location.hash);
        });
    }

    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    const header = document.querySelector('.site-header');
    const root = document.documentElement;
    if (header && root) {
        const setHeaderOffset = () => {
            const headerHeight = header.getBoundingClientRect().height;
            root.style.setProperty('--header-offset', `${headerHeight}px`);
        };

        setHeaderOffset();

        if (typeof ResizeObserver !== 'undefined') {
            const observer = new ResizeObserver(() => setHeaderOffset());
            observer.observe(header);
        }

        window.addEventListener('resize', setHeaderOffset);
    }

    const eventTitleTarget = document.querySelector('[data-event-title]');
    if (eventTitleTarget) {
        const params = new URLSearchParams(window.location.search);
        const rawTitle = params.get('title');

        if (rawTitle) {
            const cleanedTitle = rawTitle.trim();
            if (cleanedTitle.length > 0) {
                eventTitleTarget.textContent = cleanedTitle;
                document.title = `${cleanedTitle} | AWARENET`;
            }
        }
    }

    const eventDetail = document.querySelector('.event-detail');
    if (eventDetail) {
        const description = eventDetail.querySelector('.event-detail__placeholder');
        if (description) {
            const hasMedia = Boolean(eventDetail.querySelector('img, figure, picture'));
            description.classList.toggle('event-detail__placeholder--wrap', hasMedia);
        }
    }

    const setupOrganizationSelector = (form) => {
        const field = form.querySelector('[data-organization-field]');
        const selectWrapper = field ? field.querySelector('[data-organization-select]') : null;
        const input = selectWrapper ? selectWrapper.querySelector('[data-organization-input]') : null;
        const list = selectWrapper ? selectWrapper.querySelector('[data-organization-list]') : null;
        const toggle = selectWrapper ? selectWrapper.querySelector('[data-organization-toggle]') : null;

        if (!field || !selectWrapper || !input || !list) {
            return;
        }

        const baseOrganizations = [
            'Aarhus University',
            'Aalto University',
            'Aix-Marseille University',
            'Arizona State University',
            'Australian National University',
            'Bocconi University',
            'Boston University',
            'Brown University',
            'California Institute of Technology',
            'Cardiff University',
            'Carnegie Mellon University',
            'Chalmers University of Technology',
            'Charles University',
            'City University of Hong Kong',
            'Columbia University',
            'Cornell University',
            'Czech Academy of Sciences',
            'Delft University of Technology',
            'Durham University',
            'Eindhoven University of Technology',
            'Emory University',
            'Erasmus University Rotterdam',
            'ETH Zurich',
            'École Polytechnique',
            'École Polytechnique Fédérale de Lausanne (EPFL)',
            'Free University of Berlin',
            'French National Centre for Scientific Research (CNRS)',
            'Fudan University',
            'George Washington University',
            'Georgetown University',
            'Georgia Institute of Technology',
            'Ghent University',
            'Harvard University',
            'Humboldt University of Berlin',
            'Imperial College London',
            'Indian Institute of Science Bangalore',
            'Indian Institute of Technology Bombay',
            'Indiana University Bloomington',
            'Johns Hopkins University',
            'Karolinska Institutet',
            'Keio University',
            "King's College London",
            'Kyoto University',
            'KU Leuven',
            'Lancaster University',
            'Leiden University',
            'Ludwig Maximilian University of Munich',
            'Lund University',
            'Massachusetts Institute of Technology (MIT)',
            'McGill University',
            'Michigan State University',
            'Monash University',
            'National Autonomous University of Mexico',
            'National Taiwan University',
            'National University of Singapore',
            'New York University',
            'Northwestern University',
            'Norwegian University of Science and Technology',
            'Osaka University',
            'Pennsylvania State University',
            'Politecnico di Milano',
            'Politecnico di Torino',
            'Princeton University',
            'Purdue University',
            'Queen Mary University of London',
            "Queen's University Belfast",
            'Rice University',
            'RMIT University',
            'Sapienza University of Rome',
            'Scuola Normale Superiore di Pisa',
            'Seoul National University',
            'Shanghai Jiao Tong University',
            'Sorbonne University',
            'Stanford University',
            'Technical University of Denmark',
            'Technical University of Munich',
            'The Chinese University of Hong Kong',
            'The University of Auckland',
            'The University of Manchester',
            'The University of Melbourne',
            'The University of Sydney',
            'The University of Tokyo',
            'Tilburg University',
            'Tsinghua University',
            'UCLouvain',
            'Universidad de Buenos Aires',
            'Universidad de Chile',
            'Universidad Nacional de Colombia',
            'Universidade de São Paulo',
            'Universidade do Porto',
            'Universidade Federal do Rio de Janeiro',
            "Università Ca' Foscari Venezia",
            'Università degli Studi di Milano',
            'Università degli Studi di Milano-Bicocca',
            'Università degli Studi di Padova',
            "Università degli Studi di Roma Tor Vergata",
            "Università degli Studi Roma Tre",
            'Università di Bologna',
            'Università di Firenze',
            'Università di Napoli Federico II',
            'Università di Pisa',
            'Università di Torino',
            'Università degli Studi di Bari Aldo Moro',
            'Università degli Studi di Bergamo',
            'Università degli Studi di Brescia',
            'Università degli Studi di Cagliari',
            'Università degli Studi di Cassino e del Lazio Meridionale',
            'Università degli Studi di Catania',
            "Università degli Studi di Ferrara",
            "Università degli Studi di Genova",
            "Università degli Studi di Messina",
            "Università degli Studi di Modena e Reggio Emilia",
            "Università degli Studi di Palermo",
            "Università degli Studi di Parma",
            "Università degli Studi di Pavia",
            "Università degli Studi di Perugia",
            "Università degli Studi di Salerno",
            "Università degli Studi di Sassari",
            "Università degli Studi di Siena",
            "Università degli Studi di Trento",
            "Università degli Studi di Trieste",
            "Università degli Studi di Udine",
            "Università degli Studi di Verona",
            "Università Gabriele d'Annunzio Chieti-Pescara",
            'Université de Genève',
            'Université de Montréal',
            'Université de Paris Cité',
            'Université Paris-Saclay',
            'University College Cork',
            'University College Dublin',
            'University College London (UCL)',
            'University of Amsterdam',
            'University of Barcelona',
            'University of Basel',
            'University of Bergen',
            'University of Bern',
            'University of Bristol',
            'University of British Columbia',
            'University of California, Berkeley',
            'University of California, Los Angeles',
            'University of Cambridge',
            'University of Cape Town',
            'University of Chicago',
            'University of Copenhagen',
            'University of Edinburgh',
            'University of Glasgow',
            'University of Granada',
            'University of Hamburg',
            'University of Helsinki',
            'University of Hong Kong',
            'University of Iceland',
            'University of Illinois Urbana-Champaign',
            'University of Lausanne',
            'University of Leeds',
            'University of Lisbon',
            'University of Michigan',
            'University of New South Wales',
            'University of North Carolina at Chapel Hill',
            'University of Notre Dame',
            'University of Oslo',
            'University of Ottawa',
            'University of Oxford',
            'University of Pennsylvania',
            'University of Queensland',
            'University of Rochester',
            'University of Sheffield',
            'University of South Africa',
            'University of Southampton',
            'University of St Andrews',
            'University of Texas at Austin',
            'University of Toronto',
            'University of Vienna',
            'University of Virginia',
            'University of Warwick',
            'University of Washington',
            'University of Waterloo',
            'University of Wisconsin-Madison',
            'University of Zurich',
            'UNESCO',
            'United Nations Development Programme',
            'United Nations Educational, Scientific and Cultural Organization',
            'United Nations Industrial Development Organization',
            'Uppsala University',
            'Utrecht University',
            'Vienna University of Technology',
            'Virginia Tech',
            'Wageningen University & Research',
            'Warsaw University of Technology',
            'Waseda University',
            'Weizmann Institute of Science',
            'World Bank Group',
            'World Health Organization (WHO)',
            'Yale University',
            'Yokohama National University'
        ];

        const normalizeLabel = (label) => {
            const patterns = [
                /^University of\s+/i,
                /^University College\s+/i,
                /^Universit[áà]\s+degli\s+Studi\s+di\s+/i,
                /^Universit[áà]\s+degli\s+Studi\s+/i,
                /^Universit[áà]\s+di\s+/i,
                /^Université\s+/i,
                /^Universität\s+/i,
                /^Universidad\s+de\s+/i,
                /^Universidad\s+Autónoma\s+de\s+/i,
                /^Universidad\s+Nacional\s+Autónoma\s+de\s+/i,
                /^Universidade\s+de\s+/i,
                /^Universidade\s+do\s+/i,
                /^Universidade\s+Federal\s+de\s+/i,
                /^Universidade\s+Estadual\s+de\s+/i,
                /^Universidade\s+Estadual\s+Paulista\s+/i,
                /^Universiteit\s+/i
            ];

            let normalized = label.trim();
            for (const pattern of patterns) {
                if (pattern.test(normalized)) {
                    normalized = normalized.replace(pattern, '');
                    break;
                }
            }

            return normalized.trim();
        };

        const organizations = Array.from(new Set(baseOrganizations)).map((name) => {
            const sortLabel = normalizeLabel(name);
            return {
                name,
                sortLabel,
                searchValue: `${name} ${sortLabel}`.toLowerCase()
            };
        }).sort((a, b) =>
            a.sortLabel.localeCompare(b.sortLabel, undefined, { sensitivity: 'base' })
        );

        let currentOptions = organizations;
        let isOpen = false;

        const renderList = (items) => {
            list.innerHTML = '';

            if (!items.length) {
                const emptyState = document.createElement('p');
                emptyState.className = 'organization-select__empty';
                emptyState.textContent = 'No matches found.';
                list.appendChild(emptyState);
                return;
            }

            const fragment = document.createDocumentFragment();
            items.forEach(({ name }) => {
                const option = document.createElement('button');
                option.type = 'button';
                option.className = 'organization-select__option';
                option.setAttribute('role', 'option');
                option.setAttribute('tabindex', '-1');
                option.dataset.value = name;
                option.textContent = name;
                fragment.appendChild(option);
            });

            list.appendChild(fragment);
        };

        const openList = () => {
            if (isOpen) {
                return;
            }

            selectWrapper.classList.add('organization-select--open');
            input.setAttribute('aria-expanded', 'true');
            if (toggle) {
                toggle.setAttribute('aria-expanded', 'true');
            }
            isOpen = true;
        };

        const closeList = () => {
            if (!isOpen) {
                return;
            }

            selectWrapper.classList.remove('organization-select--open');
            input.setAttribute('aria-expanded', 'false');
            if (toggle) {
                toggle.setAttribute('aria-expanded', 'false');
            }
            isOpen = false;
        };

        const updateList = (query) => {
            const normalizedQuery = query.trim().toLowerCase();
            currentOptions = organizations.filter((organization) =>
                organization.searchValue.includes(normalizedQuery)
            );
            renderList(currentOptions);
        };

        const focusFirstOption = () => {
            const firstOption = list.querySelector('.organization-select__option');
            if (firstOption) {
                firstOption.focus();
            }
        };

        input.addEventListener('focus', () => {
            openList();
            renderList(currentOptions);
        });

        input.addEventListener('input', (event) => {
            const value = event.target.value || '';
            updateList(value);
            openList();
        });

        input.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                if (!isOpen) {
                    openList();
                }
                renderList(currentOptions);
                focusFirstOption();
            } else if (event.key === 'Escape') {
                closeList();
            }
        });

        if (toggle) {
            toggle.addEventListener('click', () => {
                if (isOpen) {
                    closeList();
                } else {
                    renderList(currentOptions);
                    openList();
                    input.focus();
                }
            });
        }

        list.addEventListener('click', (event) => {
            const option = event.target.closest('.organization-select__option');
            if (!option) {
                return;
            }

            event.preventDefault();
            const value = option.dataset.value || option.textContent || '';
            input.value = value;
            closeList();
            input.focus();
        });

        list.addEventListener('keydown', (event) => {
            const option = event.target.closest('.organization-select__option');
            if (!option) {
                if (event.key === 'Escape') {
                    closeList();
                    input.focus();
                }
                return;
            }

            const options = Array.from(list.querySelectorAll('.organization-select__option'));
            const currentIndex = options.indexOf(option);

            if (event.key === 'ArrowDown') {
                event.preventDefault();
                const nextOption = options[currentIndex + 1] || options[0];
                nextOption.focus();
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                const previousOption = options[currentIndex - 1] || options[options.length - 1];
                previousOption.focus();
            } else if (event.key === 'Enter') {
                event.preventDefault();
                option.click();
            } else if (event.key === 'Escape') {
                closeList();
                input.focus();
            }
        });

        document.addEventListener('click', (event) => {
            if (!field.contains(event.target)) {
                closeList();
            }
        });

        form.addEventListener('reset', () => {
            currentOptions = organizations;
            renderList(currentOptions);
            closeList();
        });

        renderList(currentOptions);
    };

    const emailLinks = document.querySelectorAll('[data-email-link]');
    if (emailLinks.length > 0) {
        const toast = document.querySelector('[data-toast]');
        let toastTimeoutId;

        const hideToast = () => {
            if (!toast) {
                return;
            }

            toast.classList.remove('toast--visible');
            toast.classList.add('toast--hidden');
            toast.classList.remove('toast--error');
        };

        const showToast = (message, tone = 'info') => {
            if (!toast) {
                return;
            }

            toast.textContent = message;
            toast.classList.remove('toast--hidden');
            toast.classList.remove('toast--error');

            if (tone === 'error') {
                toast.classList.add('toast--error');
            }

            requestAnimationFrame(() => {
                toast.classList.add('toast--visible');
            });

            window.clearTimeout(toastTimeoutId);
            toastTimeoutId = window.setTimeout(() => {
                hideToast();
            }, 2000);
        };

        const copyEmail = async (email) => {
            if (!email) {
                return false;
            }

            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(email);
                    return true;
                }
            } catch (error) {
                // Ignore and fall back to manual copy method.
            }

            const textarea = document.createElement('textarea');
            textarea.value = email;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            textarea.style.pointerEvents = 'none';
            textarea.style.top = '-9999px';

            document.body.appendChild(textarea);

            const selection = document.getSelection ? document.getSelection() : null;
            const selectedRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

            textarea.focus();
            textarea.select();

            let successful = false;

            try {
                successful = document.execCommand('copy');
            } catch (error) {
                successful = false;
            }

            document.body.removeChild(textarea);

            if (selectedRange && selection) {
                selection.removeAllRanges();
                selection.addRange(selectedRange);
            }

            return successful;
        };

        emailLinks.forEach((link) => {
            const email = (link.dataset.email || '').trim();
            if (!email) {
                return;
            }

            const mailto = `mailto:${email}`;
            const currentHref = link.getAttribute('href') || '';

            if (!currentHref || currentHref === '#') {
                link.setAttribute('href', mailto);
            }

            link.addEventListener('click', (event) => {
                event.preventDefault();

                copyEmail(email)
                    .then((copied) => {
                        if (copied) {
                            showToast('Mail copied');
                        } else {
                            showToast('Unable to copy email', 'error');
                        }
                    })
                    .finally(() => {
                        const redirectDelay = toast ? 600 : 100;

                        window.setTimeout(() => {
                            window.location.href = mailto;
                        }, redirectDelay);
                    });
            });
        });
    }

    const contactForm = document.querySelector('[data-contact-form]');
    if (contactForm) {
        setupOrganizationSelector(contactForm);
        const statusMessage = contactForm.querySelector('[data-form-status]');
        const contactEmail = (contactForm.dataset.contactEmail || '').trim();

        const updateStatus = (message, tone = 'info') => {
            if (!statusMessage) {
                return;
            }

            statusMessage.textContent = message;
            statusMessage.classList.remove('form-status--success', 'form-status--error');

            if (tone === 'success') {
                statusMessage.classList.add('form-status--success');
            } else if (tone === 'error') {
                statusMessage.classList.add('form-status--error');
            }
        };

        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            if (!contactEmail) {
                updateStatus('The email service is not configured yet. Please try again soon.', 'error');
                return;
            }

            const formData = new FormData(contactForm);
            const getValue = (field) => {
                const value = formData.get(field);
                return value ? String(value).trim() : '';
            };

            const name = getValue('name');
            const email = getValue('email');
            const organization = getValue('organization');
            const message = getValue('message');

            const emailLines = [
                'You have received a new contact request from the AWARENET website.',
                '',
                `Name: ${name || 'Not provided'}`,
                `Email: ${email || 'Not provided'}`,
                `University: ${organization || 'Not provided'}`,
                '',
                'Message:',
                message || 'No message provided.'
            ];

            const subject = encodeURIComponent(`New contact request from ${name || organization || 'AWARENET website'}`);
            const body = encodeURIComponent(emailLines.join('\n'));
            const mailtoLink = `mailto:${contactEmail}?subject=${subject}&body=${body}`;

            window.location.href = mailtoLink;
            updateStatus('We have opened your email client to finalize the request. Please press send to complete your message.', 'success');
            contactForm.reset();
        });
    }
});
