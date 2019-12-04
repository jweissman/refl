import Refl from "./Refl"

describe(Refl, () => {
    let refl: Refl;
    beforeEach(() => { refl = new Refl(); })
    describe('arithmetic', () => {
        it('adds two numbers', () => {
            expect(refl.interpret('5+6')).toEqual(11)
        })

        it('adds three numbers', () => {
            expect(refl.interpret('5+6+7')).toEqual(18)
            expect(refl.interpret('3+6+9')).toEqual(18)
        })

        it('subtracts one number from another', () => {
            expect(refl.interpret('5-6')).toEqual(-1);
            expect(refl.interpret('9-6')).toEqual(3);
        })

        it('multiplies two numbers', () => {
            expect(refl.interpret('5*5')).toEqual(25);
        })

        it('divides two numbers', () => {
            expect(refl.interpret('100/4')).toEqual(25);
        })

        it('exponentiates', () => {
            expect(refl.interpret('2^8')).toEqual(256)
            expect(refl.interpret('10^3')).toEqual(1000)
        })

        it('orders operations', () => {
            expect(refl.interpret('10+20/2')).toEqual(20);
            expect(refl.interpret('1-100/4+1')).toEqual(-23);
        })
    })

    describe('variables', () => {
        it('defines', () => {
            expect(refl.interpret('a = 5')).toEqual(5)
            expect(refl.interpret('a * 10')).toEqual(50)
            expect(refl.interpret('b = 12')).toEqual(12)
            expect(refl.interpret('a * b')).toEqual(60)
            expect(refl.interpret('b / 2')).toEqual(6)
            expect(refl.interpret('b ^ 2')).toEqual(144)
        })
    })

    describe('funcalls', () => {
        xit('defines', () => {
            expect(refl.interpret('double = (x) => x * 2')).toEqual('double')
        })
    })
})