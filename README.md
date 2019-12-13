# refl

a reflecting language

# synposis

A little interpreted language intended to explore the possibilities of reflection-oriented programming.

Runs on [`myr`](https://github.com/jweissman/myr).

# description

Some basic affordances are now available.

A memoized Fibonacci function written in Refl.

```
fmemo = []
fib = (x) => x<2 ? 1 : fibm(x-1) + fibm(x-2);
fibm(x){
    if(fmemo[x]==nil){
        fmemo[x]=fib(x)
    };
    return(fmemo[x]);
}
i = 0;
max = 45;
while (i<max) { i=i+1; print(fib(i)); }
```

Functions are first class citizens...

There is notation for classes as well.

```
class Car {
    initialize(make, model, year) {
        self.make = make
        self.model = model
        self.year = year
    }
}

cybertruck = Car.new("Tesla", "Cybertruck", 3001)
cybertruck.make # "Tesla"
```

