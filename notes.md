# notes

okays, so probably long past time i tried to capture some of the ideas for refl 'linearly'

basically we're trying to reverse-engineer what a vm and language structure need to be like
in order to support some of the higher-order reflecting capabilities of smalltalk/ruby/self/etc

a few things we've done that should help:
- spiked out simple object structures, we'll want to do inheritance and eigenclasses next...
- functions are first class citizens

some things we think might help us understand more:
- blocks as first class, yield keyword
- traits are first class citizens -- (would this be just 'intentionally' stitchable modules, maybe with some 'is enumerable/restful/flightful' kind of sugar?)
    - i think the deeper idea was that traits are kind of their own shadow classes (pure reflection?)
- archetypes or 'ideas', maybe some like a composable class algebra? (stands in relation to traits as traits to classes, 'trait templates'?)
- 'hyperclasses' (as a metaclass of all metaclasses of a class, 'universal public trait'?) / hypertraits, hyper-archetypes
- method missing?

---

i think the tack will be to try to keep the core language very simple, and try to bootstrap into higher-order things

build what we need to build out day-to-day programming things but keep evolving the concepts