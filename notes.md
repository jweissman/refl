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

----------------------------------------------------------------

so -- keywords: class/traits/archetype


traits can be mixed into classes and traits
(is singleton/eigenclass a 'shadow' trait?)

archetypes can be mixed into traits and archetypes

--
i can imagine template refl -- interpolating blocks anyway at first
and then maybe a mechanism for structural templating -- instance_eval/do with blocks handy makes some of this straightforward
but a templating -- maybe we get everything we would want meta wise without it??
i'm just wondering if archetypes layer over a lot of concerns with templates/schemes/etc
or rather could help uncover?

okay so let's imagine some things

Number and List and Set are all Printable but not all Enumerable

Only Set and List share the Enumerable traits  that permit

(Their superclass might be Collection, which might actually own the trait?)

Maybe the archetype is something that lots of traits might share...

So classes are nouns, traits are adjectives / archetypes are verbs? (a way to model functions categoreally,
i.e., as diagrams?) 

maybe they can represent certain kinds of side-effects for us and help
keep them isolate? i'm imagining now a 'Write' archetype and a 'Read' archetype
Enumerable needs them both, to interact structurally with arrays, but i can imagine that
we could write a 'readonly' view -- i guess just thinking about immutable objects and
how to permit that sort of structural difference -- 

(now i'm imagining archetypes to be the sort of layer you use to do systems, network programming
things -- structurally, higher-order than traits, and a way to isolate code that does network
from code that doesn't?)

okay, what would the write archetype be? does it 'generate' objects representing 
the computation to be done, like a little lambda that reads or writes a value?

and the read archetype is sort of the converse..

(i'm not thinking about meta-circular eval at the archetype layer, if we model evaluation
as generating a set of reads and writes (to objects, to the console)...)

in other words, if mutating an object was a side effect too, we could model the end-to-end
process as 'archetypical'... (user input/network/filesystem as read, write to objects, read
from objects)

[this seems interesting, something is working about it, i like the idea that archetypes are
verbs and all this is amazing but idk about the specific model here? building up a thunk
seems strange... but now that you mention it, a 'shallow' render of a tower of reflective objects
seems kind of interesting -- we're an interpreter anyway, but being able to execute code in
a 'dry run' kind of form seems powerful... -- quoted code obviously is kind of the same for us
though?? how would an instance eval that takes a block work -- that's a more interesting question here]

----------------------------------------------------------------

i think the real targets are full formal modelling of class and object
being able to create new ones (through new)
sharing code between refl and js like with array for now
work our way up the tree -- numbers, strings, hashes should all be wrapped

being able to rename MyrArray to List seems useful though, or at least interesting
(proving the reflection is 'thorough'?) -- 

---




(maybe modules are zero level and can be mixed into anything?)

--------------

what if archectypes are singletons but inject dependencies?
i'm imagining a 'does database.write' which grants traits, marks this object as a db writer for isolation (??)
and injects a concrete database instance lazily?
maybe also archetypes unlock 'custom' dsls
have always dreamed of weaponizing ohm somehow, exposing parsing to the user :D
ofc this goes quickly down the meta-circular evaluation rabbithole
we do want to stay focused on the goal
but i was thinking: database.write could unlock a kind of native sql object...
and does widget.render could unlock xml literals...
acceessing the Database archetype directly could only build on whatever abstract mechanics are provided
but you could implement a lot at that level
(directly implementing AR primitives? extending them thoughtfully in the directino of your code)
guardrails/guidelines for meta

