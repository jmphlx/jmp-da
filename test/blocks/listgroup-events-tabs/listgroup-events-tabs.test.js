/* global before after describe it */
import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import sinon from 'sinon';

const { decorateBlock, loadBlock } = await import('../../../scripts/aem.js');

const pagedata = await readFile({ path: './test-index.json' });
const stub = sinon.stub(window, 'fetch');

function jsonOk(body) {
  const mockResponse = new Response(JSON.stringify(body), { ok: true });
  return Promise.resolve(mockResponse);
}

async function setupBlock(htmlPath) {
  document.body.innerHTML = await readFile({ path: htmlPath });
  const block = document.querySelector('.listgroup-events-tabs');
  document.querySelector('main').append(block);
  decorateBlock(block);
  await loadBlock(block);
  return block;
}

describe('Listgroup Events Tabs', () => {
  describe('Tab list structure', () => {
    before(async () => {
      stub.onCall(0).returns(jsonOk(JSON.parse(pagedata)));
      await setupBlock('./basicEvents.html');
    });

    it('renders a tab list with the correct number of tabs', () => {
      const tablist = document.querySelector('.tabs-list');
      expect(tablist).to.not.be.null;
      const tabs = tablist.querySelectorAll('button.tabs-tab');
      expect(tabs.length).to.equal(3);
    });

    it('renders tab buttons with correct IDs and text', () => {
      const tabs = document.querySelectorAll('button.tabs-tab');
      expect(tabs[0].id).to.equal('tab-all');
      expect(tabs[0].textContent).to.equal('All Events');
      expect(tabs[1].id).to.equal('tab-live-webinar');
      expect(tabs[1].textContent).to.equal('Live Webinars');
      expect(tabs[2].id).to.equal('tab-in-person-event');
      expect(tabs[2].textContent).to.equal('In-Person Events');
    });

    it('renders tab panels with correct IDs', () => {
      const panels = document.querySelectorAll('.tabs-panel');
      expect(panels.length).to.equal(3);
      expect(panels[0].id).to.equal('tabpanel-all');
      expect(panels[1].id).to.equal('tabpanel-live-webinar');
      expect(panels[2].id).to.equal('tabpanel-in-person-event');
    });

    it('has tablist and tabpanel ARIA roles', () => {
      const tablist = document.querySelector('.tabs-list');
      expect(tablist.getAttribute('role')).to.equal('tablist');
      document.querySelectorAll('.tabs-panel').forEach((panel) => {
        expect(panel.getAttribute('role')).to.equal('tabpanel');
      });
    });

    after(() => { stub.reset(); });
  });

  describe('Default tab selection', () => {
    before(async () => {
      stub.onCall(0).returns(jsonOk(JSON.parse(pagedata)));
      await setupBlock('./basicEvents.html');
    });

    it('first tab is selected by default', () => {
      const tabs = document.querySelectorAll('button.tabs-tab');
      expect(tabs[0].getAttribute('aria-selected')).to.equal('true');
      expect(tabs[1].getAttribute('aria-selected')).to.equal('false');
      expect(tabs[2].getAttribute('aria-selected')).to.equal('false');
    });

    it('first panel is visible and others are hidden', () => {
      const panels = document.querySelectorAll('.tabs-panel');
      expect(panels[0].getAttribute('aria-hidden')).to.equal('false');
      expect(panels[1].getAttribute('aria-hidden')).to.equal('true');
      expect(panels[2].getAttribute('aria-hidden')).to.equal('true');
    });

    after(() => { stub.reset(); });
  });

  describe('All tab filtering', () => {
    before(async () => {
      stub.onCall(0).returns(jsonOk(JSON.parse(pagedata)));
      await setupBlock('./basicEvents.html');
    });

    it('All tab shows only events with a non-empty event-type tag', () => {
      const allPanel = document.querySelector('#tabpanel-all');
      const items = allPanel.querySelectorAll('li');
      // past-webinar filtered by offDateTime, noindex-conference filtered by robots,
      // no-type filtered by empty tags — 3 events remain
      expect(items.length).to.equal(3);
    });

    it('All tab excludes past events', () => {
      const allPanel = document.querySelector('#tabpanel-all');
      const titles = [...allPanel.querySelectorAll('.title')].map((el) => el.textContent);
      expect(titles).to.not.include('Past Live Webinar');
    });

    it('All tab excludes noindex pages', () => {
      const allPanel = document.querySelector('#tabpanel-all');
      const titles = [...allPanel.querySelectorAll('.title')].map((el) => el.textContent);
      expect(titles).to.not.include('Noindex In-Person Event');
    });

    it('All tab excludes events with no event-type tag', () => {
      const allPanel = document.querySelector('#tabpanel-all');
      const titles = [...allPanel.querySelectorAll('.title')].map((el) => el.textContent);
      expect(titles).to.not.include('No Type Event');
    });

    after(() => { stub.reset(); });
  });

  describe('Event sorting', () => {
    before(async () => {
      stub.onCall(0).returns(jsonOk(JSON.parse(pagedata)));
      await setupBlock('./basicEvents.html');
    });

    it('events in All tab are sorted by eventDateTime ascending', () => {
      const allPanel = document.querySelector('#tabpanel-all');
      const titles = [...allPanel.querySelectorAll('.title')].map((el) => el.textContent);
      expect(titles[0]).to.equal('In-Person Event One');
      expect(titles[1]).to.equal('Live Webinar One');
      expect(titles[2]).to.equal('Live Webinar Two');
    });

    after(() => { stub.reset(); });
  });

  describe('Tab-specific filtering', () => {
    before(async () => {
      stub.onCall(0).returns(jsonOk(JSON.parse(pagedata)));
      await setupBlock('./basicEvents.html');
    });

    it('Live Webinars tab shows only live-webinar events', () => {
      const liveWebinarPanel = document.querySelector('#tabpanel-live-webinar');
      const items = liveWebinarPanel.querySelectorAll('li');
      expect(items.length).to.equal(2);
      const titles = [...items].map((li) => li.querySelector('.title').textContent);
      expect(titles).to.include('Live Webinar One');
      expect(titles).to.include('Live Webinar Two');
    });

    it('In-Person Events tab shows only in-person events', () => {
      const inPersonPanel = document.querySelector('#tabpanel-in-person-event');
      const items = inPersonPanel.querySelectorAll('li');
      expect(items.length).to.equal(1);
      expect(items[0].querySelector('.title').textContent).to.equal('In-Person Event One');
    });

    after(() => { stub.reset(); });
  });

  describe('Card structure', () => {
    before(async () => {
      stub.onCall(0).returns(jsonOk(JSON.parse(pagedata)));
      await setupBlock('./basicEvents.html');
    });

    it('card links use item path when no redirectTarget', () => {
      const allPanel = document.querySelector('#tabpanel-all');
      const links = allPanel.querySelectorAll('a');
      const conferenceLink = [...links].find((a) => a.querySelector('.title')?.textContent === 'In-Person Event One');
      expect(conferenceLink.href).to.include('/events/conference-one');
      expect(conferenceLink.target).to.equal('_self');
    });

    it('card links use redirectTarget and open in new tab when redirectTarget is set', () => {
      const allPanel = document.querySelector('#tabpanel-all');
      const links = allPanel.querySelectorAll('a');
      const redirectLink = [...links].find((a) => a.querySelector('.title')?.textContent === 'Live Webinar Two');
      expect(redirectLink.href).to.equal('https://external.com/webinar-two');
      expect(redirectLink.target).to.equal('_blank');
    });

    it('cards render title, category label, and time', () => {
      const allPanel = document.querySelector('#tabpanel-all');
      const firstItem = allPanel.querySelector('li');
      expect(firstItem.querySelector('.title')).to.not.be.null;
      expect(firstItem.querySelector('.tag-category')).to.not.be.null;
      expect(firstItem.querySelector('.subtitle')).to.not.be.null;
    });

    it('cards display the correct eventDisplayLabel and eventDisplayTime', () => {
      const allPanel = document.querySelector('#tabpanel-all');
      const links = allPanel.querySelectorAll('a');
      const conferenceCard = [...links].find((a) => a.querySelector('.title')?.textContent === 'In-Person Event One');
      expect(conferenceCard.querySelector('.tag-category').textContent).to.equal('In-Person Event');
      expect(conferenceCard.querySelector('.subtitle').textContent).to.equal('April 5, 2099 9:00 AM');
    });

    it('list uses the list-tile class', () => {
      const allPanel = document.querySelector('#tabpanel-all');
      const list = allPanel.querySelector('ul');
      expect(list.classList.contains('listOfItems')).to.be.true;
      expect(list.classList.contains('list-tile')).to.be.true;
    });

    after(() => { stub.reset(); });
  });

  describe('Tab click behavior', () => {
    before(async () => {
      stub.onCall(0).returns(jsonOk(JSON.parse(pagedata)));
      await setupBlock('./basicEvents.html');
    });

    it('clicking a tab makes its panel visible', () => {
      document.querySelector('#tab-live-webinar').click();
      const liveWebinarPanel = document.querySelector('#tabpanel-live-webinar');
      expect(liveWebinarPanel.getAttribute('aria-hidden')).to.equal('false');
    });

    it('clicking a tab hides the previously active panel', () => {
      document.querySelector('#tab-live-webinar').click();
      const allPanel = document.querySelector('#tabpanel-all');
      expect(allPanel.getAttribute('aria-hidden')).to.equal('true');
    });

    it('clicking a tab sets aria-selected on the clicked tab', () => {
      document.querySelector('#tab-in-person-event').click();
      expect(document.querySelector('#tab-in-person-event').getAttribute('aria-selected')).to.equal('true');
      expect(document.querySelector('#tab-live-webinar').getAttribute('aria-selected')).to.equal('false');
      expect(document.querySelector('#tab-all').getAttribute('aria-selected')).to.equal('false');
    });

    after(() => { stub.reset(); });
  });

  describe('limitedEvents fixture', () => {
    before(async () => {
      stub.onCall(0).returns(jsonOk(JSON.parse(pagedata)));
      await setupBlock('./limitedEvents.html');
    });

    it('renders 3 tabs', () => {
      const tabs = document.querySelectorAll('button.tabs-tab');
      expect(tabs.length).to.equal(3);
    });

    it('All tab shows all filtered events sorted by date', () => {
      const allPanel = document.querySelector('#tabpanel-all');
      const titles = [...allPanel.querySelectorAll('.title')].map((el) => el.textContent);
      expect(titles.length).to.equal(3);
      expect(titles[0]).to.equal('In-Person Event One');
      expect(titles[1]).to.equal('Live Webinar One');
      expect(titles[2]).to.equal('Live Webinar Two');
    });

    after(() => { stub.reset(); });
  });
});
