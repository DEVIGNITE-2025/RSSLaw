const blogsSocialsData = {
  featuredVideos: [
    {
      id: 'Y8Yv9R4R6xM',
      title: 'Regulatory change briefing',
      description: 'Overview of current developments and implications for businesses in regulated sectors.',
      url: 'https://www.youtube.com/watch?v=Y8Yv9R4R6xM',
      thumbnail: 'https://i.ytimg.com/vi/Y8Yv9R4R6xM/hqdefault.jpg',
      label: 'Video 01'
    },
    {
      id: 'W4hTJybfU7s',
      title: 'Governance insights',
      description: 'Practical guidance for boards and executive teams on oversight and accountability.',
      url: 'https://www.youtube.com/watch?v=W4hTJybfU7s',
      thumbnail: 'https://i.ytimg.com/vi/W4hTJybfU7s/hqdefault.jpg',
      label: 'Video 02'
    },
    {
      id: 'IgbhM6D3l7A',
      title: 'Compliance implementation',
      description: 'Focused updates on strengthening legal compliance and internal control processes.',
      url: 'https://www.youtube.com/watch?v=IgbhM6D3l7A',
      thumbnail: 'https://i.ytimg.com/vi/IgbhM6D3l7A/hqdefault.jpg',
      label: 'Video 03'
    }
  ],
  articlePreviews: [
    {
      id: 'article-001',
      slug: 'board-oversight-priorities',
      category: 'Governance',
      title: 'Board oversight priorities in high-accountability sectors',
      excerpt: 'Practical steps for boards and executives to strengthen oversight, reporting discipline, and decision accountability.',
      published: '2026-04-18',
      displayDate: '18 April 2026'
    },
    {
      id: 'article-002',
      slug: 'embedding-compliance-standards',
      category: 'Compliance',
      title: 'Embedding compliance standards into daily operations',
      excerpt: 'How organisations can align policy, process, and internal ownership to build sustainable compliance culture.',
      published: '2026-04-14',
      displayDate: '14 April 2026'
    },
    {
      id: 'article-003',
      slug: 'data-governance-legal-accountability',
      category: 'Data Protection',
      title: 'Data governance and legal accountability',
      excerpt: 'Essential legal considerations for managing privacy duties, data controls, and operational risk exposure.',
      published: '2026-04-09',
      displayDate: '09 April 2026'
    },
    {
      id: 'article-004',
      slug: 'preparing-for-regulatory-change',
      category: 'Regulatory',
      title: 'Preparing for regulatory change in evolving markets',
      excerpt: 'A concise framework to evaluate legal exposure and implementation readiness when regulations shift.',
      published: '2026-04-04',
      displayDate: '04 April 2026'
    },
    {
      id: 'article-005',
      slug: 'responding-to-internal-allegations',
      category: 'Investigations',
      title: 'Responding to internal allegations with legal discipline',
      excerpt: 'Key principles for structuring corporate investigations while protecting process integrity and privilege.',
      published: '2026-03-30',
      displayDate: '30 March 2026'
    },
    {
      id: 'article-006',
      slug: 'employment-risk-controls',
      category: 'Employment',
      title: 'Employment risk controls for modern workplaces',
      excerpt: 'A legal perspective on strengthening workplace frameworks, dispute preparedness, and policy consistency.',
      published: '2026-03-24',
      displayDate: '24 March 2026'
    }
  ]
};

const getCmsAccessContext = () => {
  // CMS auth integration point: this bridge can be replaced with a real token/session provider.
  if (window.RSSCmsAccess && typeof window.RSSCmsAccess.getContext === 'function') {
    return window.RSSCmsAccess.getContext();
  }

  return {
    isAuthenticated: false,
    role: 'public',
    canEditBlogsSocials: false
  };
};

const setDelay = (element, index, step) => {
  if (index > 0) {
    element.style.setProperty('--delay', `${(index * step).toFixed(2)}s`);
  }
};

