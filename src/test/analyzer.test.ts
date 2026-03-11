import { calculateGrade } from '../analyzers/complexityAnalyzer';

describe('Complexity Analyzer', () => {
    test('should calculate Grade A for low complexity', () => {
        // @ts-ignore - reaching into private if necessary or just testing exported
        const grade = calculateGrade(5, 0);
        expect(grade).toBe('A');
    });

    test('should calculate Grade D for high complexity', () => {
        const grade = calculateGrade(50, 10);
        expect(grade).toBe('D');
    });
});
