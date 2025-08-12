import { shuffleArray } from './utils';

describe('shuffleArray', () => {
  it('should return a new array with the same elements', () => {
    const original = ['a', 'b', 'c', 'd'];
    const shuffled = shuffleArray(original);

    expect(shuffled).toHaveLength(original.length);
    expect(shuffled).toEqual(expect.arrayContaining(original));
    expect(shuffled).not.toBe(original);
  });

  it('should shuffle the array in a predictable way when Math.random is mocked', () => {
    const mockRandomValues = [0.1, 0.5, 0.9]; 
    let callCount = 0;
    jest.spyOn(global.Math, 'random').mockImplementation(() => {
      return mockRandomValues[callCount++] ?? 0;
    });

    const original = ['a', 'b', 'c', 'd'];
    const shuffled = shuffleArray(original);

    expect(shuffled).toEqual(['a', 'c', 'd', 'b']);

    jest.spyOn(global.Math, 'random').mockRestore();
  });

  it('should return the same array when input length <= 1', () => {
    expect(shuffleArray([])).toEqual([]);
    expect(shuffleArray(['a'])).toEqual(['a']);
  });
});