const createFeaturedVideoCard = (video, index) => {
  const article = document.createElement('article');
  article.className = 'detail-card video-card section-shell reveal fade-up';
  article.dataset.cmsItem = 'video';
  article.dataset.videoId = video.id;
  article.dataset.videoUrl = video.url;
  article.dataset.videoTitle = video.title;
  setDelay(article, index, 0.08);

  const thumbnailLink = document.createElement('a');
  thumbnailLink.className = 'video-thumb';
  thumbnailLink.href = video.url;
  thumbnailLink.target = '_blank';
  thumbnailLink.rel = 'noreferrer';
  thumbnailLink.ariaLabel = `Watch ${video.title} on YouTube`;
  thumbnailLink.dataset.cmsField = 'url';

  const image = document.createElement('img');
  image.src = video.thumbnail;
  image.alt = `${video.title} video thumbnail`;
  image.loading = 'lazy';
  image.dataset.cmsField = 'thumbnail';
  thumbnailLink.append(image);

  const label = document.createElement('span');
  label.className = 'detail-label';
  label.dataset.cmsField = 'label';
  label.textContent = video.label;

  const title = document.createElement('h3');
  title.dataset.cmsField = 'title';
  title.textContent = video.title;

  const description = document.createElement('p');
  description.dataset.cmsField = 'description';
  description.textContent = video.description;

  const watchLink = document.createElement('a');
  watchLink.className = 'button-link';
  watchLink.href = video.url;
  watchLink.target = '_blank';
  watchLink.rel = 'noreferrer';
  watchLink.dataset.cmsField = 'url';
  watchLink.textContent = 'Watch on YouTube';

  article.append(thumbnailLink, label, title, description, watchLink);
  return article;
};

const createArticlePreviewCard = (article, index) => {
  const card = document.createElement('article');
  card.className = 'detail-card section-shell reveal fade-up';
  card.dataset.cmsItem = 'article';
  card.dataset.articleId = article.id;
  card.dataset.slug = article.slug;
  card.dataset.category = article.category;
  card.dataset.published = article.published;
  setDelay(card, index, 0.04);

  const category = document.createElement('span');
  category.className = 'detail-label';
  category.dataset.cmsField = 'category';
  category.textContent = article.category;

  const title = document.createElement('h3');
  title.dataset.cmsField = 'title';
  title.textContent = article.title;

  const excerpt = document.createElement('p');
  excerpt.dataset.cmsField = 'excerpt';
  excerpt.textContent = article.excerpt;

  const meta = document.createElement('p');
  meta.className = 'article-meta';

  const time = document.createElement('time');
  time.dateTime = article.published;
  time.dataset.cmsField = 'published';
  time.textContent = article.displayDate;
  meta.append(time);

  card.append(category, title, excerpt, meta);
  return card;
};

const renderBlogsSocialsDynamicContent = () => {
  const videosRoot = document.querySelector('[data-dynamic-list="featured-videos"]');
  const articlesRoot = document.querySelector('[data-dynamic-list="article-previews"]');

  if (!videosRoot || !articlesRoot) {
    return;
  }

  videosRoot.replaceChildren(
    ...blogsSocialsData.featuredVideos
      .slice(0, 3)
      .map((video, index) => createFeaturedVideoCard(video, index))
  );

  articlesRoot.replaceChildren(
    ...blogsSocialsData.articlePreviews
      .slice(0, 6)
      .map((article, index) => createArticlePreviewCard(article, index))
  );
};

const renderAdminTools = () => {
  const adminToolsRoot = document.querySelector('[data-admin-tools-root="blogs-socials"]');

  if (!adminToolsRoot) {
    return;
  }

  const cmsAccess = getCmsAccessContext();

  // Protected editing integration point:
  // - In production, show these controls only after CMS validates admin/editor permissions.
  // - Hook button action to an authenticated CMS admin route.
  if (!cmsAccess.canEditBlogsSocials) {
    adminToolsRoot.hidden = true;
    adminToolsRoot.replaceChildren();
    return;
  }

  adminToolsRoot.hidden = false;

  const editButton = document.createElement('a');
  editButton.className = 'button button-secondary';
  editButton.href = 'login.html';
  editButton.dataset.cmsAction = 'open-protected-editor';
  editButton.textContent = 'Open CMS Editor';

  adminToolsRoot.replaceChildren(editButton);
};

renderBlogsSocialsDynamicContent();
renderAdminTools();
