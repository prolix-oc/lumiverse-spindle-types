import { expect, test } from 'bun:test';
import { SPINDLE_SYSTEM_AUDIO_HOST_CAPABILITIES } from '../src/system-audio';

test('advertises the additive stereo contract alongside the original mono API', () => {
  expect(SPINDLE_SYSTEM_AUDIO_HOST_CAPABILITIES).toEqual({ 'system-audio-v1': 1, 'system-audio-stereo-v1': 1 });
  expect(Object.isFrozen(SPINDLE_SYSTEM_AUDIO_HOST_CAPABILITIES)).toBe(true);
});
