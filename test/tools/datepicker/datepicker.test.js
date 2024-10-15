/* eslint no-unused-vars: 0 */
/* global describe it */
import { expect } from '@esm-bundle/chai';
import { html, fixture } from '@open-wc/testing';
import DaTagSelector from '../../../tools/tags/tag-selector.js';

const dp = await import('../../../tools/datepicker/datepicker.js');

describe('Tag Selector Plugin Tests', () => {
  it('Initialize Time Zones', async () => {
    const children = [];
    const mockSelect = {
      appendChild: (child) => {
        if (child.name === 'option') {
          children.push(child.textContent);
        }
      },
    };

    const mockDoc = {
      getElementById: (id) => (id === 'time-zone' ? mockSelect : null),
      createElement: (name) => (name === 'option' ? { name: 'option' } : null),
    };

    dp.initTimeZones(mockDoc);
    expect(children.length).to.be.greaterThan(0);
    expect(children).to.deep.include('(GMT+00:00) Azores Summer Time');
    expect(children).to.deep.include('(GMT+02:00) GMT+02:00');
  });

  it('Use button clicked with date', () => {
    const event = {
      preventDefault: () => {},
    };

    const textSent = [];
    const actions = {
      closeLibrary: () => {},
      sendText: (t) => textSent.push(t),
    };

    const datefield = {
      value: '2029-12-15',
    };

    const form = {
      reportValidity: () => true,
    };
    const mockDoc = {
      querySelector: (selector) => {
        switch (selector) {
          case 'form#picker':
            return form;
          case 'form#typeselect input[name="date-picker"]:checked':
            return { value: 'date' };
          case 'form#picker input[type=date]':
            return datefield;
          default:
            return null;
        }
      },
    };
    dp.useButtonClicked(event, actions, mockDoc);
    expect(textSent).to.deep.equal(['2029-12-15']);
  });

  it('Use button clicked with date and time', () => {
    const event = {
      preventDefault: () => {},
    };

    const textSent = [];
    const actions = {
      closeLibrary: () => {},
      sendText: (t) => textSent.push(t),
    };

    const datefield = {
      value: '2021-07-01',
    };
    const timefield = {
      value: '15:23',
    };
    const tzfield = {
      value: '+12:00',
    };

    const reportValidity = [];
    const form = {
      reportValidity: () => {
        reportValidity.push('called');
        return true;
      },
    };
    const mockDoc = {
      querySelector: (selector) => {
        switch (selector) {
          case 'form#picker':
            return form;
          case 'form#typeselect input[name="date-picker"]:checked':
            return { value: 'datetime' };
          case 'form#picker input[type=date]':
            return datefield;
          case 'form#picker input[type=time]':
            return timefield;
          case 'form#picker select#time-zone':
            return tzfield;
          default:
            return null;
        }
      },
    };
    dp.useButtonClicked(event, actions, mockDoc);
    expect(textSent).to.deep.equal(['2021-07-01 03:23Z']);
    expect(reportValidity).to.deep.equal(['called']);
  });
});
