export function createStoryline(target, config) {
  const element = resolveTarget(target);
  const normalized = normalizeStoryline(config);

  element.replaceChildren();
  element.classList.add('storyline');

  const header = document.createElement('header');
  header.className = 'storyline__header';

  const title = document.createElement('h2');
  title.textContent = normalized.title;
  header.append(title);

  if (normalized.description) {
    const description = document.createElement('p');
    description.textContent = normalized.description;
    header.append(description);
  }

  const chart = renderChart(normalized);
  const cards = renderCards(normalized);

  element.append(header, chart, cards);

  return {
    element,
    data: normalized
  };
}

export async function loadStoryline(target, url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not load Storyline JSON: ${response.status} ${response.statusText}`);
  }

  return createStoryline(target, await response.json());
}

function resolveTarget(target) {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element) {
    throw new Error('Storyline target element was not found.');
  }

  return element;
}

function normalizeStoryline(config) {
  if (!config || !Array.isArray(config.points) || config.points.length === 0) {
    throw new Error('Storyline JSON must include a non-empty points array.');
  }

  const points = config.points.map((point, index) => {
    const x = new Date(point.x);
    const y = Number(point.y);

    if (Number.isNaN(x.valueOf())) {
      throw new Error(`Point ${index} has an invalid x date.`);
    }

    if (!Number.isFinite(y)) {
      throw new Error(`Point ${index} has an invalid y value.`);
    }

    return {
      ...point,
      x,
      y,
      label: point.label || formatMonth(x)
    };
  });

  return {
    title: config.title || 'Storyline',
    description: config.description || '',
    chart: config.chart || {},
    points,
    cards: Array.isArray(config.cards) ? config.cards : []
  };
}

function renderChart(storyline) {
  const width = 900;
  const height = 320;
  const padding = { top: 28, right: 34, bottom: 44, left: 54 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const values = storyline.points.map((point) => point.y);
  const dates = storyline.points.map((point) => point.x.valueOf());
  const minX = Math.min(...dates);
  const maxX = Math.max(...dates);
  const minY = Math.min(...values);
  const maxY = Math.max(...values);
  const yRange = maxY - minY || 1;
  const xRange = maxX - minX || 1;

  const svg = createSvg('svg');
  svg.classList.add('storyline__chart');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', storyline.chart.yLabel || storyline.title);

  const axis = createSvg('g');
  axis.classList.add('storyline__axis');
  axis.append(line(padding.left, padding.top, padding.left, height - padding.bottom));
  axis.append(line(padding.left, height - padding.bottom, width - padding.right, height - padding.bottom));
  svg.append(axis);

  const coords = storyline.points.map((point) => {
    const x = padding.left + ((point.x.valueOf() - minX) / xRange) * innerWidth;
    const y = padding.top + (1 - ((point.y - minY) / yRange)) * innerHeight;
    return { point, x, y };
  });

  const path = createSvg('path');
  path.classList.add('storyline__line');
  path.setAttribute('d', coords.map((coord, index) => `${index === 0 ? 'M' : 'L'} ${coord.x} ${coord.y}`).join(' '));
  svg.append(path);

  coords.forEach((coord, index) => {
    const marker = createSvg('circle');
    marker.classList.add('storyline__marker');
    marker.setAttribute('cx', coord.x);
    marker.setAttribute('cy', coord.y);
    marker.setAttribute('r', storyline.cards.some((card) => card.point === index) ? 6 : 4);
    marker.append(titleElement(`${coord.point.label}: ${coord.point.y}`));
    svg.append(marker);
  });

  const firstLabel = createSvg('text');
  firstLabel.classList.add('storyline__tick');
  firstLabel.setAttribute('x', padding.left);
  firstLabel.setAttribute('y', height - 16);
  firstLabel.textContent = storyline.points[0].label;
  svg.append(firstLabel);

  const lastPoint = storyline.points[storyline.points.length - 1];
  const lastLabel = createSvg('text');
  lastLabel.classList.add('storyline__tick');
  lastLabel.setAttribute('x', width - padding.right);
  lastLabel.setAttribute('y', height - 16);
  lastLabel.setAttribute('text-anchor', 'end');
  lastLabel.textContent = lastPoint.label;
  svg.append(lastLabel);

  return svg;
}

function renderCards(storyline) {
  const list = document.createElement('ol');
  list.className = 'storyline__cards';

  storyline.cards.forEach((card) => {
    const point = storyline.points[card.point];
    const item = document.createElement('li');
    item.className = 'storyline__card';

    const date = document.createElement('time');
    date.dateTime = point ? point.x.toISOString() : '';
    date.textContent = card.date || (point ? point.label : '');

    const title = document.createElement('h3');
    title.textContent = card.title;

    const text = document.createElement('p');
    text.textContent = card.text;

    item.append(date, title, text);
    list.append(item);
  });

  return list;
}

function createSvg(name) {
  return document.createElementNS('http://www.w3.org/2000/svg', name);
}

function line(x1, y1, x2, y2) {
  const element = createSvg('line');
  element.setAttribute('x1', x1);
  element.setAttribute('y1', y1);
  element.setAttribute('x2', x2);
  element.setAttribute('y2', y2);
  return element;
}

function titleElement(text) {
  const title = createSvg('title');
  title.textContent = text;
  return title;
}

function formatMonth(date) {
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(date);
}
