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

--

okay, classes have a .shared (anonymous object for now) on which all functions live -- one implementation
should enable us to do eigen but for now inheritance and really the goal was extension, how to get methods extending?
it seems like we could do wrapped js objects with refl implementations that way, which would be interesting? i guess i'm still not
sure about that -- remember the goal was to achieve some way to call into native JS methods on the objects, which we've sort of
achieved (not a generalized method for ffi still really!) but again it seems nicer to be able to implement (or start implementing) some
of that in refl itself? esp arrays, native arrays should be a wrapped list class -- 


---

if traits are 'junction points' of classes/types
then archetypes are 'junction points' of higher-order classes/metatypes

a higher-order class is a "class of classes"
so metaclasses (
    shadow classes 'local' to an instance,
    which may be a 'singleton' instance of the classes' class -- ...
) but also hyperclasses (
    'floating' classes 'internal' to every singleton (with a trait)?
)