import { NLFTextSetting } from './NLFTextSetting';

describe('NLF verbalization', () => {
  it('handles undefined attributes', () => {
    const verbalization = NLFTextSetting.verbalizeAttributes(undefined);
    expect(verbalization).toEqual('a word');
  });

  it('ignores incorrect attributes', () => {
    const verbalization = NLFTextSetting.verbalizeAttributes({
      wrong: 'attr'
    });
    expect(verbalization).toEqual('');
  });

  it('defaults to the attribute value if there is no defined display name', () => {
    const verbalization = NLFTextSetting.verbalizeAttributes({
      case: 'fake case'
    });
    expect(verbalization).toEqual('a fake case');
  });

  it('orders descriptors properly', () => {
    const verbalization = NLFTextSetting.verbalizeAttributes({
      class: 'verbal',
      case: 'nominative',
      person: 'first',
      number: 'singular',
      gender: 'feminine',
      tense: 'aorist',
      voice: 'active',
      mood: 'indicative',
    });
    expect(verbalization).toEqual('a 1st person singular nominative feminine aorist active indicative verbal');
  });

  it('uses participle as the part of speech if mood is set to participle, even if part of speech is also set', () => {
    const verbalization = NLFTextSetting.verbalizeAttributes({
      tense: 'future',
      mood: 'participle',
    });
    expect(verbalization).toEqual('a future participle');

    const verbalizationWithReplace = NLFTextSetting.verbalizeAttributes({
      class: 'verbal',
      tense: 'future',
      mood: 'participle',
    });
    expect(verbalizationWithReplace).toEqual('a future participle');
  });

  it('uses infinitive as the part of speech if the mood is set to infinitive, even if part of speech ' +
    'is also set', () => {
    const verbalization = NLFTextSetting.verbalizeAttributes({
      tense: 'future',
      mood: 'infinitive',
    });
    expect(verbalization).toEqual('a future infinitive');

    const verbalizationWithReplace = NLFTextSetting.verbalizeAttributes({
      class: 'verbal',
      tense: 'future',
      mood: 'infinitive',
    });
    expect(verbalizationWithReplace).toEqual('a future infinitive');
  });

  it('handles lexical forms with no other attributes', () => {
    const verbalization = NLFTextSetting.verbalizeAttributes({
      lemma: 'ἀνοίγω'
    });
    expect(verbalization).toEqual('ἀνοίγω');
  });

  it('handles inflected forms with no other attributes', () => {
    const verbalization = NLFTextSetting.verbalizeAttributes({
      normalized: 'ἀνοίγω'
    });
    expect(verbalization).toEqual('ἀνοίγω');
  });

  it('if both inflected and lexical form are defined it goes with inflected form', () => {
    const verbalization = NLFTextSetting.verbalizeAttributes({
      lemma: 'ἀνοίγω',
      normalized: 'ἀνοίξω',
    });
    expect(verbalization).toEqual('ἀνοίξω');
  });

  it('adds `from _` when there is a lexical form plus other descriptors', () => {
    const verbalization = NLFTextSetting.verbalizeAttributes({
      lemma: 'ἀνοίγω',
      tense: 'future',
      voice: 'passive',
    });
    expect(verbalization).toEqual('a future passive from ἀνοίγω');
  });

  it('adds `from _` when there is an inflected form plus other descriptors', () => {
    const verbalization = NLFTextSetting.verbalizeAttributes({
      normalized: 'ἀνοιγήσεται',
      tense: 'future',
      voice: 'passive',
    });
    expect(verbalization).toEqual('a future passive from ἀνοιγήσεται');
  });

  it('includes part of speech even if there is a lexical or inflected form', () => {
    const verbalization = NLFTextSetting.verbalizeAttributes({
      lemma: 'ἀνοίγω',
      class: 'verbal',
      tense: 'future',
    });
    expect(verbalization).toEqual('a future verbal from ἀνοίγω');
    const verbalizationWithReplace = NLFTextSetting.verbalizeAttributes({
      lemma: 'ἀνοίγω',
      class: 'verbal',
      tense: 'future',
      mood: 'participle',
    });
    expect(verbalizationWithReplace).toEqual('a future participle from ἀνοίγω');
  });
});