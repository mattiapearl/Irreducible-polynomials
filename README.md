# Irreducible-polynomials
Not optimized way to get irreducible polinomials in a Prime field up to a certain degree

Basic node implementation to get irreducible polynomials. Change primo (prime number) and gradoMax (max degree) and whether you want the first coefficient to be 1 or not (monici, true for 1, false for every invertible integer)
Highly unoptimized

Lists is a set of pre-computed irreducibles that you can check

## Format

Format is

[0,1,2,7,4,2]
Growing left to right, degree of the x to which it is a coefficient

the above would be

0 + 1x + 2x^2 + 7x^3 + 4x^4 + 2x^5
