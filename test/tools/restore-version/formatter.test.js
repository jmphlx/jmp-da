/* eslint no-unused-vars: 0 */
/* global describe it */
import { expect } from '@esm-bundle/chai';

const { formatDate, formatVersions, getCurrentVersion } = await import('../../../tools/restore-version/formatter.js');

describe('Formatter Functions', () => {
  describe('formatDate', () => {
    it('formats a valid timestamp to date and time', () => {
      const timestamp = 1640995200000; // 2022-01-01 00:00:00 UTC
      const result = formatDate(timestamp);
      expect(result).to.have.all.keys('date', 'time');
      expect(result.date).to.be.a('string');
      expect(result.time).to.be.a('string');
    });

    it('formats date with correct locale format', () => {
      const timestamp = 1640995200000; // 2022-01-01 UTC
      const result = formatDate(timestamp);
      // Date should contain a year (matches YYYY format)
      expect(result.date).to.match(/\d{4}/);
      // Date should contain a month abbreviation
      expect(result.date).to.match(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/);
    });

    it('formats time in 12-hour format with AM/PM', () => {
      const timestamp = 1640995200000; // 2022-01-01 00:00:00 UTC
      const result = formatDate(timestamp);
      expect(result.time).to.match(/^\d{1,2}:\d{2}\s*(AM|PM)$/);
    });

    it('handles undefined timestamp by using current date', () => {
      const result = formatDate(undefined);
      expect(result).to.have.all.keys('date', 'time');
      expect(result.date).to.be.a('string');
      expect(result.time).to.be.a('string');
    });

    it('formats different timestamps consistently', () => {
      const timestamp1 = 1640995200000; // Jan 2022 UTC
      const timestamp2 = 1672531200000; // Jan 2023 UTC
      const result1 = formatDate(timestamp1);
      const result2 = formatDate(timestamp2);
      // Both results should have date and time properties
      expect(result1).to.have.all.keys('date', 'time');
      expect(result2).to.have.all.keys('date', 'time');
      // Results should be different
      expect(result1.date).to.not.equal(result2.date);
    });
  });

  describe('formatVersions', () => {
    it('returns empty array for empty input', () => {
      const result = formatVersions([]);
      expect(result).to.be.an('array').that.is.empty;
    });

    it('sorts versions by timestamp in descending order', () => {
      const input = [
        { timestamp: 1000, url: '/v1' },
        { timestamp: 3000, url: '/v3' },
        { timestamp: 2000, url: '/v2' },
      ];
      const result = formatVersions(input);
      expect(result[0].url).to.equal('/v3');
      expect(result[1].url).to.equal('/v2');
      expect(result[2].url).to.equal('/v1');
    });

    it('filters out entries without url (non-versions)', () => {
      const input = [
        { timestamp: 1000, url: '/v1', path: '/page1' },
        { timestamp: 2000, path: '/page2' }, // No url, should be filtered
        { timestamp: 3000, url: '/v3', path: '/page3' },
      ];
      const result = formatVersions(input);
      expect(result).to.have.lengthOf(2);
      expect(result[0].url).to.equal('/v3');
      expect(result[1].url).to.equal('/v1');
    });

    it('includes all properties from original entries', () => {
      const input = [
        {
          timestamp: 1000,
          url: '/v1',
          path: '/page1',
          label: 'Version 1',
          users: ['user1'],
        },
      ];
      const result = formatVersions(input);
      expect(result[0].url).to.equal('/v1');
      expect(result[0].path).to.equal('/page1');
      expect(result[0].label).to.equal('Version 1');
      expect(result[0].users).to.deep.equal(['user1']);
    });

    it('adds formatted date and time properties', () => {
      const input = [
        {
          timestamp: 1609459200000,
          url: '/v1',
          path: '/page1',
        },
      ];
      const result = formatVersions(input);
      expect(result[0]).to.have.property('date');
      expect(result[0]).to.have.property('time');
      expect(result[0].date).to.be.a('string');
      expect(result[0].time).to.be.a('string');
    });

    it('creates VersionResult instances', () => {
      const input = [
        {
          timestamp: 1000,
          url: '/v1',
          path: '/page1',
          date: 'Jan 1, 2021',
          time: '12:00 AM',
        },
      ];
      const result = formatVersions(input);
      expect(result[0]).to.be.an('object');
      expect(result[0].constructor.name).to.equal('VersionResult');
    });

    it('handles multiple versions with same timestamp', () => {
      const input = [
        { timestamp: 1000, url: '/v1', path: '/page1' },
        { timestamp: 1000, url: '/v2', path: '/page2' },
      ];
      const result = formatVersions(input);
      expect(result).to.have.lengthOf(2);
    });

    it('ignores entries without url property', () => {
      const input = [
        { timestamp: 1000, url: '/v1', path: '/page1' },
        { timestamp: 2000, path: '/page2', label: 'Draft' },
        { timestamp: 3000, url: '/v3', path: '/page3' },
      ];
      const result = formatVersions(input);
      expect(result).to.have.lengthOf(2);
      expect(result.every((v) => v.url)).to.be.true;
    });
  });

  describe('getCurrentVersion', () => {
    it('returns the most recent version', () => {
      const input = [
        { timestamp: 1000, url: '/v1', path: '/page1', users: ['user1'] },
        { timestamp: 3000, url: '/v3', path: '/page3', users: ['user3'] },
        { timestamp: 2000, url: '/v2', path: '/page2', users: ['user2'] },
      ];
      const result = getCurrentVersion(input);
      expect(result.path).to.equal('/page3');
      expect(result.users).to.deep.equal(['user3']);
    });

    it('includes formatted date and time', () => {
      const input = [
        { timestamp: 1609459200000, path: '/page1', users: ['user1'] },
      ];
      const result = getCurrentVersion(input);
      expect(result).to.have.all.keys('date', 'time', 'users', 'path');
      expect(result.date).to.be.a('string');
      expect(result.time).to.be.a('string');
    });

    it('returns single entry when array has one element', () => {
      const input = [
        { timestamp: 1000, path: '/page1', users: ['user1'] },
      ];
      const result = getCurrentVersion(input);
      expect(result.path).to.equal('/page1');
      expect(result.users).to.deep.equal(['user1']);
    });

    it('ignores entries sorted to later positions', () => {
      const input = [
        { timestamp: 1000, path: '/old', users: ['oldUser'] },
        { timestamp: 5000, path: '/recent', users: ['recentUser'] },
      ];
      const result = getCurrentVersion(input);
      expect(result.path).to.equal('/recent');
    });

    it('extracts users array from most recent entry', () => {
      const input = [
        { timestamp: 1000, path: '/page1', users: ['user1', 'user2'] },
        { timestamp: 2000, path: '/page2', users: ['user3'] },
      ];
      const result = getCurrentVersion(input);
      expect(result.users).to.deep.equal(['user3']);
    });

    it('handles empty users array', () => {
      const input = [
        { timestamp: 1000, path: '/page1', users: [] },
      ];
      const result = getCurrentVersion(input);
      expect(result.users).to.deep.equal([]);
    });

    it('sorts input by timestamp before extracting', () => {
      const input = [
        { timestamp: 5000, path: '/last', users: ['lastUser'] },
        { timestamp: 1000, path: '/first', users: ['firstUser'] },
      ];
      const result = getCurrentVersion(input);
      expect(result.path).to.equal('/last');
      expect(result.users).to.deep.equal(['lastUser']);
    });
  });

  describe('formatDate edge cases', () => {
    it('handles zero timestamp', () => {
      const result = formatDate(0);
      expect(result).to.have.all.keys('date', 'time');
      expect(result.date).to.be.a('string');
      expect(result.time).to.be.a('string');
    });

    it('handles very large timestamp', () => {
      const futureTimestamp = 2147483647000; // Far future date
      const result = formatDate(futureTimestamp);
      expect(result).to.have.all.keys('date', 'time');
      expect(result.date).to.match(/\d{4}/);
    });

    it('returns consistent format for same timestamp', () => {
      const timestamp = 1640995200000;
      const result1 = formatDate(timestamp);
      const result2 = formatDate(timestamp);
      expect(result1.date).to.equal(result2.date);
      expect(result1.time).to.equal(result2.time);
    });
  });

  describe('formatVersions edge cases', () => {
    it('handles single version entry', () => {
      const input = [
        { timestamp: 1000, url: '/v1', path: '/page1', label: 'Version 1' },
      ];
      const result = formatVersions(input);
      expect(result).to.have.lengthOf(1);
      expect(result[0].url).to.equal('/v1');
    });

    it('preserves specific properties when formatting', () => {
      const input = [
        {
          timestamp: 1000,
          url: '/v1',
          path: '/page',
          label: 'Test',
          users: ['user1'],
          customProp: 'value',
        },
      ];
      const result = formatVersions(input);
      // VersionResult only copies specific properties
      expect(result[0].url).to.equal('/v1');
      expect(result[0].path).to.equal('/page');
      expect(result[0].label).to.equal('Test');
      expect(result[0].users).to.deep.equal(['user1']);
    });

    it('handles entries with identical timestamps', () => {
      const timestamp = 1000;
      const input = [
        { timestamp, url: '/v1', path: '/page1' },
        { timestamp, url: '/v2', path: '/page2' },
        { timestamp, url: '/v3', path: '/page3' },
      ];
      const result = formatVersions(input);
      expect(result).to.have.lengthOf(3);
    });

    it('filters entries based on url presence', () => {
      const input = [
        { timestamp: 1000, url: '/v1', path: '/page1' },
        { timestamp: 2000, path: '/page2' }, // No url, will be filtered
      ];
      const result = formatVersions(input);
      // Only entries with url are included in result
      expect(result).to.have.lengthOf(1);
      expect(result[0].url).to.equal('/v1');
    });

    it('handles mix of properties in entries', () => {
      const input = [
        { timestamp: 3000, url: '/v3', path: '/page3', label: 'Label 3' },
        { timestamp: 1000, url: '/v1', path: '/page1' },
        { timestamp: 2000, url: '/v2', label: 'Label 2' },
      ];
      const result = formatVersions(input);
      expect(result).to.have.lengthOf(3);
      expect(result[0].url).to.equal('/v3');
      expect(result[0].label).to.equal('Label 3');
    });
  });

  describe('getCurrentVersion edge cases', () => {
    it('returns single entry for array with one element', () => {
      const input = [{ timestamp: 1000, path: '/page1', users: ['user1'] }];
      const result = getCurrentVersion(input);
      expect(result.path).to.equal('/page1');
    });

    it('handles multiple users in array', () => {
      const input = [
        { timestamp: 1000, path: '/page', users: ['user1', 'user2', 'user3'] },
      ];
      const result = getCurrentVersion(input);
      expect(result.users).to.deep.equal(['user1', 'user2', 'user3']);
    });

    it('ignores other properties when extracting current version', () => {
      const input = [
        {
          timestamp: 1000,
          path: '/page',
          users: ['user1'],
          extraProp: 'ignored',
          nestedObj: { value: 123 },
        },
      ];
      const result = getCurrentVersion(input);
      expect(result).to.have.all.keys('date', 'time', 'users', 'path');
      expect(result.extraProp).to.be.undefined;
    });

    it('handles version with undefined users gracefully', () => {
      const input = [
        { timestamp: 1000, path: '/page', users: undefined },
      ];
      const result = getCurrentVersion(input);
      expect(result.users).to.be.undefined;
    });

    it('extracts only required fields from most recent', () => {
      const input = [
        {
          timestamp: 3000,
          path: '/new',
          users: ['newUser'],
          extra: 'data',
          timestamp: 3000,
        },
        {
          timestamp: 1000,
          path: '/old',
          users: ['oldUser'],
          extra: 'oldData',
        },
      ];
      const result = getCurrentVersion(input);
      expect(result).to.have.all.keys('date', 'time', 'users', 'path');
      expect(result.path).to.equal('/new');
    });
  });

  describe('Integration between formatter functions', () => {
    it('formatVersions output can be used with formatDate', () => {
      const input = [
        { timestamp: 1640995200000, url: '/v1', path: '/page' },
      ];
      const formatted = formatVersions(input);
      const firstItem = formatted[0];

      // Verify date and time were added by formatVersions
      expect(firstItem.date).to.be.a('string');
      expect(firstItem.time).to.be.a('string');
    });

    it('handles pipeline of formatting operations', () => {
      const input = [
        { timestamp: 1000, url: '/v3', path: '/page3' },
        { timestamp: 3000, url: '/v1', path: '/page1' },
        { timestamp: 2000, url: '/v2', path: '/page2' },
      ];

      const formatted = formatVersions(input);
      const current = getCurrentVersion(input);

      // Current should be the one with highest timestamp
      expect(current.path).to.equal('/page1');
      // Formatted should be sorted
      expect(formatted[0].url).to.equal('/v1');
    });
  });
});
